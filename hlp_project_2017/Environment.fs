namespace ARM7TDMI


module environment =
    open Parser
    open Emulator
    open MachineState
    open InstructionType
    open Cast

    let makeenvironment() = 
        /// environment function, executes command
        let rec executeInstructions (state:MachineState) = 
            let newState = Emulator.Instruction.executeInstruction state (state.MemMap.TryFind(ValueOptToAddr (state.RegMap.TryFind(R 15))))
            match newState.State with
            | RunOK -> executeInstructions newState
            | RunEND -> newState
            | RunTimeErr s-> state
            | SyntaxErr s -> state

        let environment s = 
                readAsm s |> executeInstructions
        environment
