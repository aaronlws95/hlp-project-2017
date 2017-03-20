define(["exports", "fable-core/umd/Seq", "fable-core/umd/Map", "./InstructionType", "./MachineState", "./EmulatorHelper"], function (exports, _Seq, _Map, _InstructionType, _MachineState, _EmulatorHelper) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;

    function dcd(state, startMem, intList) {
        const patternInput = (0, _Seq.fold)((tupledArg, elem) => [tupledArg[0] + 4, (0, _Map.add)(new _InstructionType.Address("Addr", [tupledArg[0]]), new _InstructionType.Memory("Val", [elem]), tupledArg[1])], [startMem, state.MemMap], intList);
        return new _MachineState.MachineState(state.END, state.RegMap, patternInput[1], state.Flags, state.State);
    }

    function fill(state, startMem, length) {
        const patternInput = (0, _Seq.fold)((tupledArg, _arg1) => [tupledArg[0] + 4, (0, _Map.add)(new _InstructionType.Address("Addr", [tupledArg[0]]), new _InstructionType.Memory("Val", [0]), tupledArg[1])], [startMem, state.MemMap], (0, _Seq.toList)((0, _Seq.range)(1, length)));
        return new _MachineState.MachineState(state.END, state.RegMap, patternInput[1], state.Flags, state.State);
    }

    function equ(state, memLoc, value) {
        const MemMap = (0, _Map.add)(memLoc, new _InstructionType.Memory("Val", [value]), state.MemMap);
        return new _MachineState.MachineState(state.END, state.RegMap, MemMap, state.Flags, state.State);
    }

    function executeInstruction(state, instruction) {
        const ga = arg00_ => {
            return _EmulatorHelper.Extractor.getAddressValue(arg00_);
        };

        if (instruction.Case === "FILL") {
            return fill(state, ga(instruction.Fields[0]), instruction.Fields[1]);
        } else if (instruction.Case === "EQU") {
            return equ(state, instruction.Fields[0], instruction.Fields[1]);
        } else {
            return dcd(state, ga(instruction.Fields[0]), instruction.Fields[1]);
        }
    }
});
//# sourceMappingURL=LABELInstruction.js.map