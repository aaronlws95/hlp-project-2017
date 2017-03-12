namespace ARM7TDMI


module Emulator = 
    open InstructionType 
    open MachineState

    module ProcessFlag = 
            type ProcessFlagType = 
                | ADD of Value*Value*Value //op1 op2 result
                | SUB of Value*Value*Value //op1 op2 result
                | OTHER of Value // result

            //get flags given instruction, input, and ouput
            let processFlags instruction =
                let N (res:Value) = if res < 0 then true else false
                let Z (res:Value) = if res = 0 then true else false

                match instruction with
                | ADD(op1,op2,res) ->  { 
                                            N = N res 
                                            Z = Z res
                                            C = if (((((sign(op1) <> sign(op2)) && ((sign(op1) = 1) && (op1 > op2) ||  (sign(op2) = 1) && (op2 > op1))) && res >=0) && op1 <> 0 && op2 <> 0)  
                                                    || ((op1 <0 && op2 <0 && res >= 0))) then true
                                                else false 
                                            V = if (op1<0 && op2<0 && res>=0) || (op1>0 && op2>0 && res< 0) then true else false
                                        }
                | SUB(op1,op2,res) ->  { 
                                            N = N res 
                                            Z = Z res
                                            C = if res >= 0 then true else false
                                            V = if (op1<0 && op2<0 && res>=0) || (op1>0 && op2>0 && res< 0) then true else false
                                        }
                | OTHER(res) ->        {
                                            N = N res
                                            Z = Z res
                                            C = false
                                            V = false
                                        }
    
    module Extractor = 
        // extract value from register
        let extractRegister (state:MachineState) (rol:RegOrLit) = 
                match rol with
                | Reg r -> state.RegMap.[r]
                | Lit l -> l
        // extract value from memory
        let extractMemory (state:MachineState) (addr:Address) =
                let checkValidAddr =
                    function
                    | Val v -> v
                    | Inst i -> invalidOp "address is not valid" 
                state.MemMap.[addr]
                |> checkValidAddr
        let getAddressValue (Addr a:Address) = a

    module ALUInstruction = 
        //MOV FUNCTION
        let private mov state dest op1 s = 
            let newRegMap = Map.add dest op1 state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(op1)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        //ADD FUNCTION
        let private add state dest op1 op2 res s = 
            let newRegMap = Map.add dest res state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.ADD(op1,op2,res)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        //SUB FUNCTION
        let private sub state dest op1 op2 res s = 
            let newRegMap = Map.add dest res state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.SUB(op1,op2,res)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        //TODO: MORE FUNCTIONS
        let executeInstruction state instruction s = 
            let er = Extractor.extractRegister state
            match instruction with
            | MOV(r,rol) -> mov state r (er rol) s
            | ADD(r1,r2,rol) -> add state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]+(er rol))  s
            | SUB(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]-(er rol)) s
            | MVN(r, rol) -> mov state r ~~~(er rol) s
            | EOR(r1, r2, rol) -> mov state r1 (state.RegMap.[r2]^^^(er rol)) s
            | RSB(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) ((er rol)-state.RegMap.[r2]) s
            | ADC(r1,r2,rol) -> add state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]+(er rol)+System.Convert.ToInt32(state.Flags.C)) s
            | SBC(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]-(er rol)+System.Convert.ToInt32(state.Flags.C)-1) s
            | BIC(r1, r2, rol) -> mov state r1 (state.RegMap.[r2]&&&(~~~(er rol))) s
            | ORR(r1, r2, rol) -> mov state r1 (state.RegMap.[r2]|||(er rol)) s

    module SFInstruction = 
        let private setFlag state name op1 op2 = 
            let newFlags = 
                match name with
                | "tst" -> ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(op1&&&op2)) 
                | "teq" -> ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(op1^^^op2)) 
                | "cmp" -> ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.SUB(op1,op2,op1-op2))
                | "cmn" -> ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.ADD(op1,op2,op1+op2))
                | _ -> failwithf "invalid setFlag function"
            {state with Flags = newFlags}

        let executeInstruction state instruction = 
            let er = Extractor.extractRegister state
            match instruction with
                | TST(r,rol) -> setFlag state "tst" state.RegMap.[r] (er rol)
                | TEQ(r, rol) -> setFlag state "teq" state.RegMap.[r] (er rol)
                | CMP(r,rol) -> setFlag state "cmp" state.RegMap.[r] (er rol)
                | CMN(r, rol) -> setFlag state "cmn" state.RegMap.[r] (er rol)    
    
    module MEMInstruction = 
        // Update register functions: ADR, LDR
        let private updateRegister state dest exp s =  
            let newRegMap = Map.add dest exp state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(exp)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
  
        // TODO: MORE FUNCTIONS
        let executeInstruction state instruction s = 
            let em = Extractor.extractMemory state
            let er = Extractor.extractRegister state
            let ga = Extractor.getAddressValue
            match instruction with
                | ADR(r,i) -> updateRegister state r (ga i) s //Address load
                | LDRREG(r1,r2) -> updateRegister state r1 (em (Addr (er (Reg r2)))) s //Load register
                | LDRPI(r,i) -> updateRegister state r (ga i) s //LDR pseudo-instruction
            

    module Instruction = 
        let executeInstruction state instruction = 
            match instruction with
            | Some (Inst(ALU (ai,s))) -> ALUInstruction.executeInstruction state ai s
            | Some (Inst(MEM(mi,s))) -> MEMInstruction.executeInstruction state mi s
            | Some (Inst(SF(sfi))) -> SFInstruction.executeInstruction state sfi
            | None -> failwithf "run time error: no instruction found at address %A" (state.RegMap.TryFind(R 15))
            | x -> failwithf "run time error: instruction not defined %A" x

        let nextInstruction 