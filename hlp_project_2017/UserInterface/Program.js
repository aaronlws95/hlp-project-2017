define(["exports", "./Emulator", "fable-core/umd/String", "./Parser"], function (exports, _Emulator, _String, _Parser) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.s = undefined;
    const s = exports.s = "MOV R1 #10\r\n    MOV R2 #10";

    (function (argv) {
        const executeInstructions = state => {
            executeInstructions: while (true) {
                const newState = _Emulator.Instruction.executeLine(state);

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
        };

        (0, _String.fsFormat)("%A")(x => {
            console.log(x);
        })(executeInstructions((0, _Parser.readAsm)(s)));
        return 0;
    })(process.argv.slice(2));
});
//# sourceMappingURL=Program.js.map