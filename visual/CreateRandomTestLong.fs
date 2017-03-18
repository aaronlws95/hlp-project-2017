namespace VisualInterface

///Create random tests on multiple instructions
module CreateRandomTestLong = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType
    let rand = System.Random()
    let instNameArr = [|"MOV";"MVN";"ADD";"SUB";"EOR";"RSB";"RSC";"ADC";"SBC";"BIC";
            "ORR";"TST";"TEQ";"CMN";"CMP";"LSL";"LSR";"ASR";"ROR";"RRX"|]
    let createRandomTestRestrictReg (instName:string) (setFlagRand:string) (regLitSet:string) =       
        let reg = rand.Next(0,2)
        let reg2 = rand.Next(0,2)
        let op2shift = rand.Next(0,256)
        let strop2,op2 = 
            match regLitSet.ToUpper() with
            | "RAND" -> 
                if rand.Next(0,2) = 0 then
                    let shift = 2*rand.Next(0,16)
                    match instName with 
                        | "LSL"|"LSR"|"ASR"|"ROR"|"RRX" -> (", #" + string(op2shift),Lit op2shift)
                        | _ ->  let out =  ((rand.Next(0,256)>>>shift) ||| (rand.Next(0,256)<<<(32-shift)))
                                (", #" + string(out),Lit out)                          
                else
                    let out = rand.Next(0,2)
                    (", R" + string(out),Reg (R out))
            | "LIT" ->                          
                let shift = 2*rand.Next(0,16)
                match instName with 
                    | "LSL"|"LSR"|"ASR"|"ROR"|"RRX" -> (", #" + string(op2shift),Lit op2shift)
                    | _ ->  let out =  ((rand.Next(0,256)>>>shift) ||| (rand.Next(0,256)<<<(32-shift)))
                            (", #" + string(out),Lit out)   
            | "REG" ->  let out = rand.Next(0,2)
                        (", R" + string(out),Reg (R out))
            | _ -> failwithf "invalid setting"
               
        let strsf,sf =                
            match setFlagRand.ToUpper() with
            | "SET" -> (instName + "S R",true)
            | "NOSET" -> (instName + " R",false)
            | "RAND" -> if rand.Next(0,2) = 0 then (instName + " R",false) else (instName + "S R",true)
            | _ -> failwithf "invalid setting"

        match instName.ToUpper() with 
            | "MOV" -> ((strsf + string(reg) + strop2), ALU(MOV(R reg,op2),sf))
            | "MVN" -> ((strsf + string(reg) + strop2), ALU(MVN(R reg,op2),sf))
            | "TST" -> (("TST R" + string(reg) + strop2), SF(TST(R reg,op2)))
            | "TEQ" -> (("TEQ R" + string(reg) + strop2), SF(TEQ(R reg,op2)))
            | "CMP" -> (("CMP R" + string(reg) + strop2), SF(CMP(R reg,op2)))
            | "CMN" -> (("CMN R" + string(reg) + strop2), SF(CMN(R reg,op2)))
            | "ADD" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), ALU(ADD(R reg,R reg2, op2),sf))
            | "SUB" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), ALU(SUB(R reg,R reg2, op2),sf))
            | "EOR" -> (("EOR R" + string(reg) + ", R" + string(reg2) + strop2), ALU(EOR(R reg,R reg2, op2),false)) //Visual error with EORS so set to false
            | "RSB" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), ALU(RSB(R reg,R reg2, op2),sf))
            | "RSC" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), ALU(RSC(R reg,R reg2, op2),sf))
            | "ADC" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), ALU(ADC(R reg,R reg2, op2),sf))
            | "SBC" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), ALU(SBC(R reg,R reg2, op2),sf))
            | "BIC" -> (("BIC R" + string(reg) + ", R" + string(reg2) + strop2), ALU(BIC(R reg,R reg2, op2),false)) //Visual error with BICS so set to false
            | "ORR" -> (("ORR R" + string(reg) + ", R" + string(reg2) + strop2), ALU(ORR(R reg,R reg2, op2),false)) //Visual error with ORRS so set to false
            | "LSL" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), SHIFT(LSL(R reg,R reg2, op2),sf))
            | "LSR" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), SHIFT(LSR(R reg,R reg2, op2),sf))
            | "ASR" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), SHIFT(ASR(R reg,R reg2, op2),sf))
            | "ROR" -> ((strsf + string(reg) + ", R" + string(reg2) + strop2), SHIFT(ROR(R reg,R reg2, op2),sf))
            | "RRX" -> ((strsf + string(reg) + ", R" + string(reg2)), SHIFT(RRX(R reg,R reg2),sf))
            | _ -> failwithf "instruction name not valid"
    
    /// get random instruction name 
    let getRandInstName = fun() -> instNameArr.[rand.Next(0,Array.length instNameArr)]   

    let createRandomTestLong length setFlag setRegLit= 
        let addInst (strOld,instOld)  = 
            let strNew,instNew = (createRandomTestRestrictReg (getRandInstName()) setFlag setRegLit)
            ((strOld + "\n" + strNew),(List.append instOld [instNew]))
        [1..length] |> List.fold (fun acc elem -> addInst acc) ("MOV R0, #0",[ALU(MOV(R 0,Lit 0),false)])
    
    let createdRandTestListLong instLength n  = 
        [1..n] |> List.map (fun n -> ("Test " + string(n)),(createRandomTestLong instLength "rand" "rand")) |> List.map (fun (n,(t,il)) -> createTest n t il)