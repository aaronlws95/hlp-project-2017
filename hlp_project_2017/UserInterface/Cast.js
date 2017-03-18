define(["exports", "./InstructionType", "fable-core/umd/List", "fable-core/umd/Seq", "fable-core/umd/String"], function (exports, _InstructionType, _List, _Seq, _String) {
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
    exports.checkS = checkS;
    exports.checkCond = checkCond;
    exports.toTuple = toTuple;
    exports.TokenizeInst = TokenizeInst;
    exports.ParseInstruction = ParseInstruction;

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
            const activePatternResult304 = _IsInt___(getX);

            if (activePatternResult304 != null) {
                return activePatternResult304;
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

            const activePatternResult307 = _IsInt___(getX);

            if (activePatternResult307 != null) {
                if (activePatternResult307 <= 15) {
                    $var1 = [0, activePatternResult307];
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
        const activePatternResult312 = _IsReg___(_arg1);

        if (activePatternResult312 != null) {
            return new _InstructionType.RegOrLit("Reg", [activePatternResult312]);
        } else {
            const activePatternResult311 = _IsLit___(_arg1);

            if (activePatternResult311 != null) {
                return new _InstructionType.RegOrLit("Lit", [activePatternResult311]);
            } else {
                return null;
            }
        }
    }

    exports.$7C$IsRegOrLit$7C$_$7C$ = _IsRegOrLit___;

    function _IsLabel___(_arg1) {
        const activePatternResult318 = _IsReg___(_arg1);

        if (activePatternResult318 != null) {
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
            const activePatternResult323 = _IsLabel___(_arg1.head);

            if (activePatternResult323 != null) {
                if (_arg1.tail.tail == null) {
                    $var2 = [0, activePatternResult323];
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
            const activePatternResult325 = _IsLabel___(_arg1.head);

            if (activePatternResult325 != null) {
                if (_arg1.tail.tail == null) {
                    $var3 = [0, activePatternResult325];
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
        return null;
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
                return null;

            default:
                return null;
        }
    }

    exports.$7C$IsCondition$7C$_$7C$ = _IsCondition___;

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
        const activePatternResult457 = _Prefix___("MOV", s);

        if (activePatternResult457 != null) {
            return toTuple("MOV", activePatternResult457);
        } else {
            const activePatternResult455 = _Prefix___("MVN", s);

            if (activePatternResult455 != null) {
                return toTuple("MVN", activePatternResult455);
            } else {
                const activePatternResult453 = _Prefix___("ADD", s);

                if (activePatternResult453 != null) {
                    return toTuple("ADD", activePatternResult453);
                } else {
                    const activePatternResult451 = _Prefix___("ADC", s);

                    if (activePatternResult451 != null) {
                        return toTuple("ADC", activePatternResult451);
                    } else {
                        const activePatternResult449 = _Prefix___("SUB", s);

                        if (activePatternResult449 != null) {
                            return toTuple("SUB", activePatternResult449);
                        } else {
                            const activePatternResult447 = _Prefix___("SBC", s);

                            if (activePatternResult447 != null) {
                                return toTuple("SBC", activePatternResult447);
                            } else {
                                const activePatternResult445 = _Prefix___("RSB", s);

                                if (activePatternResult445 != null) {
                                    return toTuple("RSB", activePatternResult445);
                                } else {
                                    const activePatternResult443 = _Prefix___("RSC", s);

                                    if (activePatternResult443 != null) {
                                        return toTuple("RSC", activePatternResult443);
                                    } else {
                                        const activePatternResult441 = _Prefix___("AND", s);

                                        if (activePatternResult441 != null) {
                                            return toTuple("AND", activePatternResult441);
                                        } else {
                                            const activePatternResult439 = _Prefix___("EOR", s);

                                            if (activePatternResult439 != null) {
                                                return toTuple("EOR", activePatternResult439);
                                            } else {
                                                const activePatternResult437 = _Prefix___("BIC", s);

                                                if (activePatternResult437 != null) {
                                                    return toTuple("BIC", activePatternResult437);
                                                } else {
                                                    const activePatternResult435 = _Prefix___("ORR", s);

                                                    if (activePatternResult435 != null) {
                                                        return toTuple("ORR", activePatternResult435);
                                                    } else {
                                                        const activePatternResult433 = _Prefix___("LSL", s);

                                                        if (activePatternResult433 != null) {
                                                            return toTuple("LSL", activePatternResult433);
                                                        } else {
                                                            const activePatternResult431 = _Prefix___("LSR", s);

                                                            if (activePatternResult431 != null) {
                                                                return toTuple("LSR", activePatternResult431);
                                                            } else {
                                                                const activePatternResult429 = _Prefix___("ASR", s);

                                                                if (activePatternResult429 != null) {
                                                                    return toTuple("ASR", activePatternResult429);
                                                                } else {
                                                                    const activePatternResult427 = _Prefix___("ROR", s);

                                                                    if (activePatternResult427 != null) {
                                                                        return toTuple("ROR", activePatternResult427);
                                                                    } else {
                                                                        const activePatternResult425 = _Prefix___("CMP", s);

                                                                        if (activePatternResult425 != null) {
                                                                            return toTuple("CMP", activePatternResult425);
                                                                        } else {
                                                                            const activePatternResult423 = _Prefix___("CMN", s);

                                                                            if (activePatternResult423 != null) {
                                                                                return toTuple("CMN", activePatternResult423);
                                                                            } else {
                                                                                const activePatternResult421 = _Prefix___("TST", s);

                                                                                if (activePatternResult421 != null) {
                                                                                    return toTuple("TST", activePatternResult421);
                                                                                } else {
                                                                                    const activePatternResult419 = _Prefix___("TEQ", s);

                                                                                    if (activePatternResult419 != null) {
                                                                                        return toTuple("TEQ", activePatternResult419);
                                                                                    } else {
                                                                                        const activePatternResult417 = _Prefix___("B", s);

                                                                                        if (activePatternResult417 != null) {
                                                                                            return toTuple("B", activePatternResult417);
                                                                                        } else {
                                                                                            const activePatternResult415 = _Prefix___("B", s);

                                                                                            if (activePatternResult415 != null) {
                                                                                                return toTuple("BL", activePatternResult415);
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

    function ParseInstruction(strlist) {
        const instruction = TokenizeInst((0, _Seq.item)(0, strlist));
        const basicinstruction = (0, _Seq.item)(0, instruction);
        const setflag = (0, _Seq.item)(1, instruction);
        const condition = (0, _Seq.item)(2, instruction);
        const instrline = (0, _List.ofArray)([basicinstruction, setflag, condition], strlist.tail);
        let $var4;

        if (instrline.tail != null) {
            const activePatternResult501 = _IsMOVInst___(instrline.head);

            if (activePatternResult501 != null) {
                if (instrline.tail.tail != null) {
                    const activePatternResult502 = _IsSetFlag___(instrline.tail.head);

                    if (activePatternResult502 != null) {
                        if (instrline.tail.tail.tail != null) {
                            const activePatternResult503 = _IsCondition___(instrline.tail.tail.head);

                            if (activePatternResult503 != null) {
                                if (instrline.tail.tail.tail.tail != null) {
                                    const activePatternResult504 = _IsReg___(instrline.tail.tail.tail.head);

                                    if (activePatternResult504 != null) {
                                        if (instrline.tail.tail.tail.tail.tail != null) {
                                            const activePatternResult505 = _IsRegOrLit___(instrline.tail.tail.tail.tail.head);

                                            if (activePatternResult505 != null) {
                                                if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                    $var4 = [0, activePatternResult503, activePatternResult504, activePatternResult501, activePatternResult505, activePatternResult502];
                                                } else {
                                                    $var4 = [1];
                                                }
                                            } else {
                                                $var4 = [1];
                                            }
                                        } else {
                                            $var4 = [1];
                                        }
                                    } else {
                                        $var4 = [1];
                                    }
                                } else {
                                    $var4 = [1];
                                }
                            } else {
                                $var4 = [1];
                            }
                        } else {
                            $var4 = [1];
                        }
                    } else {
                        $var4 = [1];
                    }
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
                return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var4[3]([$var4[2], $var4[4]]), $var4[5]]), null, $var4[1]]);

            case 1:
                let $var5;

                if (instrline.tail != null) {
                    const activePatternResult495 = _IsALUInst___(instrline.head);

                    if (activePatternResult495 != null) {
                        if (instrline.tail.tail != null) {
                            const activePatternResult496 = _IsSetFlag___(instrline.tail.head);

                            if (activePatternResult496 != null) {
                                if (instrline.tail.tail.tail != null) {
                                    const activePatternResult497 = _IsCondition___(instrline.tail.tail.head);

                                    if (activePatternResult497 != null) {
                                        if (instrline.tail.tail.tail.tail != null) {
                                            const activePatternResult498 = _IsReg___(instrline.tail.tail.tail.head);

                                            if (activePatternResult498 != null) {
                                                if (instrline.tail.tail.tail.tail.tail != null) {
                                                    const activePatternResult499 = _IsReg___(instrline.tail.tail.tail.tail.head);

                                                    if (activePatternResult499 != null) {
                                                        if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                            const activePatternResult500 = _IsRegOrLit___(instrline.tail.tail.tail.tail.tail.head);

                                                            if (activePatternResult500 != null) {
                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                    $var5 = [0, activePatternResult497, activePatternResult498, activePatternResult495, activePatternResult499, activePatternResult500, activePatternResult496];
                                                                } else {
                                                                    $var5 = [1];
                                                                }
                                                            } else {
                                                                $var5 = [1];
                                                            }
                                                        } else {
                                                            $var5 = [1];
                                                        }
                                                    } else {
                                                        $var5 = [1];
                                                    }
                                                } else {
                                                    $var5 = [1];
                                                }
                                            } else {
                                                $var5 = [1];
                                            }
                                        } else {
                                            $var5 = [1];
                                        }
                                    } else {
                                        $var5 = [1];
                                    }
                                } else {
                                    $var5 = [1];
                                }
                            } else {
                                $var5 = [1];
                            }
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
                        return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var5[3]([$var5[2], $var5[4], $var5[5]]), $var5[6]]), null, $var5[1]]);

                    case 1:
                        let $var6;

                        if (instrline.tail != null) {
                            const activePatternResult489 = _IsShiftInst___(instrline.head);

                            if (activePatternResult489 != null) {
                                if (instrline.tail.tail != null) {
                                    const activePatternResult490 = _IsSetFlag___(instrline.tail.head);

                                    if (activePatternResult490 != null) {
                                        if (instrline.tail.tail.tail != null) {
                                            const activePatternResult491 = _IsCondition___(instrline.tail.tail.head);

                                            if (activePatternResult491 != null) {
                                                if (instrline.tail.tail.tail.tail != null) {
                                                    const activePatternResult492 = _IsReg___(instrline.tail.tail.tail.head);

                                                    if (activePatternResult492 != null) {
                                                        if (instrline.tail.tail.tail.tail.tail != null) {
                                                            const activePatternResult493 = _IsReg___(instrline.tail.tail.tail.tail.head);

                                                            if (activePatternResult493 != null) {
                                                                if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                    const activePatternResult494 = _IsRegOrLit___(instrline.tail.tail.tail.tail.tail.head);

                                                                    if (activePatternResult494 != null) {
                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                            $var6 = [0, activePatternResult491, activePatternResult492, activePatternResult489, activePatternResult493, activePatternResult494, activePatternResult490];
                                                                        } else {
                                                                            $var6 = [1];
                                                                        }
                                                                    } else {
                                                                        $var6 = [1];
                                                                    }
                                                                } else {
                                                                    $var6 = [1];
                                                                }
                                                            } else {
                                                                $var6 = [1];
                                                            }
                                                        } else {
                                                            $var6 = [1];
                                                        }
                                                    } else {
                                                        $var6 = [1];
                                                    }
                                                } else {
                                                    $var6 = [1];
                                                }
                                            } else {
                                                $var6 = [1];
                                            }
                                        } else {
                                            $var6 = [1];
                                        }
                                    } else {
                                        $var6 = [1];
                                    }
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
                                return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [$var6[3]([$var6[2], $var6[4], $var6[5]]), $var6[6]]), null, $var6[1]]);

                            case 1:
                                let $var7;

                                if (instrline.tail != null) {
                                    const activePatternResult484 = _IsCOMPInst___(instrline.head);

                                    if (activePatternResult484 != null) {
                                        if (instrline.tail.tail != null) {
                                            const activePatternResult485 = _IsSetFlag___(instrline.tail.head);

                                            if (activePatternResult485 != null) {
                                                if (instrline.tail.tail.tail != null) {
                                                    const activePatternResult486 = _IsCondition___(instrline.tail.tail.head);

                                                    if (activePatternResult486 != null) {
                                                        if (instrline.tail.tail.tail.tail != null) {
                                                            const activePatternResult487 = _IsReg___(instrline.tail.tail.tail.head);

                                                            if (activePatternResult487 != null) {
                                                                if (instrline.tail.tail.tail.tail.tail != null) {
                                                                    const activePatternResult488 = _IsRegOrLit___(instrline.tail.tail.tail.tail.head);

                                                                    if (activePatternResult488 != null) {
                                                                        if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                            $var7 = [0, activePatternResult486, activePatternResult487, activePatternResult484, activePatternResult488, activePatternResult485];
                                                                        } else {
                                                                            $var7 = [1];
                                                                        }
                                                                    } else {
                                                                        $var7 = [1];
                                                                    }
                                                                } else {
                                                                    $var7 = [1];
                                                                }
                                                            } else {
                                                                $var7 = [1];
                                                            }
                                                        } else {
                                                            $var7 = [1];
                                                        }
                                                    } else {
                                                        $var7 = [1];
                                                    }
                                                } else {
                                                    $var7 = [1];
                                                }
                                            } else {
                                                $var7 = [1];
                                            }
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
                                        return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var7[3]([$var7[2], $var7[4]])]), null, $var7[1]]);

                                    case 1:
                                        let $var8;

                                        if (instrline.tail != null) {
                                            const activePatternResult477 = _IsMOVInst___(instrline.head);

                                            if (activePatternResult477 != null) {
                                                if (instrline.tail.tail != null) {
                                                    const activePatternResult478 = _IsSetFlag___(instrline.tail.head);

                                                    if (activePatternResult478 != null) {
                                                        if (instrline.tail.tail.tail != null) {
                                                            const activePatternResult479 = _IsCondition___(instrline.tail.tail.head);

                                                            if (activePatternResult479 != null) {
                                                                if (instrline.tail.tail.tail.tail != null) {
                                                                    const activePatternResult480 = _IsReg___(instrline.tail.tail.tail.head);

                                                                    if (activePatternResult480 != null) {
                                                                        if (instrline.tail.tail.tail.tail.tail != null) {
                                                                            const activePatternResult481 = _IsReg___(instrline.tail.tail.tail.tail.head);

                                                                            if (activePatternResult481 != null) {
                                                                                if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                    if (instrline.tail.tail.tail.tail.tail.head === ",") {
                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                            const activePatternResult482 = _IsShiftInst___(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                            if (activePatternResult482 != null) {
                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                    const activePatternResult483 = _IsRegOrLit___(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                    if (activePatternResult483 != null) {
                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                            $var8 = [0, activePatternResult479, activePatternResult480, activePatternResult483, activePatternResult477, activePatternResult481, activePatternResult478, activePatternResult482];
                                                                                                        } else {
                                                                                                            $var8 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var8 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var8 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var8 = [1];
                                                                                            }
                                                                                        } else {
                                                                                            $var8 = [1];
                                                                                        }
                                                                                    } else {
                                                                                        $var8 = [1];
                                                                                    }
                                                                                } else {
                                                                                    $var8 = [1];
                                                                                }
                                                                            } else {
                                                                                $var8 = [1];
                                                                            }
                                                                        } else {
                                                                            $var8 = [1];
                                                                        }
                                                                    } else {
                                                                        $var8 = [1];
                                                                    }
                                                                } else {
                                                                    $var8 = [1];
                                                                }
                                                            } else {
                                                                $var8 = [1];
                                                            }
                                                        } else {
                                                            $var8 = [1];
                                                        }
                                                    } else {
                                                        $var8 = [1];
                                                    }
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
                                                return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var8[4]([$var8[2], new _InstructionType.RegOrLit("Reg", [$var8[5]])]), $var8[6]]), $var8[7]([$var8[5], $var8[5], $var8[3]]), $var8[1]]);

                                            case 1:
                                                let $var9;

                                                if (instrline.tail != null) {
                                                    const activePatternResult469 = _IsALUInst___(instrline.head);

                                                    if (activePatternResult469 != null) {
                                                        if (instrline.tail.tail != null) {
                                                            const activePatternResult470 = _IsSetFlag___(instrline.tail.head);

                                                            if (activePatternResult470 != null) {
                                                                if (instrline.tail.tail.tail != null) {
                                                                    const activePatternResult471 = _IsCondition___(instrline.tail.tail.head);

                                                                    if (activePatternResult471 != null) {
                                                                        if (instrline.tail.tail.tail.tail != null) {
                                                                            const activePatternResult472 = _IsReg___(instrline.tail.tail.tail.head);

                                                                            if (activePatternResult472 != null) {
                                                                                if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                    const activePatternResult473 = _IsReg___(instrline.tail.tail.tail.tail.head);

                                                                                    if (activePatternResult473 != null) {
                                                                                        if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                            const activePatternResult474 = _IsReg___(instrline.tail.tail.tail.tail.tail.head);

                                                                                            if (activePatternResult474 != null) {
                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.head === ",") {
                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                            const activePatternResult475 = _IsShiftInst___(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                            if (activePatternResult475 != null) {
                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                    const activePatternResult476 = _IsRegOrLit___(instrline.tail.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                    if (activePatternResult476 != null) {
                                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                            $var9 = [0, activePatternResult471, activePatternResult472, activePatternResult476, activePatternResult469, activePatternResult473, activePatternResult474, activePatternResult470, activePatternResult475];
                                                                                                                        } else {
                                                                                                                            $var9 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var9 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var9 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var9 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var9 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var9 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var9 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var9 = [1];
                                                                                            }
                                                                                        } else {
                                                                                            $var9 = [1];
                                                                                        }
                                                                                    } else {
                                                                                        $var9 = [1];
                                                                                    }
                                                                                } else {
                                                                                    $var9 = [1];
                                                                                }
                                                                            } else {
                                                                                $var9 = [1];
                                                                            }
                                                                        } else {
                                                                            $var9 = [1];
                                                                        }
                                                                    } else {
                                                                        $var9 = [1];
                                                                    }
                                                                } else {
                                                                    $var9 = [1];
                                                                }
                                                            } else {
                                                                $var9 = [1];
                                                            }
                                                        } else {
                                                            $var9 = [1];
                                                        }
                                                    } else {
                                                        $var9 = [1];
                                                    }
                                                } else {
                                                    $var9 = [1];
                                                }

                                                switch ($var9[0]) {
                                                    case 0:
                                                        return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var9[4]([$var9[2], $var9[5], new _InstructionType.RegOrLit("Reg", [$var9[6]])]), $var9[7]]), $var9[8]([$var9[6], $var9[6], $var9[3]]), $var9[1]]);

                                                    case 1:
                                                        let $var10;

                                                        if (instrline.tail != null) {
                                                            const activePatternResult462 = _IsCOMPInst___(instrline.head);

                                                            if (activePatternResult462 != null) {
                                                                if (instrline.tail.tail != null) {
                                                                    const activePatternResult463 = _IsSetFlag___(instrline.tail.head);

                                                                    if (activePatternResult463 != null) {
                                                                        if (instrline.tail.tail.tail != null) {
                                                                            const activePatternResult464 = _IsCondition___(instrline.tail.tail.head);

                                                                            if (activePatternResult464 != null) {
                                                                                if (instrline.tail.tail.tail.tail != null) {
                                                                                    const activePatternResult465 = _IsReg___(instrline.tail.tail.tail.head);

                                                                                    if (activePatternResult465 != null) {
                                                                                        if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                            const activePatternResult466 = _IsReg___(instrline.tail.tail.tail.tail.head);

                                                                                            if (activePatternResult466 != null) {
                                                                                                if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.head === ",") {
                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                            const activePatternResult467 = _IsShiftInst___(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                            if (activePatternResult467 != null) {
                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                    const activePatternResult468 = _IsRegOrLit___(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                    if (activePatternResult468 != null) {
                                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                            $var10 = [0, activePatternResult464, activePatternResult465, activePatternResult468, activePatternResult462, activePatternResult466, activePatternResult463, activePatternResult467];
                                                                                                                        } else {
                                                                                                                            $var10 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var10 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var10 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var10 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var10 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var10 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var10 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var10 = [1];
                                                                                            }
                                                                                        } else {
                                                                                            $var10 = [1];
                                                                                        }
                                                                                    } else {
                                                                                        $var10 = [1];
                                                                                    }
                                                                                } else {
                                                                                    $var10 = [1];
                                                                                }
                                                                            } else {
                                                                                $var10 = [1];
                                                                            }
                                                                        } else {
                                                                            $var10 = [1];
                                                                        }
                                                                    } else {
                                                                        $var10 = [1];
                                                                    }
                                                                } else {
                                                                    $var10 = [1];
                                                                }
                                                            } else {
                                                                $var10 = [1];
                                                            }
                                                        } else {
                                                            $var10 = [1];
                                                        }

                                                        switch ($var10[0]) {
                                                            case 0:
                                                                return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var10[4]([$var10[2], new _InstructionType.RegOrLit("Reg", [$var10[5]])])]), $var10[7]([$var10[5], $var10[5], $var10[3]]), $var10[1]]);

                                                            case 1:
                                                                return (0, _String.fsFormat)("Unexpected match in parser: %A")(x => {
                                                                    throw new Error(x);
                                                                })(instrline);
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