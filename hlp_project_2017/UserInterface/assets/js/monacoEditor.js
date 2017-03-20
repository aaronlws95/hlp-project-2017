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

    function getEditorContent() {
        return editor.getValue();
    }

    function setEditorContent(string) {
        editor.setValue(string);
    }


    let decorations = [];
    function setLineDecoration(instrLineToFind,error) {

        let codeLine = 0;
        let instrLine = 0;
        let code = window.getEditorContent().split("\n")

        for (var i = 0; i < code.length; i++) {
            if (instrLine == instrLineToFind) break;
            if (!code[i]) {
                codeLine++
            }
            else {
                codeLine++;
                instrLine++
            }
        }

        decorations = editor.deltaDecorations(decorations, [
            {
                range: new monaco.Range(codeLine, 1, codeLine, 1),
                options: {
                    isWholeLine: true,
                    className: (error)?'line-decoration-error':'line-decoration'
                }
            }
        ]);
    }

    function clearLineDecoration() {
        decorations = editor.deltaDecorations(decorations, []);
    }

    function lockEditor(){
        editor.updateOptions({"readOnly":true})
    }
    function unlockEditor(){
        editor.updateOptions({"readOnly":false})
    }

    //set global for calling from fsharp
    //window.editor = editor
    window.setEditorContent = setEditorContent;
    window.getEditorContent = getEditorContent;
    window.setLineDecoration = setLineDecoration;
    window.clearLineDecoration = clearLineDecoration;
    window.lockEditor = lockEditor;
    window.unlockEditor =unlockEditor;
});