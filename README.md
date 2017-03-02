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

Program.fs : 

Parser.fs : Parses the strings into instructions

Emulator.fs : Has all the instruction definitions

GUI.fs : Handles the GUI code

MachineType.fs : 

InstructionType.fs : Has all the common types between the different modules
