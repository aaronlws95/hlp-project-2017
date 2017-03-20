define(["exports", "./InstructionType", "fable-core/umd/Map", "./MachineState"], function (exports, _InstructionType, _Map, _MachineState) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.executeInstruction = executeInstruction;

    function executeInstruction(state, instruction) {
        let newRegMap;

        if (instruction.Case === "BL") {
            const target = instruction.Fields[0].Fields[0];

            newRegMap = (() => {
                const key = new _InstructionType.Register("R", [15]);
                return table => (0, _Map.add)(key, target, table);
            })()((0, _Map.add)(new _InstructionType.Register("R", [14]), state.RegMap.get(new _InstructionType.Register("R", [15])) + 4, state.RegMap));
        } else {
            const target_1 = instruction.Fields[0].Fields[0];
            newRegMap = (0, _Map.add)(new _InstructionType.Register("R", [15]), target_1, state.RegMap);
        }

        return new _MachineState.MachineState(state.END, newRegMap, state.MemMap, state.Flags, state.State);
    }
});
//# sourceMappingURL=BRANCHInstruction.js.map