namespace ARM7TDMI
/// ===========================================
/// Memory functions
/// ===========================================
module MEMInstruction = 
    open InstructionType 
    open MachineState
    open EmulatorHelper
    /// ADR: update register with address value
    let private adr state dest exp=  
        let newRegMap = Map.add dest exp state.RegMap
        {state with RegMap = newRegMap}
    /// LDR: load register with memory content
    let private ldr state dest source offset autoIndex s  = 
        let em = Extractor.extractMemory state
        let newRegMap = 
            let loadRegMap = Map.add dest (em (Addr (state.RegMap.[source] + offset))) state.RegMap
            if dest <> source then Map.add source (loadRegMap.[source] + autoIndex) loadRegMap else loadRegMap
        {state with RegMap = newRegMap}
    /// LDM: load multiple register with memory content
    let private ldm state dir source regList writeBack  = 
        let em = Extractor.extractMemory state
        let newRegMap,offset = 
            match dir with
            | ED | IB -> regList |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset+4))) acc),(offset+4)) (state.RegMap,0)
            | FD | IA -> regList |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset))) acc),(offset+4)) (state.RegMap,0)
            | EA | DB -> regList |> List.rev |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset-4))) acc),(offset-4)) (state.RegMap,0)
            | FA | DA -> regList |> List.rev |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset))) acc),(offset-4)) (state.RegMap,0)
        if writeBack then {state with RegMap = (Map.add source (state.RegMap.[source]+offset) newRegMap)}
        else {state with RegMap = newRegMap}
    /// STR: store register contents into memory
    let private str state source dest offset autoIndex s =  
        let newMemMap = Map.add (Addr (state.RegMap.[dest]+offset)) (Val source) state.MemMap
        let newRegMap = Map.add dest (state.RegMap.[dest]+autoIndex) state.RegMap 
        {state with MemMap = newMemMap;RegMap = newRegMap}
    /// STM: load multiple register with memory content
    let private stm state dir dest regList writeBack = 
        let newMemMap,offset = 
            match dir with
                | ED | IB -> regList |> List.rev |> List.fold (fun (acc,offset) elem -> (Map.add (Addr (state.RegMap.[dest]+offset)) (Val (state.RegMap.[elem])) acc),(offset-4)) (state.MemMap,0)
                | FD | IA -> regList |> List.rev |> List.fold (fun (acc,offset) elem -> (Map.add (Addr (state.RegMap.[dest]+offset-4)) (Val (state.RegMap.[elem])) acc),(offset-4)) (state.MemMap,0)
                | EA | DB -> regList |> List.fold (fun (acc,offset) elem -> (Map.add (Addr (state.RegMap.[dest]+offset)) (Val (state.RegMap.[elem])) acc),(offset+4)) (state.MemMap,0)
                | FA | DA -> regList |> List.fold (fun (acc,offset) elem -> (Map.add (Addr (state.RegMap.[dest]+offset+4)) (Val (state.RegMap.[elem])) acc),(offset+4)) (state.MemMap,0)
        let newRegMap = if writeBack then (Map.add dest (state.RegMap.[dest]+offset) state.RegMap) else state.RegMap
        {state with RegMap = newRegMap;MemMap = newMemMap}
    /// execute memory instruction 
    let executeInstruction state instruction =      
        let er = Extractor.extractRegister state
        let ga = Extractor.getAddressValue
        match instruction with
            | ADR(r,addr) -> adr state r (ga addr) //Address load  R:=ADDR
            | LDR(r1,r2,offset,autoIndex,b) -> ldr state r1 r2 (er offset) (er autoIndex) b //Load register R1:=[R2]             
            | STR(r1,r2,offset,autoIndex,b) -> str state state.RegMap.[r1] r2 (er offset) (er autoIndex) b //Store register [R2]:=R1
            | LDM(dir,r,regList,wb) -> ldm state dir r regList wb // Load multiple registers 
            | STM(dir,r,regList,wb) -> stm state dir r regList wb // Store multiple registers 