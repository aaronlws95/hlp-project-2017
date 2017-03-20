namespace ARM7TDMI

module Program = 
    open Parser
    open Emulator
    open MachineState
    open InstructionType

    // Initialize registers to 0, read editor code into state instructions
    let initMachineState (s:string) = readAsm s

    // Execute recursively until program end
    let rec executeInstructions (state:MachineState) = 
        let newState = Emulator.Instruction.executeLine state 
        match newState.State with
        | RunOK -> executeInstructions newState
        | RunEND -> newState
        | RunTimeErr s-> newState
        | SyntaxErr s -> newState
    let execute (s:string)=
        initMachineState s |> executeInstructions

    // Execute one line at a time 
    let stepForward (s:string) (state:MachineState) =
        printfn "Running instruction at memory %A" state.RegMap.[R 15] |> ignore
        match state.State with
        | RunOK -> Emulator.Instruction.executeLine state 
        | RunEND -> state
        | RunTimeErr s-> state
        | SyntaxErr s -> state

     