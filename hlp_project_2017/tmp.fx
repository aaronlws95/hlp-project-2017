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

    let mutable MachineState : Map<Register, int> = Map []

    MachineState <- Map.add R0 0 MachineState
    MachineState <- Map.add R1 0 MachineState
 

    let mov reg = 
        function 
        | Reg r -> MachineState <- Map.add reg MachineState.[r] MachineState
        | Lit i -> MachineState <- Map.add reg i MachineState
    
    mov R1 (Lit 2)
    mov R0 (Lit 5)
    mov R0 (Reg R1)

    //temporary implementation for add function

    let add reg = 
        function 
        | [Reg r1;Reg r2] -> MachineState <- Map.add reg (MachineState.[r1] + MachineState.[r2])  MachineState
                             OK
        | [Reg r;Lit i] -> MachineState <- Map.add reg (MachineState.[r] + i)  MachineState
                           OK
        | _ -> DataError

    add R2 [(Reg R0);(Reg R1)] |> ignore //4
    add R1 [(Reg R0);Lit 1] |> ignore //3

    //temporary implementation for sub function

    let sub reg = 
        function 
        | [Reg r1;Reg r2] -> MachineState <- Map.add reg (MachineState.[r1] - MachineState.[r2])  MachineState
                             OK
        | [Reg r;Lit i] -> MachineState <- Map.add reg (MachineState.[r] - i)  MachineState
                           OK
        | _ -> DataError

    sub R2 [(Reg R2);(Reg R1)] |> ignore //1
    sub R1 [(Reg R1);Lit 1] |> ignore //2

    //other functions will follow similarly
