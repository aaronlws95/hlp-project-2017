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
            PC: Address
            End: Address
            RegMap : Map<Register, Value>
            MemMap : Map<Address, Memory>   //instruction list and label for pointers are stored here
            Flags : Flags 
            State : RunState 
        }
