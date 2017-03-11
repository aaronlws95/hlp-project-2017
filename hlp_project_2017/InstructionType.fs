﻿namespace ARM7TDMI

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
        | MVN of dest:Register*op1:RegOrLit
        | EOR of dest:Register*op1:Register*op2:RegOrLit
        | RSB of dest:Register*op1:Register*op2:RegOrLit
        | ADC of dest:Register*op1:Register*op2:RegOrLit
        | SBC of dest:Register*op1:Register*op2:RegOrLit
        | BIC of dest:Register*op1:Register*op2:RegOrLit
        | ORR of dest:Register*op1:Register*op2:RegOrLit

    type SFInst =
        | TST of dest:Register*op1:RegOrLit
        | TEQ of dest:Register*op1:RegOrLit
        | CMP of dest:Register*op1:RegOrLit
        | CMN of dest:Register*op1:RegOrLit

    type MEMInst = 
        | ADR of dest:Register*exp:Address
        | LDRREG of dest:Register*source:Register
        | LDRPI of dest:Register*eqExp:Address

    type InstructionType =
        | ALU of ALUInst*bool  
        | MEM of MEMInst*bool
        | SF of SFInst

    type Memory = 
        | Inst of InstructionType
        | Val of Value
