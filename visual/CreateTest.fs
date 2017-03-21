namespace VisualInterface

///Create custom tests manually
module CreateTest = 
    open VITest.TestEnvt
    open ARM7TDMI
    open Emulator.Instruction
    open InstructionType
    
    let testDEBUG1 = 
        let testText = "


		MOV		R1, #11584
		
		RORS		R0, R1, #233

            "
        let testInstruction = 
            [   ALU(MOV(R 1,Lit 11584),false)
                SHIFT(ROR(R 0,R 1,Lit 233),true) ]
        createTest "DEBUG Test" testText testInstruction
    let testDEBUG2 = 
        let testText = "
        SBC R0, R1, R1
	RORS		R0, R0, #163
		
	RRXS		R1, R1

            "
        let testInstruction = 
            [   ALU(SBC(R 0, R 1, Reg(R 1)),false)
                SHIFT(ROR(R 0,R 0,Lit 163),true)
                SHIFT(RRX(R 1,R 1),true) ]
        createTest "DEBUG Test" testText testInstruction
    let testDEBUG3 = 
        let testText = "
            MOV R1, #-1
            ASRS R0, R1, R1

            "
        let testInstruction = 
            [   ALU(MOV(R 1, Lit -1),false)
                SHIFT(ROR(R 0,R 1,Reg(R 1)),true)]
        createTest "DEBUG Test" testText testInstruction
    let testDEBUG4 = 
        let testText = "
		MVN		R1, #-1677721597
		
		ASRS		R1, R1, #68

            "
        let testInstruction = 
            [   ALU(MVN(R 1, Lit -1677721597),false)
                SHIFT(ASR(R 1,R 1,Lit 68),true)]
        createTest "DEBUG Test" testText testInstruction
//    let createdManualTestList = [testDEBUG1]

    //ALU INSTRUCTION TESTS
    let testMOV1 = createTest "MOV Test" "MOV R0, #2" [ ALU(MOV(R 0, Lit 2), false) ] //TEST MOV 1
    
    let testMOV2 = 
        createTest "MOV Test 2" "MOV R0, #3\nMOV R2, R0" [ ALU(MOV(R 0, Lit 3), false);ALU(MOV(R 2, Reg(R 0)), false) ] //TEST MOV 2
    
    let testADD1 = createTest "ADD Test 1" "ADD R0, R1, #2" [ ALU(ADD(R 0, R 1, Lit 2), false) ] //TEST ADD 1
    let testSUB1 = createTest "SUB Test 1" "SUB R0, R1, #1" [ ALU(SUB(R 0, R 1, Lit 1), false) ] //TEST SUB 1
    let testMOVS1 = createTest "MOVS Test 1" "MOVS R0, #-1" [ ALU(MOV(R 0, Lit -1), true) ] //TEST MOVS 1
    
    let testADDS1 = 
        createTest "ADDS Test 1" "MOV R0, #1\nADDS R1, R0, #0xFFFFFFFF" [ ALU(MOV(R 0, Lit 1), false);ALU(ADD(R 1, R 0, Lit 0xFFFFFFFF), true) ] //TEST ADDS 1
    
    let testADDS2 = 
        createTest "ADDS Test 2" "MOV R0, #0x80000000\nADDS R1, R0, #0x80000000" 
            [ ALU(MOV(R 0, Lit 0x80000000), false);ALU(ADD(R 1, R 0, Lit 0x80000000), true) ] //TEST ADDS 1
    
    let testSUBS1 = 
        createTest "SUBS Test 1" "MOV R0, #3\nSUBS R1, R0, #3" [ ALU(MOV(R 0, Lit 3), false);ALU(SUB(R 1, R 0, Lit 3), true) ] //TEST SUBS 1
    
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
        createTest "LSL Test" "MOV R0, #1\nLSL R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false);SHIFT(LSL(R 1, R 0, Lit 27), false) ]
    
    let testLSLS1 = 
        createTest "LSLS Test" "MOV R0, #0x20000000\nLSLS R1, R0, #3" [ ALU(MOV(R 0, Lit 0x20000000), false);SHIFT(LSL(R 1, R 0, Lit 3), true) ]

    let testLSR1 = 
        createTest "LSR Test" "MOV R0, #1\nLSR R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false);SHIFT(LSR(R 1, R 0, Lit 27), false) ]
    
    let testLSRS1 = 
        createTest "LSRS Test" "MOV R0, #4\nLSRS R1, R0, #3" [ ALU(MOV(R 0, Lit 4), false);SHIFT(LSR(R 1, R 0, Lit 3), true) ]

    let testASR1 = 
        createTest "ASR Test" "MOV R0, #1\nASR R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false);SHIFT(ASR(R 1, R 0, Lit 27), false) ]
    
    let testROR1 = 
        createTest "ROR Test" "MOV R0, #1\nROR R1, R0, #27" [ ALU(MOV(R 0, Lit 1), false);SHIFT(ROR(R 1, R 0, Lit 27), false) ]
    
    let testRRX1 = 
        createTest "RRX Test" "MOV R0, #3\nRRXS R1, R0" [ ALU(MOV(R 0, Lit 3), false);SHIFT(RRX(R 1, R 0), true) ]
    

    //MEMORY INSTRUCTION TESTS
    //TEST ADR 1
    let testADR1 = createTest "ADR Test" "ADR R0, 0x100" [ MEM(ADR(R 0, Addr 0x100)) ]
    
    //TEST LDR 1
    let testLDR1 = 
        let testText = "
            LDR R0, =TEST
            ADD R0, R0, #4
            LDR R1, [R0]
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(ADD(R 0, R 0, Lit 4),false)
              MEM(LDR(R 1, R 0,Lit 0,Lit 0,false)) ]
        createTest "LDR Test 1" testText testInstruction

     //TEST LDR 2
    let testLDR2 = 
        let testText = "
            LDR R0, =TEST
            LDR R1, [R0, #4]
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              MEM(LDR(R 1, R 0,Lit 4,Lit 0,false)) ]
        createTest "LDR Test 2" testText testInstruction
     
     //TEST LDR 3
    let testLDR3 = 
        let testText = "
            LDR R0, =TEST
            LDR R1, [R0, #4]!
            LDR R2, [R0], #4
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              MEM(LDR(R 1, R 0,Lit 4,Lit 4,false))
              MEM(LDR(R 2, R 0, Lit 0,Lit 4,false)) ]
        createTest "LDR Test 3" testText testInstruction

     //TEST LDR 4
    let testLDR4 = 
        let testText = "
            LDR R0, =TEST
            MOV R1, #4
            LDR R2, [R0,R1]!
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(MOV(R 1, Lit 4), false)
              MEM(LDR(R 2, R 0, Reg (R 1),Reg (R 1),false)) ]
        createTest "LDR Test 3" testText testInstruction
          
    //TEST STR 1
    let testSTR1 = 
        let testText = "
            LDR R0, =TEST
            MOV R1, #476
            STR R1, [R0]
            LDR R2, [R0]
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(MOV(R 1, Lit 476), false)
              MEM(STR(R 1, R 0,Lit 0,Lit 0, false))
              MEM(LDR(R 2, R 0,Lit 0,Lit 0,false)) ]
        createTest "LDR Test" testText testInstruction

    //TEST STR 2
    let testSTR2 = 
        let testText = "
            LDR R0, =TEST
            MOV R1, #476
            STR R1, [R0,#4]!
            LDR R2, [R0,#4]
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(MOV(R 1, Lit 476), false)
              MEM(STR(R 1, R 0,Lit 4,Lit 4, false))
              MEM(LDR(R 2, R 0,Lit 4,Lit 0,false)) ]
        createTest "LDR Test" testText testInstruction

    //TEST LDMFD 1
    let testLDMFD1 = 
        let testText = "
            LDR R0, =TEST
            LDMFD R0!, {R6,R1}
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              MEM(LDM(FD,R 0,[R 6;R 1],true)) ]
        createTest "LDMFD Test" testText testInstruction

    //TEST LDMED 1
    let testLDMED1 = 
        let testText = "
            LDR R0, =TEST
            LDMED R0!, {R1,R2,R3}
            "
        
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              MEM(LDM(ED,R 0,[R 1;R 2;R 3],true)) ]
        createTest "LDMED Test" testText testInstruction

    //TEST LDMEA 1
    let testLDMEA1 = 
        let testText = "
		LDR		R0 , =TEST
		
		ADD		R0 ,R0, #4
		
		LDMEA	R0 , {R7}
            "
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(ADD(R 0,R 0,Lit 4),false)
              MEM(LDM(EA,R 0,[R 7],false)) ]
        createTest "LDMEA Test" testText testInstruction

    //TEST LDMFA 1
    let testLDMFA1 = 
        let testText = "
            LDR R0, =TEST
            ADD R0, R0, #8
            LDMFA R0!, {R10,R7}
            "
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(ADD(R 0,R 0,Lit 8),false)
              MEM(LDM(FA,R 0,[R 10;R 7],true)) ]
        createTest "LDMFA Test" testText testInstruction

    //TEST STMEA 1
    let testSTMEA1 = 
        let testText = "
		LDR		R0, =TEST
		MOV		R1, #1
		MOV		R2, #2
		MOV		R3, #3
		STMEA	R0!, {R1,R2,R3}
		LDMFD	R0, {R4,R5,R6}
            "
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(MOV(R 1,Lit 1),false)
              ALU(MOV(R 2,Lit 2),false)
              ALU(MOV(R 3,Lit 3),false)
              MEM(STM(EA,R 0,[R 1;R 2;R 3],true)) 
              MEM(LDM(FD,R 0,[R 4;R 5;R 6],false)) ]
        createTest "STMEA Test" testText testInstruction

    let testSTMFA1 = 
        let testText = "
		LDR		R0, =TEST
		MOV		R1, #1
		MOV		R2, #2
		MOV		R3, #3
		STMFA	R0!, {R1,R2,R3}
		LDMFD	R0, {R4,R5,R6}
            "
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(MOV(R 1,Lit 1),false)
              ALU(MOV(R 2,Lit 2),false)
              ALU(MOV(R 3,Lit 3),false)
              MEM(STM(FA,R 0,[R 1;R 2;R 3],true)) 
              MEM(LDM(FD,R 0,[R 4;R 5;R 6],false)) ]
        createTest "STMFA Test" testText testInstruction

    let testSTMED1 = 
        let testText = "
		LDR		R0, =TEST
		MOV		R1, #1
		MOV		R2, #2
		MOV		R3, #3
        ADD     R0, R0, #12
		STMED	R0!, {R1,R2,R3}
		LDMFD	R0, {R4,R5,R6}
            "
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(MOV(R 1,Lit 1),false)
              ALU(MOV(R 2,Lit 2),false)
              ALU(MOV(R 3,Lit 3),false)
              ALU(ADD(R 0, R 0, Lit 12),false)
              MEM(STM(ED,R 0,[R 1;R 2;R 3],true)) 
              MEM(LDM(FD,R 0,[R 4;R 5;R 6],false)) ]
        createTest "STMED Test" testText testInstruction

    let testSTMFD1 = 
        let testText = "
		LDR		R0, =TEST
		MOV		R1, #1
		MOV		R2, #2
		MOV		R3, #3
        ADD     R0, R0, #12
		STMFD	R0!, {R1,R2,R3}
		LDMFD	R0, {R4,R5,R6}
            "
        let testInstruction = 
            [ MEM(ADR(R 0, Addr 0x10000))
              ALU(MOV(R 1,Lit 1),false)
              ALU(MOV(R 2,Lit 2),false)
              ALU(MOV(R 3,Lit 3),false)
              ALU(ADD(R 0, R 0, Lit 12),false)
              MEM(STM(FD,R 0,[R 1;R 2;R 3],true)) 
              MEM(LDM(FD,R 0,[R 4;R 5;R 6],false)) ]
        createTest "STMFD Test" testText testInstruction


    let createdManualTestList = 
        [ 
            //ALU
            testMOV1; testMOV2; testADD1; testSUB1; testMOVS1; 
            testADDS1; testADDS2; testSUBS1; testMVN1; testEOR1; 
            testRSB1; testADC1; testSBC1; testBIC1; testORR1; 
            //SET FLAG
            testTST1; testTEQ1; testCMP1; testCMN1; 
            //SHIFT
            testLSL1; testLSR1; testASR1; testROR1; testRRX1; testLSLS1; testLSRS1
            //MEM
            testADR1; testLDR1; testLDR2; testLDR3; testLDR4; testSTR1;
            testSTR2; testLDMFD1; testLDMED1; testLDMEA1; testLDMFA1;
            testSTMEA1; testSTMFA1; testSTMFD1; testSTMED1;
        ]

