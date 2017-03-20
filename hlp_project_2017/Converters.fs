namespace ARM7TDMI

module Converters=
    open InstructionType
    open MachineState
    open BasicActivePatterns

    //convert value option to addr
    let ValueOptToAddr (value:Option<Value>) =
        match value with
        | Some (x:int) -> Addr x
        | None -> failwith "R 15 has not been initialized or has been removed"

    //convert addr to value
    let AddrToValue (addr:Address) =
        match addr with
        | Addr (x:int) -> (x:Value)

    //check if one branch label returns bool for filter
    let IsBranch =
        function
        | [IsLabel x] -> true
        | _ -> false

    //check if one branch label returns bool for filter
    let IsNotBranch =
        function
        | [IsLabel x] -> false
        | _ -> true

    //FABLE does did not like Cond option option there this had to be added
    //Convert Cond to Cond option
    let CondCast =
        function
        | NoCond -> None
        | cond -> cond |> Some