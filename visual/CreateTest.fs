﻿namespace VisualInterface

module CreateTest = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType
    
    //ALU INSTRUCTION TESTS
    let testMOV1 = createTest "MOV Test" "MOV R0, #2" [ ALU(MOV(R 0, Lit 2), false) ] //TEST MOV 1
    
    let testMOV2 = 
        createTest "MOV Test 2" "MOV R0, #3\nMOV R2, R0" [ ALU(MOV(R 0, Lit 3), false)
                                                           ALU(MOV(R 2, Reg(R 0)), false) ] //TEST MOV 2
    
    let testADD1 = createTest "ADD Test 1" "ADD R0, R1, #2" [ ALU(ADD(R 0, R 1, Lit 2), false) ] //TEST ADD 1
    let testSUB1 = createTest "SUB Test 1" "SUB R0, R1, #1" [ ALU(SUB(R 0, R 1, Lit 1), false) ] //TEST SUB 1
    let testMOVS1 = createTest "MOVS Test 1" "MOVS R0, #-1" [ ALU(MOV(R 0, Lit -1), true) ] //TEST MOVS 1
    
    let testADDS1 = 
        createTest "ADDS Test 1" "MOV R0, #1\nADDS R1, R0, #0xFFFFFFFF" [ ALU(MOV(R 0, Lit 1), false)
                                                                          ALU(ADD(R 1, R 0, Lit 0xFFFFFFFF), true) ] //TEST ADDS 1
    
    let testADDS2 = 
        createTest "ADDS Test 2" "MOV R0, #0x80000000\nADDS R1, R0, #0x80000000" 
            [ ALU(MOV(R 0, Lit 0x80000000), false)
              ALU(ADD(R 1, R 0, Lit 0x80000000), true) ] //TEST ADDS 1
    
    let testSUBS1 = 
        createTest "SUBS Test 1" "MOV R0, #3\nSUBS R1, R0, #3" [ ALU(MOV(R 0, Lit 3), false)
                                                                 ALU(SUB(R 1, R 0, Lit 3), true) ] //TEST SUBS 1
    
    let testMVN1 = createTest "MVN Test" "MVN R0, #2" [ ALU(MVN(R 0, Lit 2), false) ] // TEST MVN 1
    let testEOR1 = createTest "EOR Test" "EOR R0, R1, #2" [ ALU(EOR(R 0, R 1, Lit 2), false) ] // TEST EOR 1
    let testRSB1 = createTest "RSB Test" "RSB R0, R1, #2" [ ALU(RSB(R 0, R 1, Lit 2), false) ] // TEST RSB 1
    let testADC1 = createTest "ADC Test" "ADC R0, R1, #2" [ ALU(ADC(R 0, R 1, Lit 2), false) ] // TEST ADC 1 
    let testSBC1 = createTest "SBC Test" "SBC R0, R1, #2" [ ALU(SBC(R 0, R 1, Lit 2), false) ] // TEST SBC 1 
    let testBIC1 = createTest "BIC Test" "BIC R0, R1, #2" [ ALU(BIC(R 0, R 1, Lit 2), false) ] // TEST BIC 1 
    let testORR1 = createTest "ORR Test" "ORR R0, R1, #2" [ ALU(ORR(R 0, R 1, Lit 2), false) ] // TEST ORR 1   
    
    //SET FLAG INSTRUCTION TESTS 
    let testTST1 = createTest "TST Test" "TST R0, #2" [ SF(TST(R 0, Lit 2))] // TEST TST 1
    let testTEQ1 = createTest "TEQ Test" "TEQ R0, #2" [ SF(TEQ(R 0, Lit 2))] // TEST TEQ 1
    let testCMP1 = createTest "CMP Test" "CMP R0, #2" [ SF(CMP(R 0, Lit 2))] // TEST CMP 1
    let testCMN1 = createTest "CMN Test" "CMN R0, #2" [ SF(CMN(R 0, Lit 2))] // TEST CMN 1
    
    //SHIFT INSTRUCTION TESTS
    let testLSL1 = 
        createTest "LSL Test" "MOV R0, #1\nLSL R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false)
                                                              SHIFT(LSL(R 1, R 0, Lit 27), false) ]
    
    let testLSR1 = 
        createTest "LSR Test" "MOV R0, #1\nLSR R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false)
                                                              SHIFT(LSR(R 1, R 0, Lit 27), false) ]
    
    let testASR1 = 
        createTest "ASR Test" "MOV R0, #1\nASR R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false)
                                                              SHIFT(ASR(R 1, R 0, Lit 27), false) ]
    
    let testROR1 = 
        createTest "ROR Test" "MOV R0, #1\nROR R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false)
                                                              SHIFT(ROR(R 1, R 0, Lit 27), false) ]
    
    let testRRX1 = 
        createTest "RRX Test" "MOV R0, #3\nRRXS R1, R0" [ ALU(MOV(R 0, Lit 3), false)
                                                          SHIFT(RRX(R 1, R 0), true) ]
    
    //MEMORY INSTRUCTION TESTS
    //TEST ADR 1
    let testADR1 = createTest "ADR Test" "ADR R0, 0x100" [ MEM(ADR(R 0, Addr 0x100,false)) ]
    
    //TEST LDR 1
    let testLDR1 = 
        let testText = "
            TEST DCD 65537,65541
            LDR R0, =TEST
            ADD R0, R0, #4
            LDR R1, [R0]
            "
        
        let testInstruction = 
            [ MEM(LDRPI(R 0, Addr 0x10000))
              ALU(ADD(R 0, R 0, Lit 4),false)
              MEM(LDRREG(R 1, R 0,Lit 0,Lit 0,false)) ]
        createTest "LDR Test 1" testText testInstruction

     //TEST LDR 2
    let testLDR2 = 
        let testText = "
            TEST DCD 65537,65541
            LDR R0, =TEST
            LDR R1, [R0, #4]
            "
        
        let testInstruction = 
            [ MEM(LDRPI(R 0, Addr 0x10000))
              MEM(LDRREG(R 1, R 0,Lit 4,Lit 0,false)) ]
        createTest "LDR Test 2" testText testInstruction
     
     //TEST LDR 3
    let testLDR3 = 
        let testText = "
            TEST DCD 65537,65541
            LDR R0, =TEST
            LDR R1, [R0, #4]!
            LDR R2, [R0], #4
            "
        
        let testInstruction = 
            [ MEM(LDRPI(R 0, Addr 0x10000))
              MEM(LDRREG(R 1, R 0,Lit 4,Lit 4,false))
              MEM(LDRREG(R 2, R 0, Lit 0,Lit 4,false)) ]
        createTest "LDR Test 3" testText testInstruction

     //TEST LDR 4
    let testLDR4 = 
        let testText = "
            TEST DCD 65537,65541
            LDR R0, =TEST
            MOV R1, #4
            LDR R2, [R0,R1]!
            "
        
        let testInstruction = 
            [ MEM(LDRPI(R 0, Addr 0x10000))
              ALU(MOV(R 1, Lit 4), false)
              MEM(LDRREG(R 2, R 0, Reg (R 1),Reg (R 1),false)) ]
        createTest "LDR Test 3" testText testInstruction
          
    //TEST STR 1
    let testSTR1 = 
        let testText = "
            TEST DCD 65537,65541
            LDR R0, =TEST
            MOV R1, #476
            STR R1, [R0]
            LDR R2, [R0]
            "
        
        let testInstruction = 
            [ MEM(LDRPI(R 0, Addr 0x10000))
              ALU(MOV(R 1, Lit 476), false)
              MEM(STR(R 1, R 0,Lit 0,Lit 0, false))
              MEM(LDRREG(R 2, R 0,Lit 0,Lit 0,false)) ]
        createTest "LDR Test" testText testInstruction

    //TEST STR 2
    let testSTR2 = 
        let testText = "
            TEST DCD 65537,65541,65545
            LDR R0, =TEST
            MOV R1, #476
            STR R1, [R0,#4]!
            LDR R2, [R0,#4]
            "
        
        let testInstruction = 
            [ MEM(LDRPI(R 0, Addr 0x10000))
              ALU(MOV(R 1, Lit 476), false)
              MEM(STR(R 1, R 0,Lit 4,Lit 4, false))
              MEM(LDRREG(R 2, R 0,Lit 4,Lit 0,false)) ]
        createTest "LDR Test" testText testInstruction

    let createdTestList = 
        [ 
            //ALU
//            testMOV1; testMOV2; testADD1; testSUB1; testMOVS1; 
//            testADDS1; testADDS2; testSUBS1; testMVN1; testEOR1; 
//            testRSB1; testADC1; testSBC1; testBIC1; testORR1; 
            //SET FLAG
//            testTST1; testTEQ1; testCMP1; testCMN1; 
            //SHIFT
//            testLSL1; testLSR1; testASR1; testROR1; testRRX1; 
            //MEM
            testADR1; testLDR1; testLDR2; testLDR3; testLDR4; testSTR1;
            testSTR2;
        ]

