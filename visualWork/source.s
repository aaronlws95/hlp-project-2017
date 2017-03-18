
                TEST DCD 1,2,3,4,5,6,7,8,9,10
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
                LDR R9, =TEST

                            MOV R2, #931135488
STR R2, [R9, #8]!
LDR R8, [R9]
          MOV R1, #0
          ADDMI R1, R1, #8
          ADDEQ R1, R1, #4
          ADDCS R1, R1, #2
          ADDVS R1, R1, #1
       