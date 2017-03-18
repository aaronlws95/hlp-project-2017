define(["exports", "fable-core/umd/Map", "fable-core/umd/Seq", "./InstructionType", "fable-core/umd/GenericComparer", "./MachineState", "fable-core/umd/Serialize", "fable-core/umd/List", "fable-core/umd/String", "./Parser"], function (exports, _Map, _Seq, _InstructionType, _GenericComparer, _MachineState, _Serialize, _List, _String, _Parser) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserInterface = exports.UserInterfaceController = undefined;

    var _GenericComparer2 = _interopRequireDefault(_GenericComparer);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const UserInterfaceController = exports.UserInterfaceController = function (__exports) {
        const s = __exports.s = "MOV R1 R2\r\n    ADD R2 R3 #3\r\n    MYBRANCH MVN R2 #2\r\n    CMP R13 R2 , LSL #10\r\n    LSL R6 R7 #10\r\n    ASR R8 R9 R10\r\n    ADDS R3 R13 #15\r\n    ADDSEQ R3 R13 #15\r\n    ADDLO R3 R13 #15";
        const init_reg = __exports.init_reg = (0, _Map.create)((0, _Seq.map)(x => [new _InstructionType.Register("R", [x]), x * x], (0, _Seq.toList)((0, _Seq.range)(0, 15))), new _GenericComparer2.default((x, y) => x.CompareTo(y)));

        const init_memory = __exports.init_memory = (() => {
            const chooseAddr = m => i => {
                return (0, _Map.add)(new _InstructionType.Address("Addr", [i * 4]), new _InstructionType.Memory("Inst", [new _InstructionType.InstructionLine("Line", [new _InstructionType.InstructionType("ALU", [new _InstructionType.ALUInst("MOV", [new _InstructionType.Register("R", [1]), new _InstructionType.RegOrLit("Reg", [new _InstructionType.Register("R", [2])])]), false]), null, null])]), m);
            };

            return (() => {
                const state = (0, _Map.create)(null, new _GenericComparer2.default((x, y) => x.CompareTo(y)));
                return source => (0, _Seq.fold)(function ($var30, $var31) {
                    return chooseAddr($var30)($var31);
                }, state, source);
            })()((0, _Seq.range)(0, 20 - 1));
        })();

        const state = __exports.state = new _MachineState.MachineState(new _InstructionType.Address("Addr", [4 * 20]), init_reg, init_memory, new _MachineState.Flags(false, false, false, false), new _MachineState.RunState("RunOK", []));

        const getRegister = __exports.getRegister = function (i) {
            return (0, _Map.tryFind)(new _InstructionType.Register("R", [i]), state.RegMap);
        };

        const getMemory = __exports.getMemory = function (address) {
            const head = address - address % 4;
            return (0, _Serialize.toJson)((0, _Map.tryFind)(new _InstructionType.Address("Addr", [head]), state.MemMap));
        };

        const getState = __exports.getState = (0, _Serialize.toJson)(state.State);

        const getFlags = __exports.getFlags = (() => {
            const flags = state.Flags;
            return (0, _List.map)(x => x ? 1 : 0, (0, _List.ofArray)([flags.N, flags.Z, flags.C, flags.V]));
        })();

        const toBin = __exports.toBin = function (dec) {
            const convert = dec_1 => {
                switch (dec_1) {
                    case 0:
                    case 1:
                        return String(dec_1);

                    default:
                        const bit = String(dec_1 % 2);
                        return convert(~~(dec_1 / 2)) + bit;
                }
            };

            return convert(dec);
        };

        const toHex = __exports.toHex = function (dec) {
            const toArray = _byte => {
                return [_byte];
            };

            const toBit = remainder => {
                if (remainder <= 9) {
                    return String(remainder);
                } else {
                    switch (remainder) {
                        case 10:
                            return "A";

                        case 11:
                            return "B";

                        case 12:
                            return "C";

                        case 13:
                            return "D";

                        case 14:
                            return "E";

                        case 15:
                            return "F";

                        default:
                            return "ErrorBit";
                    }
                }
            };

            const convert = dec_1 => {
                if (dec_1 <= 9) {
                    return String(dec_1);
                } else if (dec_1 <= 15) {
                    return toBit(dec_1);
                } else {
                    const bit = toBit(dec_1 % 16);
                    return convert(~~(dec_1 / 16)) + bit;
                }
            };

            return convert(dec);
        };

        return __exports;
    }({});

    const UserInterface = exports.UserInterface = function (__exports) {
        console.log("Initialising Application...");
        const sourceDOMElement = __exports.sourceDOMElement = document.getElementById("sourceCode");
        const outputDOMElement = __exports.outputDOMElement = document.getElementById("output");
        const executeButton = __exports.executeButton = document.getElementById("execute");
        const splitIntoWords = __exports.splitIntoWords = (0, _List.filter)((() => {
            const x = "";
            return y => x !== y;
        })(), (0, _Seq.toList)((0, _String.split)("MOV R3 #10", ..._Parser.whiteSpace)));

        const execute = __exports.execute = function () {
            console.info("Executing Source Code...");
            const sourceCode = sourceDOMElement.value;
            console.info("Displaying Register Values...");
            (0, _List.map)(x => {
                console.log("R", x, "=", UserInterfaceController.getRegister(x));
            }, (0, _Seq.toList)((0, _Seq.range)(0, 15)));
            (0, _List.map)(x_1 => {
                console.log(UserInterfaceController.getMemory(x_1));
            }, (0, _Seq.toList)((0, _Seq.rangeStep)(0, 4, 32)));
            console.info("Displaying NZCV flags...");
            console.log((0, _Serialize.toJson)(UserInterfaceController.getFlags));
            console.info("Displaying Emulation Status");
            console.log(UserInterfaceController.getState);
        };

        const openFile = __exports.openFile = function () {
            console.log("Opening file...");
        };

        const saveFile = __exports.saveFile = function (saveAs) {
            console.log("Saving file...");
        };

        executeButton.addEventListener('click', _arg1 => {
            execute();
            return null;
        });
        return __exports;
    }({});
});
//# sourceMappingURL=UserInterface.js.map