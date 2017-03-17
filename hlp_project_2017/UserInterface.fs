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
                | remainder when remainder <= 15 -> remainder |> (+) 55 |> System.Convert.ToByte |> toArray |> Encoding.ASCII.GetString 
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

    Browser.console.log("Initialising Application...")

    //get input elements
    let sourceDOMElement = document.getElementById "sourceCode" :?>HTMLTextAreaElement
    let outputDOMElement = document.getElementById "output" :?>HTMLTextAreaElement
    
    //get button elements
    let executeButton = document.getElementById "execute" :?>HTMLButtonElement

    //get values from input elements
    let sourceCode = sourceDOMElement.value

    //controller functions
    let execute() =
        let state = readAsm sourceCode
        outputDOMElement.value <- state |> toJSON
    
    let openFile() = null
    let saveFile() = null

    //event register
    executeButton.addEventListener_click(fun _ ->(execute());null)