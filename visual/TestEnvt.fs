namespace VisualInterface

module TestEnvt =
    open ARM7TDMI.Emulator

    open VisualInterface

    let mstateToRegList mstate = mstate.RegMap |> Map.toList |> (List.map (fun ((Register.R v),i) -> (R v,i)))

    let mstateToFlags mstate =
        let getBoolAsString flag = if flag then "1" else "0"
        let N = mstate.Flags.N |> getBoolAsString
        let Z = mstate.Flags.Z |> getBoolAsString
        let C = mstate.Flags.C |> getBoolAsString
        let V = mstate.Flags.V |> getBoolAsString
        N+Z+C+V         
    let initializeRegMap = 
        [1..13] |> Seq.map (fun x -> (Register.R x, 0)) |> Map.ofSeq

    let makeTestEnvironment() = 
        let mutable mstate:MachineState =     
            { 
                RegMap = initializeRegMap;
                MemMap = Map.empty; 
                Flags = { N = false; Z = false; C = false; V = false; }; 
                State = Type.RunState.RunOK 
            } 

        let environment instruction = mstate <- executeInstruction mstate instruction

        environment