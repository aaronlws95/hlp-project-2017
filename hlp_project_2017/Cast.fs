namespace ARM7TDMI

module Cast=
    open InstructionType
    open MachineState


    /// matches string (X -> X) returning integer
    let (|IsInt|_|) (s:string) = 
        try 
            int s |> Some
        with _ -> None

    ///matches string (#X->X) returning integer
    let (|IsLit|_|) (s:string) = 
        let getX = s.[1..] 
        if s.[0]='#'
        then
            match getX with
            | IsInt x -> Some(x)
            | _ -> None
        else
            None

    /// matches string returning register
    let (|IsReg|_|) (s:string) =
        let getX = s.[1..] 
        //let ParseToReg =
        if s.[0]='R'
        then
            match getX with
            | IsInt x when x<=15 -> R(x) |> Some
            | _ -> None
            //| "R0" -> R 0
            //| "R1" -> R 1
        else
            None//invalidOp "register does not exist"

    /// matches string list returning register list
    let rec (|IsRegList|_|) (lst:string list) = 
        match lst with
        | IsReg reg::IsRegList rest -> reg::rest |> Some
        | [IsReg reg] -> [reg] |> Some
        | [] -> [] |> Some
        | _ -> None

    /// matches RegOrLit string returning the RegOrLit
    let (|IsRegOrLit|_|) =
        function
        | IsReg reg -> Reg(reg) |> Some
        | IsLit lit -> Lit(lit) |> Some
        | _ -> None

     /// matches string returning string
    let (|IsLabel|_|) = 
        function
        | IsReg x -> None
        | s -> 
            try 
                string s |> Some 
            with _ -> None

    ///matches Addr label or addr literal
    let (|IsAddr|_|) (b_map:Map<string,Address>) (s:string) = 
        let getX = s.[1..] 
        if s.[0]='#'
        then
            match getX with
            | IsInt x -> Some(Addr(x))
            | _ -> None
        else
            b_map.TryFind(s)

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
        | _ -> false
    //check if one branch label returns bool for filter
    let IsNotBranch =
        function
        | [IsLabel x] -> false
        | _ -> true

    //check if instruction is valid
    
    //MOV and MVN
    let (|IsMOVInst|_|)=
        function
        | "MOV" -> MOV |> Some
        | "MVN" -> MVN |> Some
        | _ -> None

    //ALU
    let (|IsALUInst|_|) =
        function
        | "ADD" -> ADD |> Some
        | "ADC" -> ADC |> Some
        | "SUB" -> SUB |> Some
        | "SBC" -> SBC |> Some
        | "RSB" -> RSB |> Some
        | "RSC" -> RSC |> Some
        //| "AND" -> AND |> Some
        | "EOR" -> EOR |> Some
        | "BIC" -> BIC |> Some
        | "ORR" -> ORR |> Some
        | _ -> None
       
    //Shift
    let (|IsShiftInst|_|) =
        function
        | "LSL" -> LSL |> Some
        | "LSR" -> LSR |> Some
        | "ASR" -> ASR |> Some
        | "ROR" -> ROR |> Some
        | _ -> None
    
    //RRX has its own pattern matching

    //compare
    let (|IsCOMPInst|_|) =
        function
        | "CMP" -> CMP |> Some
        | "CMN" -> CMN |> Some
        | "TST" -> TST |> Some
        | "TEQ" -> TEQ |> Some
        | _ -> None

    //ADR and LDR pseudo has their own pattern matching
    //Memory
    let (|IsMEMRInst|_|) =
        function
        | "LDR" -> LDR |> Some
        | "STR" -> STR |> Some
        | _ -> None

    let (|IsMEMMInst|_|) =
        function
        | "LDM" -> LDM |> Some
        | "STM" -> STM |> Some
        | _ -> None

    let (|IsBranchInst|_|) =
        function
        | "BL" -> BL |> Some
        | "B" -> B |> Some
        | _ -> None

    let (|IsSetFlag|_|) =
        function
        | "S" -> true |> Some
        | "" -> false |> Some
        | _ -> None

    let (|IsByteMode|_|) =
        function
        | "B" -> true |> Some
        | "" -> false |> Some
        | _ -> None

    let (|IsCondition|_|) =
        function
        | "EQ" -> EQ |> Some
        | "NE" -> NE |> Some 
        | "CS" -> CS |> Some 
        | "HS" -> HS |> Some 
        | "CC" -> CC |> Some 
        | "LO" -> LO |> Some 
        | "MI" -> MI |> Some 
        | "PL" -> PL |> Some 
        | "VS" -> VS |> Some 
        | "VC" -> VC |> Some 
        | "HI" -> HI |> Some 
        | "LS" -> LS |> Some 
        | "GE" -> GE |> Some 
        | "LT" -> LT |> Some 
        | "GT" -> GT |> Some 
        | "LE" -> LE |> Some 
        | "AL" -> AL |> Some 
        | "" -> NoCond |> Some
        | _ -> None

        //LDMdir
    let (|IsLDMdir|_|) = 
        function
        | "ED" -> ED |> Some
        | "IB" -> IB |> Some
        | "FD" -> FD |> Some
        | "IA" -> IA |> Some
        | "EA" -> EA |> Some
        | "DB" -> DB |> Some
        | "FA" -> FA |> Some
        | "DA" -> DA |> Some
        | _ -> None 
    //because of fable we have to do this
    let CondCast =
        function
        | NoCond -> None
        | cond -> cond |> Some
    //No forget DCD, EQU, FILL and END

    let (|Prefix|_|) (p:string) (s:string) =
        if s.StartsWith(p) then
            Some(s.Substring(p.Length))
        else
            None

    let checkS_or_B (s:string) =
        if s <> ""
        then 
            if s.[0] ='S'
            then "S"
            elif s.[0] ='B'
            then "B"
            else ""
        else ""
    let checkCond (s:string) =
        if s.Length = 2
        then s
        elif s.Length = 3
        then s.[1..2]
        elif s = "S"
        then ""
        elif s = "B"
        then ""
        else s

    let toTuple (inst:string) (rest:string) = [inst; checkS_or_B rest; checkCond rest]

    let TokenizeInst (s:string)=
        match s with
        | Prefix "MOV" rest -> toTuple "MOV" rest   //1
        | Prefix "MVN" rest -> toTuple "MVN" rest   //2
        | Prefix "ADD" rest -> toTuple "ADD" rest   //3
        | Prefix "ADC" rest -> toTuple "ADC" rest   //4
        | Prefix "SUB" rest -> toTuple "SUB" rest   //5
        | Prefix "SBC" rest -> toTuple "SBC" rest   //6
        | Prefix "RSB" rest -> toTuple "RSB" rest   //7
        | Prefix "RSC" rest -> toTuple "RSC" rest   //8
        | Prefix "AND" rest -> toTuple "AND" rest   //9
        | Prefix "EOR" rest -> toTuple "EOR" rest   //10
        | Prefix "BIC" rest -> toTuple "BIC" rest   //11
        | Prefix "ORR" rest -> toTuple "ORR" rest   //12
        | Prefix "LSL" rest -> toTuple "LSL" rest   //13
        | Prefix "LSR" rest -> toTuple "LSR" rest   //14
        | Prefix "ASR" rest -> toTuple "ASR" rest   //15
        | Prefix "ROR" rest -> toTuple "ROR" rest   //16
        | Prefix "RRX" rest -> toTuple "ROR" rest   //17
        | Prefix "CMP" rest -> toTuple "CMP" rest   //18
        | Prefix "CMN" rest -> toTuple "CMN" rest   //19
        | Prefix "TST" rest -> toTuple "TST" rest   //20
        | Prefix "TEQ" rest -> toTuple "TEQ" rest   //21
        | Prefix "BL" rest -> toTuple "BL" rest     //22
        | Prefix "B" rest -> toTuple "B" rest       //23
        | Prefix "ADR" rest -> toTuple "ADR" rest   //24
        | Prefix "LDR" rest -> toTuple "LDR" rest   //25 - double
        | Prefix "STR" rest -> toTuple "STR" rest   //26
        | Prefix "LDM" rest -> toTuple "LDM" rest   //27
        | Prefix "STM" rest -> toTuple "STM" rest   //28
        | x -> [x; ""; ""]
   