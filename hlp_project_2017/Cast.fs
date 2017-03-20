namespace ARM7TDMI

module Cast=
    open InstructionType
    open MachineState


    /// matches string (X -> X) returning integer
    let (|IsInt|_|) (s:string) = 
        try 
            int s |> Some
        with _ -> None

    /// matches string list returning Int list
    let rec (|IsIntList|_|) (lst:string list) = 
        match lst with
        | IsInt value::IsIntList rest -> value::rest |> Some
        | [IsInt value] -> [value] |> Some
        | [] -> [] |> Some
        | _ -> None

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
        match s with
        | IsInt x -> Some(Addr(x))
        | x -> b_map.TryFind(x)
            

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
        | "AND" -> AND |> Some
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
        match (if s.Length>0 then s.[0] else ' ') with
        | 'S' when s.Length>1 -> ["S";s.[1..]]
        | 'B' when s.Length>1 -> ["B";s.[1..]]
        | _   when s.Length>1 -> ["";s.[1..]]
        | 'S' -> ["S";""]
        | 'B' -> ["B";""]
        | _   -> ["";""]
    let checkdir (s:string) =
        match (if s.Length>1 then s.[0..1] else "") with
        | "ED" when s.Length>2 -> ["ED" ;s.[2..]]
        | "IB" when s.Length>2 -> ["IB" ;s.[2..]]
        | "FD" when s.Length>2 -> ["FD" ;s.[2..]]
        | "IA" when s.Length>2 -> ["IA" ;s.[2..]]
        | "EA" when s.Length>2 -> ["EA" ;s.[2..]]
        | "DB" when s.Length>2 -> ["DB" ;s.[2..]]
        | "FA" when s.Length>2 -> ["FA" ;s.[2..]]
        | "DA" when s.Length>2 -> ["DA" ;s.[2..]]
        | "ED"  -> ["ED" ;""]
        | "IB"  -> ["IB" ;""]
        | "FD"  -> ["FD" ;""]
        | "IA"  -> ["IA" ;""]
        | "EA"  -> ["EA" ;""]
        | "DB"  -> ["DB" ;""]
        | "FA"  -> ["FA" ;""]
        | "DA"  -> ["DA" ;""]
        | _ -> [""; s]

    let inst_S_or_B_Cond_ToList (inst:string) (rest:string) = inst::checkS_or_B rest
    let inst_dir_Cond_ToList (inst:string) (rest:string) = inst::checkdir rest

    let TokenizeInst (s:string)=
        match s with
        | Prefix "MOV" rest -> inst_S_or_B_Cond_ToList "MOV" rest   //1
        | Prefix "MVN" rest -> inst_S_or_B_Cond_ToList "MVN" rest   //2
        | Prefix "ADD" rest -> inst_S_or_B_Cond_ToList "ADD" rest   //3
        | Prefix "ADC" rest -> inst_S_or_B_Cond_ToList "ADC" rest   //4
        | Prefix "SUB" rest -> inst_S_or_B_Cond_ToList "SUB" rest   //5
        | Prefix "SBC" rest -> inst_S_or_B_Cond_ToList "SBC" rest   //6
        | Prefix "RSB" rest -> inst_S_or_B_Cond_ToList "RSB" rest   //7
        | Prefix "RSC" rest -> inst_S_or_B_Cond_ToList "RSC" rest   //8
        | Prefix "AND" rest -> inst_S_or_B_Cond_ToList "AND" rest   //9
        | Prefix "EOR" rest -> inst_S_or_B_Cond_ToList "EOR" rest   //10
        | Prefix "BIC" rest -> inst_S_or_B_Cond_ToList "BIC" rest   //11
        | Prefix "ORR" rest -> inst_S_or_B_Cond_ToList "ORR" rest   //12
        | Prefix "LSL" rest -> inst_S_or_B_Cond_ToList "LSL" rest   //13
        | Prefix "LSR" rest -> inst_S_or_B_Cond_ToList "LSR" rest   //14
        | Prefix "ASR" rest -> inst_S_or_B_Cond_ToList "ASR" rest   //15
        | Prefix "ROR" rest -> inst_S_or_B_Cond_ToList "ROR" rest   //16
        | Prefix "RRX" rest -> inst_S_or_B_Cond_ToList "ROR" rest   //17
        | Prefix "CMP" rest -> inst_S_or_B_Cond_ToList "CMP" rest   //18
        | Prefix "CMN" rest -> inst_S_or_B_Cond_ToList "CMN" rest   //19
        | Prefix "TST" rest -> inst_S_or_B_Cond_ToList "TST" rest   //20
        | Prefix "TEQ" rest -> inst_S_or_B_Cond_ToList "TEQ" rest   //21
        | Prefix "BL" rest -> inst_S_or_B_Cond_ToList "BL" rest     //22
        | Prefix "B" rest -> inst_S_or_B_Cond_ToList "B" rest       //23
        | Prefix "ADR" rest -> inst_S_or_B_Cond_ToList "ADR" rest   //24
        | Prefix "LDR" rest -> inst_S_or_B_Cond_ToList "LDR" rest   //25 - double
        | Prefix "STR" rest -> inst_S_or_B_Cond_ToList "STR" rest   //26
        | Prefix "LDM" rest -> inst_dir_Cond_ToList "LDM" rest   //27
        | Prefix "STM" rest -> inst_dir_Cond_ToList "STM" rest   //28
        | Prefix "END" rest -> inst_S_or_B_Cond_ToList "END" rest   
        | x -> [x; ""; ""]
   