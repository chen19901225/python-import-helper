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
    let disposable = vscode.commands.registerTextEditorCommand("cqh-python-import-helper.import-upgrade",(textEditor, edit) => {
        if (!(textEditor.selection)) {
            vscode.window.showErrorMessage("You must select a content to convert");
            return;
        }

        const document = textEditor.document;
        let i = 0;
        let line: string;

        let handle_comment = (i) => {
            return i + 1;
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
            while (1) {
                line = document.lineAt(i).text;
                if (line == '"""') {
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
            while (1) {
                line = document.lineAt(i).text;
                if (line == "'''") {
                    break;
                } else {
                    i = i + 1;
                }
            }
            return i + 1;
        }

        let handle_line = (i) => {
            let line = document.lineAt(i).text;
            if (Object.is("", line.trim())) {
                return [false, handle_empty(i)];
            }
            if (line.startsWith('#')) {
                return [false, handle_comment(i)];
            }

            if (line.startsWith('"')) {
                return [false, handle_string(i)];
            }

            if (line.startsWith('"""')) {
                return [false, handle_multiple_string(i)];
            }

            if (line.startsWith("'''")) {
                return [false, handle_multiple_single_string(i)];
            }
            return [true, i];

        }

        // 获取到行号， 改行是import 语句，或者正式代码
        
        while (1) {
            let [is_ok, new_i] = handle_line(i);
            i = new_i;
            if (is_ok) {
                break;
            }
        }

        const selection = textEditor.selection;
        const text = textEditor.document.getText(selection);

        let textAppendToEmpty =  (text: string, i: number) => {
            // append text after empty
            let j = i - 1;
            while (1 && j >= 0) {
                line = document.lineAt(j).text;
                if (!Object.is("", line.trim())) {
                    break;
                }
                j --;
            }
            
            let nextLine = document.lineAt(j + 1);
            edit.replace(nextLine.range, text + "\n" + nextLine.text);
            
            // vscode.commands.executeCommand("editor.action.deleteLines");
        }

        let getCodeLineNoFunc = (startLineNo: number) => {
            let currentLineNo = startLineNo;
            // let currentLine;
            while(1) {
                let currentLine = document.lineAt(currentLineNo);
                // 寻找 非空行， 也不是`from`, `import` 开头的行
                if(handle_line(currentLineNo)[0] && !currentLine.text.startsWith("from") && !currentLine.text.startsWith("import")) {
                    break;
                }
                currentLineNo += 1;
            }
            return currentLineNo;
        }
        let CodeLineNo = getCodeLineNoFunc(i);

        let documentLinesAnyEqualFunc= (start: number, end:number, searchText: string)=> {
            let contains = false;
            for(let i=start;i <= end ;i++) {
                let line = document.lineAt(i); 
                if(line.text.trim()===searchText) {
                    contains = true;
                    break;
                }
            }
            return contains
        }
        

        edit.replace(selection, ""); // 移除现在的位置
        if (text.startsWith("import")) {
            if(!documentLinesAnyEqualFunc(i, CodeLineNo, text)) { // import 语句，不重复
                textAppendToEmpty(text, i);
            }
             
        } else {
            // find insert line or insert the last
            let the_same_from_row_index = -1;
            let walk_row_index = i;
            let words = text.split(" ");
            // iter walk line
            let compare_line;
            while (1) {
                compare_line = document.lineAt(walk_row_index);
                if(!compare_line.text.startsWith("from") && !compare_line.text.startsWith("import")) {
                    let [is_ok, new_i] = handle_line(walk_row_index);
                    if(is_ok) {
                        break;
                    } else {
                        walk_row_index = new_i;
                        continue;
                    }
                    // break;
                }
                
                let line_words: Array<string> = compare_line.text.split(" ");
                if (Object.is(line_words[1], words[1]) && line_words[0] == "from") { // only merge `from` import
                    the_same_from_row_index = walk_row_index;
                    // edit.replace(selection, "");
                    
                    if(line_words.indexOf(words[3]) > -1) {

                    } else {
                        edit.replace(compare_line.range, compare_line.text + ", " + words[3]);
                    }
                   
                    // await vscode.commands.executeCommand("editor.action.deleteLines");
                    break;
                } else {
                    walk_row_index += 1;
                }
                
            }

            if(the_same_from_row_index==-1) {
                 textAppendToEmpty(text, i);
            } 
        }

        vscode.commands.executeCommand("editor.action.deleteLines");

       


        
        
        




    })

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}