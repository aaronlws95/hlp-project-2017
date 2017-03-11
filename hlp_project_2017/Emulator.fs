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
                                            C = if ((((sign(op1) <> sign(op2)) && ((sign(op1) = 1) && (op1 > op2) ||  (sign(op2) = 1) && (op2 > op1))) && res >= 0) 
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
        let getRegisterValue (R r:Register) = r

    module ALUInstruction = 
        //MOV FUNCTION
        let private mov state dest op1 s = 
            let newRegMap = Map.add dest op1 state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(op1)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        //ADD FUNCTION
        let private add state dest op1 op2 s = 
            let newRegMap = Map.add dest (op1+op2) state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.ADD(op1,op2,(op1+op2))) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        //SUB FUNCTION
        let private sub state dest op1 op2 s = 
            let newRegMap = Map.add dest (op1-op2) state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.SUB(op1,op2,(op1-op2))) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        //TODO: MORE FUNCTIONS
        let executeInstruction state instruction s = 
            let er = Extractor.extractRegister state
            match instruction with
            | MOV(r,i) -> mov state r (er i) s
            | ADD(r,i1,i2) -> add state r state.RegMap.[i1] (er i2) s
            | SUB(r,i1,i2) -> sub state r state.RegMap.[i1] (er i2) s

    module MEMInstruction = 
        // ADR FUNCTION
        let private adr state dest exp s =  
            let newRegMap = Map.add dest exp state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(exp)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        // LDR FUNCTION
        let private ldr state dest exp s =  
            let newRegMap = Map.add dest state.RegMap.[exp] state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(state.RegMap.[exp])) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        // TODO: MORE FUNCTIONS
        let executeInstruction state instruction s = 
            let em = Extractor.extractMemory state
            let ga = Extractor.getAddressValue
            let gr = Extractor.getRegisterValue
            match instruction with
            | ADR(r,i) -> adr state r (ga i) s
            | LDR(r1,r2) -> ldr state r1 r2 s
    
    module Instruction = 
        let executeInstruction state instruction = 
            match instruction with
            | Some (Inst(ALU (ai,s))) -> ALUInstruction.executeInstruction state ai s
            | Some (Inst(MEM(mi,s))) -> MEMInstruction.executeInstruction state mi s
            | None -> failwithf "run time error: no instruction found at address %A" state.PC
            | x -> failwithf "run time error: instruction not defined %A" x

        let rec executeInstructions (state:MachineState) =
            let newState = executeInstruction state (state.MemMap.TryFind(state.PC))
            if newState.PC = newState.End 
            then    newState
            else    executeInstructions newState

            

           