define(["exports", "fable-core/umd/Map", "./EmulatorHelper", "./MachineState"], function (exports, _Map, _EmulatorHelper, _MachineState) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;

    function updateRegister(state, dest, op2, s) {
        const newRegMap = (0, _Map.add)(dest, op2, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("OTHER", [op2])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function add(state, dest, op1, op2, res, s) {
        const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("ADD", [op1, op2, res])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function sub(state, dest, op1, op2, res, s) {
        const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("SUB", [op1, op2, res])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function subwc(state, dest, op1, op2, res, s) {
        const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("SUBWC", [op1, op2, res])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function executeInstruction(state, instruction, s) {
        const er = rol => {
            return _EmulatorHelper.Extractor.extractRegister(state, rol);
        };

        if (instruction.Case === "MVN") {
            return updateRegister(state, instruction.Fields[0], ~er(instruction.Fields[1]), s);
        } else if (instruction.Case === "AND") {
            return updateRegister(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]) & er(instruction.Fields[2]), s);
        } else if (instruction.Case === "EOR") {
            return updateRegister(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]) ^ er(instruction.Fields[2]), s);
        } else if (instruction.Case === "BIC") {
            return updateRegister(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]) & ~er(instruction.Fields[2]), s);
        } else if (instruction.Case === "ORR") {
            return updateRegister(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]) | er(instruction.Fields[2]), s);
        } else if (instruction.Case === "ADD") {
            return add(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) + er(instruction.Fields[2]), s);
        } else if (instruction.Case === "ADC") {
            return add(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) + er(instruction.Fields[2]) + state.Flags.C, s);
        } else if (instruction.Case === "SUB") {
            return sub(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) - er(instruction.Fields[2]), s);
        } else if (instruction.Case === "RSB") {
            return sub(state, instruction.Fields[0], er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]) - state.RegMap.get(instruction.Fields[1]), s);
        } else if (instruction.Case === "RSC") {
            return sub(state, instruction.Fields[0], er(instruction.Fields[2]), state.RegMap.get(instruction.Fields[1]) - state.Flags.C + 1, er(instruction.Fields[2]) - state.RegMap.get(instruction.Fields[1]) + state.Flags.C - 1, s);
        } else if (instruction.Case === "SBC") {
            return sub(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), er(instruction.Fields[2]) - state.Flags.C + 1, state.RegMap.get(instruction.Fields[1]) - er(instruction.Fields[2]) + state.Flags.C - 1, s);
        } else {
            return updateRegister(state, instruction.Fields[0], er(instruction.Fields[1]), s);
        }
    }
});
//# sourceMappingURL=ALUInstruction.js.map