namespace ARM7TDMI
/// ===========================================
/// Memory functions
/// ===========================================
module MEMInstruction = 
    open InstructionType 
    open MachineState
    open EmulatorHelper
    /// ADR: update register with address value
    let private adr state dest addr =  
        
        let newRegMap = Map.add dest addr state.RegMap
        {state with RegMap = newRegMap}
    /// LDR: load register with memory content
    let private ldr state dest source offset autoIndex s  = 
        let doLDR =  
            let em = Extractor.extractMemory state
            let newRegMap = 
                let loadRegMap = Map.add dest (em (Addr (state.RegMap.[source] + offset))) state.RegMap
                Map.add source (loadRegMap.[source] + autoIndex) loadRegMap 
            if (dest = source && autoIndex>0) then {state with State = SyntaxErr "destination cannot equal source"}
            else {state with RegMap = newRegMap} 
        if (Extractor.isValidAddress state (Addr (state.RegMap.[source] + offset))) then doLDR else {state with State = RunTimeErr "Address not allocated"}
    /// LDM: load multiple register with memory content
    let private ldm state dir source regList writeBack  = 
        //do LDM function
        let doLdm = 
            let em = Extractor.extractMemory state
            let newRegMap,offset = 
                match dir with
                | ED | IB -> regList |> Seq.distinct |> List.ofSeq |> List.sort |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset+4))) acc),(offset+4)) (state.RegMap,0)
                | FD | IA -> regList |> Seq.distinct |> List.ofSeq |> List.sort |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset))) acc),(offset+4)) (state.RegMap,0)
                | EA | DB -> regList |> Seq.distinct |> List.ofSeq |> List.sort |> List.rev |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset-4))) acc),(offset-4)) (state.RegMap,0)
                | FA | DA -> regList |> Seq.distinct |> List.ofSeq |> List.sort |> List.rev |> List.fold (fun (acc,offset) elem -> (Map.add elem (em (Addr (state.RegMap.[source]+offset))) acc),(offset-4)) (state.RegMap,0)
            if writeBack then {state with RegMap = (Map.add source (state.RegMap.[source]+offset) newRegMap)}
            else {state with RegMap = newRegMap}
        //check if the addresses being read have been written
        let checkAddresses dir =
            let initialList = [1..List.length regList]
            let isValidAddressFold addr flag = 
                match flag with
                | true -> Extractor.isValidAddress state addr
                | false -> false       
            let flag,_ =   
                match dir with
                | ED | IB -> initialList |> List.fold (fun (flag,offset) _ ->  (isValidAddressFold (Addr (state.RegMap.[source]+offset+4)) flag,(offset+4))) (true,0)
                | FD | IA -> initialList |> List.fold (fun (flag,offset) _ -> (isValidAddressFold (Addr (state.RegMap.[source]+offset)) flag,(offset+4))) (true,0)
                | EA | DB -> initialList |> List.fold (fun (flag,offset) _ -> (isValidAddressFold (Addr (state.RegMap.[source]+offset-4)) flag,(offset-4))) (true,0)
                | FA | DA -> initialList |> List.fold (fun (flag,offset) _ -> (isValidAddressFold (Addr (state.RegMap.[source]+offset)) flag,(offset-4))) (true,0)
            if flag then doLdm else {state with State = RunTimeErr "Address not allocated"}
        checkAddresses dir
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