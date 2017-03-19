define(["exports", "fable-core/umd/Map", "./MachineState", "./EmulatorHelper", "./InstructionType", "fable-core/umd/Seq", "fable-core/umd/List"], function (exports, _Map, _MachineState, _EmulatorHelper, _InstructionType, _Seq, _List) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;

    function adr(state, dest, exp) {
        const newRegMap = (0, _Map.add)(dest, exp, state.RegMap);
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, state.Flags, state.State);
    }

    function ldr(state, dest, source, offset, autoIndex, s) {
        const em = addr => {
            return _EmulatorHelper.Extractor.extractMemory(state, addr);
        };

        let newRegMap;
        const loadRegMap = (0, _Map.add)(dest, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + offset])), state.RegMap);

        if (!dest.Equals(source)) {
            newRegMap = (0, _Map.add)(source, loadRegMap.get(source) + autoIndex, loadRegMap);
        } else {
            newRegMap = loadRegMap;
        }

        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, state.Flags, state.State);
    }

    function ldm(state, dir, source, regList, writeBack) {
        const em = addr => {
            return _EmulatorHelper.Extractor.extractMemory(state, addr);
        };

        let patternInput;
        const $var1 = dir.Case === "IB" ? [0] : dir.Case === "FD" ? [1] : dir.Case === "IA" ? [1] : dir.Case === "EA" ? [2] : dir.Case === "DB" ? [2] : dir.Case === "FA" ? [3] : dir.Case === "DA" ? [3] : [0];

        switch ($var1[0]) {
            case 0:
                patternInput = (0, _Seq.fold)((tupledArg, elem) => [(0, _Map.add)(elem, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg[1] + 4])), tupledArg[0]), tupledArg[1] + 4], [state.RegMap, 0], regList);
                break;

            case 1:
                patternInput = (0, _Seq.fold)((tupledArg_1, elem_1) => [(0, _Map.add)(elem_1, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_1[1]])), tupledArg_1[0]), tupledArg_1[1] + 4], [state.RegMap, 0], regList);
                break;

            case 2:
                patternInput = (0, _Seq.fold)((tupledArg_2, elem_2) => [(0, _Map.add)(elem_2, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_2[1] - 4])), tupledArg_2[0]), tupledArg_2[1] - 4], [state.RegMap, 0], (0, _List.reverse)(regList));
                break;

            case 3:
                patternInput = (0, _Seq.fold)((tupledArg_3, elem_3) => [(0, _Map.add)(elem_3, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_3[1]])), tupledArg_3[0]), tupledArg_3[1] - 4], [state.RegMap, 0], (0, _List.reverse)(regList));
                break;
        }

        if (writeBack) {
            const RegMap = (0, _Map.add)(source, state.RegMap.get(source) + patternInput[1], patternInput[0]);
            return new _MachineState.MachineState(state.END, RegMap, state.MemMap, state.Flags, state.State);
        } else {
            return new _MachineState.MachineState(state.END, patternInput[0], state.MemMap, state.Flags, state.State);
        }
    }

    function str(state, source, dest, offset, autoIndex, s) {
        const newMemMap = (0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + offset]), new _InstructionType.Memory("Val", [source]), state.MemMap);
        const newRegMap = (0, _Map.add)(dest, state.RegMap.get(dest) + autoIndex, state.RegMap);
        return new _MachineState.MachineState(state.END, newRegMap, newMemMap, state.Flags, state.State);
    }

    function stm(state, dir, dest, regList, writeBack) {
        let patternInput;
        const $var2 = dir.Case === "IB" ? [0] : dir.Case === "FD" ? [1] : dir.Case === "IA" ? [1] : dir.Case === "EA" ? [2] : dir.Case === "DB" ? [2] : dir.Case === "FA" ? [3] : dir.Case === "DA" ? [3] : [0];

        switch ($var2[0]) {
            case 0:
                patternInput = (0, _Seq.fold)((tupledArg, elem) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg[1]]), new _InstructionType.Memory("Val", [state.RegMap.get(elem)]), tupledArg[0]), tupledArg[1] - 4], [state.MemMap, 0], (0, _List.reverse)(regList));
                break;

            case 1:
                patternInput = (0, _Seq.fold)((tupledArg_1, elem_1) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg_1[1] - 4]), new _InstructionType.Memory("Val", [state.RegMap.get(elem_1)]), tupledArg_1[0]), tupledArg_1[1] - 4], [state.MemMap, 0], (0, _List.reverse)(regList));
                break;

            case 2:
                patternInput = (0, _Seq.fold)((tupledArg_2, elem_2) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg_2[1]]), new _InstructionType.Memory("Val", [state.RegMap.get(elem_2)]), tupledArg_2[0]), tupledArg_2[1] + 4], [state.MemMap, 0], regList);
                break;

            case 3:
                patternInput = (0, _Seq.fold)((tupledArg_3, elem_3) => [(0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + tupledArg_3[1] + 4]), new _InstructionType.Memory("Val", [state.RegMap.get(elem_3)]), tupledArg_3[0]), tupledArg_3[1] + 4], [state.MemMap, 0], regList);
                break;
        }

        const newRegMap = writeBack ? (0, _Map.add)(dest, state.RegMap.get(dest) + patternInput[1], state.RegMap) : state.RegMap;
        return new _MachineState.MachineState(state.END, newRegMap, patternInput[0], state.Flags, state.State);
    }

    function executeInstruction(state, instruction) {
        const er = rol => {
            return _EmulatorHelper.Extractor.extractRegister(state, rol);
        };

        const ga = arg00_ => {
            return _EmulatorHelper.Extractor.getAddressValue(arg00_);
        };

        if (instruction.Case === "LDR") {
            return ldr(state, instruction.Fields[0], instruction.Fields[1], er(instruction.Fields[2]), er(instruction.Fields[3]), instruction.Fields[4]);
        } else if (instruction.Case === "STR") {
            return str(state, state.RegMap.get(instruction.Fields[0]), instruction.Fields[1], er(instruction.Fields[2]), er(instruction.Fields[3]), instruction.Fields[4]);
        } else if (instruction.Case === "LDM") {
            return ldm(state, instruction.Fields[0], instruction.Fields[1], instruction.Fields[2], instruction.Fields[3]);
        } else if (instruction.Case === "STM") {
            return stm(state, instruction.Fields[0], instruction.Fields[1], instruction.Fields[2], instruction.Fields[3]);
        } else {
            return adr(state, instruction.Fields[0], ga(instruction.Fields[1]));
        }
    }
});
//# sourceMappingURL=MEMInstruction.js.map