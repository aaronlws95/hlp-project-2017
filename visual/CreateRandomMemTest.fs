namespace VisualInterface

module CreateRandomMemTest = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType
    ///random seed
    let rand = System.Random()
    ///create random test string for Visual and Instruction for Emulator for memory instructions
    let createRandomMemTest (instName:string) (isOff:string) (isAutoIndex:string) =       
            let reg = rand.Next(0,5) //first register
            let reg2 = rand.Next(5,13) //second register
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
                | "RAND" -> if rand.Next(0,2) = 0 then ("!",off) else ("",0)
                | _ -> failwithf "invalid setting"

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

