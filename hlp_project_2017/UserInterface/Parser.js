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
            })(), (0, _Seq.toList)((0, _String.split)((0, _String.replace)((0, _String.replace)((0, _String.replace)((0, _String.replace)((0, _String.replace)(line.toLocaleUpperCase(), "[", " [ "), "]", " ] "), "!", " ! "), ":", " : "), "=", " = "), ...whiteSpace)));
        };

        const lineList = (0, _List.filter)((() => {
            const x_2 = new _List2.default();
            return y_2 => !x_2.Equals(y_2);
        })(), (list => (0, _List.map)(splitIntoWords, list))(splitIntoLines(textInput)));
        let branch_map;

        const chooseAddr = b => i => {
            const matchValue = (0, _Seq.item)(i, lineList);
            let $var14;

            if (matchValue.tail != null) {
                const activePatternResult687 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.head);

                if (activePatternResult687 != null) {
                    if (matchValue.tail.tail != null) {
                        const activePatternResult688 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.tail.head);

                        if (activePatternResult688 != null) {
                            if (matchValue.tail.tail.tail != null) {
                                const activePatternResult689 = (0, _Cast.$7C$IsReg$7C$_$7C$)(matchValue.tail.tail.head);

                                if (activePatternResult689 != null) {
                                    $var14 = [0, activePatternResult687];
                                } else {
                                    $var14 = [1];
                                }
                            } else {
                                $var14 = [1];
                            }
                        } else {
                            $var14 = [1];
                        }
                    } else {
                        $var14 = [1];
                    }
                } else {
                    $var14 = [1];
                }
            } else {
                $var14 = [1];
            }

            switch ($var14[0]) {
                case 0:
                    return (0, _Map.add)($var14[1], new _InstructionType.Address("Addr", [i * 4]), b);

                case 1:
                    return b;
            }
        };

        branch_map = (() => {
            const state = (0, _Map.create)(null, new _GenericComparer2.default(_Util.compare));
            return source => (0, _Seq.fold)(function ($var15, $var16) {
                return chooseAddr($var15)($var16);
            }, state, source);
        })()((0, _Seq.range)(0, lineList.length - 1));

        const remove_branch_label = line_1 => {
            let $var17;

            if (line_1.tail != null) {
                const activePatternResult692 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.head);

                if (activePatternResult692 != null) {
                    if (line_1.tail.tail != null) {
                        const activePatternResult693 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.tail.head);

                        if (activePatternResult693 != null) {
                            if (line_1.tail.tail.tail != null) {
                                const activePatternResult694 = (0, _Cast.$7C$IsReg$7C$_$7C$)(line_1.tail.tail.head);

                                if (activePatternResult694 != null) {
                                    $var17 = [0];
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
            let $var18;

            if (instrline.tail != null) {
                const activePatternResult789 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                if (activePatternResult789 != null) {
                    if (instrline.tail.tail != null) {
                        const activePatternResult790 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                        if (activePatternResult790 != null) {
                            if (instrline.tail.tail.tail != null) {
                                const activePatternResult791 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                if (activePatternResult791 != null) {
                                    if (instrline.tail.tail.tail.tail != null) {
                                        const activePatternResult792 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                        if (activePatternResult792 != null) {
                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                const activePatternResult793 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                if (activePatternResult793 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                        $var18 = [0, activePatternResult791, activePatternResult792, activePatternResult789, activePatternResult793, activePatternResult790];
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
                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var18[3]([$var18[2], $var18[4]]), $var18[5]]), null, (0, _Cast.CondCast)($var18[1])]);

                case 1:
                    let $var19;

                    if (instrline.tail != null) {
                        const activePatternResult783 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                        if (activePatternResult783 != null) {
                            if (instrline.tail.tail != null) {
                                const activePatternResult784 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                if (activePatternResult784 != null) {
                                    if (instrline.tail.tail.tail != null) {
                                        const activePatternResult785 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                        if (activePatternResult785 != null) {
                                            if (instrline.tail.tail.tail.tail != null) {
                                                const activePatternResult786 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                if (activePatternResult786 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                        const activePatternResult787 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                        if (activePatternResult787 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult788 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                if (activePatternResult788 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                        $var19 = [0, activePatternResult785, activePatternResult786, activePatternResult783, activePatternResult787, activePatternResult788, activePatternResult784];
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
                        } else {
                            $var19 = [1];
                        }
                    } else {
                        $var19 = [1];
                    }

                    switch ($var19[0]) {
                        case 0:
                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var19[3]([$var19[2], $var19[4], $var19[5]]), $var19[6]]), null, (0, _Cast.CondCast)($var19[1])]);

                        case 1:
                            let $var20;

                            if (instrline.tail != null) {
                                const activePatternResult777 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.head);

                                if (activePatternResult777 != null) {
                                    if (instrline.tail.tail != null) {
                                        const activePatternResult778 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                        if (activePatternResult778 != null) {
                                            if (instrline.tail.tail.tail != null) {
                                                const activePatternResult779 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                if (activePatternResult779 != null) {
                                                    if (instrline.tail.tail.tail.tail != null) {
                                                        const activePatternResult780 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                        if (activePatternResult780 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult781 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                if (activePatternResult781 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult782 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                        if (activePatternResult782 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var20 = [0, activePatternResult779, activePatternResult780, activePatternResult777, activePatternResult781, activePatternResult782, activePatternResult778];
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
                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [$var20[3]([$var20[2], $var20[4], $var20[5]]), $var20[6]]), null, (0, _Cast.CondCast)($var20[1])]);

                                case 1:
                                    let $var21;

                                    if (instrline.tail != null) {
                                        if (instrline.head === "RRX") {
                                            if (instrline.tail.tail != null) {
                                                const activePatternResult773 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                if (activePatternResult773 != null) {
                                                    if (instrline.tail.tail.tail != null) {
                                                        const activePatternResult774 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                        if (activePatternResult774 != null) {
                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                const activePatternResult775 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                if (activePatternResult775 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult776 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                        if (activePatternResult776 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var21 = [0, activePatternResult774, activePatternResult775, activePatternResult776, activePatternResult773];
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
                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [new _InstructionType.SHIFTInst("RRX", [$var21[2], $var21[3]]), $var21[4]]), null, (0, _Cast.CondCast)($var21[1])]);

                                        case 1:
                                            let $var22;

                                            if (instrline.tail != null) {
                                                const activePatternResult769 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

                                                if (activePatternResult769 != null) {
                                                    if (instrline.tail.tail != null) {
                                                        if (instrline.tail.tail.tail != null) {
                                                            const activePatternResult770 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                            if (activePatternResult770 != null) {
                                                                if (instrline.tail.tail.tail.tail != null) {
                                                                    const activePatternResult771 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                    if (activePatternResult771 != null) {
                                                                        if (instrline.tail.tail.tail.tail.tail != null) {
                                                                            const activePatternResult772 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                            if (activePatternResult772 != null) {
                                                                                if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                    $var22 = [0, activePatternResult770, activePatternResult771, activePatternResult769, activePatternResult772];
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
                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var22[3]([$var22[2], $var22[4]])]), null, (0, _Cast.CondCast)($var22[1])]);

                                                case 1:
                                                    let $var23;

                                                    if (instrline.tail != null) {
                                                        const activePatternResult765 = (0, _Cast.$7C$IsBranchInst$7C$_$7C$)(instrline.head);

                                                        if (activePatternResult765 != null) {
                                                            if (instrline.tail.tail != null) {
                                                                if (instrline.tail.tail.tail != null) {
                                                                    const activePatternResult766 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                    if (activePatternResult766 != null) {
                                                                        if (instrline.tail.tail.tail.tail != null) {
                                                                            const activePatternResult768 = (0, _Cast.$7C$IsAddr$7C$_$7C$)(branch_map, instrline.tail.tail.tail.head);

                                                                            if (activePatternResult768 != null) {
                                                                                if (instrline.tail.tail.tail.tail.tail == null) {
                                                                                    $var23 = [0, activePatternResult768, activePatternResult766, activePatternResult765];
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
                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("BRANCH", [$var23[3]($var23[1])]), null, (0, _Cast.CondCast)($var23[2])]);

                                                        case 1:
                                                            let $var24;

                                                            if (instrline.tail != null) {
                                                                const activePatternResult758 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                                                                if (activePatternResult758 != null) {
                                                                    if (instrline.tail.tail != null) {
                                                                        const activePatternResult759 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                        if (activePatternResult759 != null) {
                                                                            if (instrline.tail.tail.tail != null) {
                                                                                const activePatternResult760 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                if (activePatternResult760 != null) {
                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                        const activePatternResult761 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                        if (activePatternResult761 != null) {
                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult762 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                if (activePatternResult762 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult763 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                        if (activePatternResult763 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult764 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult764 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                        $var24 = [0, activePatternResult760, activePatternResult761, activePatternResult764, activePatternResult758, activePatternResult762, activePatternResult759, activePatternResult763];
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
                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var24[4]([$var24[2], new _InstructionType.RegOrLit("Reg", [$var24[5]])]), $var24[6]]), $var24[7]([$var24[5], $var24[5], $var24[3]]), (0, _Cast.CondCast)($var24[1])]);

                                                                case 1:
                                                                    let $var25;

                                                                    if (instrline.tail != null) {
                                                                        const activePatternResult750 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                                                                        if (activePatternResult750 != null) {
                                                                            if (instrline.tail.tail != null) {
                                                                                const activePatternResult751 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                                if (activePatternResult751 != null) {
                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                        const activePatternResult752 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                        if (activePatternResult752 != null) {
                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult753 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                if (activePatternResult753 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult754 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                        if (activePatternResult754 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult755 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult755 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult756 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult756 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult757 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                if (activePatternResult757 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                        $var25 = [0, activePatternResult752, activePatternResult753, activePatternResult757, activePatternResult750, activePatternResult754, activePatternResult755, activePatternResult751, activePatternResult756];
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
                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var25[4]([$var25[2], $var25[5], new _InstructionType.RegOrLit("Reg", [$var25[6]])]), $var25[7]]), $var25[8]([$var25[6], $var25[6], $var25[3]]), (0, _Cast.CondCast)($var25[1])]);

                                                                        case 1:
                                                                            let $var26;

                                                                            if (instrline.tail != null) {
                                                                                const activePatternResult743 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

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
                                                                                                                const activePatternResult747 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult747 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult748 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult748 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult749 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                if (activePatternResult749 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                        $var26 = [0, activePatternResult745, activePatternResult746, activePatternResult749, activePatternResult743, activePatternResult747, activePatternResult744, activePatternResult748];
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
                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var26[4]([$var26[2], new _InstructionType.RegOrLit("Reg", [$var26[5]])])]), $var26[7]([$var26[5], $var26[5], $var26[3]]), (0, _Cast.CondCast)($var26[1])]);

                                                                                case 1:
                                                                                    let $var27;

                                                                                    if (instrline.tail != null) {
                                                                                        if (instrline.head === "ADR") {
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
                                                                                                                        const activePatternResult742 = (0, _Cast.$7C$IsAddr$7C$_$7C$)(branch_map, instrline.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult742 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                $var27 = [0, activePatternResult742, activePatternResult739, activePatternResult740, activePatternResult738];
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
                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [new _InstructionType.MEMInst("ADR", [$var27[3], $var27[1]])]), null, (0, _Cast.CondCast)($var27[2])]);

                                                                                        case 1:
                                                                                            let $var28;

                                                                                            if (instrline.tail != null) {
                                                                                                const activePatternResult733 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                if (activePatternResult733 != null) {
                                                                                                    if (instrline.tail.tail != null) {
                                                                                                        const activePatternResult734 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                        if (activePatternResult734 != null) {
                                                                                                            if (instrline.tail.tail.tail != null) {
                                                                                                                const activePatternResult735 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                if (activePatternResult735 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult736 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                        if (activePatternResult736 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                        const activePatternResult737 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                        if (activePatternResult737 != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                        $var28 = [0, activePatternResult734, activePatternResult735, activePatternResult736, activePatternResult733, activePatternResult737];
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
                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var28[4]([$var28[3], $var28[5], new _InstructionType.RegOrLit("Lit", [0]), new _InstructionType.RegOrLit("Lit", [0]), $var28[1]])]), null, (0, _Cast.CondCast)($var28[2])]);

                                                                                                case 1:
                                                                                                    let $var29;

                                                                                                    if (instrline.tail != null) {
                                                                                                        const activePatternResult727 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                        if (activePatternResult727 != null) {
                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                const activePatternResult728 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                                if (activePatternResult728 != null) {
                                                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                                                        const activePatternResult729 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                        if (activePatternResult729 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult730 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                                if (activePatternResult730 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                        if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                const activePatternResult731 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                                if (activePatternResult731 != null) {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        const activePatternResult732 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                        if (activePatternResult732 != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                        $var29 = [0, activePatternResult728, activePatternResult729, activePatternResult730, activePatternResult727, activePatternResult732, activePatternResult731];
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
                                                                                                                const activePatternResult721 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                                if (activePatternResult721 != null) {
                                                                                                                    if (instrline.tail.tail != null) {
                                                                                                                        const activePatternResult722 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                                        if (activePatternResult722 != null) {
                                                                                                                            if (instrline.tail.tail.tail != null) {
                                                                                                                                const activePatternResult723 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                                if (activePatternResult723 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                        const activePatternResult724 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                                        if (activePatternResult724 != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        const activePatternResult725 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                                        if (activePatternResult725 != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                const activePatternResult726 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                if (activePatternResult726 != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.head === "!") {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var30 = [0, activePatternResult722, activePatternResult723, activePatternResult724, activePatternResult721, activePatternResult726, activePatternResult725];
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
                                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var30[4]([$var30[3], $var30[6], $var30[5], $var30[5], $var30[1]])]), null, (0, _Cast.CondCast)($var30[2])]);

                                                                                                                case 1:
                                                                                                                    let $var31;

                                                                                                                    if (instrline.tail != null) {
                                                                                                                        const activePatternResult715 = (0, _Cast.$7C$IsMEMRInst$7C$_$7C$)(instrline.head);

                                                                                                                        if (activePatternResult715 != null) {
                                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                                const activePatternResult716 = (0, _Cast.$7C$IsByteMode$7C$_$7C$)(instrline.tail.head);

                                                                                                                                if (activePatternResult716 != null) {
                                                                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                                                                        const activePatternResult717 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                                                        if (activePatternResult717 != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                const activePatternResult718 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                                                                if (activePatternResult718 != null) {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        if (instrline.tail.tail.tail.tail.head === "[") {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                const activePatternResult719 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                                                                if (activePatternResult719 != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult720 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult720 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var31 = [0, activePatternResult716, activePatternResult717, activePatternResult718, activePatternResult715, activePatternResult720, activePatternResult719];
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
                                                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var31[4]([$var31[3], $var31[6], new _InstructionType.RegOrLit("Lit", [0]), $var31[5], $var31[1]])]), null, (0, _Cast.CondCast)($var31[2])]);

                                                                                                                        case 1:
                                                                                                                            let $var32;

                                                                                                                            if (instrline.tail != null) {
                                                                                                                                const activePatternResult711 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                if (activePatternResult711 != null) {
                                                                                                                                    if (instrline.tail.tail != null) {
                                                                                                                                        if (instrline.tail.tail.tail != null) {
                                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                        const activePatternResult712 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                        if (activePatternResult712 != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        const activePatternResult713 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                        if (activePatternResult713 != null) {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult714 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult714 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var32 = [0, activePatternResult713, activePatternResult712, activePatternResult711, activePatternResult714];
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
                                                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var32[3]([$var32[2], $var32[4], new _List2.default(), false])]), null, (0, _Cast.CondCast)($var32[1])]);

                                                                                                                                case 1:
                                                                                                                                    let $var33;

                                                                                                                                    if (instrline.tail != null) {
                                                                                                                                        const activePatternResult708 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                        if (activePatternResult708 != null) {
                                                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                                                if (instrline.tail.tail.tail != null) {
                                                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                        if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                const activePatternResult709 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                                if (activePatternResult709 != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult710 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult710 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                                                                        $var33 = [0, activePatternResult709, activePatternResult708, activePatternResult710];
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
                                                                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var33[2]([$var33[1], $var33[3], new _List2.default(), false])]), null, null]);

                                                                                                                                        case 1:
                                                                                                                                            let $var34;

                                                                                                                                            if (instrline.tail != null) {
                                                                                                                                                const activePatternResult703 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                                if (activePatternResult703 != null) {
                                                                                                                                                    if (instrline.tail.tail != null) {
                                                                                                                                                        if (instrline.tail.tail.tail != null) {
                                                                                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                        const activePatternResult704 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                                        if (activePatternResult704 != null) {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                        const activePatternResult705 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                        if (activePatternResult705 != null) {
                                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                                const activePatternResult706 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                                if (activePatternResult706 != null) {
                                                                                                                                                                                                    const activePatternResult707 = (0, _Cast.$7C$IsRegList$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.tail);

                                                                                                                                                                                                    if (activePatternResult707 != null) {
                                                                                                                                                                                                        $var34 = [0, activePatternResult705, activePatternResult704, activePatternResult703, activePatternResult707, activePatternResult706];
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        $var34 = [1];
                                                                                                                                                                                                    }
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    $var34 = [1];
                                                                                                                                                                                                }
                                                                                                                                                                                            } else {
                                                                                                                                                                                                $var34 = [1];
                                                                                                                                                                                            }
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $var34 = [1];
                                                                                                                                                                                        }
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var34 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var34 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var34 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var34 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var34 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var34 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var34 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var34 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var34 = [1];
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    $var34 = [1];
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                $var34 = [1];
                                                                                                                                            }

                                                                                                                                            switch ($var34[0]) {
                                                                                                                                                case 0:
                                                                                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var34[3]([$var34[2], $var34[5], $var34[4], false])]), null, (0, _Cast.CondCast)($var34[1])]);

                                                                                                                                                case 1:
                                                                                                                                                    let $var35;

                                                                                                                                                    if (instrline.tail != null) {
                                                                                                                                                        const activePatternResult699 = (0, _Cast.$7C$IsMEMMInst$7C$_$7C$)(instrline.head);

                                                                                                                                                        if (activePatternResult699 != null) {
                                                                                                                                                            if (instrline.tail.tail != null) {
                                                                                                                                                                if (instrline.tail.tail.tail != null) {
                                                                                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                                                                                        if (instrline.tail.tail.tail.head === "[") {
                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                const activePatternResult700 = (0, _Cast.$7C$IsLDMdir$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                                                                                if (activePatternResult700 != null) {
                                                                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                        if (instrline.tail.tail.tail.tail.tail.head === "]") {
                                                                                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                                                                                const activePatternResult701 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                                                                                if (activePatternResult701 != null) {
                                                                                                                                                                                                    const activePatternResult702 = (0, _Cast.$7C$IsRegList$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail);

                                                                                                                                                                                                    if (activePatternResult702 != null) {
                                                                                                                                                                                                        $var35 = [0, activePatternResult700, activePatternResult699, activePatternResult702, activePatternResult701];
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        $var35 = [1];
                                                                                                                                                                                                    }
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    $var35 = [1];
                                                                                                                                                                                                }
                                                                                                                                                                                            } else {
                                                                                                                                                                                                $var35 = [1];
                                                                                                                                                                                            }
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $var35 = [1];
                                                                                                                                                                                        }
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $var35 = [1];
                                                                                                                                                                                    }
                                                                                                                                                                                } else {
                                                                                                                                                                                    $var35 = [1];
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                $var35 = [1];
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            $var35 = [1];
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        $var35 = [1];
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    $var35 = [1];
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                $var35 = [1];
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $var35 = [1];
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        $var35 = [1];
                                                                                                                                                    }

                                                                                                                                                    switch ($var35[0]) {
                                                                                                                                                        case 0:
                                                                                                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("MEM", [$var35[2]([$var35[1], $var35[4], $var35[3], false])]), null, null]);

                                                                                                                                                        case 1:
                                                                                                                                                            return new _InstructionType.InstructionLine("Failed_Parsing", ["Unexpected match in parser: " + (0, _String.join)(" ", instrline)]);
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
            return source_1 => (0, _Seq.fold)(function ($var36, $var37) {
                return chooseAddr_1($var36)($var37);
            }, state_1, source_1);
        })()((0, _Seq.range)(0, instList.length - 1));

        return new _MachineState.MachineState(new _InstructionType.Address("Addr", [4 * instList.length]), init_reg, init_memory, new _MachineState.Flags(false, false, false, false), new _MachineState.RunState("RunOK", []));
    }
});
//# sourceMappingURL=Parser.js.map