namespace ARM7TDMI

module EmulatorHelper =
    open InstructionType 
    open MachineState
    /// ===========================================
    /// Processing flag functions
    /// ===========================================
    module ProcessFlag =
            /// types for processing flags 
            type ProcessFlagType = 
                | ADD of Value*Value*Value //op1 op2 result
                | SUB of Value*Value*Value //op1 op2 result
                | SUBWC of Value*Value*Value //op1 op2 result
                | LSL of Value*Value*Value // op1 op2 result
                | LSR of Value*Value*Value // op1 op2 result
                | ASR of Value*Value*Value // op1 op2 result
                | ROR of Value*Value*Value // op1 op2 result
                | OTHER of Value // result
            ///process and return new flags
            let processFlags (state:MachineState) (instruction:ProcessFlagType) =
                let N (res:Value) = if res < 0 then true else false //set if negative
                let Z (res:Value) = if res = 0 then true else false //set if zero
                match instruction with
                | ADD(op1,op2,res) ->  {    N = N res 
                                            Z = Z res
                                            //set carry if result is greater than or equal to 2^32
                                            C = if uint64(uint32(op1)) + uint64(uint32(op2)) >= 4294967296UL then true else false 
                                            //set overflow if adding two same signed values results in a result of a different sign
                                            V = if (op1<0 && op2<0 && res>=0) || (op1>0 && op2>0 && res< 0) then true else false }
                | SUB(op1,op2,res) ->  { 
                                            N = N res 
                                            Z = Z res
                                            //set carry if result is >=0   
                                            C = if uint32(op1) >= uint32(op2) then true else false 
                                            //set overflow if subtracting +ve from -ve generates a +ve or subtracting -ve from +ve generates a -ve
                                            V = if ((op1>0 && op2<0 && res<0) || (op1<0 && op2>0 && res>0))then true else false
                                        }
                | SUBWC(op1,op2,res) ->  { 
                                            N = N res 
                                            Z = Z res
                                            //set carry if result is >=0   
                                            C = if uint32(op1) >= uint32(op2) && (op1 <> op2) then true else false 
                                            //set overflow if subtracting +ve from -ve generates a +ve or subtracting -ve from +ve generates a -ve
                                            V = if ((op1>0 && op2<0 && res<0) || (op1<0 && op2>0 && res>0))then true else false
                                        }
                | LSL(op1,op2,res) -> {   
                                                N = N res
                                                Z = Z res
                                                C = if (op1 &&& (0x80000000 >>> (op2-1)) = op1) && (op1 <> 0 && op2 <> 0) && op2 <31 then true else (if op2 = 0 then state.Flags.C else false)
                                                V = state.Flags.V
                                            }
                                            
                | LSR(op1,op2,res) -> {
                                                N = N res
                                                Z = Z res
                                                //set carry if 1 is shifted out
                                                C = if ((op1 &&& (1 <<< (op2-1))) = (1 <<< (op2-1))) && (op1 <> 0 && op2 <> 0) && op2 <31  then true else (if op2 = 0 then state.Flags.C else false)
                                                V = state.Flags.V
                                             }
                | ASR(op1,op2,res) -> {
                                                N = N res
                                                Z = Z res
                                                //set carry if 1 is shifted out
                                                C = if (((op1 &&& (1 <<< (op2-1))) = (1 <<< (op2-1))) && (op1 <> 0 && op2 <> 0) && op2<31) || (op2 >31 && op1 <0) then true else (if op2 = 0 then state.Flags.C else false)
                                                V = state.Flags.V
                                             }
                | ROR(op1,op2,res) -> {
                                                N = N res
                                                Z = Z res
                                                //set carry if 1 is shifted out
                                                C = if ((op1 &&& (1 <<< (op2%32-1))) = (1 <<< (op2%32-1))) && (op1 <> 0 && op2 <> 0) then true else (if op2 = 0 then state.Flags.C else false)
                                                V = state.Flags.V
                                              }
                | OTHER(res) ->        {
                                            N = N res
                                            Z = Z res
                                            C = state.Flags.C
                                            V = state.Flags.V
                                        }
    
    /// ===========================================
    /// Extracting functions
    /// ===========================================
    module Extractor = 
        /// extract value from register
        let extractRegister (state:MachineState) (rol:RegOrLit) = 
                match rol with
                | Reg r -> state.RegMap.[r]
                | Lit l -> l
            /// extract value from memory
        let isValidAddress (state:MachineState) (addr:Address) =
                match state.MemMap.TryFind addr with
                | Some (Val v) -> true
                | Some (Inst i) -> false
                | None -> false
        /// extract value from memory
        let extractMemory (state:MachineState) (addr:Address) =
                let checkValidAddr =
                    function
                    | Val v -> v
                    | Inst i -> failwithf "invalid address" 
                state.MemMap.[addr]
                |> checkValidAddr
        /// get value of address
        let getAddressValue (Addr a:Address) = a
