namespace ARM7TDMI

module Parser=
    open InstructionType
    open MachineState
    open InstructionsActivePatterns
    open BasicActivePatterns
    open Converters
    open Tokenizer

    type Map_addr_counter = 
        {
        Counter: int    //if user tries to use any memory below this address throw error
        AddrMap : Map<string, Address>   //PC is R15
        }

    let readAsm textInput =
        
        let lineList = //: string list list = 
            textInput
            |> splitIntoLines
            |> List.map splitIntoWords
            |> List.filter ((<>) [])

        let branch_map =
            let chooseAddr (b:Map<string,Address>) i =
                match lineList.[i] with
                | IsLabel x::IsLabel endInst::_ when endInst.Contains("END") -> b.Add(x,(Addr (i*4)))
                | IsLabel x::IsLabel _::IsReg _::_ -> b.Add(x,(Addr (i*4))) //ALL instructions except B BL DCD EQU FILL END
                | _ -> b   
            seq { 0 .. lineList.Length - 1 } 
            |> Seq.fold chooseAddr Map.empty

        let remove_branch_label line=
            match line with
            | IsLabel x::IsLabel endInst::_ when endInst.Contains("END") -> line.Tail
            | IsLabel _::IsLabel _::IsReg _::_ -> line.Tail
            | x -> x   

        let label_map =
            let chooseAddr (l:Map_addr_counter) i =
                match lineList.[i] with
                | IsLabel x::"FILL"::IsInt value::_ -> { l with AddrMap=l.AddrMap.Add(x,Addr(l.Counter*4)) ; Counter=l.Counter+value/4+1 }
                | "FILL"::IsInt value::_ -> { l with AddrMap=l.AddrMap.Add("DEFAULT_FILL",Addr(l.Counter*4)) ; Counter=l.Counter+value/4+1 }
                | IsLabel x::"DCD"::rest ->  { l with AddrMap=l.AddrMap.Add(x,Addr(l.Counter*4)) ; Counter=l.Counter+rest.Length+1 }
                | IsLabel x::"EQU"::_ -> { l with AddrMap=l.AddrMap.Add(x,Addr(l.Counter*4)) ; Counter=l.Counter+1 }
                | _ -> l   
            (seq { 0 .. lineList.Length - 1 } |> Seq.fold chooseAddr { Counter=(lineList.Length+1); AddrMap=Map.empty}).AddrMap

        let executeWordsAsCommand (strlist:string list)= //: InstructionLine
            let instruction = TokenizeInst strlist.[0]
            let basicinstruction = instruction.[0]
            let setflag_or_byte_or_dir = instruction.[1]
            let condition = instruction.[2]
            let instrline = basicinstruction::setflag_or_byte_or_dir::condition::(strlist.Tail)
            match instrline with
            //normal with S or Cond or neither
            | [ IsMOVInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsRegOrLit op1 ] -> Line(ALU(inst(dest,op1),sf),None,CondCast cond)
            | [ IsALUInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1; IsRegOrLit op2 ] -> Line(ALU(inst(dest,op1,op2),sf),None,CondCast cond)
            | [ IsShiftInst inst;  IsSetFlag sf; IsCondition cond;IsReg dest; IsReg op1; IsRegOrLit op2] -> Line(SHIFT(inst(dest,op1,op2),sf),None,CondCast cond)
            | [ "RRX"; IsSetFlag sf; IsCondition cond;IsReg dest; IsReg exp]-> Line(SHIFT(RRX(dest,exp),sf),None,CondCast cond)
            | [ IsCOMPInst inst; _ ; IsCondition cond;IsReg dest; IsRegOrLit op1] -> Line(SF(inst(dest,op1)),None,CondCast cond)
            | [ IsBranchInst inst; _ ; IsCondition cond; IsAddr branch_map addr] -> Line(BRANCH(inst(addr)),None,CondCast cond)
            // with shifts
            | [ IsMOVInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1 ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(ALU(inst(dest,Reg(op1)),sf),shiftinst(op1,op1,exp)|> Some,CondCast cond)
            | [ IsALUInst inst; IsSetFlag sf; IsCondition cond; IsReg dest; IsReg op1; IsReg op2 ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(ALU(inst(dest,op1,Reg(op2)),sf),shiftinst(op2,op2,exp)|> Some,CondCast cond)
            | [ IsCOMPInst inst; IsSetFlag sf; IsCondition cond;IsReg dest; IsReg op1 ; IsShiftInst shiftinst; IsRegOrLit exp] -> Line(SF(inst(dest,Reg(op1))),shiftinst(op1,op1,exp)|> Some,CondCast cond)
            //Memory Instructions
            | [ "ADR"; IsSetFlag sf; IsCondition cond; IsReg dest; IsAddr label_map addr] -> Line(MEM(ADR(dest,addr)),None,CondCast cond)
            | [ "LDR"; IsSetFlag sf; IsCondition cond; IsReg dest; "="; IsAddr label_map addr] -> Line(MEM(ADR(dest,addr)),None,CondCast cond)
            //LDR STR
            | [ IsMEMRInst inst; IsByteMode b; IsCondition cond; IsReg dest; "[" ; IsReg source; "]" ] ->  Line(MEM(inst(dest,source,Lit 0,Lit 0,b)),None,CondCast cond)
            | [ IsMEMRInst inst; IsByteMode b; IsCondition cond; IsReg dest; "[" ; IsReg source; IsRegOrLit offset; "]" ] ->  Line(MEM(inst(dest,source,offset,Lit 0,b)),None,CondCast cond)
            | [ IsMEMRInst inst; IsByteMode b; IsCondition cond; IsReg dest; "[" ; IsReg source; IsRegOrLit offset; "]"; "!" ] ->  Line(MEM(inst(dest,source,offset,offset,b)),None,CondCast cond)
            | [ IsMEMRInst inst; IsByteMode b; IsCondition cond; IsReg dest; "[" ; IsReg source; "]";  IsRegOrLit offset ] ->  Line(MEM(inst(dest,source,Lit 0,offset,b)),None,CondCast cond)
            //LDM STM
            | [ IsMEMMInst inst; Isdir dir; IsCondition cond; IsReg source ] ->  Line(MEM(inst(dir,source,[],false)),None,CondCast cond)
            | [ IsMEMMInst inst; Isdir dir; IsCondition cond; IsReg source; "!" ] ->  Line(MEM(inst(dir,source,[],true)),None,CondCast cond)
            | IsMEMMInst inst::Isdir dir::IsCondition cond::IsReg source::IsRegList reglist ->  Line(MEM(inst(dir,source,reglist,false)),None,CondCast cond)
            | IsMEMMInst inst::Isdir dir::IsCondition cond::IsReg source::"!"::IsRegList reglist ->  Line(MEM(inst(dir,source,reglist,true)),None,CondCast cond)
            //LABEL Instructions
            | [IsAddr label_map addr; ""; ""; "FILL"; IsInt value] -> Line(LABEL(FILL(addr,value/4)),None,None)
            | [ "FILL";"";""; IsInt value] when label_map.TryFind("DEFAULT_FILL")<>None-> Line(LABEL(FILL(label_map.["DEFAULT_FILL"],value/4)),None,None)
            | IsAddr label_map addr::""::""::"DCD"::IsIntList valueLst -> Line(LABEL(DCD(addr,valueLst)),None,None)
            | [IsAddr label_map addr;"";""; "EQU"; IsInt value] -> Line(LABEL(EQU(addr,value)),None,None)
            //END
            | ["END"; _; IsCondition cond] -> Line(END,None,CondCast cond)
            //Syntax Error
            | x -> Failed_Parsing("Unexpected match in parser: "+(x |> String.concat " "))

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