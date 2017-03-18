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

    const whiteSpace = exports.whiteSpace = [" ", "\f", "\t", "\r", "\n"];

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
            })(), (0, _Seq.toList)((0, _String.split)(line, ...whiteSpace)));
        };

        const lineList = (0, _List.filter)((() => {
            const x_2 = new _List2.default();
            return y_2 => !x_2.Equals(y_2);
        })(), (list => (0, _List.map)(splitIntoWords, list))(splitIntoLines(textInput)));
        let branch_map;

        const chooseAddr = b => i => {
            const matchValue = (0, _Seq.item)(i, lineList);
            let $var17;

            if (matchValue.tail != null) {
                const activePatternResult634 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.head);

                if (activePatternResult634 != null) {
                    if (matchValue.tail.tail != null) {
                        const activePatternResult635 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.tail.head);

                        if (activePatternResult635 != null) {
                            if (matchValue.tail.tail.tail != null) {
                                const activePatternResult636 = (0, _Cast.$7C$IsReg$7C$_$7C$)(matchValue.tail.tail.head);

                                if (activePatternResult636 != null) {
                                    $var17 = [0, activePatternResult634];
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
                    return (0, _Map.add)($var17[1], new _InstructionType.Address("Addr", [i * 4]), b);

                case 1:
                    return b;
            }
        };

        branch_map = (() => {
            const state = (0, _Map.create)(null, new _GenericComparer2.default(_Util.compare));
            return source => (0, _Seq.fold)(function ($var18, $var19) {
                return chooseAddr($var18)($var19);
            }, state, source);
        })()((0, _Seq.range)(0, lineList.length - 1));

        const remove_branch_label = line_1 => {
            let $var20;

            if (line_1.tail != null) {
                const activePatternResult639 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.head);

                if (activePatternResult639 != null) {
                    if (line_1.tail.tail != null) {
                        const activePatternResult640 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.tail.head);

                        if (activePatternResult640 != null) {
                            if (line_1.tail.tail.tail != null) {
                                const activePatternResult641 = (0, _Cast.$7C$IsReg$7C$_$7C$)(line_1.tail.tail.head);

                                if (activePatternResult641 != null) {
                                    $var20 = [0];
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
                    return line_1.tail;

                case 1:
                    return line_1;
            }
        };

        const executeWordsAsCommand = strlist => {
            const instruction = (0, _Cast.TokenizeInst)((0, _Seq.item)(0, strlist));
            const basicinstruction = (0, _Seq.item)(0, instruction);
            const setflag = (0, _Seq.item)(1, instruction);
            const condition = (0, _Seq.item)(2, instruction);
            const instrline = (0, _List.ofArray)([basicinstruction, setflag, condition], strlist.tail);
            let $var21;

            if (instrline.tail != null) {
                const activePatternResult685 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                if (activePatternResult685 != null) {
                    if (instrline.tail.tail != null) {
                        const activePatternResult686 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                        if (activePatternResult686 != null) {
                            if (instrline.tail.tail.tail != null) {
                                const activePatternResult687 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                if (activePatternResult687 != null) {
                                    if (instrline.tail.tail.tail.tail != null) {
                                        const activePatternResult688 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                        if (activePatternResult688 != null) {
                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                const activePatternResult689 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                if (activePatternResult689 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                        $var21 = [0, activePatternResult687, activePatternResult688, activePatternResult685, activePatternResult689, activePatternResult686];
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
                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var21[3]([$var21[2], $var21[4]]), $var21[5]]), null, $var21[1]]);

                case 1:
                    let $var22;

                    if (instrline.tail != null) {
                        const activePatternResult679 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                        if (activePatternResult679 != null) {
                            if (instrline.tail.tail != null) {
                                const activePatternResult680 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                if (activePatternResult680 != null) {
                                    if (instrline.tail.tail.tail != null) {
                                        const activePatternResult681 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                        if (activePatternResult681 != null) {
                                            if (instrline.tail.tail.tail.tail != null) {
                                                const activePatternResult682 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                if (activePatternResult682 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                        const activePatternResult683 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                        if (activePatternResult683 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult684 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                if (activePatternResult684 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                        $var22 = [0, activePatternResult681, activePatternResult682, activePatternResult679, activePatternResult683, activePatternResult684, activePatternResult680];
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
                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var22[3]([$var22[2], $var22[4], $var22[5]]), $var22[6]]), null, $var22[1]]);

                        case 1:
                            let $var23;

                            if (instrline.tail != null) {
                                const activePatternResult673 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.head);

                                if (activePatternResult673 != null) {
                                    if (instrline.tail.tail != null) {
                                        const activePatternResult674 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                        if (activePatternResult674 != null) {
                                            if (instrline.tail.tail.tail != null) {
                                                const activePatternResult675 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                if (activePatternResult675 != null) {
                                                    if (instrline.tail.tail.tail.tail != null) {
                                                        const activePatternResult676 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                        if (activePatternResult676 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult677 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                if (activePatternResult677 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult678 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                        if (activePatternResult678 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var23 = [0, activePatternResult675, activePatternResult676, activePatternResult673, activePatternResult677, activePatternResult678, activePatternResult674];
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
                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [$var23[3]([$var23[2], $var23[4], $var23[5]]), $var23[6]]), null, $var23[1]]);

                                case 1:
                                    let $var24;

                                    if (instrline.tail != null) {
                                        const activePatternResult668 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

                                        if (activePatternResult668 != null) {
                                            if (instrline.tail.tail != null) {
                                                const activePatternResult669 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                if (activePatternResult669 != null) {
                                                    if (instrline.tail.tail.tail != null) {
                                                        const activePatternResult670 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                        if (activePatternResult670 != null) {
                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                const activePatternResult671 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                if (activePatternResult671 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult672 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                        if (activePatternResult672 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var24 = [0, activePatternResult670, activePatternResult671, activePatternResult668, activePatternResult672, activePatternResult669];
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
                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var24[3]([$var24[2], $var24[4]])]), null, $var24[1]]);

                                        case 1:
                                            let $var25;

                                            if (instrline.tail != null) {
                                                const activePatternResult661 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                                                if (activePatternResult661 != null) {
                                                    if (instrline.tail.tail != null) {
                                                        const activePatternResult662 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                        if (activePatternResult662 != null) {
                                                            if (instrline.tail.tail.tail != null) {
                                                                const activePatternResult663 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                if (activePatternResult663 != null) {
                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                        const activePatternResult664 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                        if (activePatternResult664 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                const activePatternResult665 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                if (activePatternResult665 != null) {
                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                        if (instrline.tail.tail.tail.tail.tail.head === ",") {
                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult666 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                if (activePatternResult666 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult667 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                        if (activePatternResult667 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                $var25 = [0, activePatternResult663, activePatternResult664, activePatternResult667, activePatternResult661, activePatternResult665, activePatternResult662, activePatternResult666];
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
                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var25[4]([$var25[2], new _InstructionType.RegOrLit("Reg", [$var25[5]])]), $var25[6]]), $var25[7]([$var25[5], $var25[5], $var25[3]]), $var25[1]]);

                                                case 1:
                                                    let $var26;

                                                    if (instrline.tail != null) {
                                                        const activePatternResult653 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                                                        if (activePatternResult653 != null) {
                                                            if (instrline.tail.tail != null) {
                                                                const activePatternResult654 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                if (activePatternResult654 != null) {
                                                                    if (instrline.tail.tail.tail != null) {
                                                                        const activePatternResult655 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                        if (activePatternResult655 != null) {
                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                const activePatternResult656 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                if (activePatternResult656 != null) {
                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                        const activePatternResult657 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                        if (activePatternResult657 != null) {
                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult658 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                if (activePatternResult658 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                        if (instrline.tail.tail.tail.tail.tail.tail.head === ",") {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult659 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult659 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult660 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult660 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                $var26 = [0, activePatternResult655, activePatternResult656, activePatternResult660, activePatternResult653, activePatternResult657, activePatternResult658, activePatternResult654, activePatternResult659];
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
                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var26[4]([$var26[2], $var26[5], new _InstructionType.RegOrLit("Reg", [$var26[6]])]), $var26[7]]), $var26[8]([$var26[6], $var26[6], $var26[3]]), $var26[1]]);

                                                        case 1:
                                                            let $var27;

                                                            if (instrline.tail != null) {
                                                                const activePatternResult646 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

                                                                if (activePatternResult646 != null) {
                                                                    if (instrline.tail.tail != null) {
                                                                        const activePatternResult647 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                        if (activePatternResult647 != null) {
                                                                            if (instrline.tail.tail.tail != null) {
                                                                                const activePatternResult648 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                if (activePatternResult648 != null) {
                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                        const activePatternResult649 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                        if (activePatternResult649 != null) {
                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult650 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                if (activePatternResult650 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                        if (instrline.tail.tail.tail.tail.tail.head === ",") {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult651 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult651 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult652 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult652 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                $var27 = [0, activePatternResult648, activePatternResult649, activePatternResult652, activePatternResult646, activePatternResult650, activePatternResult647, activePatternResult651];
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
                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var27[4]([$var27[2], new _InstructionType.RegOrLit("Reg", [$var27[5]])])]), $var27[7]([$var27[5], $var27[5], $var27[3]]), $var27[1]]);

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
        };

        const instList = (list_1 => (0, _List.map)(executeWordsAsCommand, list_1))((list_2 => (0, _List.map)(remove_branch_label, list_2))(lineList));

        const init_reg = (0, _Map.create)((0, _Seq.map)(x_3 => [new _InstructionType.Register("R", [x_3]), 0], (0, _Seq.toList)((0, _Seq.range)(0, 15))), new _GenericComparer2.default((x, y) => x.CompareTo(y)));
        let init_memory;

        const chooseAddr_1 = m => i_1 => {
            return (0, _Map.add)(new _InstructionType.Address("Addr", [i_1 * 4]), new _InstructionType.Memory("Inst", [(0, _Seq.item)(i_1, instList)]), m);
        };

        init_memory = (() => {
            const state_1 = (0, _Map.create)(null, new _GenericComparer2.default((x, y) => x.CompareTo(y)));
            return source_1 => (0, _Seq.fold)(function ($var28, $var29) {
                return chooseAddr_1($var28)($var29);
            }, state_1, source_1);
        })()((0, _Seq.range)(0, instList.length - 1));

        return new _MachineState.MachineState(new _InstructionType.Address("Addr", [4 * instList.length]), init_reg, init_memory, new _MachineState.Flags(false, false, false, false), new _MachineState.RunState("RunOK", []));
    }
});
//# sourceMappingURL=Parser.js.map