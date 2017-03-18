namespace VisualInterface

module CreateMemTest = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType

    let rand = System.Random()
    let instNameArr = [|"ADR"|]
    let createRandomMemTest (instName:string) =       
            let reg = rand.Next(0,13)
            let reg2 = rand.Next(0,13)
            let memList = [0..9] |> List.map (fun x -> (0x100 + 0x4*x))
            let memLoc = fun() -> memList.[rand.Next(0,List.length memList)]
            let op2 =  memLoc()
            match instName.ToUpper() with 
                | "ADR" -> (("ADR R" + string(reg) + ", 0x" + System.String.Format("{0:X2}",op2)), MEM(ADR(R reg,Addr op2,false)))
                | _ -> failwithf "instruction name not valid"

    /// get random instruction name 
    let getRandInstName = fun() -> instNameArr.[rand.Next(0,Array.length instNameArr)]

    let createdRandMemTestList n (instName:string)= 
        let getTestParam num = 
            match instName.ToUpper() with 
            | "RAND" -> let instName = getRandInstName()
                        ("Test " + instName + string(num),(createRandomMemTest instName))
            | x ->  ("Test " + instName + string(num),(createRandomMemTest x ))

        [1..n] |> List.map getTestParam |> List.map (fun (n,(t,il)) -> createTest n t [il])

