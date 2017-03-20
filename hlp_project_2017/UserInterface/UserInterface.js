define(["exports", "fable-core/umd/Symbol", "fable-core/umd/Util", "fable-core/umd/Map", "./InstructionType", "fable-core/umd/List", "fable-core/umd/String", "fable-core/umd/Seq", "fable-core/umd/Date", "fable-core/umd/Serialize", "./Program"], function (exports, _Symbol2, _Util, _Map, _InstructionType, _List, _String, _Seq, _Date, _Serialize, _Program) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserInterface = exports.UserInterfaceController = undefined;

    var _Symbol3 = _interopRequireDefault(_Symbol2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    const UserInterfaceController = exports.UserInterfaceController = function (__exports) {
        const Base = __exports.Base = class Base {
            constructor(caseName, fields) {
                this.Case = caseName;
                this.Fields = fields;
            }

            [_Symbol3.default.reflection]() {
                return {
                    type: "ARM7TDMI.UserInterfaceController.Base",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        Bin: [],
                        Dec: [],
                        Hex: []
                    }
                };
            }

            Equals(other) {
                return (0, _Util.equalsUnions)(this, other);
            }

            CompareTo(other) {
                return (0, _Util.compareUnions)(this, other);
            }

        };
        (0, _Symbol2.setType)("ARM7TDMI.UserInterfaceController.Base", Base);

        const getRegister = __exports.getRegister = function (state, i) {
            return Number.parseInt((0, _Util.toString)((0, _Map.tryFind)(new _InstructionType.Register("R", [i]), state.RegMap)));
        };

        const getMemory = __exports.getMemory = function (state, address) {
            return (0, _Map.tryFind)(new _InstructionType.Address("Addr", [address]), state.MemMap);
        };

        const getState = __exports.getState = function (state) {
            return state.State;
        };

        const getFlags = __exports.getFlags = function (state) {
            return Int32Array.from((0, _List.map)(x => x ? 1 : 0, (0, _List.ofArray)([state.Flags.N, state.Flags.Z, state.Flags.C, state.Flags.V])));
        };

        const toBaseOf = __exports.toBaseOf = function (targetBase, dec) {
            return (0, _Util.toString)((dec >>> 0).toString(targetBase));
        };

        const toDec = __exports.toDec = function (sourceBase, numberString) {
            return Number.parseInt((0, _Util.toString)(window.parseInt(numberString, sourceBase)));
        };

        const toBin = __exports.toBin = function (dec) {
            const bin = toBaseOf(2, dec);
            return (0, _String.join)(" ", (0, _List.map)(x => bin.slice(x * 4, x * 4 + 3 + 1), (0, _Seq.toList)((0, _Seq.range)(0, 7))));
        };

        const toHex = __exports.toHex = function (dec) {
            const hex = toBaseOf(16, dec).toLocaleUpperCase();
            return (0, _String.join)(" ", (0, _List.map)(x => hex.slice(x * 2, x * 2 + 1 + 1), (0, _Seq.toList)((0, _Seq.range)(0, 3))));
        };

        const timeNow = __exports.timeNow = function () {
            let copyOfStruct = (0, _Date.now)();
            return (0, _Date.toLongTimeString)(copyOfStruct);
        };

        const showRegisters = __exports.showRegisters = function (state, currentBase) {
            console.info(timeNow(), "\tUpdating Register Values ...");

            const updateRegister = i => currentBase_1 => {
                const value = getRegister(state, i);
                const DOMElement = document.getElementById("R" + String(i));
                const diplayValue = currentBase_1.Case === "Bin" ? "0b" + toBin(value) : currentBase_1.Case === "Hex" ? "0x" + toHex(value) : String(value);
                DOMElement.textContent = diplayValue;
            };

            (0, _List.map)(i_1 => {
                updateRegister(i_1)(currentBase);
            }, (0, _Seq.toList)((0, _Seq.range)(0, 15)));
            console.info(timeNow(), "\tRegister values update successful.");
        };

        const showFlags = __exports.showFlags = function (state) {
            const flags = getFlags(state);

            const updateFlag = i => {
                const flag = document.getElementById("CSPR" + String(i));
                flag.textContent = String(flags[i - 1]);
            };

            console.info(timeNow(), "\tCSPR Bits are", flags);
            (0, _List.map)(i_1 => {
                updateFlag(i_1);
            }, (0, _Seq.toList)((0, _Seq.range)(1, 4)));
            console.info(timeNow(), "\tCSPR Bits update successful.");
        };

        const showStatus = __exports.showStatus = function (msg) {
            const DOMElement = document.getElementById("status-msg");
            DOMElement.textContent = msg;
            console.info(timeNow(), "\t" + msg);
        };

        const showState = __exports.showState = function (state) {
            const runState = getState(state);
            const StateMsg = runState.Case === "RunTimeErr" ? "Runtime Error: " + (0, _Serialize.toJson)(runState) : runState.Case === "SyntaxErr" ? "Syntax Error: " + (0, _Serialize.toJson)(runState) : runState.Case === "RunEND" ? "Execution was successful. The final instruction is reached." : "Execution was successful.";
            showStatus(StateMsg);
        };

        return __exports;
    }({});

    const UserInterface = exports.UserInterface = function (__exports) {
        let currentBase = (Object.defineProperty(__exports, 'currentBase', {
            get: () => currentBase,
            set: x => currentBase = x
        }), new UserInterfaceController.Base("Hex", []));
        let currentState = (Object.defineProperty(__exports, 'currentState', {
            get: () => currentState,
            set: x => currentState = x
        }), (0, _Program.execute)("MOV R0, #0"));
        console.info(UserInterfaceController.timeNow(), "\tFable Application Loaded");
        console.log("%c ARMadillo - HLP Project 2017", "background: #222; color: #bada55");
        console.log("%c Parser:\t Rubio, Santiago P L ", "background: #222; color: #bada55");
        console.log("%c Emulator:\t Low, Aaron S \t Chan, Jun S", "background: #222; color: #bada55");
        console.log("%c Front-end:\t Wang, Tianyou", "background: #222; color: #bada55");

        const changeBase = __exports.changeBase = function (state, toBase) {
            UserInterfaceController.showRegisters(state, toBase);
            const baseValue = toBase.Case === "Bin" ? "02" : toBase.Case === "Hex" ? "16" : "10";
            const DOMElement = document.getElementById("base");
            DOMElement.textContent = baseValue;
            currentBase = toBase;
            console.info(UserInterfaceController.timeNow(), "\tChanged register display base to", (0, _Serialize.toJson)(toBase));
        };

        const execute = __exports.execute = function () {
            console.info(UserInterfaceController.timeNow(), "\tExecuting Source Code...");
            const sourceCode = (0, _Util.toString)(window.getEditorContent());
            currentState = (0, _Program.execute)(sourceCode);
            UserInterfaceController.showRegisters(currentState, currentBase);
            UserInterfaceController.showFlags(currentState);
            UserInterfaceController.showState(currentState);
        };

        const reset = __exports.reset = function () {
            console.info(UserInterfaceController.timeNow(), "\tResetting Machine State...");
            const sourceCode = (0, _Util.toString)(window.getEditorContent());
            currentState = (0, _Program.initMachineState)(sourceCode);
            UserInterfaceController.showRegisters(currentState, currentBase);
            UserInterfaceController.showFlags(currentState);
            UserInterfaceController.showState(currentState);
        };

        const stepForward = __exports.stepForward = function () {
            console.info(UserInterfaceController.timeNow(), "\tStepping forward...");
            const sourceCode = (0, _Util.toString)(window.getEditorContent());
            const prevState = currentState;
            currentState = (0, _Program.stepForward)(sourceCode, prevState);
            UserInterfaceController.showRegisters(currentState, currentBase);
            UserInterfaceController.showFlags(currentState);
            UserInterfaceController.showState(currentState);
            window.setLineDecoration(~~(UserInterfaceController.getRegister(currentState, 15) / 4));
        };

        const memoryLookup = __exports.memoryLookup = function () {
            const startAddr = document.getElementById("memory-start").value;
            const endAddr = document.getElementById("memory-end").value;
            console.info(UserInterfaceController.timeNow(), "\tLooking up memory content for query Addr: 0x" + startAddr, "- 0x" + endAddr);
            const wordStartAddr = ~~(UserInterfaceController.toDec(16, startAddr) / 32);
            const wordEndAddr = ~~(UserInterfaceController.toDec(16, endAddr) / 32);
            const byteStartAddr = wordStartAddr * 4;
            const byteEndAddr = (wordEndAddr + 1) * 4;
            let toTable;
            const wordHeadBytes = (0, _Seq.toList)((0, _Seq.rangeStep)(byteStartAddr, 4, byteEndAddr));

            const renderInst = headByte => inst => {
                return ["<span class='label label-primary'>0x" + UserInterfaceController.toBaseOf(16, headByte * 8).toLocaleUpperCase() + "</span>", "<span class='label label-success'>Instr</span>", (0, _Serialize.toJson)(inst)];
            };

            const renderVal = headByte_1 => {
                const wordValue = (0, _List.map)(x => UserInterfaceController.getMemory(currentState, headByte_1 + x), (0, _Seq.toList)((0, _Seq.range)(3, 0)));
                return ["<span class='label label-primary'>0x" + UserInterfaceController.toBaseOf(16, headByte_1 * 8).toLocaleUpperCase() + "</span>", "<span class='label label-warning'>Value</span>", (0, _Serialize.toJson)(wordValue)];
            };

            const combineWord = wordHeadByte => {
                const firstByteContent = UserInterfaceController.getMemory(currentState, wordHeadByte);

                if (firstByteContent == null) {
                    return ["<span class='label label-primary'>0x" + UserInterfaceController.toBaseOf(16, wordHeadByte * 8).toLocaleUpperCase() + "</span>", "<span class='label label-default'>Null</span>", "0"];
                } else if (firstByteContent.Case === "Val") {
                    return renderVal(wordHeadByte);
                } else {
                    return renderInst(wordHeadByte)(firstByteContent);
                }
            };

            const dataSet = (0, _Serialize.toJson)((list => (0, _List.map)(combineWord, list))((0, _Seq.toList)((0, _Seq.rangeStep)(byteStartAddr, 4, byteEndAddr))));
            window.data = dataSet;
            toTable = window.displayMemoryQuery(dataSet);
            return false;
        };

        const changeBaseToBin = __exports.changeBaseToBin = function () {
            changeBase(currentState, new UserInterfaceController.Base("Bin", []));
        };

        const changeBaseToDec = __exports.changeBaseToDec = function () {
            changeBase(currentState, new UserInterfaceController.Base("Dec", []));
        };

        const changeBaseToHex = __exports.changeBaseToHex = function () {
            changeBase(currentState, new UserInterfaceController.Base("Hex", []));
        };

        const getButton = __exports.getButton = function (buttonId) {
            return document.getElementById(buttonId);
        };

        const executeButton = __exports.executeButton = getButton("execute");
        const resetButton = __exports.resetButton = getButton("reset");
        const stepForwardButton = __exports.stepForwardButton = getButton("step-forward");
        const toBinButton = __exports.toBinButton = getButton("toBin");
        const toDecButton = __exports.toDecButton = getButton("toDec");
        const toHexButton = __exports.toHexButton = getButton("toHex");
        executeButton.addEventListener('click', _arg1 => {
            execute();
            return null;
        });
        resetButton.addEventListener('click', _arg2 => {
            reset();
            return null;
        });
        stepForwardButton.addEventListener('click', _arg3 => {
            stepForward();
            return null;
        });
        toBinButton.addEventListener('click', _arg4 => {
            changeBaseToBin();
            return null;
        });
        toDecButton.addEventListener('click', _arg5 => {
            changeBaseToDec();
            return null;
        });
        toHexButton.addEventListener('click', _arg6 => {
            changeBaseToHex();
            return null;
        });
        const memoryToolFormElement = __exports.memoryToolFormElement = document.getElementById("memory-tool");

        memoryToolFormElement.onsubmit = _arg1_1 => memoryLookup();

        return __exports;
    }({});
});
//# sourceMappingURL=UserInterface.js.map