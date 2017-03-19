define(["exports", "./ALUInstruction", "./SFInstruction", "./MEMInstruction", "./SHIFTInstruction", "./EmulatorHelper", "./InstructionType", "fable-core/umd/Map", "fable-core/umd/String", "./MachineState"], function (exports, _ALUInstruction, _SFInstruction, _MEMInstruction, _SHIFTInstruction, _EmulatorHelper, _InstructionType, _Map, _String, _MachineState) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;
    exports.executeLine = executeLine;

    function executeInstruction(state, instruction) {
        if (instruction.Case === "ALU") {
            return (0, _ALUInstruction.executeInstruction)(state, instruction.Fields[0], instruction.Fields[1]);
        } else if (instruction.Case === "SF") {
            return (0, _SFInstruction.executeInstruction)(state, instruction.Fields[0]);
        } else if (instruction.Case === "MEM") {
            return (0, _MEMInstruction.executeInstruction)(state, instruction.Fields[0]);
        } else if (instruction.Case === "SHIFT") {
            return (0, _SHIFTInstruction.executeInstruction)(state, instruction.Fields[0], instruction.Fields[1]);
        } else {
            throw new Error("C:\\Users\\AARON\\Documents\\GitHub\\hlp-project-2017\\hlp_project_2017\\Emulator.fs", 18, 18);
        }
    }

    function executeLine(state) {
        const programCounter = _EmulatorHelper.Extractor.extractRegister(state, new _InstructionType.RegOrLit("Reg", [new _InstructionType.Register("R", [15])]));

        const checkCondition = cond => {
            const $var8 = cond.Case === "EQ" ? [0] : cond.Case === "NE" ? [1] : cond.Case === "CS" ? [2] : cond.Case === "HS" ? [2] : cond.Case === "CC" ? [3] : cond.Case === "LO" ? [3] : cond.Case === "MI" ? [4] : cond.Case === "PL" ? [5] : cond.Case === "VS" ? [6] : cond.Case === "VC" ? [7] : cond.Case === "HI" ? [8] : cond.Case === "LS" ? [9] : cond.Case === "GE" ? [10] : cond.Case === "LT" ? [11] : cond.Case === "GT" ? [12] : cond.Case === "LE" ? [13] : cond.Case === "AL" ? [14] : [15];

            switch ($var8[0]) {
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
                    throw new Error("C:\\Users\\AARON\\Documents\\GitHub\\hlp-project-2017\\hlp_project_2017\\Emulator.fs", 26, 22);
            }
        };

        const instLine = (0, _Map.tryFind)(new _InstructionType.Address("Addr", [programCounter]), state.MemMap);
        let outputState;
        const $var9 = instLine != null ? instLine.Case === "Inst" ? instLine.Fields[0].Fields[1] != null ? instLine.Fields[0].Fields[2] == null ? [1, instLine.Fields[0].Fields[0], instLine.Fields[0].Fields[1]] : [3] : instLine.Fields[0].Fields[2] != null ? (() => {
            const inst_2 = instLine.Fields[0].Fields[0];
            const c_2 = instLine.Fields[0].Fields[2];
            return checkCondition(c_2) === true;
        })() ? [2, instLine.Fields[0].Fields[2], instLine.Fields[0].Fields[0]] : [3] : [0, instLine.Fields[0].Fields[0]] : [3] : [3];

        switch ($var9[0]) {
            case 0:
                outputState = executeInstruction(state, $var9[1]);
                break;

            case 1:
                outputState = executeInstruction(executeInstruction(state, new _InstructionType.InstructionType("SHIFT", [$var9[2], false])), $var9[1]);
                break;

            case 2:
                outputState = executeInstruction(state, $var9[2]);
                break;

            case 3:
                const $var10 = instLine != null ? instLine.Case === "Inst" ? instLine.Fields[0].Fields[1] != null ? instLine.Fields[0].Fields[2] != null ? (() => {
                    const sInst = instLine.Fields[0].Fields[1];
                    const inst_1 = instLine.Fields[0].Fields[0];
                    const c_1 = instLine.Fields[0].Fields[2];
                    return checkCondition(c_1) === true;
                })() ? [0, instLine.Fields[0].Fields[2], instLine.Fields[0].Fields[0], instLine.Fields[0].Fields[1]] : [1] : [1] : [1] : [1] : [1];

                switch ($var10[0]) {
                    case 0:
                        outputState = executeInstruction(executeInstruction(state, new _InstructionType.InstructionType("SHIFT", [$var10[3], false])), $var10[2]);
                        break;

                    case 1:
                        const $var11 = instLine != null ? instLine.Case === "Inst" ? instLine.Fields[0].Fields[2] != null ? (() => {
                            const inst = instLine.Fields[0].Fields[0];
                            const c = instLine.Fields[0].Fields[2];
                            return checkCondition(c) === false;
                        })() ? [0, instLine.Fields[0].Fields[2], instLine.Fields[0].Fields[0]] : [1] : [1] : [1] : [1];

                        switch ($var11[0]) {
                            case 0:
                                outputState = state;
                                break;

                            case 1:
                                if (instLine == null) {
                                    outputState = (0, _String.fsFormat)("run time error: no instruction line found at address %A")(x => {
                                        throw new Error(x);
                                    })((0, _Map.tryFind)(new _InstructionType.Register("R", [15]), state.RegMap));
                                } else {
                                    outputState = (0, _String.fsFormat)("run time error: instruction line not defined %A")(x => {
                                        throw new Error(x);
                                    })(instLine);
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

        if (matchValue_1.CompareTo(outputState.END) >= 0) {
            const State = new _MachineState.RunState("RunEND", []);
            return new _MachineState.MachineState(outputState.END, newRegMap, outputState.MemMap, outputState.Flags, State);
        } else {
            return new _MachineState.MachineState(outputState.END, newRegMap, outputState.MemMap, outputState.Flags, outputState.State);
        }
    }
});
//# sourceMappingURL=Emulator.js.map