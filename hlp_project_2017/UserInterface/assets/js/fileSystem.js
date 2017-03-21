const {remote} = require('electron')
const fs = require('fs');
const path = require('path');
const dialog = remote.dialog;
const fileExtentionFilters = [
    { name: 'ARM Assembly', extensions: ['s'] },
    { name: 'All Files', extensions: ['*'] },
]
const appName = document.title;
const sourceCodeEditor = document.getElementById("source-code");

let fileName = "";

// function setEditorContent(string) {
//     document.getElementById("source-code").value = string;
// }

// function getEditorContent(){
//     return sourceCodeEditor.value
// }

function newFile() {
    if (confirm("Discard the current file?")) {
        setEditorContent("");
        log("New file is created.");
        document.title = "Untitled" + " - " + appName;
    }
}

function log(...args) {
    msg = args.join(" ");
    console.info(new Date().toLocaleTimeString(),"\t" + msg);
    document.getElementById("status-msg").textContent = msg;
}

function error(...args) {
    msg = args.join(" ");
    console.error(new Date().toLocaleTimeString(),"\t" + msg);
    document.getElementById("status-msg").textContent = msg;
    alert(msg);
}

function openFile() {
    if (confirm("Discard the current file?")) {
        dialog.showOpenDialog({
            filters: fileExtentionFilters
        }, function (newFileNames) {
            // fileNames is an array that contains all the selected
            if (newFileNames === undefined) {
                log("No file is selected.");
            } else {
                log("Openning", newFileNames[0]);
                readFile(newFileNames[0]);
            }
        });
    }

}

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            error("FileSystem:", "An error ocurred reading the file :" + err.message);
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        fileName = path.basename(filepath);
        setEditorContent(data);
        document.title = fileName + " - " + appName;
        log(fileName, "is openned successfully.");
    });
}

function writeFile(filepath, content) {
    fs.writeFile(filepath, content, function (err) {
        if (err) {
            alert("An error ocurred updating the file" + err.message);
            console.log(err);
            return;
        }
        log("File saved to",filepath);

    });
}

function saveFile() {
    if (fileName) {
        writeFile(fileName, getEditorContent());
    }
    else {
        saveFileAs();
    }
}
function saveFileAs() {
    dialog.showSaveDialog({
        filters: fileExtentionFilters
    }, function (newFileName) {
        if (newFileName === undefined) {
            log("User canceled file save.");
            return;
        }
        writeFile(newFileName,getEditorContent());
        fileName = path.basename(newFileName);
        document.title = fileName + " - " + appName;
    });
}

function getButton(string){
    return document.getElementById(string);
}

const newFileButton = getButton("new-file");
const openFileButton = getButton("open-file");
const saveFileButton = getButton("save-file");

newFileButton.addEventListener("click",newFile);
openFileButton.addEventListener("click",openFile);
saveFileButton.addEventListener("click",saveFile);