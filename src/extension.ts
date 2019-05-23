'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('[cqh-python-import-helper] Congratulations, your extension "cqh-python-import-helper" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    //     // The code you place here will be executed every time your command is executed

    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World!');
    // });
    let disposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.import-upgrade", (textEditor, edit) => {
        if (!(textEditor.selection)) {
            vscode.window.showErrorMessage("You must select a content to convert");
            return;
        }

        const position = textEditor.selection.active;
        const document = textEditor.document;
        let nextLineNo = 0;
        let i = 0;
        let line: string;
        let codeRowIndex = -1;
        
        let handle_comment = (i) => {
            return i+1;
        }

        let handle_empty = (i) => {
            return i + 1;
        }

        let handle_string = (i) => {
            return i + 1;
        }
        let handle_multiple_string = (i) => {
            i = i + 1;
            let line;
            while (1){
                line = document.lineAt(i).text;
                if(line== '"""') {
                    break;
                } else {
                    i = i + 1;
                }
            }
            return i + 1;
        }
        let handle_multiple_single_string = (i) => {
            i = i + 1;
            let line;
            while (1){
                line = document.lineAt(i).text;
                if(line== "'''") {
                    break;
                } else {
                    i = i + 1;
                }
            }
            return i + 1;
        }

        let handle_line = (i) =>  {
            let line = document.lineAt(i).text;
            if (Object.is("", line.trim())){
                return [false, handle_empty(i)];
            }
            if (line.startsWith('#')) {
                return [false, handle_comment(i)];
            }

            if (line.startsWith('"')) {
                return [false, handle_string(i)];
            }

            if(line.startsWith('"""') ) {
                return [false, handle_multiple_string(i)];
            }

            if(line.startsWith("'''")){
                return [false, handle_multiple_single_string(i)];
            }
            return [true, i];
            
        }

        while(1) {
            let [is_ok, new_i] = handle_line(i);
            i = new_i;
            if(is_ok){
                break;
            }
        }

        // find non empty
        let j = i -1;
        while(1) {
            line = document.lineAt(j).text;
            if(!Object.is("", line.trim())) {
                break;
            }
        }
        const selection = textEditor.selection;
        const text = textEditor.document.getText(selection);
        edit.replace(selection, "");
        let nextLine = document.lineAt(j+1);
        edit.replace(nextLine.range, text+"\n"+nextLine.text);




    })

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}