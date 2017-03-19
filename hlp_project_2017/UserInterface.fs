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

    //environment values for GUI
    type DisplayBase = Bin | Dec | Hex

    //parse MachineState for output
    let getRegister (state:MachineState) i = state.RegMap.TryFind(R i) |> string |> int
    let getMemory (state:MachineState) address = 
        let head = address - (address % 4)
        toJson (state.MemMap.TryFind(Addr head))
    let getState (state:MachineState) = state.State
    let getFlags (state:MachineState) = 
        let flags = state.Flags
        //fable ignores System.Convert.ToInt32(boolean)
        [flags.N; flags.Z; flags.C; flags.V] |> List.map (fun x -> match x with | true -> 1 | _ -> 0) |> List.toArray

    //base conversion for registers
    let toBin dec = 
        let rec convert dec = 
            match dec with
            | 0 | 1 -> string dec
            | _ -> 
                let bit = string (dec % 2)
                convert (dec/2) + bit
        convert dec

    let toHex dec = 
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
        convert dec

    
    //one-way update
    let timeNow() = System.DateTime.Now.ToLongTimeString()
    let showRegisters (state:MachineState) (currentBase: DisplayBase) = 
        console.info(timeNow(), "\tUpdating Register Values ...");
        let updateRegister i currentBase=
            let value = getRegister state i
            let DOMElement = document.getElementById (("R" + (string i))) :?>HTMLSpanElement
            let diplayValue = 
                match currentBase with
                    | Bin -> value |> toBin |> string |> (+) "0b"
                    | Hex -> value |> toHex |> string |> (+) "0x"
                    | _ -> value |> string
            DOMElement.textContent <- diplayValue
            console.log(timeNow(), "\tR" + (string i) + "=" + diplayValue);
        [0..15] |> List.map (fun i -> updateRegister i currentBase) |> ignore
        console.info(timeNow(), "\tRegister Values Update Complete.");
    
    let showFlags (state: MachineState) =
        let flags = getFlags state
        let updateFlag i = 
            let flag = document.getElementById (("CSPR" + (string i))) :?>HTMLSpanElement
            flag.textContent <- flags.[i] |> string
        console.info(timeNow(), "\tCSPR Bits Values are", flags);
        console.info(timeNow(), "\tCSPR Bits Values Update Complete.");
    
    let showStatus (msg: string) = 
        //display message in status footbar
        let DOMElement = document.getElementById ("status-msg") :?>HTMLSpanElement
        DOMElement.textContent <- msg
        console.info(timeNow(), "\tStatus Bar message:", msg);
    
    let showState (state: MachineState) = 
        let runState = getState state
        let StateMsg = 
            match runState with 
                | RunOK -> "Execution was successful."
                | RunTimeErr _ -> ("Runtime Error: " + (toJson runState))
                | SyntaxErr _ -> ("Syntax Error: " + (toJson runState))
                | RunEND -> "Execution was successful. The final instruction is reached."                
        showStatus StateMsg    

    let changeBase (state: MachineState) (toBase: DisplayBase) = 
        showRegisters state toBase
        let baseValue = 
            match toBase with
                | Bin -> "02"
                | Hex -> "16"
                | _ -> "10"
        let DOMElement = document.getElementById ("base") :?>HTMLSpanElement
        DOMElement.textContent <- baseValue
        console.info(timeNow(), "\tChanged register display base to", (toJson toBase));
    
module UserInterface = 
    open Fable.Core
    open Fable.Import
    open Fable.Import.Browser
    //open Parser
    open UserInterfaceController
    open MachineState
    open Program

    console.log("Initialising Application...")

    //get input elements
    let sourceDOMElement = document.getElementById "source-code" :?>HTMLTextAreaElement
    //let outputDOMElement = document.getElementById "output" :?>HTMLParagraphElement
       
    let mutable currentBase = Hex
    let mutable currentState = execute "MOV R0, #0"
    //controller functions
    let execute() =
        console.info("Executing Source Code...")
        //get values from input elements
        let sourceCode = sourceDOMElement.value
        currentState <- execute sourceCode

        console.info("Displaying Register Values...")
        showRegisters currentState currentBase
        showFlags currentState
        showState currentState
        //[0..4..32] |> List.map (fun x -> console.log((getMemory currentState x))) |> ignore
    
    let changeBaseToBin() =
        changeBase currentState Bin
    let changeBaseToDec() =
        changeBase currentState Dec
    let changeBaseToHex() =
        changeBase currentState Hex

    let newFile() = 
        //new file confirmation
        console.log("User created a new file.");
        sourceDOMElement.value <- ""
        showStatus "Text area cleared."
    let openFile() = 
        console.log("Opening file...");
    let saveFile(saveAs: bool) = 
        console.log("Saving file...");

    //get button elements
    let getButton buttonId= 
        document.getElementById (buttonId) :?>HTMLButtonElement

    let executeButton = getButton ("execute")
    let toBinButton = getButton("toBin")
    let toDecButton = getButton ("toDec")
    let toHexButton = getButton ("toHex")
    let newFileButton = getButton ("new-file")
    let openFileButton = getButton ("open-file")
    let saveFileButton = getButton ("save-file")
    
    //register events to buttons
    executeButton.addEventListener_click(fun _ ->(execute());null)
    toBinButton.addEventListener_click(fun _ ->(changeBaseToBin());null)
    toDecButton.addEventListener_click(fun _ ->(changeBaseToDec());null)
    toHexButton.addEventListener_click(fun _ ->(changeBaseToHex());null)
    newFileButton.addEventListener_click(fun _ ->(newFile());null)