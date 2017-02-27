﻿namespace ARM7TDMI

module Parser=

    open Emulator

    let whiteSpace = [| ' '; '\f'; '\t'; '\r' |]
        
    /// matches string returning integer
    let (|IsLit|_|) (s:string) = 
        try 
            int s |> Some
        with _ -> None
    /// matches string returning integer
    let (|IsReg|_|) s =
        let ParseToReg =
            function
            | "R0" -> R 0
            | "R1" -> R 1
            | "R2" -> R 2
            (*
            | "R3" -> R3
            | "R4" -> R4
            *)
            //exception
            | _ -> invalidOp "register does not exist"  
        try 
            ParseToReg s |> Some
        with _ -> None
    /// matches RegOrLit string returning the RegOrLit
    
    let (|IsRegOrLit|_|) s =
        let parse=
            function
            | IsReg reg -> Reg(reg)
            | IsLit lit -> Lit(lit)
            | _ -> invalidOp "message"
        try
            parse s |> Some
        with _ -> None
        
        

    let readAsm = 
            let splitIntoWords (s:string) = 
                s.Split whiteSpace 
                |> Array.filter ((<>) "") // delete empty strings generated by default .Split function
            let executeWordsAsCommand = function
                | [ "MOV"; IsReg reg1; IsReg reg2 ] -> MOV(reg1,Reg(reg2))
                | [ "MOV"; IsReg reg; IsLit n ] -> MOV(reg,Lit(n))
//                | [ "ADD"; IsReg reg1; IsReg reg2; IsReg reg3 ] -> ADD(reg1,Reg(reg2),Reg(reg3))
//                | [ "ADD"; IsReg reg1; IsReg reg2; IsLit n ] -> ADD(reg1,Reg(reg2),Lit(n))
//                | [ "SUB"; IsReg reg1; IsReg reg2; IsReg reg3 ] -> SUB(reg1,Reg(reg2),Reg(reg3))
//                | [ "SUB"; IsReg reg1; IsReg reg2; IsLit n ] -> SUB(reg1,Reg(reg2),Lit(n))
                | _ -> SYNTAXERR("error")        
                 
            splitIntoWords
            >> Array.toList
            >> executeWordsAsCommand

