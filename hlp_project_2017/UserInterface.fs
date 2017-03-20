namespace ARM7TDMI

module UserInterfaceController =
    open System
    open System.Text
    open Fable.Core
    open Fable.Import
    open Fable.Import.Browser
    open Fable.Core.JsInterop
    open Parser
    open MachineState
    open InstructionType

    type Base = Bin | Dec | Hex

    //parse MachineState for output
    let getRegister (state:MachineState) i = state.RegMap.TryFind(R i) |> string |> int
    let getMemory (state:MachineState) address = state.MemMap.TryFind(Addr address)
    let getState (state:MachineState) = state.State
    let getFlags (state:MachineState) = 
        let flags = state.Flags
        //fable ignores System.Convert.ToInt32(boolean)
        [flags.N; flags.Z; flags.C; flags.V] |> List.map (fun x -> match x with | true -> 1 | _ -> 0) |> List.toArray

(* 
    //base conversion for registers 
    //discarded due to unable to conver negative numbers
    let toBin (dec: int) = 
        //Convert.ToString(dec, 2)
        let rec convert dec = 
            match dec with
            | 0 | 1 -> string dec
            | _ -> 
                let bit = string (dec % 2)
                convert (dec/2) + bit
        convert dec 

    let toHex (dec: int) = 
        //Convert.ToString(dec, 16)
        let toArray byte = [|byte|]
        let toBit (remainder: int) = 
            match remainder with
                | remainder when remainder <= 9 -> string remainder
                //| remainder when remainder <= 15 -> remainder |> (+) 55 |> System.Convert.ToByte |> toArray |> Encoding.ASCII.GetString 
                | 10 -> "A"
                | 11 -> "B"
                | 12 -> "C"
                | 13 -> "D"
                | 14 -> "E"
                | 15 -> "F"
                | _ -> "ErrorBit"
        let rec convert dec = 
            match dec with
            | dec when dec <= 9 -> string dec
            | dec when dec <= 15 -> toBit dec
            | _ -> 
                let bit = dec % 16 |> toBit
                convert (dec/16) + bit
        convert dec        *)
    

    // using javascript native base conversion method
    let toBaseOf (targetBase:int) (dec: int)  = 
        (uint32 dec)?toString(targetBase) |>string

    let toDec (sourceBase: int) (numberString: string) =
        window?parseInt(numberString, sourceBase) |> string |> int

    // reformat the output
    let toBin (dec: int) = 
        let bin = dec |> toBaseOf 2
        [0..7] |> List.map (fun x -> bin.[(x*4)..(x*4+3)]) |> String.concat " "
        
    let toHex (dec: int) = 
        let hex = (dec |> toBaseOf 16).ToUpper();
        [0..3] |> List.map (fun x -> hex.[(x*2)..(x*2+1)]) |> String.concat " "

    //one-way update
    let timeNow() = System.DateTime.Now.ToLongTimeString()
    let showRegisters (state:MachineState) (currentBase: Base) = 
        console.info(timeNow(), "\tUpdating Register Values ...");
        let updateRegister i currentBase=
            let value = getRegister state i
            let DOMElement = document.getElementById (("R" + (string i))) :?>HTMLSpanElement
            let diplayValue = 
                match currentBase with
                    | Bin -> value |> toBin |> (+) "0b"
                    | Hex -> value |> toHex |> (+) "0x"
                    | _ -> value |> string
            DOMElement.textContent <- diplayValue
            //console.log(timeNow(), "\tR" + (string i) + "=" + diplayValue);
        [0..15] |> List.map (fun i -> updateRegister i currentBase) |> ignore
        console.info(timeNow(), "\tRegister values update successful.");
    
    let showFlags (state: MachineState) =
        let flags = getFlags state
        let updateFlag i = 
            let flag = document.getElementById (("CSPR" + (string i))) :?>HTMLSpanElement
            flag.textContent <- flags.[i-1] |> string
        console.info(timeNow(), "\tCSPR Bits are", flags);
        [1..4] |> List.map (fun i -> updateFlag i) |> ignore
        console.info(timeNow(), "\tCSPR Bits update successful.");
    
    let showStatus (msg: string) = 
        //display message in status footbar
        let DOMElement = document.getElementById ("status-msg") :?>HTMLSpanElement
        DOMElement.textContent <- msg
        console.info(timeNow(), "\t" + msg);
    
    let showState (state: MachineState) = 
        let runState = getState state
        let StateMsg = 
            match runState with 
                | RunOK -> "Execution was successful."
                | RunTimeErr _ -> ("Runtime Error: " + (toJson runState))
                | SyntaxErr _ -> ("Syntax Error: " + (toJson runState))
                | RunEND -> "Execution was successful. The final instruction is reached."                
        showStatus StateMsg    
    
module UserInterface =
    open Fable.Core
    open Fable.Import
    open Fable.Import.Browser
    open Fable.Core.JsInterop
    open UserInterfaceController
    open MachineState
    open InstructionType
    open Program

    let mutable currentBase = Hex
    let mutable currentState = execute "MOV R0, #0"

    console.info(timeNow(), "\tFable Application Loaded")
    console.log("%c ARMadillo - HLP Project 2017", "background: #222; color: #bada55");
    console.log("%c Parser:\t Rubio, Santiago P L ", "background: #222; color: #bada55");
    console.log("%c Emulator:\t Low, Aaron S \t Chan, Jun S", "background: #222; color: #bada55");
    console.log("%c Front-end:\t Wang, Tianyou", "background: #222; color: #bada55");

    let changeBase (state: MachineState) (toBase: Base) = 
        showRegisters state toBase
        let baseValue = 
            match toBase with
                | Bin -> "02"
                | Hex -> "16"
                | _ -> "10"
        let DOMElement = document.getElementById ("base") :?>HTMLSpanElement
        DOMElement.textContent <- baseValue
        currentBase <- toBase
        console.info(timeNow(), "\tChanged register display base to", (toJson toBase));

    //button functions
    let execute() =
        console.info(timeNow(), "\tExecuting Source Code...")
        //get values from input elements
        let sourceCode = window?getEditorContent() |> string
        currentState <- execute sourceCode

        showRegisters currentState currentBase
        showFlags currentState
        showState currentState
        //[0..4..32] |> List.map (fun x -> console.log((getMemory currentState x))) |> ignore

    let reset() = 
        console.info(timeNow(), "\tResetting Machine State...")
        //get values from input elements
        let sourceCode = window?getEditorContent() |> string
        currentState <- initMachineState sourceCode

        showRegisters currentState currentBase
        showFlags currentState
        showState currentState

    let stepForward() = 
        console.info(timeNow(), "\tStepping forward...")
        //get values from input elements
        let sourceCode = window?getEditorContent() |> string
        let prevState = currentState
        currentState <- stepForward sourceCode prevState
        // Display
        showRegisters currentState currentBase
        showFlags currentState
        showState currentState
        window?setLineDecoration((getRegister currentState 15)/4) |>ignore
    
    let memoryLookup() = 
        let startAddr = (document.getElementById ("memory-start") :?>HTMLInputElement).value |>string
        let endAddr = (document.getElementById ("memory-end") :?>HTMLInputElement).value |>string
        console.info(timeNow(), "\tLooking up memory content for query Addr: 0x" + startAddr, "- 0x" + endAddr);

        // the result should cover user query range (word addr)
        let wordStartAddr = (toDec 16 startAddr) / 32 
        let wordEndAddr = (toDec 16 endAddr) / 32

        let byteStartAddr = wordStartAddr * 4
        let byteEndAddr = (wordEndAddr + 1) * 4

        //[byteStartAddr..byteEndAddr] |> List.map (fun x -> console.log(x,":",getMemory currentState x)) |> ignore
        
        let toTable = 
            let wordHeadBytes = [byteStartAddr..4..byteEndAddr] 
            let renderInst headByte (inst) = 
                ("<span class='label label-primary'>0x" + (toBaseOf 16 (headByte*8)).ToUpper() + ("</span>"), "<span class='label label-success'>Instr</span>", (toJson inst)) 
                
            let renderVal headByte = 
                let wordValue = [3..0] |> List.map (fun x -> getMemory currentState (headByte + x))
                //wordValue = (getMemory currentState (headByte+3),getMemory currentState (headByte+2),getMemory currentState (headByte+1),getMemory currentState headByte)
                ("<span class='label label-primary'>0x" + (toBaseOf 16 (headByte*8)).ToUpper() + ("</span>"), "<span class='label label-warning'>Value</span>", (toJson wordValue))

            let combineWord wordHeadByte= 
                let firstByteContent = getMemory currentState wordHeadByte
                match firstByteContent with
                    | Some x -> match x with
                                    | Inst _ -> renderInst wordHeadByte firstByteContent
                                    | Val _ -> renderVal wordHeadByte
                    | None -> ("<span class='label label-primary'>0x" + (toBaseOf 16 (wordHeadByte*8)).ToUpper() + ("</span>"), "<span class='label label-default'>Null</span>", "0")
            let dataSet = [byteStartAddr..4..byteEndAddr] |>List.map combineWord |>toJson
            window?data <- dataSet
            window?displayMemoryQuery(dataSet);
        //do not remove: return false to prevent refresh on form submit
        false

    let changeBaseToBin() =
        changeBase currentState Bin
    let changeBaseToDec() =
        changeBase currentState Dec
    let changeBaseToHex() =
        changeBase currentState Hex

    //get button elements
    let getButton buttonId= 
        document.getElementById (buttonId) :?>HTMLButtonElement

    let executeButton = getButton ("execute")
    let resetButton = getButton ("reset")
    let stepForwardButton = getButton ("step-forward")
    let toBinButton = getButton("toBin")
    let toDecButton = getButton ("toDec")
    let toHexButton = getButton ("toHex")
    
    //register events to buttons
    executeButton.addEventListener_click(fun _ ->(execute());null)
    resetButton.addEventListener_click(fun _ ->(reset());null)
    stepForwardButton.addEventListener_click(fun _ ->(stepForward());null)
    toBinButton.addEventListener_click(fun _ ->(changeBaseToBin());null)
    toDecButton.addEventListener_click(fun _ ->(changeBaseToDec());null)
    toHexButton.addEventListener_click(fun _ ->(changeBaseToHex());null)

    // get memory lookup tool element
    let memoryToolFormElement = document.getElementById ("memory-tool") :?>HTMLFormElement
    memoryToolFormElement?onsubmit <- ( fun _ ->memoryLookup())