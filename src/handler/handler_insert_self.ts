import * as vscode from "vscode";
import { getConfig } from "../config";
let start_text = "# cqh_insert_self:"
let last_word: string = "";

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
            "label": `${index}.${value}`,
            "description": value
        })
        index = index + 1
    }
    let document = textEditor.document;
    const lines: string[] = document.getText().split(/\r?\n/g);
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith(start_text)) {
            let word = line.slice(start_text.length)
            word = word.trim();
            quickPickItem.push({
                "label": `${index}.${word}`,
                "description": word
            })
            index = index + 1
        }
    }

    vscode.window.showQuickPick(quickPickItem).then(item => {
        if (item) {
            last_word = item.description;
            let activeEditor = vscode.window.activeTextEditor;
            activeEditor.insertSnippet(new vscode.SnippetString(item.description), position);
            // edit.insert(currentPosition, item.description);
        }
    })

}