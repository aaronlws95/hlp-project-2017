define(["exports", "./InstructionType", "fable-core/umd/List"], function (exports, _InstructionType, _List) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.$7C$Prefix$7C$_$7C$ = exports.$7C$IsCondition$7C$_$7C$ = exports.$7C$IsSetFlag$7C$_$7C$ = exports.$7C$IsBranchInst$7C$_$7C$ = exports.$7C$IsCOMPInst$7C$_$7C$ = exports.$7C$IsShiftInst$7C$_$7C$ = exports.$7C$IsALUInst$7C$_$7C$ = exports.$7C$IsMOVInst$7C$_$7C$ = exports.$7C$IsLabel$7C$_$7C$ = exports.$7C$IsRegOrLit$7C$_$7C$ = exports.$7C$IsReg$7C$_$7C$ = exports.$7C$IsLit$7C$_$7C$ = exports.$7C$IsInt$7C$_$7C$ = undefined;
    exports.ValueToAddr = ValueToAddr;
    exports.ValueOptToAddr = ValueOptToAddr;
    exports.AddrToValue = AddrToValue;
    exports.IsBranch = IsBranch;
    exports.IsNotBranch = IsNotBranch;
    exports.CondCast = CondCast;
    exports.checkS = checkS;
    exports.checkCond = checkCond;
    exports.toTuple = toTuple;
    exports.TokenizeInst = TokenizeInst;

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
            const activePatternResult320 = _IsInt___(getX);

            if (activePatternResult320 != null) {
                return activePatternResult320;
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
            let $var1;

            const activePatternResult323 = _IsInt___(getX);

            if (activePatternResult323 != null) {
                if (activePatternResult323 <= 15) {
                    $var1 = [0, activePatternResult323];
                } else {
                    $var1 = [1];
                }
            } else {
                $var1 = [1];
            }

            switch ($var1[0]) {
                case 0:
                    return new _InstructionType.Register("R", [$var1[1]]);

                case 1:
                    return null;
            }
        } else {
            return null;
        }
    }

    exports.$7C$IsReg$7C$_$7C$ = _IsReg___;

    function _IsRegOrLit___(_arg1) {
        const activePatternResult328 = _IsReg___(_arg1);

        if (activePatternResult328 != null) {
            return new _InstructionType.RegOrLit("Reg", [activePatternResult328]);
        } else {
            const activePatternResult327 = _IsLit___(_arg1);

            if (activePatternResult327 != null) {
                return new _InstructionType.RegOrLit("Lit", [activePatternResult327]);
            } else {
                return null;
            }
        }
    }

    exports.$7C$IsRegOrLit$7C$_$7C$ = _IsRegOrLit___;

    function _IsLabel___(_arg1) {
        const activePatternResult334 = _IsReg___(_arg1);

        if (activePatternResult334 != null) {
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
        let $var2;

        if (_arg1.tail != null) {
            const activePatternResult339 = _IsLabel___(_arg1.head);

            if (activePatternResult339 != null) {
                if (_arg1.tail.tail == null) {
                    $var2 = [0, activePatternResult339];
                } else {
                    $var2 = [1];
                }
            } else {
                $var2 = [1];
            }
        } else {
            $var2 = [1];
        }

        switch ($var2[0]) {
            case 0:
                return true;

            case 1:
                return false;
        }
    }

    function IsNotBranch(_arg1) {
        let $var3;

        if (_arg1.tail != null) {
            const activePatternResult341 = _IsLabel___(_arg1.head);

            if (activePatternResult341 != null) {
                if (_arg1.tail.tail == null) {
                    $var3 = [0, activePatternResult341];
                } else {
                    $var3 = [1];
                }
            } else {
                $var3 = [1];
            }
        } else {
            $var3 = [1];
        }

        switch ($var3[0]) {
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

            case "EOR":
                return tupledArg_5 => new _InstructionType.ALUInst("EOR", [tupledArg_5[0], tupledArg_5[1], tupledArg_5[2]]);

            case "BIC":
                return tupledArg_6 => new _InstructionType.ALUInst("BIC", [tupledArg_6[0], tupledArg_6[1], tupledArg_6[2]]);

            case "ORR":
                return tupledArg_7 => new _InstructionType.ALUInst("ORR", [tupledArg_7[0], tupledArg_7[1], tupledArg_7[2]]);

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

    function checkS(s) {
        if (s !== "") {
            if (s[0] === "S") {
                return "S";
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
        } else {
            return s;
        }
    }

    function toTuple(inst, rest) {
        return (0, _List.ofArray)([inst, checkS(rest), checkCond(rest)]);
    }

    function TokenizeInst(s) {
        const activePatternResult461 = _Prefix___("MOV", s);

        if (activePatternResult461 != null) {
            return toTuple("MOV", activePatternResult461);
        } else {
            const activePatternResult459 = _Prefix___("MVN", s);

            if (activePatternResult459 != null) {
                return toTuple("MVN", activePatternResult459);
            } else {
                const activePatternResult457 = _Prefix___("ADD", s);

                if (activePatternResult457 != null) {
                    return toTuple("ADD", activePatternResult457);
                } else {
                    const activePatternResult455 = _Prefix___("ADC", s);

                    if (activePatternResult455 != null) {
                        return toTuple("ADC", activePatternResult455);
                    } else {
                        const activePatternResult453 = _Prefix___("SUB", s);

                        if (activePatternResult453 != null) {
                            return toTuple("SUB", activePatternResult453);
                        } else {
                            const activePatternResult451 = _Prefix___("SBC", s);

                            if (activePatternResult451 != null) {
                                return toTuple("SBC", activePatternResult451);
                            } else {
                                const activePatternResult449 = _Prefix___("RSB", s);

                                if (activePatternResult449 != null) {
                                    return toTuple("RSB", activePatternResult449);
                                } else {
                                    const activePatternResult447 = _Prefix___("RSC", s);

                                    if (activePatternResult447 != null) {
                                        return toTuple("RSC", activePatternResult447);
                                    } else {
                                        const activePatternResult445 = _Prefix___("AND", s);

                                        if (activePatternResult445 != null) {
                                            return toTuple("AND", activePatternResult445);
                                        } else {
                                            const activePatternResult443 = _Prefix___("EOR", s);

                                            if (activePatternResult443 != null) {
                                                return toTuple("EOR", activePatternResult443);
                                            } else {
                                                const activePatternResult441 = _Prefix___("BIC", s);

                                                if (activePatternResult441 != null) {
                                                    return toTuple("BIC", activePatternResult441);
                                                } else {
                                                    const activePatternResult439 = _Prefix___("ORR", s);

                                                    if (activePatternResult439 != null) {
                                                        return toTuple("ORR", activePatternResult439);
                                                    } else {
                                                        const activePatternResult437 = _Prefix___("LSL", s);

                                                        if (activePatternResult437 != null) {
                                                            return toTuple("LSL", activePatternResult437);
                                                        } else {
                                                            const activePatternResult435 = _Prefix___("LSR", s);

                                                            if (activePatternResult435 != null) {
                                                                return toTuple("LSR", activePatternResult435);
                                                            } else {
                                                                const activePatternResult433 = _Prefix___("ASR", s);

                                                                if (activePatternResult433 != null) {
                                                                    return toTuple("ASR", activePatternResult433);
                                                                } else {
                                                                    const activePatternResult431 = _Prefix___("ROR", s);

                                                                    if (activePatternResult431 != null) {
                                                                        return toTuple("ROR", activePatternResult431);
                                                                    } else {
                                                                        const activePatternResult429 = _Prefix___("CMP", s);

                                                                        if (activePatternResult429 != null) {
                                                                            return toTuple("CMP", activePatternResult429);
                                                                        } else {
                                                                            const activePatternResult427 = _Prefix___("CMN", s);

                                                                            if (activePatternResult427 != null) {
                                                                                return toTuple("CMN", activePatternResult427);
                                                                            } else {
                                                                                const activePatternResult425 = _Prefix___("TST", s);

                                                                                if (activePatternResult425 != null) {
                                                                                    return toTuple("TST", activePatternResult425);
                                                                                } else {
                                                                                    const activePatternResult423 = _Prefix___("TEQ", s);

                                                                                    if (activePatternResult423 != null) {
                                                                                        return toTuple("TEQ", activePatternResult423);
                                                                                    } else {
                                                                                        const activePatternResult421 = _Prefix___("B", s);

                                                                                        if (activePatternResult421 != null) {
                                                                                            return toTuple("B", activePatternResult421);
                                                                                        } else {
                                                                                            const activePatternResult419 = _Prefix___("B", s);

                                                                                            if (activePatternResult419 != null) {
                                                                                                return toTuple("BL", activePatternResult419);
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
});
//# sourceMappingURL=Cast.js.map