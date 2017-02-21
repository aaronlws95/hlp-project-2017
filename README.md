# hlp-project-2017
A user-friendly ARM7TDMI assembler and simulator in F#

The project is seperated in four modules for the backend of things:

Type: Has all the common types between the different modules

Parser: Parses the strings into instructions

Emulator: Has all the instruction definitions

Environment: Makes the environment with the mutable state. Calls parse and emulate functions from the other modules

