﻿namespace ARM7TDMI

module Parser=
    open InstructionType
    open MachineState
    open Cast
   
    let whiteSpace = [| ' '; '\f'; '\t'; '\r'; '\n'; ',' |]

    let readAsm textInput = 
        let splitIntoLines (text:string) = 
            text.Split [|'\r'; '\n'|]
            |> Array.toList
            |> List.filter ((<>) "") // delete empty strings generated by default .Split function
        let splitIntoWords (line:string) = 
            line.Split whiteSpace
            |> Array.toList
            |> List.filter ((<>) "") // delete empty strings generated by default .Split function

        let lineList = //: string list list = 
            textInput
            |> splitIntoLines
            |> List.map splitIntoWords
            |> List.filter ((<>) [])

        let branch_map =
            let chooseAddr (b:Map<string,Address>) i =
                match lineList.[i] with
                | IsLabel x::IsLabel _::IsReg _::_ -> b.Add(x,(Addr (i*4)))
                | _ -> b   
            seq { 0 .. lineList.Length - 1 } 
            |> Seq.fold chooseAddr Map.empty

        let remove_branch_label line=
            match line with
            | IsLabel _::IsLabel _::IsReg _::_ -> line.Tail
            | x -> x   

        let executeWordsAsCommand (strlist:string list)= //: InstructionLine
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
            | [ IsMOVInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsRegOrLit op1 ] -> Line(ALU(inst(dest,op1),sf),None,CondCast cond)
            | [ IsALUInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1; IsRegOrLit op2 ] -> Line(ALU(inst(dest,op1,op2),sf),None,CondCast cond)
            | [ IsShiftInst inst;  IsSetFlag sf; IsCondition cond;IsReg dest; IsReg op1; IsRegOrLit op2] -> Line(SHIFT(inst(dest,op1,op2),sf),None,CondCast cond)
            | [ "RRX"; IsSetFlag sf; IsCondition cond;IsReg dest; IsReg exp]-> Line(SHIFT(RRX(dest,exp),sf),None,CondCast cond)
            | [ IsCOMPInst inst; IsSetFlag sf; IsCondition cond;IsReg dest; IsRegOrLit op1] -> Line(SF(inst(dest,op1)),None,CondCast cond)
            | [ IsBranchInst inst; IsCondition cond; IsLabel label] when branch_map.TryFind(label) <> None-> Line(BRANCH(inst(branch_map.[label])),None,CondCast cond)
            // with shifts
            | [ IsMOVInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1 ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(ALU(inst(dest,Reg(op1)),sf),shiftinst(op1,op1,exp)|> Some,CondCast cond)
            | [ IsALUInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1; IsReg op2 ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(ALU(inst(dest,op1,Reg(op2)),sf),shiftinst(op2,op2,exp)|> Some,CondCast cond)
            | [ IsCOMPInst inst; IsSetFlag sf; IsCondition cond;IsReg dest; IsReg op1 ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(SF(inst(dest,Reg(op1))),shiftinst(op1,op1,exp)|> Some,CondCast cond)
            | x -> failwithf "Unexpected match in parser: %A" x

        let instList = //: InstructionType list = 
            lineList
            |> List.map remove_branch_label   
            |> List.map executeWordsAsCommand

        let init_reg = 
            [0..15] |> Seq.map (fun x -> (R x, 0)) |> Map.ofSeq
        
        let init_memory =
            let chooseAddr (m:Map<Address,Memory>) i = m.Add(Addr(i*4),Inst(instList.[i]))
            seq { 0 .. instList.Length - 1 } 
            |> Seq.fold chooseAddr Map.empty

        { 
            //PC = Addr 0 // PC is now Reg 15
            END = Addr (4*instList.Length)
            RegMap = init_reg
            MemMap = init_memory
            Flags = {N=false; Z=false; C=false; V=false}
            State = RunOK
        }