namespace VisualInterface

module VITest =
    open ARM7TDMI
    open MachineState
    open InstructionType
    
    module TestMStateConverter = 
        open VisualInterface

        let mstateToRegList mstate = mstate.RegMap |> Map.toList |> (List.map (fun ((Register.R v),i) -> (R v,i)))

        let mstateToFlags mstate =
            let getBoolAsString flag = if flag then "1" else "0"
            let N = mstate.Flags.N |> getBoolAsString
            let Z = mstate.Flags.Z |> getBoolAsString
            let C = mstate.Flags.C |> getBoolAsString
            let V = mstate.Flags.V |> getBoolAsString
            N+Z+C+V    

    module TestEnvt =
        open Emulator.Instruction
        open TestMStateConverter
        //create tuple to send for testing        
        let createTest name text instructionList  = 
            //initial machine state
            let mstate:MachineState =       
                { 
                    RegMap = [0..12] |> Seq.map (fun x -> (R x, 0)) |> Map.ofSeq
                    MemMap = [0..9] |> Seq.map (fun x -> (0x10000 + 0x4*x,x)) |> Seq.map (fun (x,y) -> (Addr x, Val (y+1))) |> Map.ofSeq
                    Flags = { N = false; Z = false; C = false; V = false;}
                    State = MachineState.RunState.RunOK 
                    END = Addr 0
                } 
            //initialise all registers to 0
            let initializeAllReg = 
                "
                TEST DCD 1,2,3,4,5,6,7,8,9,10
                MOV R0, #0
                MOV R1, #0
                MOV R2, #0
                MOV R3, #0
                MOV R4, #0
                MOV R5, #0
                MOV R6, #0
                MOV R7, #0
                MOV R8, #0
                MOV R9, #0
                MOV R10, #0
                MOV R11, #0
                MOV R12, #0
                " 
            // run instructions in order and return new machine state
            let mstate = instructionList |> List.fold (fun acc elem -> executeInstruction acc elem) mstate 
            (name,initializeAllReg+text,mstateToFlags mstate,mstateToRegList mstate)


            

          

            