namespace ARM7TDMI

module InstructionType = 
    type Register = R of int
    type Memory = M of int 
    type RegOrLit = 
        | Reg of Register 
        | Lit of int

    type ALUInst = 
        | MOV of (Register*RegOrLit)
        | ADD of (Register*RegOrLit*RegOrLit)
        | SUB of (Register*RegOrLit*RegOrLit)

    type MEMInst = 
        | ADR of (Register*Memory)

    type InstructionType =
        | ALU of ALUInst
        | MEM of MEMInst
