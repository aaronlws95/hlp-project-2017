define(["exports", "./Parser", "./Emulator", "fable-core/umd/String", "./InstructionType"], function (exports, _Parser, _Emulator, _String, _InstructionType) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.initMachineState = initMachineState;
    exports.executeInstructions = executeInstructions;
    exports.execute = execute;
    exports.stepForward = stepForward;

    function initMachineState(s) {
        return (0, _Parser.readAsm)(s);
    }

    function executeInstructions(state) {
        executeInstructions: while (true) {
            const newState = (0, _Emulator.executeLine)(state);

            if (newState.State.Case === "RunEND") {
                return newState;
            } else if (newState.State.Case === "RunTimeErr") {
                return newState;
            } else if (newState.State.Case === "SyntaxErr") {
                return newState;
            } else {
                state = newState;
                continue executeInstructions;
            }
        }
    }

    function execute(s) {
        return executeInstructions(initMachineState(s));
    }

    function stepForward(s, state) {
        (0, _String.fsFormat)("Running instruction at memory %A")(x => {
            console.log(x);
        })(state.RegMap.get(new _InstructionType.Register("R", [15])));

        if (state.State.Case === "RunEND") {
            return state;
        } else if (state.State.Case === "RunTimeErr") {
            return state;
        } else if (state.State.Case === "SyntaxErr") {
            return state;
        } else {
            return (0, _Emulator.executeLine)(state);
        }
    }
});
//# sourceMappingURL=Program.js.map