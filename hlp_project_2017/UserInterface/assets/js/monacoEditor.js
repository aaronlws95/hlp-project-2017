requirejs.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });
requirejs(['vs/editor/editor.main'], function () {
    //register a new language
    monaco.languages.register({ id: 'ARM' });

    monaco.languages.setMonarchTokensProvider('ARM', {
        ignoreCase: true,
        tokenizer: {
            root: [
                [/\b(r([0-9]|1[0-5])|(pc|sp|lr))\b/, "register"],
                [/[#$=](-)?((0x[0-9a-f]+)|(0b[01]+)|(\d+))/, "number"],
                [/\b(MOV|ADD|SUB|MVN|EOR|RSB|RSC|ADC|SBC|BIC|ORR|ADR)(S)?(EQ|NE|CS|HS|CC|LO|MI|PL|VS|VC|HI|LS|GE|LT|GT|LE|AL)?\b/, "arithmetic"],
                //<Operation>{S}{<cond>} Rd, Operand2
                [/\b(LSL|LSR|ASR|ROR|RRX)(S)?(EQ|NE|CS|HS|CC|LO|MI|PL|VS|VC|HI|LS|GE|LT|GT|LE|AL)?\b/, "shift"],
                [/\b(CMP|CMN|TST|TEQ)(EQ|NE|CS|HS|CC|LO|MI|PL|VS|VC|HI|LS|GE|LT|GT|LE|AL)?\b/, "compare"],
                [/\b(B|BL)(EQ|NE|CS|HS|CC|LO|MI|PL|VS|VC|HI|LS|GE|LT|GT|LE|AL)?\b/, "branch"],
                [/\b(LDR|STR)(B)?(EQ|NE|CS|HS|CC|LO|MI|PL|VS|VC|HI|LS|GE|LT|GT|LE|AL)?\b/, "single-register"],
                [/\b(LDM|STM)(ED|IB|FD|IA|EA|DB|FA|DA)?(EQ|NE|CS|HS|CC|LO|MI|PL|VS|VC|HI|LS|GE|LT|GT|LE|AL)?\b/, "multiple-register"],
            ],
        }
    });

    monaco.editor.defineTheme('ARMTheme', {
        base: 'vs',
        inherit: false,
        rules: [
            { token: 'register', foreground: 'FF9800', fontStyle: 'bold' },

            { token: 'number', foreground: '757575' },

            { token: 'arithmetic', foreground: '536DFE', fontStyle: 'bold' },
            { token: 'shift', foreground: '536DFE', fontStyle: 'bold' },
            { token: 'compare', foreground: '536DFE', fontStyle: 'bold' },
            { token: 'branch', foreground: '536DFE', fontStyle: 'bold' },
            { token: 'single-register', foreground: '536DFE', fontStyle: 'bold' },
            { token: 'multiple-register', foreground: '536DFE', fontStyle: 'bold' },

            { token: 'comment', foreground: '808080' }
        ]
    });

    let editor = monaco.editor.create(document.getElementById('text-editor-container'), {
        language: 'ARM',
        theme: 'ARMTheme',
        automaticLayout: true,
        scrollbar: {
            // Subtle shadows to the left & top. Defaults to true.
            useShadows: false,
            verticalScrollbarSize: 17,
        }
    });

    window.getEditorContent = function () {
        return editor.getValue();
    }

    window.setEditorContent = function (string) {
        editor.setValue(string);
    }

    let decorations = [];
    window.setLineDecoration = function (line) {
        decorations = editor.deltaDecorations(decorations, [
            {
                range: new monaco.Range(line, 1, line, 1),
                options: {
                    isWholeLine: true,
                    className: 'line-decoration'
                }
            }
        ]);
    }
});