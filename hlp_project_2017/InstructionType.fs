namespace ARM7TDMI

module InstructionType = 
    type Register = int    //Registers indentified by 0-13
    type Address = int     //Address of memory
    type Value = int
    
    type RegOrLit = 
        | Reg of Register 
        | Lit of Value

    type ALUInst = 
        | MOV of (Register*RegOrLit)
        | ADD of (Register*Register*RegOrLit)
        | SUB of (Register*Register*RegOrLit)

    type MEMInst = 
        | ADR of (Register*Address)

    type InstructionType =
        | ALU of ALUInst*bool
        | MEM of MEMInst*bool

    type Memory =
        | Inst of InstructionType
        | Val of Value

