// Learn more about F# at http://fsharp.org
// See the 'F# Tutorial' project for more help.
namespace ARM7TDMI

module Program = 
    open Parser
    open Emulator
    open MachineState
    open InstructionType
    open Cast


//    let s = 
//        "MOV R1 R2
//    ADD R2 R3 #3
//    MYBRANCH MVN R2 #2
//    CMP R13 R2 , LSL #10
//    LSL R6 R7 #10
//    ASR R8 R9 R10
//    ADDS R3 R13 #15
//    ADDSEQ R3 R13 #15
//    ADDLO R3 R13 #15" 

    let s = "MOV R1 #10
    MOV R2 #10"

    [<EntryPoint>]
    let main argv = 
        
        let rec executeInstructions (state:MachineState) = 
            let newState = Emulator.Instruction.executeLine state //(state.MemMap.TryFind(ValueOptToAddr (state.RegMap.TryFind(R 15))))
            match newState.State with
            | RunOK -> executeInstructions newState
            | RunEND -> newState
            | RunTimeErr s-> state
            | SyntaxErr s -> state

        
        //let s = "MOV R1 #20"
        //printfn "%A" (readAsm s)
        //let x = executeInstructions (readAsm s)
        printfn "%A" (readAsm s |> executeInstructions)

        System.Console.ReadKey() |> ignore
        0 // return an integer exit code
     