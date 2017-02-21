# hlp-project-2017
A user-friendly ARM7TDMI assembler and simulator in F#

The mutable state in the environment is passed by reference to the emulator using the technique shown below:

let assign (result:byref<'a>) (x:'a) =
    result <- x

let thisWorks() =
    let mutable v = Unchecked.defaultof<int>
    assign &v 5
    printfn "%A" v

