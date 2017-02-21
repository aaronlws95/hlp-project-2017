namespace ARM7TDMI

module Type =

    type Register = 
        | R0
        | R1
        | R2

    type RegOrLit = 
        | Reg of Register
        | Lit of int

    type Instruction = 
        | MOV of (Register * RegOrLit)
        | ADD of (Register * RegOrLit * RegOrLit) 
        | SUB of (Register * RegOrLit * RegOrLit)

    type State = Map<Register, int>

    type Response =
        | VarValue of int // for commands that return data
        | ParseError // if command string is invalid
        | DataError // if the required data does not exist
        | State of State // for valid commads that return no data

    
     

