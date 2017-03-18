define(["exports", "fable-core/umd/Symbol", "fable-core/umd/Util", "./MachineState", "fable-core/umd/Long", "fable-core/umd/String", "fable-core/umd/Map", "./InstructionType", "fable-core/umd/Seq", "fable-core/umd/List"], function (exports, _Symbol2, _Util, _MachineState, _Long, _String, _Map, _InstructionType, _Seq, _List) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Instruction = exports.SHIFTInstruction = exports.MEMInstruction = exports.SFInstruction = exports.ALUInstruction = exports.Extractor = exports.ProcessFlag = undefined;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const ProcessFlag = exports.ProcessFlag = function (__exports) {
        const ProcessFlagType = __exports.ProcessFlagType = class ProcessFlagType {
            constructor(caseName, fields) {
                this.Case = caseName;
                this.Fields = fields;
            }

            [_Symbol3.default.reflection]() {
                return {
                    type: "ARM7TDMI.Emulator.ProcessFlag.ProcessFlagType",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        ADD: ["number", "number", "number"],
                        LEFTSHIFT: ["number", "number", "number"],
                        OTHER: ["number"],
                        RIGHTSHIFT: ["number", "number", "number"],
                        SUB: ["number", "number", "number"],
                        SUBWC: ["number", "number", "number"]
                    }
                };
            }

            Equals(other) {
                return (0, _Util.equalsUnions)(this, other);
            }

            CompareTo(other) {
                return (0, _Util.compareUnions)(this, other);
            }

        };
        (0, _Symbol2.setType)("ARM7TDMI.Emulator.ProcessFlag.ProcessFlagType", ProcessFlagType);

        const processFlags = __exports.processFlags = function (state, instruction) {
            const N = res => {
                if (res < 0) {
                    return true;
                } else {
                    return false;
                }
            };

            const Z = res_1 => {
                if (res_1 === 0) {
                    return true;
                } else {
                    return false;
                }
            };

            if (instruction.Case === "SUB") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), ((instruction.Fields[0] >= instruction.Fields[1] ? instruction.Fields[2] <= instruction.Fields[0] : false) ? true : instruction.Fields[0] === instruction.Fields[1]) ? true : false, (((instruction.Fields[0] > 0 ? instruction.Fields[1] < 0 : false) ? instruction.Fields[2] < 0 : false) ? true : (instruction.Fields[0] < 0 ? instruction.Fields[1] > 0 : false) ? instruction.Fields[2] > 0 : false) ? true : false);
            } else if (instruction.Case === "SUBWC") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), ((instruction.Fields[0] + state.Flags.C - 1 >= instruction.Fields[1] ? instruction.Fields[2] <= instruction.Fields[0] + state.Flags.C - 1 : false) ? true : instruction.Fields[0] + state.Flags.C - 1 === instruction.Fields[1]) ? true : false, (((instruction.Fields[0] > 0 ? instruction.Fields[1] < 0 : false) ? instruction.Fields[2] < 0 : false) ? true : (instruction.Fields[0] < 0 ? instruction.Fields[1] > 0 : false) ? instruction.Fields[2] > 0 : false) ? true : false);
            } else if (instruction.Case === "LEFTSHIFT") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), ((instruction.Fields[0] & -2147483648 >> instruction.Fields[1] - 1) === instruction.Fields[0] ? instruction.Fields[0] !== 0 ? instruction.Fields[1] !== 0 : false : false) ? true : false, state.Flags.V);
            } else if (instruction.Case === "RIGHTSHIFT") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), ((instruction.Fields[0] & 1 << instruction.Fields[1] - 1) === instruction.Fields[0] ? instruction.Fields[0] !== 0 ? instruction.Fields[1] !== 0 : false : false) ? true : false, state.Flags.V);
            } else if (instruction.Case === "OTHER") {
                return new _MachineState.Flags(N(instruction.Fields[0]), Z(instruction.Fields[0]), state.Flags.C, state.Flags.V);
            } else {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), (0, _Long.fromNumber)(instruction.Fields[0] >>> 0, true).add((0, _Long.fromNumber)(instruction.Fields[1] >>> 0, true)).CompareTo((0, _Long.fromBits)(0, 1, true)) >= 0 ? true : false, (((instruction.Fields[0] < 0 ? instruction.Fields[1] < 0 : false) ? instruction.Fields[2] >= 0 : false) ? true : (instruction.Fields[0] > 0 ? instruction.Fields[1] > 0 : false) ? instruction.Fields[2] < 0 : false) ? true : false);
            }
        };

        return __exports;
    }({});

    const Extractor = exports.Extractor = function (__exports) {
        const extractRegister = __exports.extractRegister = function (state, rol) {
            if (rol.Case === "Lit") {
                return rol.Fields[0];
            } else {
                return state.RegMap.get(rol.Fields[0]);
            }
        };

        const extractMemory = __exports.extractMemory = function (state, addr) {
            const checkValidAddr = _arg1 => {
                if (_arg1.Case === "Inst") {
                    return (0, _String.fsFormat)("invalid address")(x => {
                        throw new Error(x);
                    });
                } else {
                    return _arg1.Fields[0];
                }
            };

            return checkValidAddr(state.MemMap.get(addr));
        };

        const getAddressValue = __exports.getAddressValue = function (_arg1) {
            return _arg1.Fields[0];
        };

        return __exports;
    }({});

    const ALUInstruction = exports.ALUInstruction = function (__exports) {
        const updateRegister = function (state, dest, op2, s) {
            const newRegMap = (0, _Map.add)(dest, op2, state.RegMap);
            const newFlags = s ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("OTHER", [op2])) : state.Flags;
            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
        };

        const add = function (state, dest, op1, op2, res, s) {
            const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
            const newFlags = s ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("ADD", [op1, op2, res])) : state.Flags;
            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
        };

        const sub = function (state, dest, op1, op2, res, s) {
            const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
            const newFlags = s ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("SUB", [op1, op2, res])) : state.Flags;
            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
        };

        const subwc = function (state, dest, op1, op2, res, s) {
            const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
            const newFlags = s ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("SUBWC", [op1, op2, res])) : state.Flags;
            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
        };

        const executeInstruction = __exports.executeInstruction = function (state, instruction, s) {
            const er = rol => {
                return Extractor.extractRegister(state, rol);
            };

            if (instruction.Case === "ADD") {
                return add(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) + er(instruction.Fields[2]), s);
            } else if (instruction.Case === "SUB") {
                return sub(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) - er(instruction.Fields[2]), s);
            } else if (instruction.Case === "MVN") {
                return updateRegister(state, instruction.Fields[0], ~er(instruction.Fields[1]), s);
            } else if (instruction.Case === "EOR") {
                return updateRegister(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]) ^ er(instruction.Fields[2]), s);
            } else if (instruction.Case === "RSB") {
                return sub(state, instruction.Fields[0], er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]) - state.RegMap.get(instruction.Fields[1]), s);
            } else if (instruction.Case === "RSC") {
                return subwc(state, instruction.Fields[0], er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]) - state.RegMap.get(instruction.Fields[1]) + state.Flags.C - 1, s);
            } else if (instruction.Case === "ADC") {
                return add(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) + er(instruction.Fields[2]) + state.Flags.C, s);
            } else if (instruction.Case === "SBC") {
                return subwc(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) - er(instruction.Fields[2]) + state.Flags.C - 1, s);
            } else if (instruction.Case === "BIC") {
                return updateRegister(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]) & ~er(instruction.Fields[2]), s);
            } else if (instruction.Case === "ORR") {
                return updateRegister(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]) | er(instruction.Fields[2]), s);
            } else {
                return updateRegister(state, instruction.Fields[0], er(instruction.Fields[1]), s);
            }
        };

        return __exports;
    }({});

    const SFInstruction = exports.SFInstruction = function (__exports) {
        const executeInstruction = __exports.executeInstruction = function (state, instruction) {
            const er = rol => {
                return Extractor.extractRegister(state, rol);
            };

            const newFlags = instruction.Case === "TEQ" ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("OTHER", [state.RegMap.get(instruction.Fields[0]) ^ er(instruction.Fields[1])])) : instruction.Case === "CMP" ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("SUB", [state.RegMap.get(instruction.Fields[0]), er(instruction.Fields[1]), state.RegMap.get(instruction.Fields[0]) - er(instruction.Fields[1])])) : instruction.Case === "CMN" ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("ADD", [state.RegMap.get(instruction.Fields[0]), er(instruction.Fields[1]), state.RegMap.get(instruction.Fields[0]) + er(instruction.Fields[1])])) : ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("OTHER", [state.RegMap.get(instruction.Fields[0]) & er(instruction.Fields[1])]));
            return new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, newFlags, state.State);
        };

        return __exports;
    }({});

    const MEMInstruction = exports.MEMInstruction = function (__exports) {
        const adr = function (state, dest, exp) {
            const newRegMap = (0, _Map.add)(dest, exp, state.RegMap);
            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, state.Flags, state.State);
        };

        const ldr = function (state, dest, source, offset, autoIndex, s) {
            const em = addr => {
                return Extractor.extractMemory(state, addr);
            };

            let newRegMap;
            const loadRegMap = (0, _Map.add)(dest, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + offset])), state.RegMap);

            if (!dest.Equals(source)) {
                newRegMap = (0, _Map.add)(source, loadRegMap.get(source) + autoIndex, loadRegMap);
            } else {
                newRegMap = loadRegMap;
            }

            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, state.Flags, state.State);
        };

        const ldm = function (state, dir, source, regList, writeBack) {
            const em = addr => {
                return Extractor.extractMemory(state, addr);
            };

            let patternInput;
            const $var6 = dir.Case === "IB" ? [0] : dir.Case === "FD" ? [1] : dir.Case === "IA" ? [1] : dir.Case === "EA" ? [2] : dir.Case === "DB" ? [2] : dir.Case === "FA" ? [3] : dir.Case === "DA" ? [3] : [0];

            switch ($var6[0]) {
                case 0:
                    patternInput = (0, _Seq.fold)((tupledArg, elem) => [(0, _Map.add)(elem, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg[1] + 4])), tupledArg[0]), tupledArg[1] + 4], [state.RegMap, 0], regList);
                    break;

                case 1:
                    patternInput = (0, _Seq.fold)((tupledArg_1, elem_1) => [(0, _Map.add)(elem_1, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_1[1]])), tupledArg_1[0]), tupledArg_1[1] + 4], [state.RegMap, 0], regList);
                    break;

                case 2:
                    patternInput = (0, _Seq.fold)((tupledArg_2, elem_2) => [(0, _Map.add)(elem_2, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_2[1] - 4])), tupledArg_2[0]), tupledArg_2[1] - 4], [state.RegMap, 0], (0, _List.reverse)(regList));
                    break;

                case 3:
                    patternInput = (0, _Seq.fold)((tupledArg_3, elem_3) => [(0, _Map.add)(elem_3, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_3[1]])), tupledArg_3[0]), tupledArg_3[1] - 4], [state.RegMap, 0], (0, _List.reverse)(regList));
                    break;
            }

            if (writeBack) {
                const RegMap = (0, _Map.add)(source, state.RegMap.get(source) + patternInput[1], patternInput[0]);
                return new _MachineState.MachineState(state.END, RegMap, state.MemMap, state.Flags, state.State);
            } else {
                return new _MachineState.MachineState(state.END, patternInput[0], state.MemMap, state.Flags, state.State);
            }
        };

        const str = function (state, source, dest, offset, autoIndex, s) {
            const newMemMap = (0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + offset]), new _InstructionType.Memory("Val", [source]), state.MemMap);
            const newRegMap = (0, _Map.add)(dest, state.RegMap.get(dest) + autoIndex, state.RegMap);
            return new _MachineState.MachineState(state.END, newRegMap, newMemMap, state.Flags, state.State);
        };

        const stm = function (state, dir, dest, regList, writeBack) {
            let patternInput;
            const $var7 = dir.Case === "IB" ? [0] : dir.Case === "FD" ? [1] : dir.Case === "IA" ? [1] : dir.Case === "EA" ? [2] : dir.Case === "DB" ? [2] : dir.Case === "FA" ? [3] : dir.Case === "DA" ? [3] : [0];

            switch ($var7[0]) {
                case 0:
                    patternInput = (0, _Seq.fold)((tupledArg, elem) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg[1]]), new _InstructionType.Memory("Val", [state.RegMap.get(elem)]), tupledArg[0]), tupledArg[1] - 4], [state.MemMap, 0], (0, _List.reverse)(regList));
                    break;

                case 1:
                    patternInput = (0, _Seq.fold)((tupledArg_1, elem_1) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg_1[1] - 4]), new _InstructionType.Memory("Val", [state.RegMap.get(elem_1)]), tupledArg_1[0]), tupledArg_1[1] - 4], [state.MemMap, 0], (0, _List.reverse)(regList));
                    break;

                case 2:
                    patternInput = (0, _Seq.fold)((tupledArg_2, elem_2) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg_2[1]]), new _InstructionType.Memory("Val", [state.RegMap.get(elem_2)]), tupledArg_2[0]), tupledArg_2[1] + 4], [state.MemMap, 0], regList);
                    break;

                case 3:
                    patternInput = (0, _Seq.fold)((tupledArg_3, elem_3) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg_3[1] + 4]), new _InstructionType.Memory("Val", [state.RegMap.get(elem_3)]), tupledArg_3[0]), tupledArg_3[1] + 4], [state.MemMap, 0], regList);
                    break;
            }

            const newRegMap = writeBack ? (0, _Map.add)(dest, state.RegMap.get(dest) + patternInput[1], state.RegMap) : state.RegMap;
            return new _MachineState.MachineState(state.END, newRegMap, patternInput[0], state.Flags, state.State);
        };

        const executeInstruction = __exports.executeInstruction = function (state, instruction) {
            const er = rol => {
                return Extractor.extractRegister(state, rol);
            };

            const ga = arg00_ => {
                return Extractor.getAddressValue(arg00_);
            };

            if (instruction.Case === "LDR") {
                return ldr(state, instruction.Fields[0], instruction.Fields[1], er(instruction.Fields[2]), er(instruction.Fields[3]), instruction.Fields[4]);
            } else if (instruction.Case === "STR") {
                return str(state, state.RegMap.get(instruction.Fields[0]), instruction.Fields[1], er(instruction.Fields[2]), er(instruction.Fields[3]), instruction.Fields[4]);
            } else if (instruction.Case === "LDM") {
                return ldm(state, instruction.Fields[0], instruction.Fields[1], instruction.Fields[2], instruction.Fields[3]);
            } else if (instruction.Case === "STM") {
                return stm(state, instruction.Fields[0], instruction.Fields[1], instruction.Fields[2], instruction.Fields[3]);
            } else {
                return adr(state, instruction.Fields[0], ga(instruction.Fields[1]));
            }
        };

        return __exports;
    }({});

    const SHIFTInstruction = exports.SHIFTInstruction = function (__exports) {
        const shiftRight = function (state, dest, op1, op2, res, s) {
            const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
            const newFlags = s ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("RIGHTSHIFT", [state.RegMap.get(op1), op2, res])) : state.Flags;
            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
        };

        const shiftLeft = function (state, dest, op1, op2, res, s) {
            const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
            const newFlags = s ? ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("LEFTSHIFT", [state.RegMap.get(op1), op2, res])) : state.Flags;
            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
        };

        const rrx = function (state, dest, exp, s) {
            const newExp = (exp >> 1) + (state.Flags.C << 31);
            const newRegMap = (0, _Map.add)(dest, newExp, state.RegMap);
            const newC = (exp & 1) === 1 ? true : false;
            let newFlags;

            if (s) {
                const inputRecord = ProcessFlag.processFlags(state, new ProcessFlag.ProcessFlagType("OTHER", [newExp]));
                newFlags = new _MachineState.Flags(inputRecord.N, inputRecord.Z, newC, inputRecord.V);
            } else {
                newFlags = state.Flags;
            }

            return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
        };

        const executeInstruction = __exports.executeInstruction = function (state, instruction, s) {
            const er = rol => {
                return Extractor.extractRegister(state, rol);
            };

            if (instruction.Case === "LSR") {
                return shiftRight(state, instruction.Fields[0], instruction.Fields[1], er(instruction.Fields[2]), ~~(state.RegMap.get(instruction.Fields[1]) >>> 0 >>> er(instruction.Fields[2])), s);
            } else if (instruction.Case === "ASR") {
                return shiftRight(state, instruction.Fields[0], instruction.Fields[1], er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) >> er(instruction.Fields[2]), s);
            } else if (instruction.Case === "ROR") {
                return shiftRight(state, instruction.Fields[0], instruction.Fields[1], er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) >> er(instruction.Fields[2]) | state.RegMap.get(instruction.Fields[1]) << 32 - er(instruction.Fields[2]), s);
            } else if (instruction.Case === "RRX") {
                return rrx(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), s);
            } else {
                return shiftLeft(state, instruction.Fields[0], instruction.Fields[1], er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) << er(instruction.Fields[2]), s);
            }
        };

        return __exports;
    }({});

    const Instruction = exports.Instruction = function (__exports) {
        const executeInstruction = __exports.executeInstruction = function (state, instruction) {
            if (instruction.Case === "ALU") {
                return ALUInstruction.executeInstruction(state, instruction.Fields[0], instruction.Fields[1]);
            } else if (instruction.Case === "SF") {
                return SFInstruction.executeInstruction(state, instruction.Fields[0]);
            } else if (instruction.Case === "MEM") {
                return MEMInstruction.executeInstruction(state, instruction.Fields[0]);
            } else if (instruction.Case === "SHIFT") {
                return SHIFTInstruction.executeInstruction(state, instruction.Fields[0], instruction.Fields[1]);
            } else {
                throw new Error("C:\\Users\\Santiago\\Rubio 2016\\4th year\\4th year modules\\HLP\\Project\\hlp-project-2017\\hlp_project_2017\\Emulator.fs", 229, 18);
            }
        };

        const executeLine = __exports.executeLine = function (state) {
            const programCounter = Extractor.extractRegister(state, new _InstructionType.RegOrLit("Reg", [new _InstructionType.Register("R", [15])]));

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
                        throw new Error("C:\\Users\\Santiago\\Rubio 2016\\4th year\\4th year modules\\HLP\\Project\\hlp-project-2017\\hlp_project_2017\\Emulator.fs", 237, 22);
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
        };

        return __exports;
    }({});
});
//# sourceMappingURL=Emulator.js.map