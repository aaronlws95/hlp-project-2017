namespace ARM7TDMI

module MachineState =
    open InstructionType
    type RunState = 
    | RunOK
    | RunTimeErr of string
    | SyntaxErr of string
    | RunEND
        
    type Flags = 
        {
            N: bool
            Z: bool
            C: bool
            V: bool
        }

    type MachineState = 
        {
        END: Address    //if user tries to use any memory below this address throw error
        RegMap : Map<Register, Value>   //PC is R15
        MemMap : Map<Address, Memory>   //instruction list and label for pointers are stored here
        Flags : Flags 
        State : RunState 
        }
