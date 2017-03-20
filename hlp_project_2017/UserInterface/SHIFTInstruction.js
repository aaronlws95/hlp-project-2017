define(["exports", "fable-core/umd/Map", "./EmulatorHelper", "./MachineState"], function (exports, _Map, _EmulatorHelper, _MachineState) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;

    function lshl(state, dest, op1, op2, s) {
        const res = op2 >= 31 ? 0 : op1 << op2;
        const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("LSL", [op1, op2, res])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function lshr(state, dest, op1, op2, s) {
        const res = op2 >= 31 ? 0 : ~~(op1 >>> 0 >>> op2);
        const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("LSR", [op1, op2, res])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function ashr(state, dest, op1, op2, s) {
        const res = (op2 > 31 ? op1 < 0 : false) ? -1 : op2 > 31 ? 0 : op1 >> op2;
        const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("ASR", [op1, op2, res])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function ror(state, dest, op1, op2, s) {
        const res = ~~(op1 >>> 0 >>> op2 | op1 >>> 0 << 32 - op2);
        const newRegMap = (0, _Map.add)(dest, res, state.RegMap);
        const newFlags = s ? _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("ROR", [op1, op2, res])) : state.Flags;
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function rrx(state, dest, exp, s) {
        const newExp = ~~(exp >>> 0 >>> 1 | state.Flags.C >>> 0 << 31);
        const newRegMap = (0, _Map.add)(dest, newExp, state.RegMap);
        const newC = (exp & 1) === 1 ? true : false;
        let newFlags;

        if (s) {
            const inputRecord = _EmulatorHelper.ProcessFlag.processFlags(state, new _EmulatorHelper.ProcessFlag.ProcessFlagType("OTHER", [newExp]));

            newFlags = new _MachineState.Flags(inputRecord.N, inputRecord.Z, newC, inputRecord.V);
        } else {
            newFlags = state.Flags;
        }

        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, newFlags, state.State);
    }

    function executeInstruction(state, instruction, s) {
        const er = rol => {
            return _EmulatorHelper.Extractor.extractRegister(state, rol);
        };

        const get8lsbit = x => {
            return ~~(x & 0xFF);
        };

        if (instruction.Case === "LSR") {
            return lshr(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), get8lsbit(er(instruction.Fields[2])), s);
        } else if (instruction.Case === "ASR") {
            return ashr(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), get8lsbit(er(instruction.Fields[2])), s);
        } else if (instruction.Case === "ROR") {
            return ror(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), get8lsbit(er(instruction.Fields[2])), s);
        } else if (instruction.Case === "RRX") {
            return rrx(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), s);
        } else {
            return lshl(state, instruction.Fields[0], state.RegMap.get(instruction.Fields[1]), get8lsbit(er(instruction.Fields[2])), s);
        }
    }
});
//# sourceMappingURL=SHIFTInstruction.js.map