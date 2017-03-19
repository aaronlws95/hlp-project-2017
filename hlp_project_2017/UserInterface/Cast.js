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
            const activePatternResult446 = _IsInt___(getX);

            if (activePatternResult446 != null) {
                return activePatternResult446;
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
            let $var3;

            const activePatternResult449 = _IsInt___(getX);

            if (activePatternResult449 != null) {
                if (activePatternResult449 <= 15) {
                    $var3 = [0, activePatternResult449];
                } else {
                    $var3 = [1];
                }
            } else {
                $var3 = [1];
            }

            switch ($var3[0]) {
                case 0:
                    return new _InstructionType.Register("R", [$var3[1]]);

                case 1:
                    return null;
            }
        } else {
            return null;
        }
    }

    exports.$7C$IsReg$7C$_$7C$ = _IsReg___;

    function _IsRegList___(lst) {
        let $var4;

        if (lst.tail != null) {
            const activePatternResult455 = _IsReg___(lst.head);

            if (activePatternResult455 != null) {
                const activePatternResult456 = _IsRegList___(lst.tail);

                if (activePatternResult456 != null) {
                    $var4 = [0, activePatternResult455, activePatternResult456];
                } else {
                    $var4 = [1];
                }
            } else {
                $var4 = [1];
            }
        } else {
            $var4 = [1];
        }

        switch ($var4[0]) {
            case 0:
                return new _List2.default($var4[1], $var4[2]);

            case 1:
                let $var5;

                if (lst.tail != null) {
                    const activePatternResult454 = _IsReg___(lst.head);

                    if (activePatternResult454 != null) {
                        if (lst.tail.tail == null) {
                            $var5 = [0, activePatternResult454];
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
                        return (0, _List.ofArray)([$var5[1]]);

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
        const activePatternResult461 = _IsReg___(_arg1);

        if (activePatternResult461 != null) {
            return new _InstructionType.RegOrLit("Reg", [activePatternResult461]);
        } else {
            const activePatternResult460 = _IsLit___(_arg1);

            if (activePatternResult460 != null) {
                return new _InstructionType.RegOrLit("Lit", [activePatternResult460]);
            } else {
                return null;
            }
        }
    }

    exports.$7C$IsRegOrLit$7C$_$7C$ = _IsRegOrLit___;

    function _IsLabel___(_arg1) {
        const activePatternResult467 = _IsReg___(_arg1);

        if (activePatternResult467 != null) {
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
            const activePatternResult469 = _IsInt___(getX);

            if (activePatternResult469 != null) {
                return new _InstructionType.Address("Addr", [activePatternResult469]);
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
        let $var6;

        if (_arg1.tail != null) {
            const activePatternResult475 = _IsLabel___(_arg1.head);

            if (activePatternResult475 != null) {
                if (_arg1.tail.tail == null) {
                    $var6 = [0, activePatternResult475];
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
                return true;

            case 1:
                return false;
        }
    }

    function IsNotBranch(_arg1) {
        let $var7;

        if (_arg1.tail != null) {
            const activePatternResult477 = _IsLabel___(_arg1.head);

            if (activePatternResult477 != null) {
                if (_arg1.tail.tail == null) {
                    $var7 = [0, activePatternResult477];
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
            case "B":
                return arg0 => new _InstructionType.BRANCHInst("B", [arg0]);

            case "BL":
                return arg0_1 => new _InstructionType.BRANCHInst("BL", [arg0_1]);

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
        const activePatternResult633 = _Prefix___("MOV", s);

        if (activePatternResult633 != null) {
            return toTuple("MOV", activePatternResult633);
        } else {
            const activePatternResult631 = _Prefix___("MVN", s);

            if (activePatternResult631 != null) {
                return toTuple("MVN", activePatternResult631);
            } else {
                const activePatternResult629 = _Prefix___("ADD", s);

                if (activePatternResult629 != null) {
                    return toTuple("ADD", activePatternResult629);
                } else {
                    const activePatternResult627 = _Prefix___("ADC", s);

                    if (activePatternResult627 != null) {
                        return toTuple("ADC", activePatternResult627);
                    } else {
                        const activePatternResult625 = _Prefix___("SUB", s);

                        if (activePatternResult625 != null) {
                            return toTuple("SUB", activePatternResult625);
                        } else {
                            const activePatternResult623 = _Prefix___("SBC", s);

                            if (activePatternResult623 != null) {
                                return toTuple("SBC", activePatternResult623);
                            } else {
                                const activePatternResult621 = _Prefix___("RSB", s);

                                if (activePatternResult621 != null) {
                                    return toTuple("RSB", activePatternResult621);
                                } else {
                                    const activePatternResult619 = _Prefix___("RSC", s);

                                    if (activePatternResult619 != null) {
                                        return toTuple("RSC", activePatternResult619);
                                    } else {
                                        const activePatternResult617 = _Prefix___("AND", s);

                                        if (activePatternResult617 != null) {
                                            return toTuple("AND", activePatternResult617);
                                        } else {
                                            const activePatternResult615 = _Prefix___("EOR", s);

                                            if (activePatternResult615 != null) {
                                                return toTuple("EOR", activePatternResult615);
                                            } else {
                                                const activePatternResult613 = _Prefix___("BIC", s);

                                                if (activePatternResult613 != null) {
                                                    return toTuple("BIC", activePatternResult613);
                                                } else {
                                                    const activePatternResult611 = _Prefix___("ORR", s);

                                                    if (activePatternResult611 != null) {
                                                        return toTuple("ORR", activePatternResult611);
                                                    } else {
                                                        const activePatternResult609 = _Prefix___("LSL", s);

                                                        if (activePatternResult609 != null) {
                                                            return toTuple("LSL", activePatternResult609);
                                                        } else {
                                                            const activePatternResult607 = _Prefix___("LSR", s);

                                                            if (activePatternResult607 != null) {
                                                                return toTuple("LSR", activePatternResult607);
                                                            } else {
                                                                const activePatternResult605 = _Prefix___("ASR", s);

                                                                if (activePatternResult605 != null) {
                                                                    return toTuple("ASR", activePatternResult605);
                                                                } else {
                                                                    const activePatternResult603 = _Prefix___("ROR", s);

                                                                    if (activePatternResult603 != null) {
                                                                        return toTuple("ROR", activePatternResult603);
                                                                    } else {
                                                                        const activePatternResult601 = _Prefix___("RRX", s);

                                                                        if (activePatternResult601 != null) {
                                                                            return toTuple("ROR", activePatternResult601);
                                                                        } else {
                                                                            const activePatternResult599 = _Prefix___("CMP", s);

                                                                            if (activePatternResult599 != null) {
                                                                                return toTuple("CMP", activePatternResult599);
                                                                            } else {
                                                                                const activePatternResult597 = _Prefix___("CMN", s);

                                                                                if (activePatternResult597 != null) {
                                                                                    return toTuple("CMN", activePatternResult597);
                                                                                } else {
                                                                                    const activePatternResult595 = _Prefix___("TST", s);

                                                                                    if (activePatternResult595 != null) {
                                                                                        return toTuple("TST", activePatternResult595);
                                                                                    } else {
                                                                                        const activePatternResult593 = _Prefix___("TEQ", s);

                                                                                        if (activePatternResult593 != null) {
                                                                                            return toTuple("TEQ", activePatternResult593);
                                                                                        } else {
                                                                                            const activePatternResult591 = _Prefix___("B", s);

                                                                                            if (activePatternResult591 != null) {
                                                                                                return toTuple("B", activePatternResult591);
                                                                                            } else {
                                                                                                const activePatternResult589 = _Prefix___("BL", s);

                                                                                                if (activePatternResult589 != null) {
                                                                                                    return toTuple("BL", activePatternResult589);
                                                                                                } else {
                                                                                                    const activePatternResult587 = _Prefix___("ADR", s);

                                                                                                    if (activePatternResult587 != null) {
                                                                                                        return toTuple("ADR", activePatternResult587);
                                                                                                    } else {
                                                                                                        const activePatternResult585 = _Prefix___("LDR", s);

                                                                                                        if (activePatternResult585 != null) {
                                                                                                            return toTuple("LDR", activePatternResult585);
                                                                                                        } else {
                                                                                                            const activePatternResult583 = _Prefix___("STR", s);

                                                                                                            if (activePatternResult583 != null) {
                                                                                                                return toTuple("STR", activePatternResult583);
                                                                                                            } else {
                                                                                                                const activePatternResult581 = _Prefix___("LDM", s);

                                                                                                                if (activePatternResult581 != null) {
                                                                                                                    return toTuple("LDM", activePatternResult581);
                                                                                                                } else {
                                                                                                                    const activePatternResult579 = _Prefix___("STM", s);

                                                                                                                    if (activePatternResult579 != null) {
                                                                                                                        return toTuple("STM", activePatternResult579);
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