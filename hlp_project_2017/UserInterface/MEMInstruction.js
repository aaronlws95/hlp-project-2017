define(["exports", "fable-core/umd/Map", "./MachineState", "./EmulatorHelper", "./InstructionType", "fable-core/umd/Seq", "fable-core/umd/Util", "fable-core/umd/Set", "fable-core/umd/List"], function (exports, _Map, _MachineState, _EmulatorHelper, _InstructionType, _Seq, _Util, _Set, _List) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;

    function adr(state, dest, addr) {
        const newRegMap = (0, _Map.add)(dest, addr, state.RegMap);
        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, state.Flags, state.State);
    }

    function ldr(state, dest, source, offset, autoIndex, s) {
        let doLDR;

        const em = addr => {
            return _EmulatorHelper.Extractor.extractMemory(state, addr);
        };

        let newRegMap;
        const loadRegMap = (0, _Map.add)(dest, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + offset])), state.RegMap);
        newRegMap = (0, _Map.add)(source, loadRegMap.get(source) + autoIndex, loadRegMap);

        if (dest.Equals(source) ? autoIndex > 0 : false) {
            const State = new _MachineState.RunState("SyntaxErr", ["destination cannot equal source"]);
            doLDR = new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, state.Flags, State);
        } else {
            doLDR = new _MachineState.MachineState(state.END, newRegMap, state.MemMap, state.Flags, state.State);
        }

        if (_EmulatorHelper.Extractor.isValidAddress(state, new _InstructionType.Address("Addr", [state.RegMap.get(source) + offset]))) {
            return doLDR;
        } else {
            const State_1 = new _MachineState.RunState("RunTimeErr", ["Address not allocated"]);
            return new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, state.Flags, State_1);
        }
    }

    function ldm(state, dir, source, regList, writeBack) {
        let doLdm;

        const em = addr => {
            return _EmulatorHelper.Extractor.extractMemory(state, addr);
        };

        let patternInput;
        const $var1 = dir.Case === "IB" ? [0] : dir.Case === "FD" ? [1] : dir.Case === "IA" ? [1] : dir.Case === "EA" ? [2] : dir.Case === "DB" ? [2] : dir.Case === "FA" ? [3] : dir.Case === "DA" ? [3] : [0];

        switch ($var1[0]) {
            case 0:
                patternInput = (0, _Seq.fold)((tupledArg, elem) => [(0, _Map.add)(elem, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg[1] + 4])), tupledArg[0]), tupledArg[1] + 4], [state.RegMap, 0], (0, _Seq.toList)((0, _Seq.sortWith)((x, y) => (0, _Util.compare)(x, y), (0, _Seq.toList)((0, _Set.distinct)(regList)))));
                break;

            case 1:
                patternInput = (0, _Seq.fold)((tupledArg_1, elem_1) => [(0, _Map.add)(elem_1, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_1[1]])), tupledArg_1[0]), tupledArg_1[1] + 4], [state.RegMap, 0], (0, _Seq.toList)((0, _Seq.sortWith)((x, y) => (0, _Util.compare)(x, y), (0, _Seq.toList)((0, _Set.distinct)(regList)))));
                break;

            case 2:
                patternInput = (0, _Seq.fold)((tupledArg_2, elem_2) => [(0, _Map.add)(elem_2, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_2[1] - 4])), tupledArg_2[0]), tupledArg_2[1] - 4], [state.RegMap, 0], (0, _List.reverse)((0, _Seq.toList)((0, _Seq.sortWith)((x, y) => (0, _Util.compare)(x, y), (0, _Seq.toList)((0, _Set.distinct)(regList))))));
                break;

            case 3:
                patternInput = (0, _Seq.fold)((tupledArg_3, elem_3) => [(0, _Map.add)(elem_3, em(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_3[1]])), tupledArg_3[0]), tupledArg_3[1] - 4], [state.RegMap, 0], (0, _List.reverse)((0, _Seq.toList)((0, _Seq.sortWith)((x, y) => (0, _Util.compare)(x, y), (0, _Seq.toList)((0, _Set.distinct)(regList))))));
                break;
        }

        if (writeBack) {
            const RegMap = (0, _Map.add)(source, state.RegMap.get(source) + patternInput[1], patternInput[0]);
            doLdm = new _MachineState.MachineState(state.END, RegMap, state.MemMap, state.Flags, state.State);
        } else {
            doLdm = new _MachineState.MachineState(state.END, patternInput[0], state.MemMap, state.Flags, state.State);
        }

        const checkAddresses = dir_1 => {
            const initialList = (0, _Seq.toList)((0, _Seq.range)(1, regList.length));

            const isValidAddressFold = addr_1 => flag => {
                if (flag) {
                    return _EmulatorHelper.Extractor.isValidAddress(state, addr_1);
                } else {
                    return false;
                }
            };

            let patternInput_1;
            const $var2 = dir_1.Case === "IB" ? [0] : dir_1.Case === "FD" ? [1] : dir_1.Case === "IA" ? [1] : dir_1.Case === "EA" ? [2] : dir_1.Case === "DB" ? [2] : dir_1.Case === "FA" ? [3] : dir_1.Case === "DA" ? [3] : [0];

            switch ($var2[0]) {
                case 0:
                    patternInput_1 = (0, _Seq.fold)((tupledArg_4, _arg1) => [isValidAddressFold(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_4[1] + 4]))(tupledArg_4[0]), tupledArg_4[1] + 4], [true, 0], initialList);
                    break;

                case 1:
                    patternInput_1 = (0, _Seq.fold)((tupledArg_5, _arg2) => [isValidAddressFold(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_5[1]]))(tupledArg_5[0]), tupledArg_5[1] + 4], [true, 0], initialList);
                    break;

                case 2:
                    patternInput_1 = (0, _Seq.fold)((tupledArg_6, _arg3) => [isValidAddressFold(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_6[1] - 4]))(tupledArg_6[0]), tupledArg_6[1] - 4], [true, 0], initialList);
                    break;

                case 3:
                    patternInput_1 = (0, _Seq.fold)((tupledArg_7, _arg4) => [isValidAddressFold(new _InstructionType.Address("Addr", [state.RegMap.get(source) + tupledArg_7[1]]))(tupledArg_7[0]), tupledArg_7[1] - 4], [true, 0], initialList);
                    break;
            }

            if (patternInput_1[0]) {
                return doLdm;
            } else {
                const State = new _MachineState.RunState("RunTimeErr", ["Address not allocated"]);
                return new _MachineState.MachineState(state.END, state.RegMap, state.MemMap, state.Flags, State);
            }
        };

        return checkAddresses(dir);
    }

    function str(state, source, dest, offset, autoIndex, s) {
        const newMemMap = (0, _Map.add)(new _InstructionType.Address("Addr", [state.RegMap.get(dest) + offset]), new _InstructionType.Memory("Val", [source]), state.MemMap);
        const newRegMap = (0, _Map.add)(dest, state.RegMap.get(dest) + autoIndex, state.RegMap);
        return new _MachineState.MachineState(state.END, newRegMap, newMemMap, state.Flags, state.State);
    }

    function stm(state, dir, dest, regList, writeBack) {
        let patternInput;
        const $var3 = dir.Case === "IB" ? [0] : dir.Case === "FD" ? [1] : dir.Case === "IA" ? [1] : dir.Case === "EA" ? [2] : dir.Case === "DB" ? [2] : dir.Case === "FA" ? [3] : dir.Case === "DA" ? [3] : [0];

        switch ($var3[0]) {
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