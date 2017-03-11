﻿namespace VisualInterface

module CreateTest = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType
    //TEST MOV 1
    let testMOV1 = createTest "MOV Test" "MOV R0, #2" [Some (Inst(ALU(MOV(R 0,Lit 2),false)))] 
    //TEST MOV 2
    let testMOV2 = 
        let testText = 
            "
            MOV R0, #3
            MOV R2, R0
            " 
        let testInstruction = 
            [Some (Inst(ALU(MOV(R 0,Lit 3),false)));
            Some (Inst(ALU(MOV(R 2,Reg (R 0)),false)))]
        createTest "MOV Test 2" testText  testInstruction
    //TEST ADD 1
    let testADD1 = createTest "ADD Test 1" "ADD R0, R1, #2" [Some (Inst(ALU(ADD(R 0,R 1,Lit 2),false)))] 
    //TEST SUB 1
    let testSUB1 = createTest "SUB Test 1" "SUB R0, R1, #1" [Some (Inst(ALU(SUB(R 0,R 1,Lit 1),false)))] 
    //TEST MOVS 1
    let testMOVS1 = createTest "MOVS Test 1" "MOVS R0, #-1" [Some (Inst(ALU(MOV(R 0,Lit -1),true)))] 
    //TEST ADDS 1
    let testADDS1 = 
        let testText = 
            "
            MOV R0, #1
            ADDS R1, R0, #0xFFFFFFFF
            " 
        let testInstruction = 
            [Some (Inst(ALU(MOV(R 0,Lit 1),false)));
            Some (Inst(ALU(ADD(R 1, R 0,Lit 0xFFFFFFFF),true)))]
        createTest "ADDS Test 1" testText  testInstruction
    //TEST ADDS 1
    let testADDS2 = 
        let testText = 
            "
            MOV R0, #0x80000000
            ADDS R1, R0, #0x80000000
            " 
        let testInstruction = 
            [Some (Inst(ALU(MOV(R 0,Lit 0x80000000),false)));
            Some (Inst(ALU(ADD(R 1,R 0,Lit 0x80000000),true)))]
        createTest "ADDS Test 2" testText testInstruction
    //TEST SUBS 1
    let testSUBS1 = 
        let testText = 
            "
            MOV R0, #3
            SUBS R1, R0, #3
            " 
        let testInstruction = 
            [Some (Inst(ALU(MOV(R 0,Lit 3),false)));
            Some (Inst(ALU(SUB(R 1,R 0,Lit 3),true)))]
        createTest "SUBS Test 1" testText testInstruction

    //TEST ADR
    let testADR1 = createTest "ADR Test" "ADR R0, 0x100" [Some(Inst((MEM(ADR(R 0,Addr 0x100),false))))] 
    
    //TEST LDR
        //TEST SUBS 1
    let testLDR1 = 
        let testText = 
            "
            TEST DCD 65537,65541
            LDR R0, =TEST
            ADD R0, R0, #4
            LDR R1, [R0]
            " 
        let testInstruction = 
            [Some (Inst(MEM(LDRPI(R 0,Addr 0x10000),false)));
            Some (Inst(ALU(ADD(R 0,R 0,Lit 4),false)));
            Some (Inst(MEM(LDRREG(R 1,R 0),false)))]
        createTest "LDR Test" testText testInstruction
    
    let testMVN1 = createTest "MVN Test" "MVN R0, #2" [Some (Inst(ALU(MVN(R 0,Lit 2),false)))]  
    let testEOR1 = createTest "EOR Test" "EOR R0, R1, #2" [Some (Inst(ALU(EOR(R 0, R 1, Lit 2),false)))]  
    let testRSB1 = createTest "RSB Test" "RSB R0, R1, #2" [Some (Inst(ALU(RSB(R 0, R 1, Lit 2),false)))]  
    let testADC1 = createTest "ADC Test" "ADC R0, R1, #2" [Some (Inst(ALU(ADC(R 0, R 1, Lit 2),false)))]  
    let testSBC1 = createTest "SBC Test" "SBC R0, R1, #2" [Some (Inst(ALU(SBC(R 0, R 1, Lit 2),false)))]  
    let testBIC1 = createTest "BIC Test" "BIC R0, R1, #2" [Some (Inst(ALU(BIC(R 0, R 1, Lit 2),false)))]  
    let testORR1 = createTest "ORR Test" "ORR R0, R1, #2" [Some (Inst(ALU(ORR(R 0, R 1, Lit 2),false)))]     
    let testTST1 = createTest "TST Test" "TST R0, #2" [Some (Inst(SF(TST(R 0, Lit 2))))]  
    let testTEQ1 = createTest "TEQ Test" "TEQ R0, #2" [Some (Inst(SF(TEQ(R 0, Lit 2))))]
    let testCMP1 = createTest "CMP Test" "CMP R0, #2" [Some (Inst(SF(CMP(R 0, Lit 2))))]
    let testCMN1 = createTest "CMN Test" "CMN R0, #2" [Some (Inst(SF(CMN(R 0, Lit 2))))]

    let createdTestList = [
        testMOV1
        testMOV2
        testADD1
        testSUB1
        testMOVS1
        testADDS1
        testADDS2
        testSUBS1
        testADR1
        testLDR1
        testMVN1
        testEOR1
        testRSB1
        testADC1
        testSBC1
        testBIC1
        testORR1
        testTST1
        testTEQ1
        testCMP1
        testCMN1
    ]
