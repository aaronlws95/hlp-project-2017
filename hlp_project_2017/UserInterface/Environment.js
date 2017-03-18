define(["exports", "./Parser"], function (exports, _Parser) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.makeenvironment = makeenvironment;

    function makeenvironment() {
        const environment = s => {
            return (0, _Parser.readAsm)(s);
        };

        return environment;
    }
});
//# sourceMappingURL=Environment.js.map