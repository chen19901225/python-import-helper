import * as vscode from "vscode";
import { getConfig } from "../config";
import * as path from "path";
import * as os from "os";
let start_text = "# cqh_insert_self:"
let last_word: string = "";

// __insert_self__
export function insert_self(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let position = textEditor.selection.active;
    // edit.insert(position, "self");

    // let final_list = [];
    let quickPickItem: vscode.QuickPickItem[] = [];
    if (last_word.length > 0) {
        quickPickItem.push({
            "label": last_word,
            "description": last_word
        })
    }
    let config = getConfig();
    let insert_list = config.insert_list;
    let index = 1;
    for (let value of insert_list) {
        quickPickItem.push({
            "label": `${index}.${value.name}`,
            "description": ""+index
        })
        index = index + 1
    }
    // 下面的忽略掉
    //let document = textEditor.document;
    // const lines: string[] = document.getText().split(/\r?\n/g);
    // for (let line of lines) {
    //     line = line.trim();
    //     if (line.startsWith(start_text)) {
    //         let word = line.slice(start_text.length)
    //         word = word.trim();
    //         quickPickItem.push({
    //             "label": `${index}.${word}`,
    //             "description": word
    //         })
    //         index = index + 1
    //     }
    // }

    vscode.window.showQuickPick(quickPickItem).then(item => {
        if (item) {
            // last_word = item.description;
            let indexStr = item.description;
            let indexNum = parseInt(indexStr);
            
            let insertItem = insert_list[indexNum-1];
            let insert_line = insertItem.list.join(os.EOL);
            let activeEditor = vscode.window.activeTextEditor;
            activeEditor.insertSnippet(new vscode.SnippetString(insert_line), position);
            // edit.insert(currentPosition, item.description);
        }
    })

}