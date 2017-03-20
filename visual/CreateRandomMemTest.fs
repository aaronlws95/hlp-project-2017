﻿namespace VisualInterface

module CreateRandomMemTest = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType
    ///random seed
    let rand = System.Random()
    ///create random test string for Visual and Instruction for Emulator for memory instructions
    let createRandomMemTest (instName:string) (isOff:string) (isAutoIndex:string) =    
            //get details to create instruction   
            let reg = rand.Next(0,5) //first register
            //second register diff to avoid LDR for same source and dest with offset and autoindex
            let reg2 = rand.Next(5,13) 
            let reg3 = rand.Next(0,13) //register to store final result for STR
            let randLit = 
                let shift = 2*rand.Next(0,16)
                ((rand.Next(0,256)>>>shift) ||| (rand.Next(0,256)<<<(32-shift)))
            let memLoc = 
                let memList = [|0..9|] |> Array.map (fun x -> (0x100 + 0x4*x))
                fun() -> memList.[rand.Next(0,Array.length memList)]   
            let op2 =  memLoc()   
           
            let stroff,off,isOff =
                let offset = 4*rand.Next(0,9)                 
                match isOff.ToUpper() with
                | "OFFSET" -> (", #" + string(offset) + "]",offset,true)
                | "NOOFFSET" -> ("]",0,false)
                | "RAND" -> if rand.Next(0,2) = 0 then (", #" + string(offset) + "]",offset,true) else ("]",0,false)
                | _ -> failwithf "invalid setting" 
            let strAutoInd,autoInd =           
                match isAutoIndex.ToUpper() with
                | "AI" -> if isOff then ("!",off) else ("",0)
                | "NOAI" -> ("",0)
                | "RAND" -> if rand.Next(0,2) = 0 then (if isOff then ("!",off) else ("",0)) else ("",0)
                | _ -> failwithf "invalid setting"
            //create instruction
            match instName.ToUpper() with 
                | "ADR" -> (("ADR R" + string(reg) + ", 0x" + System.String.Format("{0:X2}",op2)), [MEM(ADR(R reg,Addr op2))])
                | "LDR" -> ("LDR R" + string(reg2) + ", =TEST\n
                            LDR R" + string(reg) + ", [R" + string(reg2) + stroff + strAutoInd),
                            ([MEM(ADR(R reg2, Addr 0x10000));
                            MEM(LDR(R reg, R reg2,Lit off,Lit autoInd,false))])
                | "STR" ->("LDR R" + string(reg2) + ", =TEST\n
                            MOV R" + string(reg) + ", #" + string(randLit) + 
                            "\nSTR R" + string(reg) + ", [R" + string(reg2) + 
                            stroff + strAutoInd + "\nLDR R" + string(reg3) + ", [R" + string(reg2) + "]"),
                          ([MEM(ADR(R reg2, Addr 0x10000));
                          ALU(MOV (R reg, Lit randLit),false);
                          MEM(STR(R reg, R reg2,Lit off,Lit autoInd,false));
                          MEM(LDR(R reg3, R reg2,Lit 0,Lit 0,false))])
                | _ -> failwithf "instruction name not valid"

    /// get random instruction name 
    let getRandInstName = 
        let instNameArr = [|"ADR";"LDR";"STR"|]
        fun() -> instNameArr.[rand.Next(0,Array.length instNameArr)]

    /// create list of tests, each a random memory instruction
    /// Use RAND for random instructions
    let createdRandMemTestList n (instName:string) isOff isAutoIndex = 
        let getTestParam num = 
            match instName.ToUpper() with 
            | "RAND" -> let instName = getRandInstName()
                        ("Test " + instName + string(num),(createRandomMemTest instName isOff isAutoIndex))
            | x ->  ("Test " + instName + string(num),(createRandomMemTest x isOff isAutoIndex))
        [1..n] |> List.map getTestParam |> List.map (fun (n,(t,il)) -> createTest n t il)

    ///create random test string for Visual and Instruction for Emulator for memory instructions
    let createRandomMultMemTest (instName:string) (isWriteBack:string) =      
            let reg = rand.Next(0,13) //first register      
            let strRegList,regList = 
                let length = rand.Next(1,5)
                let randList = List.init length (fun _ -> rand.Next ()) 
                let strRandList = (randList |> List.map (fun x -> "R" + string(x)) |> List.fold (fun acc elem -> acc + "," + elem) "")
                (strRandList.[1..],randList |> List.map (fun x -> R x))
            let strDir,dir = 
                let dirArray = [|ED;IB;FD;IA;EA;DB;FA;DA|]
                let dirArrayStr = [|"ED";"IB";"FD";"IA";"EA";"DB";"FA";"DA"|]
                (dirArrayStr.[rand.Next(0,Array.length dirArrayStr)],dirArray.[rand.Next(0,Array.length dirArray)])

            let strWriteBack,writeBack =           
                match isWriteBack.ToUpper() with
                | "WB" -> "!", true
                | "NOWB" -> "", false
                | "RAND" -> if rand.Next(0,2) = 0 then ("!",true) else ("",false)
                | _ -> failwithf "invalid setting"

            match instName.ToUpper() with 
                | "LDM" ->  let initial = 
                                match dir with
                                | ED | IB | FD | IA -> "LDR R" + string(reg) + ", =TEST\n" 
                                | EA | DB | FA | DA ->  "LDR R" + string(reg) + ", =TEST\nADD R" + string(reg) + ",R" + string(reg) + ",#" + string(4*(List.length regList)) + "\n" 
                            (initial + ("LDM R" + string(reg) + strDir + strWriteBack + ", {" + strRegList + "}")), [MEM(LDM(dir,R reg,regList,writeBack))])
                | _ -> failwithf "instruction name not valid"

    /// get random instruction name 
    let getRandInstMultName = 
        let instNameArr = [|"LDM"|]
        fun() -> instNameArr.[rand.Next(0,Array.length instNameArr)]

    /// create list of tests, each a random memory instruction
    /// Use RAND for random instructions
    let createdRandMemTestList n (instName:string) isWriteBack = 
        let getTestParam num = 
            match instName.ToUpper() with 
            | "RAND" -> let instName = getRandInstMultName()
                        ("Test " + instName + string(num),(createRandomMultMemTest instName isWriteBack))
            | x ->  ("Test " + instName + string(num),(createRandomMultMemTest x isWriteBack))
        [1..n] |> List.map getTestParam |> List.map (fun (n,(t,il)) -> createTest n t il)
