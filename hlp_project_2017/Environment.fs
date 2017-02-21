namespace ARM7TDMI


module Environment =

    open Type
    open Parser
    open Emulator

    let makeEnvironment() = 
        let mutable state : State = Map []

        /// Environment function, executes command
        let environment s= 
            try
                parse s |> emulate state
            with _ -> ParseError
        
        environment

