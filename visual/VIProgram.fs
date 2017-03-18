namespace VisualInterface

module VIProgram=

    open VisualInterface
    open Expecto
    open CreateTest
    open CreateRandomTest
    open CreateRandomTestLong
    open CreateMemTest
    /// postlude which sets R1 bits to status bit values
    let NZCVToR12 =
       """
          MOV R1, #0
          ADDMI R1, R1, #8
          ADDEQ R1, R1, #4
          ADDCS R1, R1, #2
          ADDVS R1, R1, #1
       """ 

    let defaultParas = {
            Cached = false                  // true if results are stored in a cache on disk and reused to speed 
                                            // up future repeat simulations
            VisualPath =  @"..\..\..\visualapp\visual\" // the directory in which the downloaded VisUAL.exe can be found
            WorkFileDir = @"..\..\..\VisualWork\"      // the directory in which both temporary files and the persistent cache file are put
            MemDataStart = 0x100            // start of VisUAL data section Memory
            MemLocs = []                    // memory locations to be traced and data returned

        }

    type Flags = 
        {
            FN: bool
            FZ: bool
            FC: bool
            FV: bool
        }
   
    let defParasWithLocs locs = {defaultParas with MemLocs = locs}
    
    /// Adds postlude to assembly code to detect flags values.
    /// Returns registers (before flag detection code) * flags
    let RunVisualWithFlagsOut paras src =
        let asm = src + NZCVToR12
        let trace = VisualInterface.RunVisual defaultParas asm
        if Array.length trace < 5 then failwithf "Error: Trace \n%A\nfrom\n%s\n has length %d < 5." trace asm (Array.length trace)
        let regs = 
            [0..15] 
            |> List.map (fun n -> R n, trace.[5].ResOut.[R n]) // get reg values before postlude
            |> Map.ofList
        let flagsInt = trace.[0].ResOut.[R 1] //Postlude code sets R1(3:0) equal to NZCV
        printfn "flagsint=%x, trace=%A" flagsInt trace.[5]
        let flagBool n = (flagsInt &&& (1 <<< n)) > 0
        { 
          FN = flagBool 3
          FZ = flagBool 2
          FC = flagBool 1
          FV = flagBool 0
        }, regs

    /// Run Visual with specified source code and list of memory locations to trace
    /// src - source code
    /// memLocs - list of memory locations to trace
    let RunVisualWithFlagsOutLocs memLocs src =
        RunVisualWithFlagsOut {defaultParas with MemLocs = memLocs} src

    /// convenience function, convert 4 char string to NZCV status flag record
    let strToFlags s =
        let toBool = function | '0' -> false | '1' -> true | s -> failwithf "Bad character in flag specification '%c'" s
        match s |> Seq.toList |> List.map toBool with
        | [ a ; b ; c ; d] -> { FN=a; FZ=b;FC=c;FV=d}
        | _ -> failwithf "Wrong number of characters (should be 4) in flag specification %s" s
    
    
    /// run an expecto test of VisUAL
    /// name - name of test
    ///
    let VisualUnitTest (name,src,(flagsExpected:string),(outExpected: (Out * int) list)) =
        testCase name <| fun () ->
            let mems = outExpected |> List.collect (function | Mem n, x -> [n,x] | _ -> [])
            let memLocs = mems |> List.map fst
            let flags, outs = RunVisualWithFlagsOutLocs memLocs src
            Expecto.Expect.equal flags (flagsExpected |> strToFlags) ("Status flags don't match " + name + " " + src)
            let regs = outExpected |> List.filter (function | R _,_ -> true | _ -> false)
            let getOut (out, v) = 
                try
                    out, outs.[out]
                with
                | _ -> failwithf "Can't find output %A in outs %A" out outs
            Expecto.Expect.sequenceEqual (outExpected |> List.map getOut) outExpected ("Reg and Mem outputs don't match " + name + " " + src)
      
    let seqConfig = { Expecto.Tests.defaultConfig with parallel = false}

    let repeatingPrompt predicate (message:string) =
        let prompt _ =
            System.Console.WriteLine(message)
            System.Console.ReadLine()
        Seq.initInfinite prompt |> Seq.find predicate

    [<EntryPoint>]
    let main argv =
        InitCache defaultParas.WorkFileDir // read the currently cached info from disk to speed things up
        let input = 
            repeatingPrompt (fun x -> x = "1" || x = "2" || x = "3" || x = "4")  "1: Manual Test\n2: Random Instruction Test\n3: Random Long Instruction Test\n4: Memory Instruction Test" 
        let createdTestList =
            match int(input) with
            | 1 -> createdManualTestList
            | 2 -> let input2 = repeatingPrompt (fun x -> x = "1" || x = "2") "1. All Instructions\n2. Specific Instructions"
                   match int(input2) with
                   | 1 -> printf "Enter: Number of tests per instruction\nn"
                          let input3 = System.Console.ReadLine()
                          createdRandTestListAll (int(input3))
                   | 2 -> printf "Enter: Number of tests,Instruction name,Set flag: SET/NOSET/RAND,op2 is Reg or Lit:REG/LIT/RAND\n"
                          let numTest = System.Console.ReadLine()
                          let inst = System.Console.ReadLine()
                          let sf = System.Console.ReadLine()
                          let reglit = System.Console.ReadLine()
                          createdRandTestList (int(numTest)) inst sf reglit
                   | _ -> failwithf "invalid number"
            | 3 -> printf "Enter: Number of instruction lines,Number of tests\n"
                   let numInst = System.Console.ReadLine()
                   let numTest =  System.Console.ReadLine()
                   createdRandTestListLong (int(numInst)) (int(numTest))
            | 4 -> printf "Enter: Number of tests,Instruction name \n"
                   let numTest = System.Console.ReadLine()
                   let name = System.Console.ReadLine()
                   createdRandMemTestList (int(numTest)) name
            | _ -> failwithf "invalid number"

        let tests = testList "Visual tests" (createdTestList |> List.map VisualUnitTest)

        let rc = runTests seqConfig tests
        System.Console.ReadKey() |> ignore                
        rc // return an integer exit code - 0 if all tests pass
//          printf "%A" randTestListLong1
//          System.Console.ReadKey() |> ignore  
//          0

