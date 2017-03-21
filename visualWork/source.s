
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
                LDR R0, =TEST
MOV	R1, #10
MOV R2, #20
MOV R3, #30
ADD R0 ,R0, #8
STMDA R0 , {R1,R1}
LDMFD R0, {R4,R5,R6}
          MOV R1, #0
          ADDMI R1, R1, #8
          ADDEQ R1, R1, #4
          ADDCS R1, R1, #2
          ADDVS R1, R1, #1
       