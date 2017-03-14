﻿namespace ARM7TDMI

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

    //No forget ADR and LDR

    //ALU
    let (|IsALUInst|_|) =
        function
        | "ADD" -> ADD |> Some
        | "ADC" -> ADC |> Some
        | "SUB" -> SUB |> Some
        | "SBC" -> SBC |> Some
        | "RSB" -> RSB |> Some
        //| "RSC" -> RSC |> Some
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
    
    //No forget RRX

    //compare
    let (|IsCOMPInst|_|) =
        function
        | "CMP" -> CMP |> Some
        | "CMN" -> CMN |> Some
        | "TST" -> TST |> Some
        | "TEQ" -> TEQ |> Some
        | _ -> None

    //No forget LDR and STR

    //No forget LDM and STM

    let (|IsBranchInst|_|) =
        function
        //| "B" -> B |> Some
        //| "BL" -> BL |> Some
        | _ -> None

    let (|IsSetFlag|_|) =
        function
        | "S" -> true |> Some
        | "" -> false |> Some
        | _ -> None

    let (|IsCondition|_|) =
        function
        | "EQ" -> EQ |> Some |> Some
        | "NE" -> NE |> Some |> Some
        | "CS" -> CS |> Some |> Some
        | "HS" -> HS |> Some |> Some
        | "CC" -> CC |> Some |> Some
        | "LO" -> LO |> Some |> Some
        | "MI" -> MI |> Some |> Some
        | "PL" -> PL |> Some |> Some
        | "VS" -> VS |> Some |> Some
        | "VC" -> VC |> Some |> Some
        | "HI" -> HI |> Some |> Some
        | "LS" -> LS |> Some |> Some
        | "GE" -> GE |> Some |> Some
        | "LT" -> LT |> Some |> Some
        | "GT" -> GT |> Some |> Some
        | "LE" -> LE |> Some |> Some
        | "AL" -> AL |> Some |> Some
        | "" -> None |> Some
        | _ -> None
    //No forget DCD, EQU, FILL and END

    let (|Prefix|_|) (p:string) (s:string) =
        if s.StartsWith(p) then
            Some(s.Substring(p.Length))
        else
            None

    let checkS (s:string) =
        if s <> ""
        then 
            if s.[0] ='S'
            then "S"
            else ""
        else ""
    let checkCond (s:string) =
        if s.Length = 2
        then s
        elif s.Length = 3
        then s.[1..2]
        elif s = "S"
        then ""
        else s

    let toTuple (inst:string) (rest:string) = [inst; checkS rest; checkCond rest]

    let TokenizeInst (s:string)=
        match s with
        | Prefix "MOV" rest -> toTuple "MOV" rest
        | Prefix "MVN" rest -> toTuple "MVN" rest
        | Prefix "ADD" rest -> toTuple "ADD" rest
        | Prefix "ADC" rest -> toTuple "ADC" rest
        | Prefix "SUB" rest -> toTuple "SUB" rest
        | Prefix "SBC" rest -> toTuple "SBC" rest
        | Prefix "RSB" rest -> toTuple "RSB" rest
        | Prefix "RSC" rest -> toTuple "RSC" rest
        | Prefix "AND" rest -> toTuple "AND" rest
        | Prefix "EOR" rest -> toTuple "EOR" rest
        | Prefix "BIC" rest -> toTuple "BIC" rest
        | Prefix "ORR" rest -> toTuple "ORR" rest
        | Prefix "LSL" rest -> toTuple "LSL" rest
        | Prefix "LSR" rest -> toTuple "LSR" rest
        | Prefix "ASR" rest -> toTuple "ASR" rest
        | Prefix "ROR" rest -> toTuple "ROR" rest
        | Prefix "CMP" rest -> toTuple "CMP" rest
        | Prefix "CMN" rest -> toTuple "CMN" rest
        | Prefix "TST" rest -> toTuple "TST" rest
        | Prefix "TEQ" rest -> toTuple "TEQ" rest
        | Prefix "B" rest -> toTuple "B" rest
        | Prefix "B" rest -> toTuple "BL" rest
        | x -> [x; ""; ""]
      

    

    let ParseInstruction (strlist:string list)=
        let instruction = TokenizeInst strlist.[0]
        let basicinstruction = instruction.[0]//instruction.[0..2]
        let setflag = instruction.[1]
            (*if instruction.Length = 4 then (string)instruction.[3]
            elif instruction.Length = 6 then (string)instruction.[3]
            else ""*)
        let condition = instruction.[2]
            (*if instruction.Length = 5 then instruction.[3..4]
            elif instruction.Length = 6 then instruction.[4..5]
            else ""*)
        let instrline = basicinstruction::setflag::condition::(strlist.Tail)
        match instrline with
        //normal with S or Cond or neither
        | [ IsMOVInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsRegOrLit op1 ] -> Line(ALU(inst(dest,op1),sf),None,cond)
        | [ IsALUInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1; IsRegOrLit op2 ] -> Line(ALU(inst(dest,op1,op2),sf),None,cond)
        | [ IsShiftInst inst;  IsSetFlag sf; IsCondition cond;IsReg dest; IsReg op1; IsRegOrLit op2] -> Line(SHIFT(inst(dest,op1,op2),sf),None,cond)
        | [ IsCOMPInst inst; IsSetFlag sf; IsCondition cond;IsReg dest; IsRegOrLit op1] -> Line(SF(inst(dest,op1)),None,cond)
        //| [ IsBranchInst inst; IsCondition cond; IsLabel lab] ->
        // with shifts
        | [ IsMOVInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1; "," ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(ALU(inst(dest,Reg(op1)),sf),shiftinst(op1,op1,exp)|> Some,cond)
        | [ IsALUInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1; IsReg op2 ; "," ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(ALU(inst(dest,op1,Reg(op2)),sf),shiftinst(op2,op2,exp)|> Some,cond)
        | [ IsCOMPInst inst; IsSetFlag sf; IsCondition cond;IsReg dest; IsReg op1 ; "," ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(SF(inst(dest,Reg(op1))),shiftinst(op1,op1,exp)|> Some,cond)
        | x -> failwithf "Unexpected match in parser: %A" x
