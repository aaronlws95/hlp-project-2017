namespace ARM7TDMI

module Cast=
    open InstructionType
    open MachineState


    /// matches string returning integer
    let (|IsLit|_|) (s:string) = 
        try 
            int s |> Some
        with _ -> None

    /// matches string returning integer
    let (|IsLabel|_|) (s:string) = 
        try 
            string s |> Some
        with _ -> None

    /// matches string returning integer
    let (|IsReg|_|) (s:string) =
        let ParseToReg =
            function
            | "R0" -> R 0
            | "R1" -> R 1
            | "R2" -> R 2
            | "R3" -> R 3
            | "R4" -> R 4
            | "R5" -> R 5
            | "R6" -> R 6
            | "R7" -> R 7
            | "R8" -> R 8
            | "R9" -> R 9
            | "R10" -> R 10
            | "R11" -> R 11
            | "R12" -> R 12
            | "R13" -> R 13
            | "R14" -> R 14
            | "R15" -> R 15
            //exception
            | _ -> invalidOp "register does not exist"  
        try 
            ParseToReg s |> Some
        with _ -> None

    /// matches RegOrLit string returning the RegOrLit
    let (|IsRegOrLit|_|) s =
        let parse=
            function
            | IsReg reg -> Reg(reg)
            | IsLit lit -> Lit(lit)
            | _ -> invalidOp "invalid input"
        try
            parse s |> Some
        with _ -> None

    //cast value to addr
    let ValueToAddr (value:Value) =
        match value with
        | (x:int) -> Addr x
    //cast value opttion to addr
    let ValueOptToAddr (value:Option<Value>) =
        match value with
        | Some (x:int) -> Addr x
        | None -> failwith "R 15 has not been initialized or has been removed"
    //cast addr to value
    let AddrToValue (addr:Address) =
        match addr with
        | Addr (x:int) -> (x:Value)

    //check if one branch label returns bool for filter
    let IsBranch =
        function
        | [IsLabel x] -> true
        //| Inst (BRA x) -> true
        | _ -> false
    //check if one branch label returns bool for filter
    let IsNotBranch =
        function
        | [IsLabel x] -> false
        | _ -> true

