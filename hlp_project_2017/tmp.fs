//Added by Aaron
//temporary implementation for mov function
    type Register = 
        | R0
        | R1
        | R2

    type RegOrLit = 
        | Reg of Register
        | Lit of int

    type Response =
    | VarValue of int // for commands that return data
    | ParseError // if command string is invalid
    | DataError // if the required data does not exist
    | OK // for valid commads that return no data

    let mutable state : Map<Register, int> = Map []

    state <- Map.add R0 0 state
    state <- Map.add R1 0 state
 

    let mov reg = 
        function 
        | Reg r -> state <- Map.add reg state.[r] state
        | Lit i -> state <- Map.add reg i state
    
    mov R1 (Lit 2)
    mov R0 (Lit 5)
    mov R0 (Reg R1)

    //temporary implementation for add function

    let add reg = 
        function 
        | [Reg r1;Reg r2] -> state <- Map.add reg (state.[r1] + state.[r2])  state
                             OK
        | [Reg r;Lit i] -> state <- Map.add reg (state.[r] + i)  state
                           OK
        | _ -> DataError

    add R2 [(Reg R0);(Reg R1)] |> ignore //4
    add R1 [(Reg R0);Lit 1] |> ignore //3

    //temporary implementation for sub function

    let sub reg = 
        function 
        | [Reg r1;Reg r2] -> state <- Map.add reg (state.[r1] - state.[r2])  state
                             OK
        | [Reg r;Lit i] -> state <- Map.add reg (state.[r] - i)  state
                           OK
        | _ -> DataError

    sub R2 [(Reg R2);(Reg R1)] |> ignore //1
    sub R1 [(Reg R1);Lit 1] |> ignore //2

    //other functions will follow similarly
