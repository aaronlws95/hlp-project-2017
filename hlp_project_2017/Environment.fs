namespace ARM7TDMI


module Environment =

    open Type
    open Parser
    open Emulator

    let makeEnvironment() = 
        let mutable MachineState : MachineState = Map []

        /// Environment function, executes command
        let environment s= 
            try
                readAsm s |> executeInstruction MachineState
            with _ -> ParseError
        
        environment

