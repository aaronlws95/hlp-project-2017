namespace VisualInterface

module CreateTest = 
    open VITest.TestEnvt
    open ARM7TDMI.Emulator.Instruction
    open ARM7TDMI.InstructionType
    //TEST MOV 1
    let testMOV1 = createTest "MOV Test" "MOV R0, #2" [(ALUInst(MOV(R 0,Lit 2),false))] 
    //TEST MOV 2
    let testMOV2 = 
        let testText = 
            "
            MOV R0, #3
            MOV R2, R5
            " 
        let testInstruction = 
            [(ALUInst(MOV(R 0,Lit 3),false));
            (ALUInst(MOV(R 2,Reg (R 5)),false))]
        createTest "MOV Test 2" testText  testInstruction
    //TEST ADD 1
    let testADD1 = createTest "ADD Test 1" "ADD R0, R1, #2" [(ALUInst(ADD(R 0,Reg (R 1),Lit 2),false))] 
    //TEST SUB 1
    let testSUB1 = createTest "SUB Test 1" "SUB R0, R1, #1" [(ALUInst(SUB(R 0,Reg (R 1),Lit 1),false))] 
    //TEST MOVS 1
    let testMOVS1 = createTest "MOVS Test 1" "MOVS R0, #-1" [(ALUInst(MOV(R 0,Lit -1),true))] 
    //TEST ADDS 1
    let testADDS1 = 
        let testText = 
            "
            MOV R0, #1
            ADDS R1, R0, #0xFFFFFFFF
            " 
        let testInstruction = 
            [(ALUInst(MOV(R 0,Lit 1),false));
            (ALUInst(ADD(R 1,Reg (R 0),Lit 0xFFFFFFFF),true))]
        createTest "ADDS Test 1" testText  testInstruction
    //TEST ADDS 1
    let testADDS2 = 
        let testText = 
            "
            MOV R0, #0x80000000
            ADDS R1, R0, #0x80000000
            " 
        let testInstruction = 
            [(ALUInst(MOV(R 0,Lit 0x80000000),false));
            (ALUInst(ADD(R 1,Reg (R 0),Lit 0x80000000),true))]
        createTest "ADDS Test 2" testText  testInstruction
    //TEST ADDS 1
    let testSUBS1 = 
        let testText = 
            "
            MOV R0, #3
            SUBS R1, R0, #3
            " 
        let testInstruction = 
            [(ALUInst(MOV(R 0,Lit 3),false));
            (ALUInst(SUB(R 1,Reg (R 0),Lit 3),true))]
        createTest "SUBS Test 1" testText  testInstruction
        
    
    let createdTestList = [
        testMOV1
        testMOV2
        testADD1
        testSUB1
        testMOVS1
        testADDS1
        testADDS2
        testSUBS1
    ]
