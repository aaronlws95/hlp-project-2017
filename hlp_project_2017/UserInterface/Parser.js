define(["exports", "fable-core/umd/List", "fable-core/umd/Seq", "fable-core/umd/String", "./Cast", "fable-core/umd/Map", "./InstructionType", "fable-core/umd/GenericComparer", "fable-core/umd/Util", "./MachineState"], function (exports, _List, _Seq, _String, _Cast, _Map, _InstructionType, _GenericComparer, _Util, _MachineState) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.whiteSpace = undefined;
    exports.readAsm = readAsm;

    var _List2 = _interopRequireDefault(_List);

    var _GenericComparer2 = _interopRequireDefault(_GenericComparer);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const whiteSpace = exports.whiteSpace = [" ", "\f", "\t", "\r", "\n", ","];

    function readAsm(textInput) {
        const splitIntoLines = text => {
            return (0, _List.filter)((() => {
                const x = "";
                return y => x !== y;
            })(), (0, _Seq.toList)((0, _String.split)(text, "\r", "\n")));
        };

        const splitIntoWords = line => {
            return (0, _List.filter)((() => {
                const x_1 = "";
                return y_1 => x_1 !== y_1;
            })(), (0, _Seq.toList)((0, _String.split)((0, _String.replace)((0, _String.replace)((0, _String.replace)((0, _String.replace)((0, _String.replace)(line, "[", " [ "), "]", " ] "), "!", " ! "), ":", " : "), "=", " = "), ...whiteSpace)));
        };

        const lineList = (0, _List.filter)((() => {
            const x_2 = new _List2.default();
            return y_2 => !x_2.Equals(y_2);
        })(), (list => (0, _List.map)(splitIntoWords, list))(splitIntoLines(textInput)));
        let branch_map;

        const chooseAddr = b => i => {
            const matchValue = (0, _Seq.item)(i, lineList);
            let $var12;

            if (matchValue.tail != null) {
                const activePatternResult641 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.head);

                if (activePatternResult641 != null) {
                    if (matchValue.tail.tail != null) {
                        const activePatternResult642 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.tail.head);

                        if (activePatternResult642 != null) {
                            if (matchValue.tail.tail.tail != null) {
                                const activePatternResult643 = (0, _Cast.$7C$IsReg$7C$_$7C$)(matchValue.tail.tail.head);

                                if (activePatternResult643 != null) {
                                    $var12 = [0, activePatternResult641];
                                } else {
                                    $var12 = [1];
                                }
                            } else {
                                $var12 = [1];
                            }
                        } else {
                            $var12 = [1];
                        }
                    } else {
                        $var12 = [1];
                    }
                } else {
                    $var12 = [1];
                }
            } else {
                $var12 = [1];
            }

            switch ($var12[0]) {
                case 0:
                    return (0, _Map.add)($var12[1], new _InstructionType.Address("Addr", [i * 4]), b);

                case 1:
                    return b;
            }
        };

        branch_map = (() => {
            const state = (0, _Map.create)(null, new _GenericComparer2.default(_Util.compare));
            return source => (0, _Seq.fold)(function ($var13, $var14) {
                return chooseAddr($var13)($var14);
            }, state, source);
        })()((0, _Seq.range)(0, lineList.length - 1));

        const remove_branch_label = line_1 => {
            let $var15;

            if (line_1.tail != null) {
                const activePatternResult646 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.head);

                if (activePatternResult646 != null) {
                    if (line_1.tail.tail != null) {
                        const activePatternResult647 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.tail.head);

                        if (activePatternResult647 != null) {
                            if (line_1.tail.tail.tail != null) {
                                const activePatternResult648 = (0, _Cast.$7C$IsReg$7C$_$7C$)(line_1.tail.tail.head);

                                if (activePatternResult648 != null) {
                                    $var15 = [0];
                                } else {
                                    $var15 = [1];
                                }
                            } else {
                                $var15 = [1];
                            }
                        } else {
                            $var15 = [1];
                        }
                    } else {
                        $var15 = [1];
                    }
                } else {
                    $var15 = [1];
                }
            } else {
                $var15 = [1];
            }

            switch ($var15[0]) {
                case 0:
                    return line_1.tail;

                case 1:
                    return line_1;
            }
        };

        const executeWordsAsCommand = strlist => {
            const instruction = (0, _Cast.TokenizeInst)((0, _Seq.item)(0, strlist));
            const basicinstruction = (0, _Seq.item)(0, instruction);
            const setflag_or_byte = (0, _Seq.item)(1, instruction);
            const condition = (0, _Seq.item)(2, instruction);
            const instrline = (0, _List.ofArray)([basicinstruction, setflag_or_byte, condition], strlist.tail);
            let $var16;

            if (instrline.tail != null) {
                const activePatternResult743 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                if (activePatternResult743 != null) {
                    if (instrline.tail.tail != null) {
                        const activePatternResult744 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                        if (activePatternResult744 != null) {
                            if (instrline.tail.tail.tail != null) {
                                const activePatternResult745 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                if (activePatternResult745 != null) {
                                    if (instrline.tail.tail.tail.tail != null) {
                                        const activePatternResult746 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                        if (activePatternResult746 != null) {
                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                const activePatternResult747 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                if (activePatternResult747 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                        $var16 = [0, activePatternResult745, activePatternResult746, activePatternResult743, activePatternResult747, activePatternResult744];
                                                    } else {
                                                        $var16 = [1];
                                                    }
                                                } else {
                                                    $var16 = [1];
                                                }
                                            } else {
                                                $var16 = [1];
                                            }
                                        } else {
                                            $var16 = [1];
                                        }
                                    } else {
                                        $var16 = [1];
                                    }
                                } else {
                                    $var16 = [1];
                                }
                            } else {
                                $var16 = [1];
                            }
                        } else {
                            $var16 = [1];
                        }
                    } else {
                        $var16 = [1];
                    }
                } else {
                    $var16 = [1];
                }
            } else {
                $var16 = [1];
            }

            switch ($var16[0]) {
                case 0:
                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var16[3]([$var16[2], $var16[4]]), $var16[5]]), null, (0, _Cast.CondCast)($var16[1])]);

                case 1:
                    let $var17;

                    if (instrline.tail != null) {
                        const activePatternResult737 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                        if (activePatternResult737 != null) {
                            if (instrline.tail.tail != null) {
                                const activePatternResult738 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                if (activePatternResult738 != null) {
                                    if (instrline.tail.tail.tail != null) {
                                        const activePatternResult739 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                        if (activePatternResult739 != null) {
                                            if (instrline.tail.tail.tail.tail != null) {
                                                const activePatternResult740 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                if (activePatternResult740 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                        const activePatternResult741 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                        if (activePatternResult741 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult742 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                if (activePatternResult742 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                        $var17 = [0, activePatternResult739, activePatternResult740, activePatternResult737, activePatternResult741, activePatternResult742, activePatternResult738];
                                                                    } else {
                                                                        $var17 = [1];
                                                                    }
                                                                } else {
                                                                    $var17 = [1];
                                                                }
                                                            } else {
                                                                $var17 = [1];
                                                            }
                                                        } else {
                                                            $var17 = [1];
                                                        }
                                                    } else {
                                                        $var17 = [1];
                                                    }
                                                } else {
                                                    $var17 = [1];
                                                }
                                            } else {
                                                $var17 = [1];
                                            }
                                        } else {
                                            $var17 = [1];
                                        }
                                    } else {
                                        $var17 = [1];
                                    }
                                } else {
                                    $var17 = [1];
                                }
                            } else {
                                $var17 = [1];
                            }
                        } else {
                            $var17 = [1];
                        }
                    } else {
                        $var17 = [1];
                    }

                    switch ($var17[0]) {
                        case 0:
                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var17[3]([$var17[2], $var17[4], $var17[5]]), $var17[6]]), null, (0, _Cast.CondCast)($var17[1])]);

                        case 1:
                            let $var18;

                            if (instrline.tail != null) {
                                const activePatternResult731 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.head);

                                if (activePatternResult731 != null) {
                                    if (instrline.tail.tail != null) {
                                        const activePatternResult732 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                        if (activePatternResult732 != null) {
                                            if (instrline.tail.tail.tail != null) {
                                                const activePatternResult733 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                if (activePatternResult733 != null) {
                                                    if (instrline.tail.tail.tail.tail != null) {
                                                        const activePatternResult734 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                        if (activePatternResult734 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult735 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                if (activePatternResult735 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult736 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                        if (activePatternResult736 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var18 = [0, activePatternResult733, activePatternResult734, activePatternResult731, activePatternResult735, activePatternResult736, activePatternResult732];
                                                                            } else {
                                                                                $var18 = [1];
                                                                            }
                                                                        } else {
                                                                            $var18 = [1];
                                                                        }
                                                                    } else {
                                                                        $var18 = [1];
                                                                    }
                                                                } else {
                                                                    $var18 = [1];
                                                                }
                                                            } else {
                                                                $var18 = [1];
                                                            }
                                                        } else {
                                                            $var18 = [1];
                                                        }
                                                    } else {
                                                        $var18 = [1];
                                                    }
                                                } else {
                                                    $var18 = [1];
                                                }
                                            } else {
                                                $var18 = [1];
                                            }
                                        } else {
                                            $var18 = [1];
                                        }
                                    } else {
                                        $var18 = [1];
                                    }
                                } else {
                                    $var18 = [1];
                                }
                            } else {
                                $var18 = [1];
                            }

                            switch ($var18[0]) {
                                case 0:
                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [$var18[3]([$var18[2], $var18[4], $var18[5]]), $var18[6]]), null, (0, _Cast.CondCast)($var18[1])]);

                                case 1:
                                    let $var19;

                                    if (instrline.tail != null) {
                                        if (instrline.head === "RRX") {
                                            if (instrline.tail.tail != null) {
                                                const activePatternResult727 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                if (activePatternResult727 != null) {
                                                    if (instrline.tail.tail.tail != null) {
                                                        const activePatternResult728 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                        if (activePatternResult728 != null) {
                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                const activePatternResult729 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                if (activePatternResult729 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult730 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                        if (activePatternResult730 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var19 = [0, activePatternResult728, activePatternResult729, activePatternResult730, activePatternResult727];
                                                                            } else {
                                                                                $var19 = [1];
                                                                            }
                                                                        } else {
                                                                            $var19 = [1];
                                                                        }
                                                                    } else {
                                                                        $var19 = [1];
                                                                    }
                                                                } else {
                                                                    $var19 = [1];
                                                                }
                                                            } else {
                                                                $var19 = [1];
                                                            }
                                                        } else {
                                                            $var19 = [1];
                                                        }
                                                    } else {
                                                        $var19 = [1];
                                                    }
                                                } else {
                                                    $var19 = [1];
                                                }
                                            } else {
                                                $var19 = [1];
                                            }
                                        } else {
                                            $var19 = [1];
                                        }
                                    } else {
                                        $var19 = [1];
                                    }

                                    switch ($var19[0]) {
                                        case 0:
                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [new _InstructionType.SHIFTInst("RRX", [$var19[2], $var19[3]]), $var19[4]]), null, (0, _Cast.CondCast)($var19[1])]);

                                        case 1:
                                            let $var20;

                                            if (instrline.tail != null) {
                                                const activePatternResult723 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

                                                if (activePatternResult723 != null) {
                                                    if (instrline.tail.tail != null) {
                                                        if (instrline.tail.tail.tail != null) {
                                                            const activePatternResult724 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                            if (activePatternResult724 != null) {
                                                                if (instrline.tail.tail.tail.tail != null) {
                                                                    const activePatternResult725 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                    if (activePatternResult725 != null) {
                                                                        if (instrline.tail.tail.tail.tail.tail != null) {
                                                                            const activePatternResult726 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                            if (activePatternResult726 != null) {
                                                                                if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                    $var20 = [0, activePatternResult724, activePatternResult725, activePatternResult723, activePatternResult726];
                                                                                } else {
                                                                                    $var20 = [1];
                                                                                }
                                                                            } else {
                                                                                $var20 = [1];
                                                                            }
                                                                        } else {
                                                                            $var20 = [1];
                                                                        }
                                                                    } else {
                                                                        $var20 = [1];
                                                                    }
                                                                } else {
                                                                    $var20 = [1];
                                                                }
                                                            } else {
                                                                $var20 = [1];
                                                            }
                                                        } else {
                                                            $var20 = [1];
                                                        }
                                                    } else {
                                                        $var20 = [1];
                                                    }
                                                } else {
                                                    $var20 = [1];
                                                }
                                            } else {
                                                $var20 = [1];
                                            }

                                            switch ($var20[0]) {
                                                case 0:
                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var20[3]([$var20[2], $var20[4]])]), null, (0, _Cast.CondCast)($var20[1])]);

                                                case 1:
                                                    let $var21;

                                                    if (instrline.tail != null) {
                                                        const activePatternResult719 = (0, _Cast.$7C$IsBranchInst$7C$_$7C$)(instrline.head);

                                                        if (activePatternResult719 != null) {
                                                            if (instrline.tail.tail != null) {
                                                                if (instrline.tail.tail.tail != null) {
                                                                    const activePatternResult720 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                    if (activePatternResult720 != null) {
                                                                        if (instrline.tail.tail.tail.tail != null) {
                                                                            const activePatternResult722 = (0, _Cast.$7C$IsAddr$7C$_$7C$)(branch_map, instrline.tail.tail.tail.head);

                                                                            if (activePatternResult722 != null) {
                                                                                if (instrline.tail.tail.tail.tail.tail == null) {
                                                                                    $var21 = [0, activePatternResult722, activePatternResult720, activePatternResult719];
                                                                                } else {
                                                                                    $var21 = [1];
                                                                                }
                                                                            } else {
                                                                                $var21 = [1];
                                                                            }
                                                                        } else {
                                                                            $var21 = [1];
                                                                        }
                                                                    } else {
                                                                        $var21 = [1];
                                                                    }
                                                                } else {
                                                                    $var21 = [1];
                                                                }
                                                            } else {
                                                                $var21 = [1];
                                                            }
                                                        } else {
                                                            $var21 = [1];
                                                        }
                                                    } else {
                                                        $var21 = [1];
                                                    }

                                                    switch ($var21[0]) {
                                                        case 0:
                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("BRANCH", [$var21[3]($var21[1])]), null, (0, _Cast.CondCast)($var21[2])]);

                                                        case 1:
                                                            let $var22;

                                                            if (instrline.tail != null) {
                                                                const activePatternResult712 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                                                                if (activePatternResult712 != null) {
                                                                    if (instrline.tail.tail != null) {
                                                                        const activePatternResult713 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                        if (activePatternResult713 != null) {
                                                                            if (instrline.tail.tail.tail != null) {
                                                                                const activePatternResult714 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                if (activePatternResult714 != null) {
                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                        const activePatternResult715 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                        if (activePatternResult715 != null) {
                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult716 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                if (activePatternResult716 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult717 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                        if (activePatternResult717 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult718 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult718 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                        $var22 = [0, activePatternResult714, activePatternResult715, activePatternResult718, activePatternResult712, activePatternResult716, activePatternResult713, activePatternResult717];
                                                                                                                    } else {
                                                                                                                        $var22 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var22 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var22 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var22 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var22 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var22 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var22 = [1];
                                                                                            }
                                                                                        } else {
                                                                                            $var22 = [1];
                                                                                        }
                                                                                    } else {
                                                                                        $var22 = [1];
                                                                                    }
                                                                                } else {
                                                                                    $var22 = [1];
                                                                                }
                                                                            } else {
                                                                                $var22 = [1];
                                                                            }
                                                                        } else {
                                                                            $var22 = [1];
                                                                        }
                                                                    } else {
                                                                        $var22 = [1];
                                                                    }
                                                                } else {
                                                                    $var22 = [1];
                                                                }
                                                            } else {
                                                                $var22 = [1];
                                                            }

                                                            switch ($var22[0]) {
                                                                case 0:
                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var22[4]([$var22[2], new _InstructionType.RegOrLit("Reg", [$var22[5]])]), $var22[6]]), $var22[7]([$var22[5], $var22[5], $var22[3]]), (0, _Cast.CondCast)($var22[1])]);

                                                                case 1:
                                                                    let $var23;

                                                                    if (instrline.tail != null) {
                                                                        const activePatternResult704 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                                                                        if (activePatternResult704 != null) {
                                                                            if (instrline.tail.tail != null) {
                                                                                const activePatternResult705 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                                if (activePatternResult705 != null) {
                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                        const activePatternResult706 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                        if (activePatternResult706 != null) {
                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult707 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                if (activePatternResult707 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult708 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                        if (activePatternResult708 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult709 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult709 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult710 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult710 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult711 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                if (activePatternResult711 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                        $var23 = [0, activePatternResult706, activePatternResult707, activePatternResult711, activePatternResult704, activePatternResult708, activePatternResult709, activePatternResult705, activePatternResult710];
                                                                                                                                    } else {
                                                                                                                                        $var23 = [1];
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    $var23 = [1];
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                $var23 = [1];
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            $var23 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var23 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var23 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var23 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var23 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var23 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var23 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var23 = [1];
                                                                                            }
                                                                                        } else {
                                                                                            $var23 = [1];
                                                                                        }
                                                                                    } else {
                                                                                        $var23 = [1];
                                                                                    }
                                                                                } else {
                                                                                    $var23 = [1];
                                                                                }
                                                                            } else {
                                                                                $var23 = [1];
                                                                            }
                                                                        } else {
                                                                            $var23 = [1];
                                                                        }
                                                                    } else {
                                                                        $var23 = [1];
                                                                    }

                                                                    switch ($var23[0]) {
                                                                        case 0:
                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var23[4]([$var23[2], $var23[5], new _InstructionType.RegOrLit("Reg", [$var23[6]])]), $var23[7]]), $var23[8]([$var23[6], $var23[6], $var23[3]]), (0, _Cast.CondCast)($var23[1])]);

                                                                        case 1:
                                                                            let $var24;

                                                                            if (instrline.tail != null) {
                                                                                const activePatternResult697 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

                                                                                if (activePatternResult697 != null) {
                                                                                    if (instrline.tail.tail != null) {
                                                                                        const activePatternResult698 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                                        if (activePatternResult698 != null) {
                                                                                            if (instrline.tail.tail.tail != null) {
                                                                                                const activePatternResult699 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                if (activePatternResult699 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult700 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                        if (activePatternResult700 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult701 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult701 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult702 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult702 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult703 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                if (activePatternResult703 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                        $var24 = [0, activePatternResult699, activePatternResult700, activePatternResult703, activePatternResult697, activePatternResult701, activePatternResult698, activePatternResult702];
                                                                                                                                    } else {
                                                                                                                                        $var24 = [1];
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    $var24 = [1];
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                $var24 = [1];
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            $var24 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var24 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var24 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var24 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var24 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var24 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var24 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var24 = [1];
                                                                                            }
                                                                                        } else {
                                                                                            $var24 = [1];
                                                                                        }
                                                                                    } else {
                                                                                        $var24 = [1];
                                                                                    }
                                                                                } else {
                                                                                    $var24 = [1];
                                                                                }
                                                                            } else {
                                                                                $var24 = [1];
                                                                            }

                                                                            switch ($var24[0]) {
                                                                                case 0:
                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var24[4]([$var24[2], new _InstructionType.RegOrLit("Reg", [$var24[5]])])]), $var24[7]([$var24[5], $var24[5], $var24[3]]), (0, _Cast.CondCast)($var24[1])]);

                                                                                case 1:
                                                                                    let $var25;

                                                                                    if (instrline.tail != null) {
                                                                                        if (instrline.head === "ADR") {
                                                                                            if (instrline.tail.tail != null) {
                                                                                                const activePatternResult692 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                                                if (activePatternResult692 != null) {
                                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                                        const activePatternResult693 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                        if (activePatternResult693 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult694 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                if (activePatternResult694 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult696 = (0, _Cast.$7C$IsAddr$7C$_$7C$)(branch_map, instrline.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult696 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                $var25 = [0, activePatternResult696, activePatternResult693, activePatternResult694, activePatternResult692];
                                                                                                                            } else {
                                                                                                                                $var25 = [1];
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            $var25 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var25 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var25 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var25 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var25 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var25 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var25 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var25 = [1];
                                                                                            }
                                                                                        } else {
                                                                                            $var25 = [1];
                                                                                        }
                                                                                    } else {
                                                                                        $var25 = [1];
                                                                                    }

                                                                                    switch ($var25[0]) {
                                                                                        case 0:
                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [new _InstructionType.MEMInst("ADR", [$var25[3], $var25[1]])]), null, (0, _Cast.CondCast)($var25[2])]);

                                                                                        case 1:
                                                                                            let $var26;

                                                                                            if (instrline.tail != null) {
                                                                                                const activePatternResult687 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                if (activePatternResult687 != null) {
                                                                                                    if (instrline.tail.tail != null) {
                                                                                                        const activePatternResult688 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                        if (activePatternResult688 != null) {
                                                                                                            if (instrline.tail.tail.tail != null) {
                                                                                                                const activePatternResult689 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                if (activePatternResult689 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult690 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                        if (activePatternResult690 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                        const activePatternResult691 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                        if (activePatternResult691 != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                        $var26 = [0, activePatternResult688, activePatternResult689, activePatternResult690, activePatternResult687, activePatternResult691];
                                                                                                                                                    } else {
                                                                                                                                                        $var26 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var26 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var26 = [1];
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            $var26 = [1];
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        $var26 = [1];
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    $var26 = [1];
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                $var26 = [1];
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            $var26 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var26 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var26 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var26 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var26 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var26 = [1];
                                                                                                    }
                                                                                                } else {
                                                                                                    $var26 = [1];
                                                                                                }
                                                                                            } else {
                                                                                                $var26 = [1];
                                                                                            }

                                                                                            switch ($var26[0]) {
                                                                                                case 0:
                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var26[4]([$var26[3], $var26[5], new _InstructionType.RegOrLit("Lit", [0]), new _InstructionType.RegOrLit("Lit", [0]), $var26[1]])]), null, (0, _Cast.CondCast)($var26[2])]);

                                                                                                case 1:
                                                                                                    let $var27;

                                                                                                    if (instrline.tail != null) {
                                                                                                        const activePatternResult681 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                        if (activePatternResult681 != null) {
                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                const activePatternResult682 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                                if (activePatternResult682 != null) {
                                                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                                                        const activePatternResult683 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                        if (activePatternResult683 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult684 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                                if (activePatternResult684 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                        if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                const activePatternResult685 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                                if (activePatternResult685 != null) {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        const activePatternResult686 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                        if (activePatternResult686 != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                        $var27 = [0, activePatternResult682, activePatternResult683, activePatternResult684, activePatternResult681, activePatternResult686, activePatternResult685];
                                                                                                                                                                    } else {
                                                                                                                                                                        $var27 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var27 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var27 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var27 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var27 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var27 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var27 = [1];
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            $var27 = [1];
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        $var27 = [1];
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    $var27 = [1];
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                $var27 = [1];
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            $var27 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var27 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var27 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var27 = [1];
                                                                                                            }
                                                                                                        } else {
                                                                                                            $var27 = [1];
                                                                                                        }
                                                                                                    } else {
                                                                                                        $var27 = [1];
                                                                                                    }

                                                                                                    switch ($var27[0]) {
                                                                                                        case 0:
                                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var27[4]([$var27[3], $var27[6], $var27[5], new _InstructionType.RegOrLit("Lit", [0]), $var27[1]])]), null, (0, _Cast.CondCast)($var27[2])]);

                                                                                                        case 1:
                                                                                                            let $var28;

                                                                                                            if (instrline.tail != null) {
                                                                                                                const activePatternResult675 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                                if (activePatternResult675 != null) {
                                                                                                                    if (instrline.tail.tail != null) {
                                                                                                                        const activePatternResult676 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                                        if (activePatternResult676 != null) {
                                                                                                                            if (instrline.tail.tail.tail != null) {
                                                                                                                                const activePatternResult677 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                                if (activePatternResult677 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                        const activePatternResult678 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                                        if (activePatternResult678 != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        const activePatternResult679 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                                        if (activePatternResult679 != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                const activePatternResult680 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                if (activePatternResult680 != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.head === "!") {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var28 = [0, activePatternResult676, activePatternResult677, activePatternResult678, activePatternResult675, activePatternResult680, activePatternResult679];
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var28 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var28 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var28 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var28 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var28 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var28 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var28 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var28 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var28 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var28 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var28 = [1];
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            $var28 = [1];
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        $var28 = [1];
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    $var28 = [1];
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                $var28 = [1];
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            $var28 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var28 = [1];
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    $var28 = [1];
                                                                                                                }
                                                                                                            } else {
                                                                                                                $var28 = [1];
                                                                                                            }

                                                                                                            switch ($var28[0]) {
                                                                                                                case 0:
                                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var28[4]([$var28[3], $var28[6], $var28[5], new _InstructionType.RegOrLit("Lit", [0]), $var28[1]])]), null, (0, _Cast.CondCast)($var28[2])]);

                                                                                                                case 1:
                                                                                                                    let $var29;

                                                                                                                    if (instrline.tail != null) {
                                                                                                                        const activePatternResult669 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                                        if (activePatternResult669 != null) {
                                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                                const activePatternResult670 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                                                if (activePatternResult670 != null) {
                                                                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                                                                        const activePatternResult671 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                                        if (activePatternResult671 != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                const activePatternResult672 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                                                if (activePatternResult672 != null) {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                const activePatternResult673 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                                                if (activePatternResult673 != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult674 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult674 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var29 = [0, activePatternResult670, activePatternResult671, activePatternResult672, activePatternResult669, activePatternResult674, activePatternResult673];
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var29 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var29 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var29 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var29 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var29 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var29 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var29 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var29 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var29 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var29 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var29 = [1];
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            $var29 = [1];
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        $var29 = [1];
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    $var29 = [1];
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                $var29 = [1];
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            $var29 = [1];
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        $var29 = [1];
                                                                                                                    }

                                                                                                                    switch ($var29[0]) {
                                                                                                                        case 0:
                                                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var29[4]([$var29[3], $var29[6], $var29[5], new _InstructionType.RegOrLit("Lit", [0]), $var29[1]])]), null, (0, _Cast.CondCast)($var29[2])]);

                                                                                                                        case 1:
                                                                                                                            let $var30;

                                                                                                                            if (instrline.tail != null) {
                                                                                                                                const activePatternResult665 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                if (activePatternResult665 != null) {
                                                                                                                                    if (instrline.tail.tail != null) {
                                                                                                                                        if (instrline.tail.tail.tail != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        const activePatternResult666 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                        if (activePatternResult666 != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        const activePatternResult667 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                        if (activePatternResult667 != null) {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult668 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult668 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var30 = [0, activePatternResult667, activePatternResult666, activePatternResult665, activePatternResult668];
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var30 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var30 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var30 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var30 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var30 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var30 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var30 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var30 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var30 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var30 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var30 = [1];
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            $var30 = [1];
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        $var30 = [1];
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    $var30 = [1];
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                $var30 = [1];
                                                                                                                            }

                                                                                                                            switch ($var30[0]) {
                                                                                                                                case 0:
                                                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var30[3]([$var30[2], $var30[4], new _List2.default(), false])]), null, (0, _Cast.CondCast)($var30[1])]);

                                                                                                                                case 1:
                                                                                                                                    let $var31;

                                                                                                                                    if (instrline.tail != null) {
                                                                                                                                        const activePatternResult662 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                        if (activePatternResult662 != null) {
                                                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail != null) {
                                                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                        if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                const activePatternResult663 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                                if (activePatternResult663 != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult664 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult664 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var31 = [0, activePatternResult663, activePatternResult662, activePatternResult664];
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var31 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var31 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var31 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var31 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var31 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var31 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var31 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var31 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var31 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var31 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var31 = [1];
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            $var31 = [1];
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        $var31 = [1];
                                                                                                                                    }

                                                                                                                                    switch ($var31[0]) {
                                                                                                                                        case 0:
                                                                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var31[2]([$var31[1], $var31[3], new _List2.default(), false])]), null, null]);

                                                                                                                                        case 1:
                                                                                                                                            let $var32;

                                                                                                                                            if (instrline.tail != null) {
                                                                                                                                                const activePatternResult657 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                                if (activePatternResult657 != null) {
                                                                                                                                                    if (instrline.tail.tail != null) {
                                                                                                                                                        if (instrline.tail.tail.tail != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        const activePatternResult658 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                                        if (activePatternResult658 != null) {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                        const activePatternResult659 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                        if (activePatternResult659 != null) {
                                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                                const activePatternResult660 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                                if (activePatternResult660 != null) {
                                                                                                                                                                                                    const activePatternResult661 = (0, _Cast.$7C$IsRegList$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.tail);

                                                                                                                                                                                                    if (activePatternResult661 != null) {
                                                                                                                                                                                                        $var32 = [0, activePatternResult659, activePatternResult658, activePatternResult657, activePatternResult661, activePatternResult660];
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        $var32 = [1];
                                                                                                                                                                                                    }
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    $var32 = [1];
                                                                                                                                                                                                }
                                                                                                                                                                                            } else {
                                                                                                                                                                                                $var32 = [1];
                                                                                                                                                                                            }
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $var32 = [1];
                                                                                                                                                                                        }
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var32 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var32 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var32 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var32 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var32 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var32 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var32 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var32 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var32 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var32 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var32 = [1];
                                                                                                                                            }

                                                                                                                                            switch ($var32[0]) {
                                                                                                                                                case 0:
                                                                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var32[3]([$var32[2], $var32[5], $var32[4], false])]), null, (0, _Cast.CondCast)($var32[1])]);

                                                                                                                                                case 1:
                                                                                                                                                    let $var33;

                                                                                                                                                    if (instrline.tail != null) {
                                                                                                                                                        const activePatternResult653 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                                        if (activePatternResult653 != null) {
                                                                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult654 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult654 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                                const activePatternResult655 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                                if (activePatternResult655 != null) {
                                                                                                                                                                                                    const activePatternResult656 = (0, _Cast.$7C$IsRegList$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail);

                                                                                                                                                                                                    if (activePatternResult656 != null) {
                                                                                                                                                                                                        $var33 = [0, activePatternResult654, activePatternResult653, activePatternResult656, activePatternResult655];
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        $var33 = [1];
                                                                                                                                                                                                    }
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    $var33 = [1];
                                                                                                                                                                                                }
                                                                                                                                                                                            } else {
                                                                                                                                                                                                $var33 = [1];
                                                                                                                                                                                            }
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $var33 = [1];
                                                                                                                                                                                        }
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var33 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var33 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var33 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var33 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var33 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var33 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var33 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var33 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var33 = [1];
                                                                                                                                                    }

                                                                                                                                                    switch ($var33[0]) {
                                                                                                                                                        case 0:
                                                                                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var33[2]([$var33[1], $var33[4], $var33[3], false])]), null, null]);

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
        };

        const instList = (list_1 => (0, _List.map)(executeWordsAsCommand, list_1))((list_2 => (0, _List.map)(remove_branch_label, list_2))(lineList));

        const init_reg = (0, _Map.create)((0, _Seq.map)(x_3 => [new _InstructionType.Register("R", [x_3]), 0], (0, _Seq.toList)((0, _Seq.range)(0, 15))), new _GenericComparer2.default((x, y) => x.CompareTo(y)));
        let init_memory;

        const chooseAddr_1 = m => i_1 => {
            return (0, _Map.add)(new _InstructionType.Address("Addr", [i_1 * 4]), new _InstructionType.Memory("Inst", [(0, _Seq.item)(i_1, instList)]), m);
        };

        init_memory = (() => {
            const state_1 = (0, _Map.create)(null, new _GenericComparer2.default((x, y) => x.CompareTo(y)));
            return source_1 => (0, _Seq.fold)(function ($var34, $var35) {
                return chooseAddr_1($var34)($var35);
            }, state_1, source_1);
        })()((0, _Seq.range)(0, instList.length - 1));

        return new _MachineState.MachineState(new _InstructionType.Address("Addr", [4 * instList.length]), init_reg, init_memory, new _MachineState.Flags(false, false, false, false), new _MachineState.RunState("RunOK", []));
    }
});
//# sourceMappingURL=Parser.js.map