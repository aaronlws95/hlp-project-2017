namespace ARM7TDMI


module Emulator = 
    open InstructionType 
    open MachineState

    module ProcessFlag =
            /// types for processing flags 
            type ProcessFlagType = 
                | ADD of Value*Value*Value //op1 op2 result
                | SUB of Value*Value*Value //op1 op2 result
                | OTHER of Value // result
            ///process and return new flags
            let processFlags state instruction =
                let N (res:Value) = if res < 0 then true else false
                let Z (res:Value) = if res = 0 then true else false
                match instruction with
                | ADD(op1,op2,res) ->  { 
                                            N = N res 
                                            Z = Z res
                                            C = if (((((sign(op1) <> sign(op2)) && ((sign(op1) = 1) && (op1 > op2) ||  (sign(op2) = 1) && (op2 > op1))) && res >=0) && op1 <> 0 && op2 <> 0)  
                                                    || ((op1 <0 && op2 <0 && res >= 0))) then true
                                                else false 
                                            V = if (op1<0 && op2<0 && res>=0) || (op1>0 && op2>0 && res< 0) then true else false
                                        }
                | SUB(op1,op2,res) ->  { 
                                            N = N res 
                                            Z = Z res
                                            C = if res >= 0 then true else false
                                            V = if (op1<0 && op2<0 && res>=0) || (op1>0 && op2>0 && res< 0) then true else false
                                        }
                | OTHER(res) ->        {
                                            N = N res
                                            Z = Z res
                                            C = state.Flags.C
                                            V = state.Flags.V
                                        }
    
    module Extractor = 
        /// extract value from register
        let extractRegister (state:MachineState) (rol:RegOrLit) = 
                match rol with
                | Reg r -> state.RegMap.[r]
                | Lit l -> l
        /// extract value from memory
        let extractMemory (state:MachineState) (addr:Address) =
                let checkValidAddr =
                    function
                    | Val v -> v
                    | Inst i -> invalidOp "invalid address" 
                state.MemMap.[addr]
                |> checkValidAddr
        /// get value of address
        let getAddressValue (Addr a:Address) = a

    ///arithmetic logic unit instructions
    module ALUInstruction = 
        /// update register and set NZ based on new result   
        let private updateRegister state dest op2 s = 
            let newRegMap = Map.add dest op2 state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(op2)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        /// update register and set NZCV based on result with addition
        let private add state dest op1 op2 res s = 
            let newRegMap = Map.add dest res state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.ADD(op1,op2,res)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        /// update register and set NZCV based on result with subtraction
        let private sub state dest op1 op2 res s = 
            let newRegMap = Map.add dest res state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.SUB(op1,op2,res)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        /// execute ALU instruction 
        let executeInstruction state instruction s = 
            let er = Extractor.extractRegister state
            match instruction with
            | MOV(r,rol) -> updateRegister state r (er rol) s  // R:=ROL
            | ADD(r1,r2,rol) -> add state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]+(er rol))  s // R1:=R2+ROL
            | SUB(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]-(er rol)) s // R1:=R2-ROL
            | MVN(r, rol) -> updateRegister state r ~~~(er rol) s //R:=NOT(ROL)
            | EOR(r1, r2, rol) -> updateRegister state r1 (state.RegMap.[r2]^^^(er rol)) s // R1:=R2 EOR ROL
            | RSB(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) ((er rol)-state.RegMap.[r2]) s //R1:=ROL-R2
            | ADC(r1,r2,rol) -> add state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]+(er rol)+System.Convert.ToInt32(state.Flags.C)) s //R1:=R2+ROl+C
            | SBC(r1,r2,rol) -> sub state r1 state.RegMap.[r2] (er rol) (state.RegMap.[r2]-(er rol)+System.Convert.ToInt32(state.Flags.C)-1) s //R1:=R2-ROL+C-1
            | BIC(r1, r2, rol) -> updateRegister state r1 (state.RegMap.[r2]&&&(~~~(er rol))) s //R1:=R2 AND NOT(ROL)
            | ORR(r1, r2, rol) -> updateRegister state r1 (state.RegMap.[r2]|||(er rol)) s //R1:= R2 OR ROL

    ///set flag instructions
    module SFInstruction = 
        /// set new flags
        let private setFlag state name op1 op2 = 
            let newFlags = 
                match name with
                | "tst" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(op1&&&op2)) 
                | "teq" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(op1^^^op2)) 
                | "cmp" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.SUB(op1,op2,op1-op2))
                | "cmn" -> ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.ADD(op1,op2,op1+op2))
                | _ -> invalidOp "invalid setFlag function"
            {state with Flags = newFlags}
        /// execute set flag instruction
        let executeInstruction state instruction = 
            let er = Extractor.extractRegister state
            match instruction with
                | TST(r,rol) -> setFlag state "tst" state.RegMap.[r] (er rol) //R AND ROL
                | TEQ(r, rol) -> setFlag state "teq" state.RegMap.[r] (er rol) // R EOR ROL
                | CMP(r,rol) -> setFlag state "cmp" state.RegMap.[r] (er rol) // R-ROL
                | CMN(r, rol) -> setFlag state "cmn" state.RegMap.[r] (er rol) // R+ROL

    /// memory instructions
    module MEMInstruction = 
        /// update register with address value
        let private adr state dest exp s =  
            let newRegMap = Map.add dest exp state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(exp)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        /// load register with address value given by label
        let private ldrpi state dest exp = 
            let newRegMap = Map.add dest exp state.RegMap
            {state with RegMap = newRegMap}
        /// load register with memory content
        let private ldrreg state dest source offset autoIndex s  = 
            let em = Extractor.extractMemory state
            let newRegMap = 
                let loadRegMap = Map.add dest (em (Addr (state.RegMap.[source] + offset))) state.RegMap
                Map.add source (state.RegMap.[source] + autoIndex) loadRegMap
            {state with RegMap = newRegMap}
        /// store register contents into memory
        let private str state source dest offset autoIndex  s =  
            let newMemMap = Map.add (Addr (state.RegMap.[dest]+offset)) (Val source) state.MemMap
            let newRegMap = Map.add dest (state.RegMap.[dest]+autoIndex) state.RegMap 
            {state with MemMap = newMemMap;RegMap = newRegMap}
        /// execute memory instruction 
        let executeInstruction state instruction =      
            let er = Extractor.extractRegister state
            let ga = Extractor.getAddressValue
            match instruction with
                | ADR(r,addr,s) -> adr state r (ga addr) s //Address load  R:=ADDR
                | LDRPI(r,addr) -> ldrpi state r (ga addr) //LDR pseudo-instruction R:=ADDR
                | LDRREG(r1,r2,offset,autoIndex,b) -> ldrreg state r1 r2 (er offset) (er autoIndex) b //Load register R1:=[R2]             
                | STR(r1,r2,offset,autoIndex,b) -> str state state.RegMap.[r1] r2 (er offset) (er autoIndex) b //Store register [R2]:=R1

    ///shift instructions
    module SHIFTInstruction =
        /// update register and set NZ based on new result 
        let private updateRegister state dest exp s =  
            let newRegMap = Map.add dest exp state.RegMap
            let newFlags = if s then ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(exp)) else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        /// rotate right with extend
        let private rrx state dest exp s = 
            let newExp = (exp >>> 1) + (System.Convert.ToInt32(state.Flags.C) <<< 31)
            let newRegMap = Map.add dest newExp state.RegMap
            let newC = System.Convert.ToBoolean(exp &&& 1)
            let newFlags = if s then {ProcessFlag.processFlags state (ProcessFlag.ProcessFlagType.OTHER(newExp)) with C = newC} else state.Flags
            {state with RegMap = newRegMap;Flags = newFlags}
        ///execute shift function
        let executeInstruction state instruction s = 
            let er = Extractor.extractRegister state
            match instruction with
                | LSL(r1,r2,rol) -> updateRegister state r1 (state.RegMap.[r2] <<< (er rol)) s //logical shift left
                | LSR(r1,r2,rol) -> updateRegister state r1 ((int32)((uint32)state.RegMap.[r2] >>> (er rol))) s //logical shift right
                | ASR(r1,r2,rol) -> updateRegister state r1 (state.RegMap.[r2] >>> (er rol)) s //arithmetic shift right
                | ROR(r1,r2,rol) -> updateRegister state r1  ((state.RegMap.[r2]>>>(er rol)) ||| (state.RegMap.[r2]<<<(32-(er rol)))) s //rotate right
                | RRX(r1,r2) -> rrx state r1 state.RegMap.[r2] s //rotate right and extend

    ///Instruction
    module Instruction = 
        /// main execute instruction function
        let executeInstruction state instruction = 
            match instruction with 
            | ALU(ai,s) -> ALUInstruction.executeInstruction state ai s 
            | MEM(mi) -> MEMInstruction.executeInstruction state mi
            | SF(sfi) -> SFInstruction.executeInstruction state sfi  
            | SHIFT(shifti,s) -> SHIFTInstruction.executeInstruction state shifti s  

        let executeLine state = 
            let pc = Extractor.extractRegister state (Reg(R 15)) // Program counter is R15
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
            let instLine = state.MemMap.TryFind( Addr(pc) )
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
