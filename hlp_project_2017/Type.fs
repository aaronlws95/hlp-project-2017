namespace ARM7TDMI

module Type =

    type Register = R of int

    type Memory = M of int 

    type RegOrLit = 
        | Reg of Register
        | Lit of int

    type Instruction = 
        | MOV of (Register * RegOrLit)
        | ADD of (Register * Register * RegOrLit) 
        | SUB of (Register * Register * RegOrLit)
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

    let initializeRegMap = 
        Map.empty.
          Add(R 0, 0).
          Add(R 1, 0).
          Add(R 2, 0).
          Add(R 3, 0)
   
    
     

