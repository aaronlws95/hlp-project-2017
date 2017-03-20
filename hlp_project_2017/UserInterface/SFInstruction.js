define(["exports", "./EmulatorHelper", "./MachineState"], function (exports, _EmulatorHelper, _MachineState) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;

    function executeInstruction(state, instruction) {
        const er = rol => {
            return _EmulatorHelper.Extractor.extractRegister(state, rol);
        };

        const newFlags = instruction.Case === "TEQ" ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("OTHER", [state.RegMap.get(instruction.Fields[0]) ^ er(instruction.Fields[1])])) : instruction.Case === "CMP" ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("SUB", [state.RegMap.get(instruction.Fields[0]), er(instruction.Fields[1]), state.RegMap.get(instruction.Fields[0]) - er(instruction.Fields[1])])) : instruction.Case === "CMN" ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("ADD", [state.RegMap.get(instruction.Fields[0]), er(instruction.Fields[1]), state.RegMap.get(instruction.Fields[0]) + er(instruction.Fields[1])])) : _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("OTHER", [state.RegMap.get(instruction.Fields[0]) & er(instruction.Fields[1])]));
        return new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, newFlags, state.State);
    }
});
//# sourceMappingURL=SFInstruction.js.map