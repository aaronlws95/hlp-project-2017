﻿namespace ARM7TDMI

module UserInterfaceController =
    open System
    open System.Text
    open Fable.Import
    open Fable.Core.JsInterop
    open Parser
    open MachineState
    open InstructionType
    let s = 
        "MOV R1 R2
    ADD R2 R3 #3
    MYBRANCH MVN R2 #2
    CMP R13 R2 , LSL #10
    LSL R6 R7 #10
    ASR R8 R9 R10
    ADDS R3 R13 #15
    ADDSEQ R3 R13 #15
    ADDLO R3 R13 #15"

    //let state = readAsm s
    let init_reg = 
            [0..15] |> Seq.map (fun x -> (R x, x*x)) |> Map.ofSeq
        
    let init_memory =
        let chooseAddr (m:Map<Address,Memory>) i = m.Add(Addr(i*4),Inst(Line (ALU (MOV (R 1,Reg (R 2)),false),None,None)))
        seq { 0 .. 20 - 1 } 
            |> Seq.fold chooseAddr Map.empty
    let state: MachineState = { 
            //PC = Addr 0 // PC is now Reg 15
            END = Addr (4*20)
            RegMap = init_reg
            MemMap = init_memory
            Flags = {N=false; Z=false; C=false; V=false}
            State = RunOK
        }
    let getRegister i = state.RegMap.TryFind(R i)
    let getMemory address = 
        let head = address - (address % 4)
        toJson (state.MemMap.TryFind(Addr head))
    let getState = toJson state.State
    let getFlags = 
        let flags = state.Flags
        //fable ignores System.Convert.ToInt32(boolean)
        [flags.N; flags.Z; flags.C; flags.V] |> List.map (fun x -> match x with | true -> 1 | _ -> 0)
    
    
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
        Browser.console.info("Executing Source Code...")
        //get values from input elements
        let sourceCode = sourceDOMElement.value

        Browser.console.info("Displaying Register Values...")
        [0..15] |> List.map (fun x -> Browser.console.log("R",x,"=",(getRegister x))) |> ignore
        [0..4..32] |> List.map (fun x -> Browser.console.log((getMemory x))) |> ignore

        Browser.console.info("Displaying NZCV flags...")
        Browser.console.log(toJson getFlags)

        Browser.console.info("Displaying Emulation Status")
        Browser.console.log(getState)

    let openFile() = 
        Browser.console.log("Opening file...");
    let saveFile(saveAs: bool) = 
        Browser.console.log("Saving file...");

    //event register
    executeButton.addEventListener_click(fun _ ->(execute());null)