namespace VisualInterface

module TestEnvt =
    open ARM7TDMI
    open Type
    open Emulator

    open VisualInterface

//
//    let processFlags (instruction: Instruction) prevNum op2Val nextNum = 
//        let N = if nextNum < 0 then true else false
//        let Z = if nextNum = 0 then true else false
//        let C = 
//            match instruction with
//            | ADD -> if (prevNum<0 && nextNum >= 0) || (prevNum>0 && nextNum<=0) then true else false 
//            | SUB -> if nextNum >= 0 then true else false
//            | _ -> false
//        let V = 
//            match instruction with
//            | ADD -> if (prevNum<0 && op2Val<0 && nextNum>=0) || (prevNum>0 && op2Val>0 && nextNum< 0) then true else false
//            | SUB -> if (prevNum<0 && op2Val>0 && nextNum>= 0) || (prevNum>0 && op2Val<0 && nextNum<0) then true else false
//            | _ -> false
//        {N = N
//         Z = Z
//         C = C
//         V = V   
//        }

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
            | ("mov",MOV (dest,op1)) -> 
                mstate <- mov mstate dest op1
                mstate
            | ("add",ADD (dest,op1,op2)) -> 
                mstate <- add mstate dest op1 op2
                mstate
            | ("sub",SUB (dest,op1,op2)) -> 
                mstate <- sub mstate dest op1 op2
                mstate
            | _ -> mstate <- doError mstate
                   mstate

        environment