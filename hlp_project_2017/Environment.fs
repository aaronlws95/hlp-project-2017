﻿namespace ARM7TDMI


module Environment =

    open Parser
    open Emulator
    open MachineState
    open InstructionType

    let initializeRegMap = 
        [1..13] |> Seq.map (fun x -> (R x, 0)) |> Map.ofSeq

    let makeEnvironment() = 
        let mutable machineState : MachineState =
            { 
              RegMap = initializeRegMap
              MemMap = Map.empty
              InstrList = List.empty
              Flags = { N = false; Z = false; C = false; V = false; }
              State = RunOK 
            }

        /// Environment function, executes command
        let environment s = 
                readAsm s |> executeInstruction machineState
        
        environment

