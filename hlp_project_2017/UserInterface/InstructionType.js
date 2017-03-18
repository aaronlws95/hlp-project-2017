define(["exports", "fable-core/umd/Symbol", "fable-core/umd/Util", "fable-core/umd/List"], function (exports, _Symbol2, _Util, _List) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Memory = exports.InstructionLine = exports.InstructionType = exports.ConditionCode = exports.SHIFTInst = exports.MEMInst = exports.LDMdir = exports.SFInst = exports.ALUInst = exports.RegOrLit = exports.Address = exports.Register = undefined;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    var _List2 = _interopRequireDefault(_List);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    class Register {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.Register",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    R: ["number"]
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

    exports.Register = Register;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.Register", Register);

    class Address {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.Address",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Addr: ["number"]
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

    exports.Address = Address;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.Address", Address);

    class RegOrLit {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.RegOrLit",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Lit: ["number"],
                    Reg: [Register]
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

    exports.RegOrLit = RegOrLit;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.RegOrLit", RegOrLit);

    class ALUInst {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.ALUInst",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    ADC: [Register, Register, RegOrLit],
                    ADD: [Register, Register, RegOrLit],
                    BIC: [Register, Register, RegOrLit],
                    EOR: [Register, Register, RegOrLit],
                    MOV: [Register, RegOrLit],
                    MVN: [Register, RegOrLit],
                    ORR: [Register, Register, RegOrLit],
                    RSB: [Register, Register, RegOrLit],
                    RSC: [Register, Register, RegOrLit],
                    SBC: [Register, Register, RegOrLit],
                    SUB: [Register, Register, RegOrLit]
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

    exports.ALUInst = ALUInst;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.ALUInst", ALUInst);

    class SFInst {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.SFInst",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    CMN: [Register, RegOrLit],
                    CMP: [Register, RegOrLit],
                    TEQ: [Register, RegOrLit],
                    TST: [Register, RegOrLit]
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

    exports.SFInst = SFInst;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.SFInst", SFInst);

    class LDMdir {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.LDMdir",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    DA: [],
                    DB: [],
                    EA: [],
                    ED: [],
                    FA: [],
                    FD: [],
                    IA: [],
                    IB: []
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

    exports.LDMdir = LDMdir;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.LDMdir", LDMdir);

    class MEMInst {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.MEMInst",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    ADR: [Register, Address, "boolean"],
                    LDM: [LDMdir, Register, (0, _Util.makeGeneric)(_List2.default, {
                        T: Register
                    }), "boolean"],
                    LDRPI: [Register, Address],
                    LDRREG: [Register, Register, RegOrLit, RegOrLit, "boolean"],
                    STM: [LDMdir, Register, (0, _Util.makeGeneric)(_List2.default, {
                        T: Register
                    }), "boolean"],
                    STR: [Register, Register, RegOrLit, RegOrLit, "boolean"]
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

    exports.MEMInst = MEMInst;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.MEMInst", MEMInst);

    class SHIFTInst {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.SHIFTInst",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    ASR: [Register, Register, RegOrLit],
                    LSL: [Register, Register, RegOrLit],
                    LSR: [Register, Register, RegOrLit],
                    ROR: [Register, Register, RegOrLit],
                    RRX: [Register, Register]
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

    exports.SHIFTInst = SHIFTInst;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.SHIFTInst", SHIFTInst);

    class ConditionCode {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.ConditionCode",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    AL: [],
                    CC: [],
                    CS: [],
                    EQ: [],
                    GE: [],
                    GT: [],
                    HI: [],
                    HS: [],
                    LE: [],
                    LO: [],
                    LS: [],
                    LT: [],
                    MI: [],
                    NE: [],
                    PL: [],
                    VC: [],
                    VS: []
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

    exports.ConditionCode = ConditionCode;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.ConditionCode", ConditionCode);

    class InstructionType {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.InstructionType",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    ALU: [ALUInst, "boolean"],
                    MEM: [MEMInst],
                    SF: [SFInst],
                    SHIFT: [SHIFTInst, "boolean"]
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

    exports.InstructionType = InstructionType;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.InstructionType", InstructionType);

    class InstructionLine {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.InstructionLine",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Line: [InstructionType, (0, _Util.Option)(SHIFTInst), (0, _Util.Option)(ConditionCode)]
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

    exports.InstructionLine = InstructionLine;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.InstructionLine", InstructionLine);

    class Memory {
        constructor(caseName, fields) {
            this.Case = caseName;
            this.Fields = fields;
        }

        [_Symbol3.default.reflection]() {
            return {
                type: "ARM7TDMI.InstructionType.Memory",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Inst: [InstructionLine],
                    Val: ["number"]
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

    exports.Memory = Memory;
    (0, _Symbol2.setType)("ARM7TDMI.InstructionType.Memory", Memory);
});
//# sourceMappingURL=InstructionType.js.map