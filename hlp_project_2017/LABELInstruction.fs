namespace ARM7TDMI

module LABELInstruction =      
    open InstructionType 
    open MachineState
    open EmulatorHelper

    /// DCD: Set values in memory  
    let private dcd state startMem intList = 
        let _,newMemMap = intList |> List.fold (fun (memLoc,accMap) elem -> (memLoc + 4),Map.add (Addr memLoc) (Val elem) accMap) (startMem,state.MemMap)
        {state with MemMap = newMemMap}
    /// FILL: Allocate space in memory
    let private fill state startMem length = 
        let _,newMemMap = [1..length] |> List.fold (fun (memLoc,accMap) _ -> (memLoc + 4),Map.add (Addr memLoc) (Val 0) accMap) (startMem,state.MemMap)
        {state with MemMap = newMemMap}
    /// EQU: Set a constant in memory
    let private equ state memLoc value = 
        {state with MemMap = (Map.add memLoc (Val value) state.MemMap)} 
    /// execute set flag instruction
    let executeInstruction state instruction = 
        let ga = Extractor.getAddressValue
        match instruction with
        | DCD(startMem,intList) -> dcd state (ga startMem) intList //DCD
        | FILL(startMem,length) -> fill state (ga startMem) length //FILL
        | EQU(memLoc,value) -> equ state memLoc value



