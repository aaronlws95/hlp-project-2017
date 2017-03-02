# ARMadillo :mouse:
### A user-friendly ARM7TDMI assembler and simulator in F&#35; 

ARMadillo is a cross-platform ARM emulator for assembling and simulating the ARM7TDMI instruction set. 

The project was built as part of the High Level Programming EE3-22 (2017) module at Imperial College London, and draws inspiration from Salman Arif's [VisUAL](https://salmanarif.bitbucket.io/visual/). :+1:

## Technologies

ARMadillo is built using the following technologies:

* Assembler written in [F#](http://fsharp.org/) and transpiled into JavaScript using [FABLE](http://fable.io/)

* GUI done using web technologies (HTML/CSS/JS), with the [CodeMirror](https://codemirror.net/) text editor  

## Project Architecture

![pic](https://raw.githubusercontent.com/aaronlws95/hlp-project-2017/master/project_architecture.png)

The assembler is separated into several modules:

`Program.fs` : TO-DO

`Parser.fs` : Parses the text from the GUI text editor into a list of `InstructionType`s and returns a `MachineState` containing the instructions.

`Emulator.fs` : Executes instructions and returns a new `MachineState`.

`GUI.fs` : TO-DO

`MachineType.fs` : Contains data structure for register maps, memory maps, list of instructions, etc.

`InstructionType.fs` : Holds all the implemented ARM instructions as `InstructionType` data types.
