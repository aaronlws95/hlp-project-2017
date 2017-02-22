namespace VisualInterface


module VisualInterface = 

    open System.IO
    open System
    open FSharp.Data
    open System.Xml
    open MBrace.FsPickler
    
    /// configuration data for running VisUAL
    type Params = {
        VisualPath: string // the directory in which the downloaded VisUAL.exe can be found
        WorkFileDir: string // the directory in which both temporary files and the persistent cache file are put
        VisualOpts: string // options passed to VisUAL when run in headless mode
        MemDataStart: int // start of VisUAL data section Memory
        MemLocs: int list // memory locations to be traced and data returned
    }



    type Out = 
        | R of int
        | Mem of int


    type RunState = 
        | RunOK
        | RunTimeErr of string
        | SyntaxErr of string

 
    type Result = 
        { ResOut : Map<Out, int>
          State : RunState }



    [<Literal>]
    let XmlSample1 = """
        <VisUAL xmlns="http://bitbucket.org/salmanarif/visual">
            <syntax-error line="2">Invalid source.</syntax-error>
            <syntax-error line="3">Invalid source.</syntax-error>
            <line id="2">
                <code>MOV R2, #10</code>
                <register name="R0">0x0</register>
                <register name="R1">0x5</register>
                <register name="R2">0xA</register>
                <register name="R3">0x0</register>
                <register name="R4">0x0</register>
                <register name="R5">0x0</register>
                <register name="R6">0x0</register>
                <register name="R7">0x0</register>
                <register name="R8">0x0</register>
                <register name="R9">0x0</register>
                <register name="R10">0x0</register>
                <register name="R11">0x0</register>
                <register name="R12">0x0</register>
                <register name="R13">0xFF000000</register>
                <register name="R14">0x0</register>
                <register name="R15">0x8014</register>
                <word address="0x140">0x7D0</word>
                <word address="0x144">0x0</word>
                <cycles>1</cycles>
            </line>
            <line id="3">
                <code>MOV R2, #10</code>
                <word address="0x140">0x7D0</word>
                <cycles>2</cycles>
            </line>
            <runtime-error line="3">Self-branching instruction detected.</runtime-error>
            <runtime-error line="3">Self-branching instruction detected.</runtime-error>
        </VisUAL>
        """
    let VPCandidate = @"C:\src\visual\"
    let VisualOpts = "--cycles --regs --syntax --runtime --mode:completion "
    let VisualOptsMem memsize locs =
        let locshex = String.concat "," (List.map (sprintf "0x%x") locs)
        VisualOpts + (sprintf " --meminstsize:0x%x --custom:%s "  memsize locshex)
    
    type VisualLog = FSharp.Data.XmlProvider<XmlSample1>

    let RunVisual (paras: Params) src : Result = 
        let visDir = paras.WorkFileDir
        let visualJarExec vp = vp + @"jre\bin\java -jar "
        //printfn "\n\nVisual Temp files:%s\n" tempFilePath
        Directory.CreateDirectory visDir |> ignore
        let runOpts = 
            match paras.MemLocs with 
            | [] -> VisualOpts
            | _ -> VisualOptsMem paras.MemDataStart paras.MemLocs
        let visualHeadlessExec srcFile outputFile opts = 
            (visualJarExec paras.VisualPath) + paras.VisualPath + @"content\visual_headless.jar --headless " + srcFile + " " + outputFile 
            + " " + opts
        let addQuotes s = sprintf "\"%s\"" s
        let srcF = Path.Combine(visDir, "source.s")
        File.WriteAllText(srcF, src)
        let outputF = Path.Combine(visDir, "visoutput.log")
        let cmdArgs = "/C " + (addQuotes <| visualHeadlessExec srcF outputF runOpts)
        //printfn "%s" cmdArgs
        File.WriteAllText(visDir + "comstr.txt", cmdArgs)
        try 
            let proc = System.Diagnostics.Process.Start("cmd", cmdArgs)
            proc.WaitForExit()
        with e -> printfn "%s" e.Message
        let outXml = VisualLog.Load(outputF)
        let recordError() = File.AppendAllText( visDir+"\\VisualErrors", sprintf "\n>>---SOURCE:\n%s\n-------\n\n>>>>>>>>>>>>>>>>>>>>>>\n\n%A\n----------------------\n" src outXml)
        let lines = outXml.Lines |> Array.toList
        
        match outXml.SyntaxErrors |> Array.toList with
        | _ :: _ -> recordError(); { ResOut = Map.ofList [] ; State = SyntaxErr (sprintf "Syntax Error: %A\n" outXml) }
        | _ -> 
            match outXml.RuntimeErrors |> Array.toList with
            | err :: _ -> recordError(); { ResOut = Map.ofList [] ; State = RunTimeErr(err.Value) }
            | _ -> 
                match outXml.Lines
                      |> Array.toList
                      |> List.rev with
                | line :: _ -> 
                    let regs = 
                        line.Registers
                        |> Array.map (fun r -> R( int  <| r.Name.[1 .. ]), int r.Value)
                        |> List.ofArray
                    let words =
                        line.Words
                        |> Array.map (fun w -> Mem ( int w.Address - paras.MemDataStart), int w.Value)
                        |> List.ofArray
                    { ResOut = Map.ofList (regs @ words); State = RunOK }
                | _ -> failwithf "OK_Fatal Error: Unexpected XML output from emulation:%A" outXml

    
    let mutable Cache: Map<string, Result> = Map.empty

    let BinarySerializer = FsPickler.CreateBinarySerializer()

    let InitCache visDir =
        let cacheFName = Path.Combine(visDir, "Cache")
        if File.Exists cacheFName then
            try
                Cache <- BinarySerializer.UnPickle<Map<string,Result>> (File.ReadAllBytes cacheFName)
            with
                | _ -> printfn "WARNING: cache file %s has incompatible format - it will be deleted" cacheFName
    
    let SaveCache paras =
        let cacheFName = Path.Combine(paras.WorkFileDir, "Cache")
        printf "Cache is:%s" cacheFName
        File.WriteAllBytes( cacheFName,  BinarySerializer.Pickle Cache)
 
    let RunVisualCached (paras:Params) (src:string) : Result =
        if Cache.ContainsKey(src) then Cache.[src]
        else 
            let visResults = RunVisual paras src
            Cache <- Cache.Add(src, visResults)
            SaveCache paras
            visResults 


