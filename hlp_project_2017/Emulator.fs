namespace ARM7TDMI

module Emulator = 
    module MachineState =
        type Register = R of int
        type Memory = M of int  
        type RunState = 
        | RunOK
        | RunTimeErr of string
        | SyntaxErr of string
        type Flags = 
            {
                N: bool
                Z: bool
                C: bool
                V: bool
            }
        type MachineState = 
            { 
                RegMap : Map<Register, int>
                MemMap : Map<Memory, int> 
                Flags : Flags 
                State : RunState 
            }

    module ProcessFlag = 
            open MachineState
            type InstructionType = 
                | ADD of int*int*int
                | SUB of int*int*int
                | OTHER of int 
    
            let processFlags instruction =
                let N res = if res < 0 then true else false
                let Z res = if res = 0 then true else false

                match instruction with
                | ADD(op1,op2,res) ->  { 
                                            N = N res 
                                            Z = Z res
                                            C = if (res<0 && res >= 0) || (res>0 && res<=0) then true else false 
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
    
    module ExtractRegister = 
        open MachineState
        type RegOrLit = 
            private
            | Reg of Register 
            | Lit of int

        let extractRegister (state:MachineState) (rol:RegOrLit) = 
             match rol with
             | Reg r -> state.RegMap.[r]
             | Lit l -> l
             

    module ALUInstruction = 
        open MachineState
        open ProcessFlag
        open ExtractRegister

        type ALUInstruction =
            private
            | MOV of (Register * RegOrLit)
            | ADD of (Register * RegOrLit * RegOrLit) 
            | SUB of (Register * RegOrLit * RegOrLit)

        let private mov state dest op1 s = 
            let newRegMap = Map.add dest op1 state.RegMap
            let newFlags = if s then processFlags (ProcessFlag.InstructionType.OTHER(op1)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        
        let private add state dest op1 op2 s = 
            let newRegMap = Map.add dest (op1+op2) state.RegMap
            let newFlags = if s then processFlags (ProcessFlag.InstructionType.ADD(op1,op2,(op1+op2))) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
    
        let private sub state dest op1 op2 s = 
            let newRegMap = Map.add dest (op1-op2) state.RegMap
            let newFlags = if s then processFlags (ProcessFlag.InstructionType.SUB(op1,op2,(op1-op2))) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        
        let executeInstruction state instruction s = 
            let er = extractRegister state
            match instruction with
            | MOV(r,i) -> mov state r (er i) s
            | ADD(r,i1,i2) -> add state r (er i1) (er i2) s
            | SUB(r,i1,i2) -> sub state r (er i1) (er i2) s

    module Instruction = 
        open MachineState
        type Instruction = 
            private 
            | ALUInst of ALUInstruction.ALUInstruction * setCond: bool
            
        let executeInstruction state instruction = 
            match instruction with
            | ALUInst(ai,s) -> ALUInstruction.executeInstruction state ai s
