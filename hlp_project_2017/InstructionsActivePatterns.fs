namespace ARM7TDMI

module InstructionsActivePatterns =
    open InstructionType
    open MachineState

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

    //ADR and pseudo LDR have their own pattern matching

    //Memory Register
    let (|IsMEMRInst|_|) =
        function
        | "LDR" -> LDR |> Some
        | "STR" -> STR |> Some
        | _ -> None

    //Memory Memory
    let (|IsMEMMInst|_|) =
        function
        | "LDM" -> LDM |> Some
        | "STM" -> STM |> Some
        | _ -> None

    //Branch
    let (|IsBranchInst|_|) =
        function
        | "BL" -> BL |> Some
        | "B" -> B |> Some
        | _ -> None

    //SetFlag
    let (|IsSetFlag|_|) =
        function
        | "S" -> true |> Some
        | "" -> false |> Some
        | _ -> None

    //ByteMode
    let (|IsByteMode|_|) =
        function
        | "B" -> true |> Some
        | "" -> false |> Some
        | _ -> None

    //Conditions
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

    //LDM[dir]/STM[dir]
    let (|Isdir|_|) = 
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