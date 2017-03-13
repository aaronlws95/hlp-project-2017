// Learn more about F# at http://fsharp.org
// See the 'F# Tutorial' project for more help.
namespace ARM7TDMI

module program = 
    open Parser
    open Emulator
    open MachineState
    open InstructionType
    open Cast


    let s = 
        "MOV R1 R2
    ADD R2 R3 #3
    MYBRANCH MVN R2 #2
    CMP R13 #3
    LSL R6 R7 #10
    ASR R8 R9 R10
    ADDS R3 R13 #15
    ADDSEQ R3 R13 #15
    ADDEQ R3 R13 #15" 
    printfn "%A" (readAsm s)

//module program = 
//    [<entrypoint>]
//    let main argv = 
//        printfn "%a" argv
//        0 // return an integer exit code
//            