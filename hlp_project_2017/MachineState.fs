namespace ARM7TDMI

module MachineState =
    open InstructionType
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
            InstrList : InstructionType list
            Flags : Flags 
            State : RunState 
        }
