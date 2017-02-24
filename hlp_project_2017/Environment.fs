namespace ARM7TDMI


module Environment =

    open Type
    open Parser
    open Emulator




    let makeEnvironment() = 
        let mutable machineState : MachineState =
            { 
              RegMap = initializeRegMap
              MemMap = Map.empty; 
              Flags = { N = false; Z = false; C = false; V = false; }; 
              State = RunOK 
            }

        /// Environment function, executes command
        let environment s= 
                readAsm s |> executeInstruction machineState
        
        environment

