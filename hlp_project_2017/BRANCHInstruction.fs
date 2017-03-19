namespace ARM7TDMI

/// ===========================================
/// Branching functions
/// ===========================================

module BRANCHInstruction = 
    open InstructionType 
    open MachineState
    /// execute set flag instruction
    let executeInstruction state instruction = 
        let newRegMap = 
            match instruction with
            | B(Addr(target)) -> Map.add (R 15) (target) state.RegMap // Replace R15 (PC) with target address
            | BL(Addr(target)) -> 
                Map.add (R 14) (state.RegMap.[R 15] + 4) state.RegMap // Replace R14 (LR) with PC+4
                |> Map.add (R 15) (target) // Replace R15 (PC) with target address, 
        {state with RegMap = newRegMap}