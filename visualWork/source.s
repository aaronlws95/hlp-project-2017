
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
                
        TEST		DCD		65537,65541,65545,65549,65553,65557
		LDR		R0, =TEST
		MOV		R1, #1
		MOV		R2, #2
		MOV		R3, #3
        ADD     R0, R0, #12
		STMED	R0!, {R1,R2,R3}
		LDMFD	R0, {R4,R5,R6}
            
          MOV R1, #0
          ADDMI R1, R1, #8
          ADDEQ R1, R1, #4
          ADDCS R1, R1, #2
          ADDVS R1, R1, #1
       