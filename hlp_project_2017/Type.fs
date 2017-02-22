namespace ARM7TDMI

module Type =

    type Register = R of int

    type Memory = M of int 

    type Op2 = 
        | Reg of Register
        | Lit of int

    type Instruction = 
        | MOV of (Register * Op2)
        | ADD of (Register * Op2 * Op2) 
        | SUB of (Register * Op2 * Op2)
        | SYNTAXERR of string

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
        { RegMap : Map<Register, int>
          MemMap : Map<Memory, int> 
          Flags : Flags 
          State : RunState 
        }

   
    
     

