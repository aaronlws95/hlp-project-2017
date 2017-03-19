define(["exports", "fable-core/umd/Symbol", "fable-core/umd/Util", "./MachineState", "fable-core/umd/Long", "fable-core/umd/String"], function (exports, _Symbol2, _Util, _MachineState, _Long, _String) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Extractor = exports.ProcessFlag = undefined;

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
                    type: "ARM7TDMI.EmulatorHelper.ProcessFlag.ProcessFlagType",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        ADD: ["number", "number", "number"],
                        ASR: ["number", "number", "number"],
                        LSL: ["number", "number", "number"],
                        LSR: ["number", "number", "number"],
                        OTHER: ["number"],
                        ROR: ["number", "number", "number"],
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
        (0, _Symbol2.setType)("ARM7TDMI.EmulatorHelper.ProcessFlag.ProcessFlagType", ProcessFlagType);

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
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), instruction.Fields[0] >>> 0 >= instruction.Fields[1] >>> 0 ? true : false, (((instruction.Fields[0] > 0 ? instruction.Fields[1] < 0 : false) ? instruction.Fields[2] < 0 : false) ? true : (instruction.Fields[0] < 0 ? instruction.Fields[1] > 0 : false) ? instruction.Fields[2] > 0 : false) ? true : false);
            } else if (instruction.Case === "SUBWC") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), (instruction.Fields[0] >>> 0 >= instruction.Fields[1] >>> 0 ? instruction.Fields[0] !== instruction.Fields[1] : false) ? true : false, (((instruction.Fields[0] > 0 ? instruction.Fields[1] < 0 : false) ? instruction.Fields[2] < 0 : false) ? true : (instruction.Fields[0] < 0 ? instruction.Fields[1] > 0 : false) ? instruction.Fields[2] > 0 : false) ? true : false);
            } else if (instruction.Case === "LSL") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), (((instruction.Fields[0] & -2147483648 >> instruction.Fields[1] - 1) === instruction.Fields[0] ? instruction.Fields[0] !== 0 ? instruction.Fields[1] !== 0 : false : false) ? instruction.Fields[1] < 31 : false) ? true : state.Flags.C, state.Flags.V);
            } else if (instruction.Case === "LSR") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), (((instruction.Fields[0] & 1 << instruction.Fields[1] - 1) === 1 << instruction.Fields[1] - 1 ? instruction.Fields[0] !== 0 ? instruction.Fields[1] !== 0 : false : false) ? instruction.Fields[1] < 31 : false) ? true : state.Flags.C, state.Flags.V);
            } else if (instruction.Case === "ASR") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), ((((instruction.Fields[0] & 1 << instruction.Fields[1] - 1) === 1 << instruction.Fields[1] - 1 ? instruction.Fields[0] !== 0 ? instruction.Fields[1] !== 0 : false : false) ? instruction.Fields[1] < 31 : false) ? true : instruction.Fields[1] > 31 ? instruction.Fields[0] < 0 : false) ? true : state.Flags.C, state.Flags.V);
            } else if (instruction.Case === "ROR") {
                return new _MachineState.Flags(N(instruction.Fields[2]), Z(instruction.Fields[2]), (((instruction.Fields[0] & 1 << instruction.Fields[1] - 1) === 1 << instruction.Fields[1] - 1 ? instruction.Fields[0] !== 0 ? instruction.Fields[1] !== 0 : false : false) ? instruction.Fields[1] < 31 : false) ? true : false, state.Flags.V);
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
});
//# sourceMappingURL=EmulatorHelper.js.map