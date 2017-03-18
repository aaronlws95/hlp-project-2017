namespace VisualInterface

module CreateRandomMemTest = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType

    let rand = System.Random()
    
    let createRandomMemTest (instName:string) =       
            let reg = rand.Next(0,13)
            let reg2 = rand.Next(0,13)
            let reg3 = rand.Next(0,13)
            let randLit = 
                let shift = 2*rand.Next(0,16)
                ((rand.Next(0,256)>>>shift) ||| (rand.Next(0,256)<<<(32-shift)))
            let memLoc = 
                let memList = [|0..9|] |> Array.map (fun x -> (0x100 + 0x4*x))
                fun() -> memList.[rand.Next(0,Array.length memList)]   
            let op2 =  memLoc()   
            match instName.ToUpper() with 
                | "ADR" -> (("ADR R" + string(reg) + ", 0x" + System.String.Format("{0:X2}",op2)), [MEM(ADR(R reg,Addr op2))])
                | "LDR" -> ("LDR R" + string(reg2) + ", =TEST\n
                            LDR R" + string(reg) + ", [R" + string(reg2) + "]"),
                            ([MEM(ADR(R reg2, Addr 0x10000));
                            MEM(LDR(R reg, R reg2,Lit 0,Lit 0,false))])
                | "STR" ->("LDR R" + string(reg2) + ", =TEST\n
                            MOV R" + string(reg) + ", #" + string(randLit) + 
                            "\nSTR R" + string(reg) + ", [R" + string(reg2) + 
                            "]\nLDR R" + string(reg3) + ", [R" + string(reg2) + "]"),
                          ([MEM(ADR(R reg2, Addr 0x10000));
                          ALU(MOV (R reg, Lit randLit),false);
                          MEM(STR(R reg, R reg2,Lit 0,Lit 0,false));
                          MEM(LDR(R reg3, R reg2,Lit 0,Lit 0,false))])
                | _ -> failwithf "instruction name not valid"

    /// get random instruction name 
    let getRandInstName = 
        let instNameArr = [|"ADR";"LDR";"STR"|]
        fun() -> instNameArr.[rand.Next(0,Array.length instNameArr)]

    let createdRandMemTestList n (instName:string)= 
        let getTestParam num = 
            match instName.ToUpper() with 
            | "RAND" -> let instName = getRandInstName()
                        ("Test " + instName + string(num),(createRandomMemTest instName))
            | x ->  ("Test " + instName + string(num),(createRandomMemTest x ))

        [1..n] |> List.map getTestParam |> List.map (fun (n,(t,il)) -> createTest n t il)

