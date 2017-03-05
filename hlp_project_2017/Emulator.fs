namespace ARM7TDMI


module Emulator = 
    open InstructionType 
    open MachineState

    module ProcessFlag = 
            type ProcessFlagType = 
                | ADD of int*int*int //op1 op2 result
                | SUB of int*int*int //op1 op2 result
                | OTHER of int // result

            //get flags given instruction, input, and ouput
            let processFlags instruction =
                let N res = if res < 0 then true else false
                let Z res = if res = 0 then true else false

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
        let extractMemory (state:MachineState) (mem:Memory) = 
                state.MemMap.[mem]
    
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
            | ADD(r,i1,i2) -> add state r (er i1) (er i2) s
            | SUB(r,i1,i2) -> sub state r (er i1) (er i2) s

    module MEMInstruction = 
        // ADR FUNCTION
        let private adr state dest exp s =
            let newRegMap = Map.add dest exp state.RegMap
            let newFlags = if s then ProcessFlag.processFlags (ProcessFlag.ProcessFlagType.OTHER(exp)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        // TODO: MORE FUNCTIONS

        let executeInstruction state instruction s = 
            let em = Extractor.extractMemory state
            match instruction with
            | ADR(r,i) -> adr state r (em i) s
    
    module Instruction = 
        type Instruction = 
            | ALUInst of ALUInst * bool
            | MEMInst of MEMInst * bool
            
        let executeInstruction state instruction = 
            match instruction with
            | ALUInst (ai,s) -> ALUInstruction.executeInstruction state ai s
            | MEMInst (mi,s) -> MEMInstruction.executeInstruction state mi s

           

           