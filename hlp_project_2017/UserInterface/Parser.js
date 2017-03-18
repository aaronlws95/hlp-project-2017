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
            })(), (0, _Seq.toList)((0, _String.split)(line, ...whiteSpace)));
        };

        const lineList = (0, _List.filter)((() => {
            const x_2 = new _List2.default();
            return y_2 => !x_2.Equals(y_2);
        })(), (list => (0, _List.map)(splitIntoWords, list))(splitIntoLines(textInput)));
        let branch_map;

        const chooseAddr = b => i => {
            const matchValue = (0, _Seq.item)(i, lineList);
            let $var10;

            if (matchValue.tail != null) {
                const activePatternResult586 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.head);

                if (activePatternResult586 != null) {
                    if (matchValue.tail.tail != null) {
                        const activePatternResult587 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(matchValue.tail.head);

                        if (activePatternResult587 != null) {
                            if (matchValue.tail.tail.tail != null) {
                                const activePatternResult588 = (0, _Cast.$7C$IsReg$7C$_$7C$)(matchValue.tail.tail.head);

                                if (activePatternResult588 != null) {
                                    $var10 = [0, activePatternResult586];
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
                    return (0, _Map.add)($var10[1], new _InstructionType.Address("Addr", [i * 4]), b);

                case 1:
                    return b;
            }
        };

        branch_map = (() => {
            const state = (0, _Map.create)(null, new _GenericComparer2.default(_Util.compare));
            return source => (0, _Seq.fold)(function ($var11, $var12) {
                return chooseAddr($var11)($var12);
            }, state, source);
        })()((0, _Seq.range)(0, lineList.length - 1));

        const remove_branch_label = line_1 => {
            let $var13;

            if (line_1.tail != null) {
                const activePatternResult591 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.head);

                if (activePatternResult591 != null) {
                    if (line_1.tail.tail != null) {
                        const activePatternResult592 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(line_1.tail.head);

                        if (activePatternResult592 != null) {
                            if (line_1.tail.tail.tail != null) {
                                const activePatternResult593 = (0, _Cast.$7C$IsReg$7C$_$7C$)(line_1.tail.tail.head);

                                if (activePatternResult593 != null) {
                                    $var13 = [0];
                                } else {
                                    $var13 = [1];
                                }
                            } else {
                                $var13 = [1];
                            }
                        } else {
                            $var13 = [1];
                        }
                    } else {
                        $var13 = [1];
                    }
                } else {
                    $var13 = [1];
                }
            } else {
                $var13 = [1];
            }

            switch ($var13[0]) {
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
            let $var14;

            if (instrline.tail != null) {
                const activePatternResult644 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                if (activePatternResult644 != null) {
                    if (instrline.tail.tail != null) {
                        const activePatternResult645 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                        if (activePatternResult645 != null) {
                            if (instrline.tail.tail.tail != null) {
                                const activePatternResult646 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                if (activePatternResult646 != null) {
                                    if (instrline.tail.tail.tail.tail != null) {
                                        const activePatternResult647 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                        if (activePatternResult647 != null) {
                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                const activePatternResult648 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                if (activePatternResult648 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                        $var14 = [0, activePatternResult646, activePatternResult647, activePatternResult644, activePatternResult648, activePatternResult645];
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
                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var14[3]([$var14[2], $var14[4]]), $var14[5]]), null, (0, _Cast.CondCast)($var14[1])]);

                case 1:
                    let $var15;

                    if (instrline.tail != null) {
                        const activePatternResult638 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                        if (activePatternResult638 != null) {
                            if (instrline.tail.tail != null) {
                                const activePatternResult639 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                if (activePatternResult639 != null) {
                                    if (instrline.tail.tail.tail != null) {
                                        const activePatternResult640 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                        if (activePatternResult640 != null) {
                                            if (instrline.tail.tail.tail.tail != null) {
                                                const activePatternResult641 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                if (activePatternResult641 != null) {
                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                        const activePatternResult642 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                        if (activePatternResult642 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult643 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                if (activePatternResult643 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                        $var15 = [0, activePatternResult640, activePatternResult641, activePatternResult638, activePatternResult642, activePatternResult643, activePatternResult639];
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
                    } else {
                        $var15 = [1];
                    }

                    switch ($var15[0]) {
                        case 0:
                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var15[3]([$var15[2], $var15[4], $var15[5]]), $var15[6]]), null, (0, _Cast.CondCast)($var15[1])]);

                        case 1:
                            let $var16;

                            if (instrline.tail != null) {
                                const activePatternResult632 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.head);

                                if (activePatternResult632 != null) {
                                    if (instrline.tail.tail != null) {
                                        const activePatternResult633 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                        if (activePatternResult633 != null) {
                                            if (instrline.tail.tail.tail != null) {
                                                const activePatternResult634 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                if (activePatternResult634 != null) {
                                                    if (instrline.tail.tail.tail.tail != null) {
                                                        const activePatternResult635 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                        if (activePatternResult635 != null) {
                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                const activePatternResult636 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                if (activePatternResult636 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult637 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                        if (activePatternResult637 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var16 = [0, activePatternResult634, activePatternResult635, activePatternResult632, activePatternResult636, activePatternResult637, activePatternResult633];
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
                                } else {
                                    $var16 = [1];
                                }
                            } else {
                                $var16 = [1];
                            }

                            switch ($var16[0]) {
                                case 0:
                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [$var16[3]([$var16[2], $var16[4], $var16[5]]), $var16[6]]), null, (0, _Cast.CondCast)($var16[1])]);

                                case 1:
                                    let $var17;

                                    if (instrline.tail != null) {
                                        if (instrline.head === "RRX") {
                                            if (instrline.tail.tail != null) {
                                                const activePatternResult628 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                if (activePatternResult628 != null) {
                                                    if (instrline.tail.tail.tail != null) {
                                                        const activePatternResult629 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                        if (activePatternResult629 != null) {
                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                const activePatternResult630 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                if (activePatternResult630 != null) {
                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                        const activePatternResult631 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                        if (activePatternResult631 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                $var17 = [0, activePatternResult629, activePatternResult630, activePatternResult631, activePatternResult628];
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
                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SHIFT", [new _InstructionType.SHIFTInst("RRX", [$var17[2], $var17[3]]), $var17[4]]), null, (0, _Cast.CondCast)($var17[1])]);

                                        case 1:
                                            let $var18;

                                            if (instrline.tail != null) {
                                                const activePatternResult623 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

                                                if (activePatternResult623 != null) {
                                                    if (instrline.tail.tail != null) {
                                                        const activePatternResult624 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                        if (activePatternResult624 != null) {
                                                            if (instrline.tail.tail.tail != null) {
                                                                const activePatternResult625 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                if (activePatternResult625 != null) {
                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                        const activePatternResult626 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                        if (activePatternResult626 != null) {
                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                const activePatternResult627 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                if (activePatternResult627 != null) {
                                                                                    if (instrline.tail.tail.tail.tail.tail.tail == null) {
                                                                                        $var18 = [0, activePatternResult625, activePatternResult626, activePatternResult623, activePatternResult627, activePatternResult624];
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
                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var18[3]([$var18[2], $var18[4]])]), null, (0, _Cast.CondCast)($var18[1])]);

                                                case 1:
                                                    let $var19;

                                                    if (instrline.tail != null) {
                                                        const activePatternResult620 = (0, _Cast.$7C$IsBranchInst$7C$_$7C$)(instrline.head);

                                                        if (activePatternResult620 != null) {
                                                            if (instrline.tail.tail != null) {
                                                                const activePatternResult621 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.head);

                                                                if (activePatternResult621 != null) {
                                                                    if (instrline.tail.tail.tail != null) {
                                                                        const activePatternResult622 = (0, _Cast.$7C$IsLabel$7C$_$7C$)(instrline.tail.tail.head);

                                                                        if (activePatternResult622 != null) {
                                                                            if (instrline.tail.tail.tail.tail == null) {
                                                                                if (!(0, _Util.equals)((0, _Map.tryFind)(activePatternResult622, branch_map), null)) {
                                                                                    $var19 = [0, activePatternResult621, activePatternResult620, activePatternResult622];
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
                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("BRANCH", [$var19[2](branch_map.get($var19[3]))]), null, (0, _Cast.CondCast)($var19[1])]);

                                                        case 1:
                                                            let $var20;

                                                            if (instrline.tail != null) {
                                                                const activePatternResult613 = (0, _Cast.$7C$IsMOVInst$7C$_$7C$)(instrline.head);

                                                                if (activePatternResult613 != null) {
                                                                    if (instrline.tail.tail != null) {
                                                                        const activePatternResult614 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                        if (activePatternResult614 != null) {
                                                                            if (instrline.tail.tail.tail != null) {
                                                                                const activePatternResult615 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                if (activePatternResult615 != null) {
                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                        const activePatternResult616 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                        if (activePatternResult616 != null) {
                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult617 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                if (activePatternResult617 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult618 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                        if (activePatternResult618 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult619 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult619 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                        $var20 = [0, activePatternResult615, activePatternResult616, activePatternResult619, activePatternResult613, activePatternResult617, activePatternResult614, activePatternResult618];
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
                                                                } else {
                                                                    $var20 = [1];
                                                                }
                                                            } else {
                                                                $var20 = [1];
                                                            }

                                                            switch ($var20[0]) {
                                                                case 0:
                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var20[4]([$var20[2], new _InstructionType.RegOrLit("Reg", [$var20[5]])]), $var20[6]]), $var20[7]([$var20[5], $var20[5], $var20[3]]), (0, _Cast.CondCast)($var20[1])]);

                                                                case 1:
                                                                    let $var21;

                                                                    if (instrline.tail != null) {
                                                                        const activePatternResult605 = (0, _Cast.$7C$IsALUInst$7C$_$7C$)(instrline.head);

                                                                        if (activePatternResult605 != null) {
                                                                            if (instrline.tail.tail != null) {
                                                                                const activePatternResult606 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                                if (activePatternResult606 != null) {
                                                                                    if (instrline.tail.tail.tail != null) {
                                                                                        const activePatternResult607 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                        if (activePatternResult607 != null) {
                                                                                            if (instrline.tail.tail.tail.tail != null) {
                                                                                                const activePatternResult608 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                if (activePatternResult608 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult609 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                        if (activePatternResult609 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult610 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult610 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult611 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult611 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult612 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                if (activePatternResult612 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                        $var21 = [0, activePatternResult607, activePatternResult608, activePatternResult612, activePatternResult605, activePatternResult609, activePatternResult610, activePatternResult606, activePatternResult611];
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
                                                                            return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [$var21[4]([$var21[2], $var21[5], new _InstructionType.RegOrLit("Reg", [$var21[6]])]), $var21[7]]), $var21[8]([$var21[6], $var21[6], $var21[3]]), (0, _Cast.CondCast)($var21[1])]);

                                                                        case 1:
                                                                            let $var22;

                                                                            if (instrline.tail != null) {
                                                                                const activePatternResult598 = (0, _Cast.$7C$IsCOMPInst$7C$_$7C$)(instrline.head);

                                                                                if (activePatternResult598 != null) {
                                                                                    if (instrline.tail.tail != null) {
                                                                                        const activePatternResult599 = (0, _Cast.$7C$IsSetFlag$7C$_$7C$)(instrline.tail.head);

                                                                                        if (activePatternResult599 != null) {
                                                                                            if (instrline.tail.tail.tail != null) {
                                                                                                const activePatternResult600 = (0, _Cast.$7C$IsCondition$7C$_$7C$)(instrline.tail.tail.head);

                                                                                                if (activePatternResult600 != null) {
                                                                                                    if (instrline.tail.tail.tail.tail != null) {
                                                                                                        const activePatternResult601 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.head);

                                                                                                        if (activePatternResult601 != null) {
                                                                                                            if (instrline.tail.tail.tail.tail.tail != null) {
                                                                                                                const activePatternResult602 = (0, _Cast.$7C$IsReg$7C$_$7C$)(instrline.tail.tail.tail.tail.head);

                                                                                                                if (activePatternResult602 != null) {
                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                        const activePatternResult603 = (0, _Cast.$7C$IsShiftInst$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.head);

                                                                                                                        if (activePatternResult603 != null) {
                                                                                                                            if (instrline.tail.tail.tail.tail.tail.tail.tail != null) {
                                                                                                                                const activePatternResult604 = (0, _Cast.$7C$IsRegOrLit$7C$_$7C$)(instrline.tail.tail.tail.tail.tail.tail.head);

                                                                                                                                if (activePatternResult604 != null) {
                                                                                                                                    if (instrline.tail.tail.tail.tail.tail.tail.tail.tail == null) {
                                                                                                                                        $var22 = [0, activePatternResult600, activePatternResult601, activePatternResult604, activePatternResult598, activePatternResult602, activePatternResult599, activePatternResult603];
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
                                                                                    return new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("SF", [$var22[4]([$var22[2], new _InstructionType.RegOrLit("Reg", [$var22[5]])])]), $var22[7]([$var22[5], $var22[5], $var22[3]]), (0, _Cast.CondCast)($var22[1])]);

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
        };

        const instList = (list_1 => (0, _List.map)(executeWordsAsCommand, list_1))((list_2 => (0, _List.map)(remove_branch_label, list_2))(lineList));

        const init_reg = (0, _Map.create)((0, _Seq.map)(x_3 => [new _InstructionType.Register("R", [x_3]), 0], (0, _Seq.toList)((0, _Seq.range)(0, 15))), new _GenericComparer2.default((x, y) => x.CompareTo(y)));
        let init_memory;

        const chooseAddr_1 = m => i_1 => {
            return (0, _Map.add)(new _InstructionType.Address("Addr", [i_1 * 4]), new _InstructionType.Memory("Inst", [(0, _Seq.item)(i_1, instList)]), m);
        };

        init_memory = (() => {
            const state_1 = (0, _Map.create)(null, new _GenericComparer2.default((x, y) => x.CompareTo(y)));
            return source_1 => (0, _Seq.fold)(function ($var23, $var24) {
                return chooseAddr_1($var23)($var24);
            }, state_1, source_1);
        })()((0, _Seq.range)(0, instList.length - 1));

        return new _MachineState.MachineState(new _InstructionType.Address("Addr", [4 * instList.length]), init_reg, init_memory, new _MachineState.Flags(false, false, false, false), new _MachineState.RunState("RunOK", []));
    }
});
//# sourceMappingURL=Parser.js.map