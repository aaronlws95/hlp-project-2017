const {Menu, MenuItem} = remote

let menu = new Menu()
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New(N)',
                accelerator: 'CmdOrCtrl+N',
                click() { newFile() }
            },
            {
                type: 'separator'
            },
            {
                label: 'Open(O)',
                accelerator: 'CmdOrCtrl+O',
                click() { openFile() }
            },
            {
                type: 'separator'
            },
            {
                label: 'Save(S)',
                accelerator: 'CmdOrCtrl+S',
                click() { saveFile() }
            },
            {
                label: 'Save As(A)...',
                accelerator: 'CmdOrCtrl+Shift+S',
                click() { saveFileAs() }
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit(X)',
                click() { }
            },
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                lable: 'Full Screen',
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Developer Tool',
                accelerator: 'F12',
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                label: 'About',
                accelerator: 'F1',
                click() { require('electron').shell.openExternal('http://electron.atom.io') }
            }
        ]
    }
]

menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)