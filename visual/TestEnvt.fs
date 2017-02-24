namespace VisualInterface

module TestEnvt =
    open ARM7TDMI
    open Type
    open Emulator

    open VisualInterface

    let mstateToRegList mstate = mstate.RegMap |> Map.toList |> (List.map (fun ((Register.R v),i) -> (R v,i)))

    let mstateToFlags mstate =
        let getBoolAsString flag = if flag then "1" else "0"
         
        let N = mstate.Flags.N |> getBoolAsString
        let Z = mstate.Flags.Z |> getBoolAsString
        let C = mstate.Flags.C |> getBoolAsString
        let V = mstate.Flags.V |> getBoolAsString
        
        N+Z+C+V         
    
    type EmulatorParam = 
        | TwoParam of Register * RegOrLit
        | ThreeParam of Register * Register * RegOrLit



    let makeTestEnvironment() = 
        let mutable mstate:MachineState =     
            { 
                RegMap = initializeRegMap;
                MemMap = Map.empty; 
                Flags = { N = false; Z = false; C = false; V = false; }; 
                State = Type.RunState.RunOK 
            } 

        let environment = 
            function
            | ("mov",TwoParam (dest,op1)) -> 
                mstate <- mov mstate dest op1
                mstate
            | ("add",ThreeParam (dest,op1,op2)) -> 
                mstate <- add mstate dest op1 op2
                mstate

        environment