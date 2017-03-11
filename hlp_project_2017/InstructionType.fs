namespace ARM7TDMI

module InstructionType = 
    type Register = R of int
    type Address = Addr of int
    type Value = int

    type RegOrLit = 
        | Reg of Register 
        | Lit of Value

    type ALUInst = 
        | MOV of dest:Register*op1:RegOrLit
        | ADD of dest:Register*op1:Register*op2:RegOrLit
        | SUB of dest:Register*op1:Register*op2:RegOrLit

    type MEMInst = 
        | ADR of dest:Register*exp:Address
        | LDRREG of dest:Register*source:Register
        | LDRPI of dest:Register*eqExp:Address

    type InstructionType =
        | ALU of ALUInst*bool  
        | MEM of MEMInst*bool

    type Memory = 
        | Inst of InstructionType
        | Val of Value

