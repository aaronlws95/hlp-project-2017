define(["exports", "./Emulator", "./Parser", "fable-core/umd/String"], function (exports, _Emulator, _Parser, _String) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.test = undefined;
    exports.executeInstructions = executeInstructions;
    exports.execute = execute;
    exports.main = main;
    const test = exports.test = "MOV R1 #10\r\n    MOV R2 #20\r\n    ADD R3 R1 R2";

    function executeInstructions(state) {
        executeInstructions: while (true) {
            const newState = (0, _Emulator.executeLine)(state);

            if (newState.State.Case === "RunEND") {
                return newState;
            } else if (newState.State.Case === "RunTimeErr") {
                return state;
            } else if (newState.State.Case === "SyntaxErr") {
                return state;
            } else {
                state = newState;
                continue executeInstructions;
            }
        }
    }

    function execute(s) {
        return executeInstructions((0, _Parser.readAsm)(s));
    }

    function main(argv) {
        (0, _String.fsFormat)("%A")(x => {
            console.log(x);
        })(execute(test));
        return 0;
    }
});
//# sourceMappingURL=Program.js.map