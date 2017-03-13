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
        | LDRPI of dest:Register*eqExp:Address
        | LDRREG of dest:Register*source:Register
        | STR of dest:Register*source:Register

    type SHIFTInst = 
        | LSL of dest:Register*op1:Register*op2:RegOrLit
        | LSR of dest:Register*op1:Register*op2:RegOrLit
        | ASR of dest:Register*op1:Register*op2:RegOrLit
        | ROR of dest:Register*op1:Register*op2:RegOrLit
        | RRX of op1:Register*op2:Register

    type ConditionCode = | EQ | NE | CS | HS | CC | LO | MI | PL | VS | VC | HI | LS | GE | LT | GT | LE | AL 

    type InstructionType =
        | ALU of ALUInst*setflag:bool  
        | MEM of MEMInst*setflag:bool
        | SF of SFInst
        | SHIFT of SHIFTInst*setflag:bool


    //type ConditionType = Condition of ConditionCode

    type InstructionLine = Line of InstructionType * SHIFTInst option * ConditionCode option

    type Memory = 
        | Inst of InstructionLine
        | Val of Value