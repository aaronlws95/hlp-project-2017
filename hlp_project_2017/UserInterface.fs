namespace ARM7TDMI

module UserInterfaceController =
    open System.Text

    open MachineState
    let toJSON state = 
        "{State Map}"
    
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
            
module UserInterface = 
    open Fable.Core
    open Fable.Core.JsInterop
    open Fable.Import
    open Fable.Import.Browser
    open Parser
    open UserInterfaceController
    open MachineState
    open InstructionType

    Browser.console.log("Initialising Application...")

    //get input elements
    let sourceDOMElement = document.getElementById "sourceCode" :?>HTMLTextAreaElement
    let outputDOMElement = document.getElementById "output" :?>HTMLParagraphElement
    
    //get button elements
    let executeButton = document.getElementById "execute" :?>HTMLButtonElement
        
    let splitIntoWords = 
        "MOV R3 #10".Split whiteSpace
        |> Array.toList
        |> List.filter ((<>) "")

    //controller functions
    let execute() =
        //get values from input elements
        let sourceCode = sourceDOMElement.value
        Browser.console.log(sourceCode)

        Browser.console.log(splitIntoWords)
        let state = readAsm sourceCode
        Browser.console.log(state.MemMap)
    
    let openFile() = null
    let saveFile() = null

    //event register
    executeButton.addEventListener_click(fun _ ->(execute());null)