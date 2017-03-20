define(["exports", "fable-core/umd/Symbol", "fable-core/umd/Util", "./InstructionType", "fable-core/umd/Map"], function (exports, _Symbol2, _Util, _InstructionType, _Map2) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MachineState = exports.Flags = exports.RunState = undefined;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    var _Map3 = _interopRequireDefault(_Map2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    class RunState {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.MachineState.RunState",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    RunEND: [],
                    RunOK: [],
                    RunTimeErr: ["string"],
                    SyntaxErr: ["string"]
                }
            };
        }

        Equals(other) {
            return (0, _Util.equalsUnions)(this, other);
        }

        CompareTo(other) {
            return (0, _Util.compareUnions)(this, other);
        }

    }

    exports.RunState = RunState;
    (0, _Symbol2.setType)("ARM7TDMI.MachineState.RunState", RunState);

    class Flags {
        constructor(n, z, c, v) {
            this.N = n;
            this.Z = z;
            this.C = c;
            this.V = v;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.MachineState.Flags",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    N: "boolean",
                    Z: "boolean",
                    C: "boolean",
                    V: "boolean"
                }
            };
        }

        Equals(other) {
            return (0, _Util.equalsRecords)(this, other);
        }

        CompareTo(other) {
            return (0, _Util.compareRecords)(this, other);
        }

    }

    exports.Flags = Flags;
    (0, _Symbol2.setType)("ARM7TDMI.MachineState.Flags", Flags);

    class MachineState {
        constructor(eND, regMap, memMap, flags, state) {
            this.END = eND;
            this.RegMap = regMap;
            this.MemMap = memMap;
            this.Flags = flags;
            this.State = state;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.MachineState.MachineState",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    END: _InstructionType.Address,
                    RegMap: (0, _Util.makeGeneric)(_Map3.default, {
                        Key: _InstructionType.Register,
                        Value: "number"
                    }),
                    MemMap: (0, _Util.makeGeneric)(_Map3.default, {
                        Key: _InstructionType.Address,
                        Value: _InstructionType.Memory
                    }),
                    Flags: Flags,
                    State: RunState
                }
            };
        }

        Equals(other) {
            return (0, _Util.equalsRecords)(this, other);
        }

        CompareTo(other) {
            return (0, _Util.compareRecords)(this, other);
        }

    }

    exports.MachineState = MachineState;
    (0, _Symbol2.setType)("ARM7TDMI.MachineState.MachineState", MachineState);
});
//# sourceMappingURL=MachineState.js.map