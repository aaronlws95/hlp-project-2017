namespace ARM7TDMI


module Emulator = 
    open InstructionType 
    open MachineState

    module ProcessFlag = 
            type ProcessFlagType = 
                | ADD of Value*Value*Value //op1 op2 result
                | SUB of Value*Value*Value //op1 op2 result
                | OTHER of Value // result
            //get flags given state, instruction with input, and ouput
            let processFlags state instruction =
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
                                            C = state.Flags.C
                                            V = state.Flags.V
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
                    | Inst i -> invalidOp "invalid address" 
                state.MemMap.[addr]
                |> checkValidAddr
        let getAddressValue (Addr a:Address) = a

    ///ARITHMETIC LOGIC UNIT INSTRUCTIONS
    module ALUInstruction = 
        let private mov state dest op2 s = 
            let newRegMap = Map.add dest op2 state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(op2)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}

        let private add state dest op1 op2 res s = 
            let newRegMap = Map.add dest res state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.ADD(op1,op2,res)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}

        let private sub state dest op1 op2 res s = 
            let newRegMap = Map.add dest res state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.SUB(op1,op2,res)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        
        let executeInstruction state instruction s = 
            let er = Extractor.extractRegister state
            match instruction with
            | MOV(r,rol) -> mov state r (er rol) s  // R:=ROL
            | ADD(r1,r2,rol) -> add state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]+(er rol))  s // R1:=R2+ROL
            | SUB(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]-(er rol)) s // R1:=R2-ROL
            | MVN(r, rol) -> mov state r ~~~(er rol) s //R:=NOT(ROL)
            | EOR(r1, r2, rol) -> mov state r1 (state.RegMap.[r2]^^^(er rol)) s // R1:=R2 EOR ROL
            | RSB(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) ((er rol)-state.RegMap.[r2]) s //R1:=ROL-R2
            | ADC(r1,r2,rol) -> add state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]+(er rol)+System.Convert.ToInt32(state.Flags.C)) s //R1:=R2+ROl+C
            | SBC(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]-(er rol)+System.Convert.ToInt32(state.Flags.C)-1) s //R1:=R2-ROL+C-1
            | BIC(r1, r2, rol) -> mov state r1 (state.RegMap.[r2]&&&(~~~(er rol))) s //R1:=R2 AND NOT(ROL)
            | ORR(r1, r2, rol) -> mov state r1 (state.RegMap.[r2]|||(er rol)) s //R1:= R2 OR ROL

    ///SET FLAG INSTRUCTIONS
    module SFInstruction = 
        let private setFlag state name op1 op2 = 
            let newFlags = 
                match name with
                | "tst" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(op1&&&op2)) 
                | "teq" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(op1^^^op2)) 
                | "cmp" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.SUB(op1,op2,op1-op2))
                | "cmn" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.ADD(op1,op2,op1+op2))
                | _ -> invalidOp "invalid setFlag function"
            {state with Flags = newFlags}
        
        let executeInstruction state instruction = 
            let er = Extractor.extractRegister state
            match instruction with
                | TST(r,rol) -> setFlag state "tst" state.RegMap.[r] (er rol) //R AND ROL
                | TEQ(r, rol) -> setFlag state "teq" state.RegMap.[r] (er rol) // R EOR ROL
                | CMP(r,rol) -> setFlag state "cmp" state.RegMap.[r] (er rol) // R-ROL
                | CMN(r, rol) -> setFlag state "cmn" state.RegMap.[r] (er rol) // R+ROL

    /// MEMORY INSTRUCTIONS
    module MEMInstruction = 
        let private adr state dest exp s =  
            let newRegMap = Map.add dest exp state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(exp)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        let private ldr state dest exp s  = 
            let newRegMap = Map.add dest exp state.RegMap
            {state with RegMap = newRegMap}
        let private str state value addr s =  
            let newMemMap = Map.add (Addr addr) (Val value)  state.MemMap
            {state with MemMap = newMemMap}


        
        let executeInstruction state instruction s = 
            let em = Extractor.extractMemory state
            let er = Extractor.extractRegister state
            let ga = Extractor.getAddressValue
            match instruction with
                | ADR(r,addr) -> adr state r (ga addr) s //Address load  R:=ADDR
                | LDRPI(r,addr) -> ldr state r (ga addr) s //LDR pseudo-instruction R:=ADDR
                | LDRREG(r1,r2) -> ldr state r1 (em (Addr (er (Reg r2)))) s //Load register R1:=[R2]             
                | STR(r1,r2) -> str state state.RegMap.[r1] state.RegMap.[r2] s   //Store register


    ///SHIFT INSTRUCTIONS
    module SHIFTInstruction = 
        let private updateRegister state dest exp s =  
            let newRegMap = Map.add dest exp state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(exp)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        let private rrx state dest exp s = 
            let newExp = (exp >>> 1) + (System.Convert.ToInt32(state.Flags.C) <<< 31)
            let newRegMap = Map.add dest newExp state.RegMap
            let newC = System.Convert.ToBoolean(exp &&& 1)
            let newFlags = if s then {ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(newExp)) with C = newC} else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
            
        let executeInstruction state instruction s = 
            let er = Extractor.extractRegister state
            match instruction with
                | LSL(r1,r2,rol) -> updateRegister state r1 (state.RegMap.[r2] <<< (er rol)) s //logical shift left
                | LSR(r1,r2,rol) -> updateRegister state r1 ((int32)((uint32)state.RegMap.[r2] >>> (er rol))) s //logical shift right
                | ASR(r1,r2,rol) -> updateRegister state r1 (state.RegMap.[r2] >>> (er rol)) s //arithmetic shift right
                | ROR(r1,r2,rol) -> updateRegister state r1  ((state.RegMap.[r2]>>>(er rol)) ||| (state.RegMap.[r2]<<<(32-(er rol)))) s //rotate right
                | RRX(r1,r2) -> rrx state r1 state.RegMap.[r2] s //rotate right and extend

    ///INSTRUCTION
    module Instruction = 
        let executeInstruction state instruction = 
            match instruction with
            | Some (Inst(ALU (ai,s))) -> ALUInstruction.executeInstruction state ai s
            | Some (Inst(MEM(mi,s))) -> MEMInstruction.executeInstruction state mi s
            | Some (Inst(SF(sfi))) -> SFInstruction.executeInstruction state sfi
            | Some(Inst(SHIFT(shifti,s))) -> SHIFTInstruction.executeInstruction state shifti s  
            | None -> failwithf "run time error: no instruction found at address %A" (state.RegMap.TryFind(R 15))
            | x -> failwithf "run time error: instruction not defined %A" x