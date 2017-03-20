define(["exports", "./InstructionType", "fable-core/umd/List", "fable-core/umd/Map"], function (exports, _InstructionType, _List, _Map) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.$7C$Prefix$7C$_$7C$ = exports.$7C$IsLDMdir$7C$_$7C$ = exports.$7C$IsCondition$7C$_$7C$ = exports.$7C$IsByteMode$7C$_$7C$ = exports.$7C$IsSetFlag$7C$_$7C$ = exports.$7C$IsBranchInst$7C$_$7C$ = exports.$7C$IsMEMMInst$7C$_$7C$ = exports.$7C$IsMEMRInst$7C$_$7C$ = exports.$7C$IsCOMPInst$7C$_$7C$ = exports.$7C$IsShiftInst$7C$_$7C$ = exports.$7C$IsALUInst$7C$_$7C$ = exports.$7C$IsMOVInst$7C$_$7C$ = exports.$7C$IsAddr$7C$_$7C$ = exports.$7C$IsLabel$7C$_$7C$ = exports.$7C$IsRegOrLit$7C$_$7C$ = exports.$7C$IsRegList$7C$_$7C$ = exports.$7C$IsReg$7C$_$7C$ = exports.$7C$IsLit$7C$_$7C$ = exports.$7C$IsInt$7C$_$7C$ = undefined;
    exports.ValueToAddr = ValueToAddr;
    exports.ValueOptToAddr = ValueOptToAddr;
    exports.AddrToValue = AddrToValue;
    exports.IsBranch = IsBranch;
    exports.IsNotBranch = IsNotBranch;
    exports.CondCast = CondCast;
    exports.checkS_or_B = checkS_or_B;
    exports.checkCond = checkCond;
    exports.toTuple = toTuple;
    exports.TokenizeInst = TokenizeInst;

    var _List2 = _interopRequireDefault(_List);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _IsInt___(s) {
        try {
            return Number.parseInt(s);
        } catch (matchValue) {
            return null;
        }
    }

    exports.$7C$IsInt$7C$_$7C$ = _IsInt___;

    function _IsLit___(s) {
        const getX = s.slice(1, s.length);

        if (s[0] === "#") {
            const activePatternResult492 = _IsInt___(getX);

            if (activePatternResult492 != null) {
                return activePatternResult492;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    exports.$7C$IsLit$7C$_$7C$ = _IsLit___;

    function _IsReg___(s) {
        const getX = s.slice(1, s.length);

        if (s[0] === "R") {
            let $var4;

            const activePatternResult495 = _IsInt___(getX);

            if (activePatternResult495 != null) {
                if (activePatternResult495 <= 15) {
                    $var4 = [0, activePatternResult495];
                } else {
                    $var4 = [1];
                }
            } else {
                $var4 = [1];
            }

            switch ($var4[0]) {
                case 0:
                    return new _InstructionType.Register("R", [$var4[1]]);

                case 1:
                    return null;
            }
        } else {
            return null;
        }
    }

    exports.$7C$IsReg$7C$_$7C$ = _IsReg___;

    function _IsRegList___(lst) {
        let $var5;

        if (lst.tail != null) {
            const activePatternResult501 = _IsReg___(lst.head);

            if (activePatternResult501 != null) {
                const activePatternResult502 = _IsRegList___(lst.tail);

                if (activePatternResult502 != null) {
                    $var5 = [0, activePatternResult501, activePatternResult502];
                } else {
                    $var5 = [1];
                }
            } else {
                $var5 = [1];
            }
        } else {
            $var5 = [1];
        }

        switch ($var5[0]) {
            case 0:
                return new _List2.default($var5[1], $var5[2]);

            case 1:
                let $var6;

                if (lst.tail != null) {
                    const activePatternResult500 = _IsReg___(lst.head);

                    if (activePatternResult500 != null) {
                        if (lst.tail.tail == null) {
                            $var6 = [0, activePatternResult500];
                        } else {
                            $var6 = [1];
                        }
                    } else {
                        $var6 = [1];
                    }
                } else {
                    $var6 = [1];
                }

                switch ($var6[0]) {
                    case 0:
                        return (0, _List.ofArray)([$var6[1]]);

                    case 1:
                        if (lst.tail == null) {
                            return new _List2.default();
                        } else {
                            return null;
                        }

                }

        }
    }

    exports.$7C$IsRegList$7C$_$7C$ = _IsRegList___;

    function _IsRegOrLit___(_arg1) {
        const activePatternResult507 = _IsReg___(_arg1);

        if (activePatternResult507 != null) {
            return new _InstructionType.RegOrLit("Reg", [activePatternResult507]);
        } else {
            const activePatternResult506 = _IsLit___(_arg1);

            if (activePatternResult506 != null) {
                return new _InstructionType.RegOrLit("Lit", [activePatternResult506]);
            } else {
                return null;
            }
        }
    }

    exports.$7C$IsRegOrLit$7C$_$7C$ = _IsRegOrLit___;

    function _IsLabel___(_arg1) {
        const activePatternResult513 = _IsReg___(_arg1);

        if (activePatternResult513 != null) {
            return null;
        } else {
            try {
                return _arg1;
            } catch (matchValue) {
                return null;
            }
        }
    }

    exports.$7C$IsLabel$7C$_$7C$ = _IsLabel___;

    function _IsAddr___(b_map, s) {
        const getX = s.slice(1, s.length);

        if (s[0] === "#") {
            const activePatternResult515 = _IsInt___(getX);

            if (activePatternResult515 != null) {
                return new _InstructionType.Address("Addr", [activePatternResult515]);
            } else {
                return null;
            }
        } else {
            return (0, _Map.tryFind)(s, b_map);
        }
    }

    exports.$7C$IsAddr$7C$_$7C$ = _IsAddr___;

    function ValueToAddr(value) {
        return new _InstructionType.Address("Addr", [value]);
    }

    function ValueOptToAddr(value) {
        if (value == null) {
            throw new Error("R 15 has not been initialized or has been removed");
        } else {
            return new _InstructionType.Address("Addr", [value]);
        }
    }

    function AddrToValue(addr) {
        return addr.Fields[0];
    }

    function IsBranch(_arg1) {
        let $var7;

        if (_arg1.tail != null) {
            const activePatternResult521 = _IsLabel___(_arg1.head);

            if (activePatternResult521 != null) {
                if (_arg1.tail.tail == null) {
                    $var7 = [0, activePatternResult521];
                } else {
                    $var7 = [1];
                }
            } else {
                $var7 = [1];
            }
        } else {
            $var7 = [1];
        }

        switch ($var7[0]) {
            case 0:
                return true;

            case 1:
                return false;
        }
    }

    function IsNotBranch(_arg1) {
        let $var8;

        if (_arg1.tail != null) {
            const activePatternResult523 = _IsLabel___(_arg1.head);

            if (activePatternResult523 != null) {
                if (_arg1.tail.tail == null) {
                    $var8 = [0, activePatternResult523];
                } else {
                    $var8 = [1];
                }
            } else {
                $var8 = [1];
            }
        } else {
            $var8 = [1];
        }

        switch ($var8[0]) {
            case 0:
                return false;

            case 1:
                return true;
        }
    }

    function _IsMOVInst___(_arg1) {
        switch (_arg1) {
            case "MOV":
                return tupledArg => new _InstructionType.ALUInst("MOV", [tupledArg[0], tupledArg[1]]);

            case "MVN":
                return tupledArg_1 => new _InstructionType.ALUInst("MVN", [tupledArg_1[0], tupledArg_1[1]]);

            default:
                return null;
        }
    }

    exports.$7C$IsMOVInst$7C$_$7C$ = _IsMOVInst___;

    function _IsALUInst___(_arg1) {
        switch (_arg1) {
            case "ADD":
                return tupledArg => new _InstructionType.ALUInst("ADD", [tupledArg[0], tupledArg[1], tupledArg[2]]);

            case "ADC":
                return tupledArg_1 => new _InstructionType.ALUInst("ADC", [tupledArg_1[0], tupledArg_1[1], tupledArg_1[2]]);

            case "SUB":
                return tupledArg_2 => new _InstructionType.ALUInst("SUB", [tupledArg_2[0], tupledArg_2[1], tupledArg_2[2]]);

            case "SBC":
                return tupledArg_3 => new _InstructionType.ALUInst("SBC", [tupledArg_3[0], tupledArg_3[1], tupledArg_3[2]]);

            case "RSB":
                return tupledArg_4 => new _InstructionType.ALUInst("RSB", [tupledArg_4[0], tupledArg_4[1], tupledArg_4[2]]);

            case "RSC":
                return tupledArg_5 => new _InstructionType.ALUInst("RSC", [tupledArg_5[0], tupledArg_5[1], tupledArg_5[2]]);

            case "EOR":
                return tupledArg_6 => new _InstructionType.ALUInst("EOR", [tupledArg_6[0], tupledArg_6[1], tupledArg_6[2]]);

            case "BIC":
                return tupledArg_7 => new _InstructionType.ALUInst("BIC", [tupledArg_7[0], tupledArg_7[1], tupledArg_7[2]]);

            case "ORR":
                return tupledArg_8 => new _InstructionType.ALUInst("ORR", [tupledArg_8[0], tupledArg_8[1], tupledArg_8[2]]);

            default:
                return null;
        }
    }

    exports.$7C$IsALUInst$7C$_$7C$ = _IsALUInst___;

    function _IsShiftInst___(_arg1) {
        switch (_arg1) {
            case "LSL":
                return tupledArg => new _InstructionType.SHIFTInst("LSL", [tupledArg[0], tupledArg[1], tupledArg[2]]);

            case "LSR":
                return tupledArg_1 => new _InstructionType.SHIFTInst("LSR", [tupledArg_1[0], tupledArg_1[1], tupledArg_1[2]]);

            case "ASR":
                return tupledArg_2 => new _InstructionType.SHIFTInst("ASR", [tupledArg_2[0], tupledArg_2[1], tupledArg_2[2]]);

            case "ROR":
                return tupledArg_3 => new _InstructionType.SHIFTInst("ROR", [tupledArg_3[0], tupledArg_3[1], tupledArg_3[2]]);

            default:
                return null;
        }
    }

    exports.$7C$IsShiftInst$7C$_$7C$ = _IsShiftInst___;

    function _IsCOMPInst___(_arg1) {
        switch (_arg1) {
            case "CMP":
                return tupledArg => new _InstructionType.SFInst("CMP", [tupledArg[0], tupledArg[1]]);

            case "CMN":
                return tupledArg_1 => new _InstructionType.SFInst("CMN", [tupledArg_1[0], tupledArg_1[1]]);

            case "TST":
                return tupledArg_2 => new _InstructionType.SFInst("TST", [tupledArg_2[0], tupledArg_2[1]]);

            case "TEQ":
                return tupledArg_3 => new _InstructionType.SFInst("TEQ", [tupledArg_3[0], tupledArg_3[1]]);

            default:
                return null;
        }
    }

    exports.$7C$IsCOMPInst$7C$_$7C$ = _IsCOMPInst___;

    function _IsMEMRInst___(_arg1) {
        switch (_arg1) {
            case "LDR":
                return tupledArg => new _InstructionType.MEMInst("LDR", [tupledArg[0], tupledArg[1], tupledArg[2], tupledArg[3], tupledArg[4]]);

            case "STR":
                return tupledArg_1 => new _InstructionType.MEMInst("STR", [tupledArg_1[0], tupledArg_1[1], tupledArg_1[2], tupledArg_1[3], tupledArg_1[4]]);

            default:
                return null;
        }
    }

    exports.$7C$IsMEMRInst$7C$_$7C$ = _IsMEMRInst___;

    function _IsMEMMInst___(_arg1) {
        switch (_arg1) {
            case "LDM":
                return tupledArg => new _InstructionType.MEMInst("LDM", [tupledArg[0], tupledArg[1], tupledArg[2], tupledArg[3]]);

            case "STM":
                return tupledArg_1 => new _InstructionType.MEMInst("STM", [tupledArg_1[0], tupledArg_1[1], tupledArg_1[2], tupledArg_1[3]]);

            default:
                return null;
        }
    }

    exports.$7C$IsMEMMInst$7C$_$7C$ = _IsMEMMInst___;

    function _IsBranchInst___(_arg1) {
        switch (_arg1) {
            case "BL":
                return arg0 => new _InstructionType.BRANCHInst("BL", [arg0]);

            case "B":
                return arg0_1 => new _InstructionType.BRANCHInst("B", [arg0_1]);

            default:
                return null;
        }
    }

    exports.$7C$IsBranchInst$7C$_$7C$ = _IsBranchInst___;

    function _IsSetFlag___(_arg1) {
        switch (_arg1) {
            case "S":
                return true;

            case "":
                return false;

            default:
                return null;
        }
    }

    exports.$7C$IsSetFlag$7C$_$7C$ = _IsSetFlag___;

    function _IsByteMode___(_arg1) {
        switch (_arg1) {
            case "B":
                return true;

            case "":
                return false;

            default:
                return null;
        }
    }

    exports.$7C$IsByteMode$7C$_$7C$ = _IsByteMode___;

    function _IsCondition___(_arg1) {
        switch (_arg1) {
            case "EQ":
                return new _InstructionType.ConditionCode("EQ", []);

            case "NE":
                return new _InstructionType.ConditionCode("NE", []);

            case "CS":
                return new _InstructionType.ConditionCode("CS", []);

            case "HS":
                return new _InstructionType.ConditionCode("HS", []);

            case "CC":
                return new _InstructionType.ConditionCode("CC", []);

            case "LO":
                return new _InstructionType.ConditionCode("LO", []);

            case "MI":
                return new _InstructionType.ConditionCode("MI", []);

            case "PL":
                return new _InstructionType.ConditionCode("PL", []);

            case "VS":
                return new _InstructionType.ConditionCode("VS", []);

            case "VC":
                return new _InstructionType.ConditionCode("VC", []);

            case "HI":
                return new _InstructionType.ConditionCode("HI", []);

            case "LS":
                return new _InstructionType.ConditionCode("LS", []);

            case "GE":
                return new _InstructionType.ConditionCode("GE", []);

            case "LT":
                return new _InstructionType.ConditionCode("LT", []);

            case "GT":
                return new _InstructionType.ConditionCode("GT", []);

            case "LE":
                return new _InstructionType.ConditionCode("LE", []);

            case "AL":
                return new _InstructionType.ConditionCode("AL", []);

            case "":
                return new _InstructionType.ConditionCode("NoCond", []);

            default:
                return null;
        }
    }

    exports.$7C$IsCondition$7C$_$7C$ = _IsCondition___;

    function _IsLDMdir___(_arg1) {
        switch (_arg1) {
            case "ED":
                return new _InstructionType.LDMdir("ED", []);

            case "IB":
                return new _InstructionType.LDMdir("IB", []);

            case "FD":
                return new _InstructionType.LDMdir("FD", []);

            case "IA":
                return new _InstructionType.LDMdir("IA", []);

            case "EA":
                return new _InstructionType.LDMdir("EA", []);

            case "DB":
                return new _InstructionType.LDMdir("DB", []);

            case "FA":
                return new _InstructionType.LDMdir("FA", []);

            case "DA":
                return new _InstructionType.LDMdir("DA", []);

            default:
                return null;
        }
    }

    exports.$7C$IsLDMdir$7C$_$7C$ = _IsLDMdir___;

    function CondCast(_arg1) {
        if (_arg1.Case === "NoCond") {
            return null;
        } else {
            return _arg1;
        }
    }

    function _Prefix___(p, s) {
        if (s.indexOf(p) === 0) {
            return s.substr(p.length);
        } else {
            return null;
        }
    }

    exports.$7C$Prefix$7C$_$7C$ = _Prefix___;

    function checkS_or_B(s) {
        if (s !== "") {
            if (s[0] === "S") {
                return "S";
            } else if (s[0] === "B") {
                return "B";
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    function checkCond(s) {
        if (s.length === 2) {
            return s;
        } else if (s.length === 3) {
            return s.slice(1, 2 + 1);
        } else if (s === "S") {
            return "";
        } else if (s === "B") {
            return "";
        } else {
            return s;
        }
    }

    function toTuple(inst, rest) {
        return (0, _List.ofArray)([inst, checkS_or_B(rest), checkCond(rest)]);
    }

    function TokenizeInst(s) {
        const activePatternResult679 = _Prefix___("MOV", s);

        if (activePatternResult679 != null) {
            return toTuple("MOV", activePatternResult679);
        } else {
            const activePatternResult677 = _Prefix___("MVN", s);

            if (activePatternResult677 != null) {
                return toTuple("MVN", activePatternResult677);
            } else {
                const activePatternResult675 = _Prefix___("ADD", s);

                if (activePatternResult675 != null) {
                    return toTuple("ADD", activePatternResult675);
                } else {
                    const activePatternResult673 = _Prefix___("ADC", s);

                    if (activePatternResult673 != null) {
                        return toTuple("ADC", activePatternResult673);
                    } else {
                        const activePatternResult671 = _Prefix___("SUB", s);

                        if (activePatternResult671 != null) {
                            return toTuple("SUB", activePatternResult671);
                        } else {
                            const activePatternResult669 = _Prefix___("SBC", s);

                            if (activePatternResult669 != null) {
                                return toTuple("SBC", activePatternResult669);
                            } else {
                                const activePatternResult667 = _Prefix___("RSB", s);

                                if (activePatternResult667 != null) {
                                    return toTuple("RSB", activePatternResult667);
                                } else {
                                    const activePatternResult665 = _Prefix___("RSC", s);

                                    if (activePatternResult665 != null) {
                                        return toTuple("RSC", activePatternResult665);
                                    } else {
                                        const activePatternResult663 = _Prefix___("AND", s);

                                        if (activePatternResult663 != null) {
                                            return toTuple("AND", activePatternResult663);
                                        } else {
                                            const activePatternResult661 = _Prefix___("EOR", s);

                                            if (activePatternResult661 != null) {
                                                return toTuple("EOR", activePatternResult661);
                                            } else {
                                                const activePatternResult659 = _Prefix___("BIC", s);

                                                if (activePatternResult659 != null) {
                                                    return toTuple("BIC", activePatternResult659);
                                                } else {
                                                    const activePatternResult657 = _Prefix___("ORR", s);

                                                    if (activePatternResult657 != null) {
                                                        return toTuple("ORR", activePatternResult657);
                                                    } else {
                                                        const activePatternResult655 = _Prefix___("LSL", s);

                                                        if (activePatternResult655 != null) {
                                                            return toTuple("LSL", activePatternResult655);
                                                        } else {
                                                            const activePatternResult653 = _Prefix___("LSR", s);

                                                            if (activePatternResult653 != null) {
                                                                return toTuple("LSR", activePatternResult653);
                                                            } else {
                                                                const activePatternResult651 = _Prefix___("ASR", s);

                                                                if (activePatternResult651 != null) {
                                                                    return toTuple("ASR", activePatternResult651);
                                                                } else {
                                                                    const activePatternResult649 = _Prefix___("ROR", s);

                                                                    if (activePatternResult649 != null) {
                                                                        return toTuple("ROR", activePatternResult649);
                                                                    } else {
                                                                        const activePatternResult647 = _Prefix___("RRX", s);

                                                                        if (activePatternResult647 != null) {
                                                                            return toTuple("ROR", activePatternResult647);
                                                                        } else {
                                                                            const activePatternResult645 = _Prefix___("CMP", s);

                                                                            if (activePatternResult645 != null) {
                                                                                return toTuple("CMP", activePatternResult645);
                                                                            } else {
                                                                                const activePatternResult643 = _Prefix___("CMN", s);

                                                                                if (activePatternResult643 != null) {
                                                                                    return toTuple("CMN", activePatternResult643);
                                                                                } else {
                                                                                    const activePatternResult641 = _Prefix___("TST", s);

                                                                                    if (activePatternResult641 != null) {
                                                                                        return toTuple("TST", activePatternResult641);
                                                                                    } else {
                                                                                        const activePatternResult639 = _Prefix___("TEQ", s);

                                                                                        if (activePatternResult639 != null) {
                                                                                            return toTuple("TEQ", activePatternResult639);
                                                                                        } else {
                                                                                            const activePatternResult637 = _Prefix___("BL", s);

                                                                                            if (activePatternResult637 != null) {
                                                                                                return toTuple("BL", activePatternResult637);
                                                                                            } else {
                                                                                                const activePatternResult635 = _Prefix___("B", s);

                                                                                                if (activePatternResult635 != null) {
                                                                                                    return toTuple("B", activePatternResult635);
                                                                                                } else {
                                                                                                    const activePatternResult633 = _Prefix___("ADR", s);

                                                                                                    if (activePatternResult633 != null) {
                                                                                                        return toTuple("ADR", activePatternResult633);
                                                                                                    } else {
                                                                                                        const activePatternResult631 = _Prefix___("LDR", s);

                                                                                                        if (activePatternResult631 != null) {
                                                                                                            return toTuple("LDR", activePatternResult631);
                                                                                                        } else {
                                                                                                            const activePatternResult629 = _Prefix___("STR", s);

                                                                                                            if (activePatternResult629 != null) {
                                                                                                                return toTuple("STR", activePatternResult629);
                                                                                                            } else {
                                                                                                                const activePatternResult627 = _Prefix___("LDM", s);

                                                                                                                if (activePatternResult627 != null) {
                                                                                                                    return toTuple("LDM", activePatternResult627);
                                                                                                                } else {
                                                                                                                    const activePatternResult625 = _Prefix___("STM", s);

                                                                                                                    if (activePatternResult625 != null) {
                                                                                                                        return toTuple("STM", activePatternResult625);
                                                                                                                    } else {
                                                                                                                        return (0, _List.ofArray)([s, "", ""]);
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});
//# sourceMappingURL=Cast.js.map