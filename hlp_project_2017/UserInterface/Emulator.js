define(["exports", "./SFInstruction", "./MEMInstruction", "./SHIFTInstruction", "./BRANCHInstruction", "./LABELInstruction", "./MachineState", "./ALUInstruction", "./EmulatorHelper", "./InstructionType", "fable-core/umd/Map", "fable-core/umd/Util"], function (exports, _SFInstruction, _MEMInstruction, _SHIFTInstruction, _BRANCHInstruction, _LABELInstruction, _MachineState, _ALUInstruction, _EmulatorHelper, _InstructionType, _Map, _Util) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;
    exports.executeLine = executeLine;

    function executeInstruction(state, instruction) {
        if (instruction.Case === "SF") {
            return (0, _SFInstruction.executeInstruction)(state, instruction.Fields[0]);
        } else if (instruction.Case === "MEM") {
            return (0, _MEMInstruction.executeInstruction)(state, instruction.Fields[0]);
        } else if (instruction.Case === "SHIFT") {
            return (0, _SHIFTInstruction.executeInstruction)(state, instruction.Fields[0], instruction.Fields[1]);
        } else if (instruction.Case === "BRANCH") {
            return (0, _BRANCHInstruction.executeInstruction)(state, instruction.Fields[0]);
        } else if (instruction.Case === "LABEL") {
            return (0, _LABELInstruction.executeInstruction)(state, instruction.Fields[0]);
        } else if (instruction.Case === "END") {
            const State = new _MachineState.RunState("RunEND", []);
            return new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, state.Flags, State);
        } else {
            return (0, _ALUInstruction.executeInstruction)(state, instruction.Fields[0], instruction.Fields[1]);
        }
    }

    function executeLine(state) {
        const programCounter = _EmulatorHelper.Extractor.extractRegister(state, new _InstructionType.RegOrLit("Reg", [new _InstructionType.Register("R", [15])]));

        const checkCondition = cond => {
            const $var9 = cond.Case === "NE" ? [1] : cond.Case === "CS" ? [2] : cond.Case === "HS" ? [2] : cond.Case === "CC" ? [3] : cond.Case === "LO" ? [3] : cond.Case === "MI" ? [4] : cond.Case === "PL" ? [5] : cond.Case === "VS" ? [6] : cond.Case === "VC" ? [7] : cond.Case === "HI" ? [8] : cond.Case === "LS" ? [9] : cond.Case === "GE" ? [10] : cond.Case === "LT" ? [11] : cond.Case === "GT" ? [12] : cond.Case === "LE" ? [13] : cond.Case === "AL" ? [14] : cond.Case === "NoCond" ? [15] : [0];

            switch ($var9[0]) {
                case 0:
                    return state.Flags.Z === true;

                case 1:
                    return state.Flags.Z === false;

                case 2:
                    return state.Flags.C === true;

                case 3:
                    return state.Flags.C === false;

                case 4:
                    return state.Flags.N === true;

                case 5:
                    return state.Flags.N === false;

                case 6:
                    return state.Flags.V === true;

                case 7:
                    return state.Flags.V === false;

                case 8:
                    if (state.Flags.C === true) {
                        return state.Flags.Z === false;
                    } else {
                        return false;
                    }

                case 9:
                    if (state.Flags.C === false) {
                        return state.Flags.Z === true;
                    } else {
                        return false;
                    }

                case 10:
                    return state.Flags.N === state.Flags.V;

                case 11:
                    return !(state.Flags.N === state.Flags.V);

                case 12:
                    if (state.Flags.Z === false) {
                        return state.Flags.N === state.Flags.V;
                    } else {
                        return false;
                    }

                case 13:
                    if (state.Flags.Z === true) {
                        return !(state.Flags.N === state.Flags.V);
                    } else {
                        return false;
                    }

                case 14:
                    return true;

                case 15:
                    return true;
            }
        };

        const instLine = (0, _Map.tryFind)(new _InstructionType.Address("Addr", [programCounter]), state.MemMap);
        let outputState;
        const $var10 = instLine != null ? instLine.Case === "Inst" ? instLine.Fields[0].Case === "Line" ? instLine.Fields[0].Fields[1] != null ? instLine.Fields[0].Fields[2] == null ? [1, instLine.Fields[0].Fields[0], instLine.Fields[0].Fields[1]] : [3] : instLine.Fields[0].Fields[2] != null ? (() => {
            const inst_2 = instLine.Fields[0].Fields[0];
            const c_2 = instLine.Fields[0].Fields[2];
            return checkCondition(c_2) === true;
        })() ? [2, instLine.Fields[0].Fields[2], instLine.Fields[0].Fields[0]] : [3] : [0, instLine.Fields[0].Fields[0]] : [3] : [3] : [3];

        switch ($var10[0]) {
            case 0:
                outputState = executeInstruction(state, $var10[1]);
                break;

            case 1:
                outputState = executeInstruction(executeInstruction(state, new _InstructionType.InstructionType("SHIFT", [$var10[2], false])), $var10[1]);
                break;

            case 2:
                outputState = executeInstruction(state, $var10[2]);
                break;

            case 3:
                const $var11 = instLine != null ? instLine.Case === "Inst" ? instLine.Fields[0].Case === "Line" ? instLine.Fields[0].Fields[1] != null ? instLine.Fields[0].Fields[2] != null ? (() => {
                    const sInst = instLine.Fields[0].Fields[1];
                    const inst_1 = instLine.Fields[0].Fields[0];
                    const c_1 = instLine.Fields[0].Fields[2];
                    return checkCondition(c_1) === true;
                })() ? [0, instLine.Fields[0].Fields[2], instLine.Fields[0].Fields[0], instLine.Fields[0].Fields[1]] : [1] : [1] : [1] : [1] : [1] : [1];

                switch ($var11[0]) {
                    case 0:
                        outputState = executeInstruction(executeInstruction(state, new _InstructionType.InstructionType("SHIFT", [$var11[3], false])), $var11[2]);
                        break;

                    case 1:
                        const $var12 = instLine != null ? instLine.Case === "Inst" ? instLine.Fields[0].Case === "Line" ? instLine.Fields[0].Fields[2] != null ? (() => {
                            const inst = instLine.Fields[0].Fields[0];
                            const c = instLine.Fields[0].Fields[2];
                            return checkCondition(c) === false;
                        })() ? [0, instLine.Fields[0].Fields[2], instLine.Fields[0].Fields[0]] : [1] : [1] : [1] : [1] : [1];

                        switch ($var12[0]) {
                            case 0:
                                outputState = state;
                                break;

                            case 1:
                                const $var13 = instLine != null ? instLine.Case === "Inst" ? instLine.Fields[0].Case === "Failed_Parsing" ? [1, instLine.Fields[0].Fields[0]] : [2, instLine] : [2, instLine] : [0];

                                switch ($var13[0]) {
                                    case 0:
                                        const State = new _MachineState.RunState("RunTimeErr", ["No instruction line found at address " + (0, _Util.toString)((0, _Map.tryFind)(new _InstructionType.Register("R", [15]), state.RegMap))]);
                                        outputState = new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, state.Flags, State);
                                        break;

                                    case 1:
                                        const State_1 = new _MachineState.RunState("SyntaxErr", [$var13[1]]);
                                        outputState = new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, state.Flags, State_1);
                                        break;

                                    case 2:
                                        const State_2 = new _MachineState.RunState("RunTimeErr", ["Instruction line not defined: " + (0, _Util.toString)($var13[1])]);
                                        outputState = new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, state.Flags, State_2);
                                        break;
                                }

                                break;
                        }

                        break;
                }

                break;
        }

        let newRegMap;
        const matchValue = outputState.RegMap.get(new _InstructionType.Register("R", [15]));

        if (matchValue === state.RegMap.get(new _InstructionType.Register("R", [15]))) {
            newRegMap = (0, _Map.add)(new _InstructionType.Register("R", [15]), matchValue + 4, outputState.RegMap);
        } else {
            newRegMap = outputState.RegMap;
        }

        const matchValue_1 = new _InstructionType.Address("Addr", [newRegMap.get(new _InstructionType.Register("R", [15]))]);

        if (!outputState.State.Equals(new _MachineState.RunState("RunOK", []))) {
            return outputState;
        } else if (matchValue_1.CompareTo(outputState.END) >= 0) {
            const State_3 = new _MachineState.RunState("RunEND", []);
            return new _MachineState.MachineState(outputState.END, newRegMap, outputState.MemMap, outputState.Flags, State_3);
        } else {
            return new _MachineState.MachineState(outputState.END, newRegMap, outputState.MemMap, outputState.Flags, outputState.State);
        }
    }
});
//# sourceMappingURL=Emulator.js.map