namespace VisualInterface

module Converter = 
    open ARM7TDMI
    open MachineState
    open InstructionType
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
    open ARM7TDMI
    open Emulator.Instruction
    open MachineState
    open InstructionType
    open Converter
    
    let createTest text instructionList  = 
        let mstate:MachineState =     
            { 
                RegMap = [0..12] |> Seq.map (fun x -> (R x, 0)) |> Map.ofSeq
                MemMap = Map.empty
                InstrList = List.empty
                Flags = { N = false; Z = false; C = false; V = false; }
                State = MachineState.RunState.RunOK 
            } 

        let initializeAllReg = 
            "
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
        let mstate = instructionList |> List.fold (fun acc elem -> executeInstruction acc elem) mstate 
        (initializeAllReg+text,mstateToFlags mstate,mstateToRegList mstate)
        
    
    let testMOV1 = createTest "MOV R0, #1" [(ALUInst(MOV(R 0,Lit 1),false))] 

    let testMOV2 = 
        let testText = 
            "
                MOV R0, #2
                MOV R2, R0
            " 
        let testInstruction = 
            [(ALUInst(MOV(R 0,Lit 2),false));
            (ALUInst(MOV(R 2,Reg (R 0)),false))]
        createTest testText  testInstruction

    let testADD1 = createTest "ADD R0, R1, #1" [(ALUInst(ADD(R 0,Reg (R 1),Lit 1),false))] 

    let testSUB1 = createTest "SUB R0, R1, #1" [(ALUInst(SUB(R 0,Reg (R 1),Lit 1),false))] 

    let testMOVS1 = createTest "MOVS R0, #-1" [(ALUInst(MOV(R 0,Lit -1),true))] 