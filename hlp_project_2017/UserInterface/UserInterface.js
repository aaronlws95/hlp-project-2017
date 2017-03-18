define(["exports", "fable-core/umd/Map", "./InstructionType", "fable-core/umd/Serialize", "fable-core/umd/List", "./Program", "fable-core/umd/Seq"], function (exports, _Map, _InstructionType, _Serialize, _List, _Program, _Seq) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserInterface = exports.UserInterfaceController = undefined;

    const UserInterfaceController = exports.UserInterfaceController = function (__exports) {
        const getRegister = __exports.getRegister = function (state, i) {
            return (0, _Map.tryFind)(new _InstructionType.Register("R", [i]), state.RegMap);
        };

        const getMemory = __exports.getMemory = function (state, address) {
            const head = address - address % 4;
            return (0, _Serialize.toJson)((0, _Map.tryFind)(new _InstructionType.Address("Addr", [head]), state.MemMap));
        };

        const getState = __exports.getState = function (state) {
            return (0, _Serialize.toJson)(state.State);
        };

        const getFlags = __exports.getFlags = function (state) {
            return (0, _List.map)(x => x ? 1 : 0, (0, _List.ofArray)([state.Flags.N, state.Flags.Z, state.Flags.C, state.Flags.V]));
        };

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

        const execute = __exports.execute = function () {
            console.info("Executing Source Code...");
            const sourceCode = sourceDOMElement.value;
            const newstate = (0, _Program.execute)(sourceCode);
            console.info("Displaying Register Values...");
            (0, _List.map)(x => {
                console.log("R", x, "=", UserInterfaceController.getRegister(newstate, x));
            }, (0, _Seq.toList)((0, _Seq.range)(0, 15)));
            (0, _List.map)(x_1 => {
                console.log(UserInterfaceController.getMemory(newstate, x_1));
            }, (0, _Seq.toList)((0, _Seq.rangeStep)(0, 4, 32)));
            console.info("Displaying NZCV flags...");
            console.log((0, _Serialize.toJson)(UserInterfaceController.getFlags(newstate)));
            console.info("Displaying Emulation Status");
            console.log(UserInterfaceController.getState(newstate));
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