namespace ARM7TDMI

module Emulator =
    
    open Type

    let executeInstruction (oldState:MachineState) instruction =
       //TO DO: move functions out into a diff module
        let mov state dest op1 = 
            let newRegMap = 
                match op1 with 
                | Reg (R r) -> Map.add dest state.RegMap.[R r] state.RegMap
                | Lit i -> Map.add dest i state.RegMap
            {state with RegMap = newRegMap}
    
        let add state dest op1 op2 = 
            let newRegMap = 
                match op2 with 
                | Reg (R r) -> Map.add dest (state.RegMap.[op1] + state.RegMap.[R r]) state.RegMap
                | Lit i -> Map.add dest (state.RegMap.[op1] + i) state.RegMap
            {state with RegMap = newRegMap}
 
        let sub state dest op1 op2 = 
            let newRegMap = 
                match op2 with 
                | Reg (R r) -> Map.add dest (state.RegMap.[op1] - state.RegMap.[R r]) state.RegMap
                | Lit i -> Map.add dest (state.RegMap.[op1] - i) state.RegMap
            {state with RegMap = newRegMap}
        
        match instruction with
        |MOV(dest,op1) ->  mov oldState dest op1
        |ADD(dest,op1,op2) ->  add oldState dest op1 op2
        |SUB(dest,op1,op2) ->  sub oldState dest op1 op2


