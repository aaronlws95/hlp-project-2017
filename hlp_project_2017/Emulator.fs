namespace ARM7TDMI

module Emulator =
    
    open Type

    let emulate (state:State) instruction =

        let mov reg = 
            function 
            | Reg r -> State(Map.add reg state.[r] state)
            | Lit i -> State(Map.add reg i state)
        
        let add reg = 
            function 
            | [Reg r1;Reg r2] -> State(Map.add reg (state.[r1] + state.[r2])  state)
            | [Reg r;Lit i] -> State(Map.add reg (state.[r] + i)  state)
            | _ -> DataError

    //temporary implementation for sub function

        let sub reg = 
            function 
            | [Reg r1;Reg r2] -> State(Map.add reg (state.[r1] - state.[r2])  state)
            | [Reg r;Lit i] -> State(Map.add reg (state.[r] - i)  state)
            | _ -> DataError

        match instruction with
        |MOV(reg,rol) ->  mov reg rol
        |ADD(reg,rol1,rol2) ->  add reg [rol1;rol2]
        |SUB(reg,rol1,rol2) ->  sub reg [rol1;rol2]