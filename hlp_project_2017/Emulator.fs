namespace ARM7TDMI

module Emulator =
    
    open Type

    let executeInstruction (state:MachineState) instruction =

        let mov reg = 
            function 
            | Reg (R r) -> Map.add reg state.RegMap.[R r] state.RegMap
                           state
            | Lit i -> Map.add reg i state.RegMap
                       state
        
//        let add reg = 
//            function 
//            | [Reg r1;Reg r2] -> MachineState(Map.add reg (MachineState.[r1] + MachineState.[r2])  MachineState)
//            | [Reg r;Lit i] -> MachineState(Map.add reg (MachineState.[r] + i)  MachineState)
//            | _ -> DataError
//
//    //temporary implementation for sub function
//
//        let sub reg = 
//            function 
//            | [Reg r1;Reg r2] -> MachineState(Map.add reg (MachineState.[r1] - MachineState.[r2])  MachineState)
//            | [Reg r;Lit i] -> MachineState(Map.add reg (MachineState.[r] - i)  MachineState)
//            | _ -> DataError

        match instruction with
        |MOV(reg,op2) ->  mov reg op2
//        |ADD(reg,rol1,rol2) ->  add reg [rol1;rol2]
//        |SUB(reg,rol1,rol2) ->  sub reg [rol1;rol2]


let machineState : MachineState =
    {   RegMap = Map.empty;
        MemMap = Map.empty; 
        Flags = { N = false; Z = false; C = false; V = false; }; 
        State = RunOK 
    }

let mov reg = 
    function 
    | Reg (R r) -> Map.add reg machineState.RegMap.[R r] machineState.RegMap
                   machineState
    | Lit i -> Map.add reg i machineState.RegMap
               machineState

let machineState = mov R 0 5