
                MOV R0, #0
                MOV R1, #0
                MOV R2, #0
                MOV R3, #0
                MOV R4, #0
                MOV R5, #0
                MOV R6, #0
                MOV R7, #0
                MOV R8, #0
                MOV R9, #0
                MOV R10, #0
                MOV R11, #0
                MOV R12, #0
                
            TEST DCD 65537,65541,65545
            LDR R0, =TEST
            MOV R1, #476
            STR R1, [R0,#4]!
            LDR R2, [R0,#4]
            
          MOV R1, #0
          ADDMI R1, R1, #8
          ADDEQ R1, R1, #4
          ADDCS R1, R1, #2
          ADDVS R1, R1, #1
       