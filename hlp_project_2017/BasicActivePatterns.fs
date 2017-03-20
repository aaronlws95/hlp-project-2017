namespace ARM7TDMI

module BasicActivePatterns=
    open InstructionType
    open MachineState

     /// matches string (X -> X) returning integer
    let (|IsInt|_|) (s:string) = 
        try 
            int s |> Some
        with _ -> None

     /// matches string list returning Int list
    let rec (|IsIntList|_|) (lst:string list) = 
        match lst with
        | IsInt value::IsIntList rest -> value::rest |> Some
        | [IsInt value] -> [value] |> Some
        | [] -> [] |> Some
        | _ -> None

    ///matches string (#X->X) returning integer
    let (|IsLit|_|) (s:string) = 
        let getX = s.[1..] 
        if s.[0]='#'
        then
            match getX with
            | IsInt x -> Some(x)
            | _ -> None
        else
            None

     /// matches string returning register
    let (|IsReg|_|) (s:string) =
        if s.Length>1
        then
            let getX = s.[1..] 
            if s.[0]='R'
            then
                match getX with
                | IsInt x when x<=15 -> R(x) |> Some
                | _ -> None
            else
                None
        else
            None

    /// matches string list returning register list
    let rec (|IsRegList|_|) (lst:string list) = 
        match lst with
        | IsReg reg::IsRegList rest -> reg::rest |> Some
        | [IsReg reg] -> [reg] |> Some
        | [] -> [] |> Some
        | _ -> None

    /// matches RegOrLit string returning the RegOrLit
    let (|IsRegOrLit|_|) =
        function
        | IsReg reg -> Reg(reg) |> Some
        | IsLit lit -> Lit(lit) |> Some
        | _ -> None

     /// matches label (not reg) returning string
    let (|IsLabel|_|) = 
        function
        | IsReg x -> None
        | s -> 
            try 
                string s |> Some 
            with _ -> None

    ///matches Addr label or addr literal
    let (|IsAddr|_|) (b_map:Map<string,Address>) (s:string) = 
        match s with
        | IsInt x -> Some(Addr(x))
        | x -> b_map.TryFind(x)
            
    //Prefix to split a word in two
    let (|Prefix|_|) (p:string) (s:string) =
        if s.StartsWith(p) then
            Some(s.Substring(p.Length))
        else
            None
