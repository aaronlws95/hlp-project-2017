namespace ARM7TDMI


module environment =
    open Parser
    open Emulator
    open MachineState
    open InstructionType

    let makeenvironment() = 
        /// environment function, executes command
        let environment s = 
                readAsm s |> Emulator.Instruction.executeInstruction
        environment
