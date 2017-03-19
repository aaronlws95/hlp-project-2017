namespace ARM7TDMI


module Emulator = 
    open InstructionType 
    open MachineState
    open ALUInstruction
    open SFInstruction
    open MEMInstruction
    open SHIFTInstruction
    open EmulatorHelper
    /// ===========================================
    /// Emulator functions
    /// ===========================================
    module Instruction = 
        /// main execute instruction function
        let executeInstruction state instruction = 
            match instruction with 
            | ALU(ai,s) -> ALUInstruction.executeInstruction state ai s 
            | SF(sfi) -> SFInstruction.executeInstruction state sfi 
            | MEM(mi) -> MEMInstruction.executeInstruction state mi 
            | SHIFT(shifti,s) -> SHIFTInstruction.executeInstruction state shifti s 
        let executeLine state = 
            let programCounter = Extractor.extractRegister state (Reg(R 15)) // Program counter is R15
            let checkCondition cond = 
                match cond with
                | EQ -> state.Flags.Z = true
                | NE -> state.Flags.Z = false
                | CS | HS -> state.Flags.C = true
                | CC | LO -> state.Flags.C = false
                | MI -> state.Flags.N = true
                | PL -> state.Flags.N = false
                | VS -> state.Flags.V = true
                | VC -> state.Flags.V = false
                | HI -> state.Flags.C = true && state.Flags.Z = false
                | LS -> state.Flags.C = false && state.Flags.Z = true
                | GE -> state.Flags.N = state.Flags.V
                | LT -> not (state.Flags.N = state.Flags.V)
                | GT -> state.Flags.Z = false && state.Flags.N = state.Flags.V
                | LE -> state.Flags.Z = true && not (state.Flags.N = state.Flags.V)
                | AL -> true
            let instLine = state.MemMap.TryFind( Addr(programCounter) )
            let outputState = 
                match instLine with
                // Shift:None, Condition:None
                | Some (Inst(Line(inst, None, None))) -> executeInstruction state inst
                // Shift:Some, Condition:None
                | Some (Inst(Line(inst, Some(sInst), None))) -> executeInstruction (executeInstruction state (SHIFT(sInst,false))) inst
                // Shift:None, Condition:True
                | Some (Inst(Line(inst, None, Some(c) ))) when checkCondition c = true -> executeInstruction state inst 
                // Shift:Some, Condition:True
                | Some (Inst(Line(inst, Some(sInst), Some(c) ))) when checkCondition c = true -> executeInstruction (executeInstruction state (SHIFT(sInst,false))) inst
                // Shift:None/Some, Condition:False
                | Some (Inst(Line(inst, _, Some(c) ))) when checkCondition c = false -> state 
                // Error cases
                | None -> failwithf "run time error: no instruction line found at address %A" (state.RegMap.TryFind(R 15)) 
                | x -> failwithf "run time error: instruction line not defined %A" x 
            // Update PC 
            let newRegMap = 
                match outputState.RegMap.[R 15] with
                | pc when pc = state.RegMap.[R 15] -> Map.add (R 15) (pc+4) outputState.RegMap
                | _ -> outputState.RegMap // If PC has been changed, it means a branching operation has taken care of PC for us so no need +4
            // Check if we have reached the end
            match Addr(newRegMap.[R 15]) with
            | pc when pc >= outputState.END -> {outputState with RegMap = newRegMap; State = RunEND}
            | _ -> {outputState with RegMap = newRegMap}