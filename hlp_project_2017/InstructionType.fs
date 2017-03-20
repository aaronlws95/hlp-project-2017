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
        | MVN of dest:Register*op1:RegOrLit
        | AND of dest:Register*op1:Register*op2:RegOrLit
        | EOR of dest:Register*op1:Register*op2:RegOrLit
        | RSB of dest:Register*op1:Register*op2:RegOrLit
        | RSC of dest:Register*op1:Register*op2:RegOrLit
        | ADC of dest:Register*op1:Register*op2:RegOrLit
        | SBC of dest:Register*op1:Register*op2:RegOrLit
        | BIC of dest:Register*op1:Register*op2:RegOrLit
        | ORR of dest:Register*op1:Register*op2:RegOrLit

    type SFInst =
        | TST of dest:Register*op1:RegOrLit
        | TEQ of dest:Register*op1:RegOrLit
        | CMP of dest:Register*op1:RegOrLit
        | CMN of dest:Register*op1:RegOrLit

    type LDMdir = ED | IB | FD | IA | EA | DB | FA | DA
    
    type MEMInst = 
        | ADR of dest:Register*exp:Address
        | LDR of dest:Register*source:Register*offset:RegOrLit*autoIndex:RegOrLit*byte:bool
        | STR of dest:Register*source:Register*offset:RegOrLit*autoIndex:RegOrLit*byte:bool 
        | LDM of dir:LDMdir*source:Register*regList:(Register list)*writeBack:bool
        | STM of dir:LDMdir*dest:Register*regList:(Register list)*writeBack:bool

    type SHIFTInst = 
        | LSL of dest:Register*op1:Register*op2:RegOrLit
        | LSR of dest:Register*op1:Register*op2:RegOrLit
        | ASR of dest:Register*op1:Register*op2:RegOrLit
        | ROR of dest:Register*op1:Register*op2:RegOrLit
        | RRX of op1:Register*op2:Register
    
    type LABELInst =
        | FILL of memStart:Address*length:Value
        | DCD of memStart:Address*valList:int list
        | EQU of value:Value

    type BRANCHInst = 
        | B of target:Address
        | BL of target:Address

    type ConditionCode = | EQ | NE | CS | HS | CC | LO | MI | PL | VS | VC | HI | LS | GE | LT | GT | LE | AL | NoCond

    type InstructionType =
        | ALU of ALUInst*setFlag:bool  
        | MEM of MEMInst
        | SF of SFInst
        | SHIFT of SHIFTInst*setFlag:bool
        | BRANCH of BRANCHInst
        | LABEL of LABELInst
        | END

    //type ConditionType = Condition of ConditionCode

    type InstructionLine = 
        | Line of InstructionType * SHIFTInst option * ConditionCode option
        | Failed_Parsing of string

    type Memory = 
        | Inst of InstructionLine
        | Val of Value