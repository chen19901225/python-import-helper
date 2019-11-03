import * as vscode from "vscode";
import { removeVarType } from "../util"
export function get_left_last_part(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let position = textEditor.selection.active;
    let currentLine = textEditor.document.lineAt(position.line);
    let text = currentLine.text.trim();
    // if(/^[^=]+=.+$/.test())
    let match = /^\s*([^=]+)=.*$/.exec(text);
    if (match) {
        let eleWithoutType = removeVarType(match[1])
        let pattern = eleWithoutType
        if (eleWithoutType.indexOf(".") > -1) {
            pattern = eleWithoutType.split(".").pop();
        } else if (eleWithoutType.indexOf("__") > -1) {
            let index = eleWithoutType.indexOf("__")
            pattern = eleWithoutType.slice(index + 2)
        }
        let quickItems: vscode.QuickPickItem[] = [
            {
                'label': '1.raw',
                'description': '1.keep private, self._no_keep_alive got _no_keep_alive'
            },
            {
                "label": "2.remove_private",
                "description": "2. remove private prefix, self._no_keep_alive, get no_keep_alive"
            }
        ]
        vscode.window.showQuickPick(quickItems).then((item) => {
            if (item) {
                let { label } = item;
                if (label.startsWith("1.")) {
                    
                } else {
                    if(pattern.startsWith("_")) {
                        pattern = pattern.slice(1)
                    }
                }

                let activeEditor = vscode.window.activeTextEditor;
                // let insertedText = getInsertedContent(item.description);
                activeEditor.insertSnippet(new vscode.SnippetString(pattern), position);
            }
        })


        // edit.insert(position, pattern.trim());
        return;
    }

}
