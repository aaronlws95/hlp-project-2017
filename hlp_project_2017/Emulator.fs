namespace ARM7TDMI

module Emulator =
    
    open Type

    let executeInstruction (oldState:MachineState) instruction =
       //TO DO: move functions out into a diff module
        let mov dest op1 = 
            let newRegMap = 
                match op1 with 
                | Reg (R r) -> Map.add dest oldState.RegMap.[R r] oldState.RegMap
                | Lit i -> Map.add dest i oldState.RegMap
            {oldState with RegMap = newRegMap}

        
        let add dest op1 op2 = 
            let newRegMap = 
                match op2 with 
                | Reg (R r) -> Map.add dest (oldState.RegMap.[op1] + oldState.RegMap.[R r]) oldState.RegMap
                | Lit i -> Map.add dest (oldState.RegMap.[op1] + i) oldState.RegMap
            {oldState with RegMap = newRegMap}
 

        let sub reg = 
            let newRegMap = 
                match op2 with 
                | Reg (R r) -> Map.add dest (oldState.RegMap.[op1] - oldState.RegMap.[R r]) oldState.RegMap
                | Lit i -> Map.add dest (oldState.RegMap.[op1] - i) oldState.RegMap
            {oldState with RegMap = newRegMap}

        match instruction with
        |MOV(reg,op2) ->  mov reg op2
//        |ADD(reg,rol1,rol2) ->  add reg [rol1;rol2]
//        |SUB(reg,rol1,rol2) ->  sub reg [rol1;rol2]


