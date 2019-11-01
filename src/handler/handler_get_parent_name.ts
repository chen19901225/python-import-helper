import * as vscode from "vscode";
import { parse_function } from '../parser';
import { try_get_definition } from '../util'

export function get_parent_name(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    const definition = try_get_definition(textEditor, edit);
    const parseResult = parse_function(definition);

    let insertContent = parseResult.name;
    let currentPosition = textEditor.selection.active;
    let quickItems: vscode.QuickPickItem[] = []
    for (let name of ["raw", "raw_without_prefix"]) {
        quickItems.push({
            "label": name,
            "description": name
        })
    }
    vscode.window.showQuickPick(quickItems).then((item) => {
        if (item) {
            let { label } = item;
            if (label === "raw") {
                // edit.insert(currentPosition, insertContent);
            } else {
                if (insertContent.startsWith("_")) {
                    insertContent = insertContent.slice(1)
                }
                let index = insertContent.indexOf("_")
                insertContent = insertContent.slice(index + 1);

            }
            let convert_element = insertContent;
            let activeEditor = vscode.window.activeTextEditor;
            activeEditor.insertSnippet(new vscode.SnippetString(convert_element), textEditor.selection.active)

            // edit.insert(currentPosition, insertContent);
        }
    })

    

}