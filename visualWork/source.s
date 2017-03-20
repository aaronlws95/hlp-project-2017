
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
                MOV R0, #0
MVNS R0, #173056
SBC R1, R0, R0
LSRS R1, R0, #150
ADD R1, R0, #25856
RSC R1, R1, R0
MVNS R1, R1
SBC R1, R0, R1
RORS R0, R1, #206
RSC R1, R1, #1476395011
ORR R1, R1, #8064
          MOV R1, #0
          ADDMI R1, R1, #8
          ADDEQ R1, R1, #4
          ADDCS R1, R1, #2
          ADDVS R1, R1, #1
       