import * as vscode from "vscode";
import { error } from "util";
import { service_position_history_add_position } from "../service/service_position_history";

function handle_dict_var(selectedText: string) {
    let index = selectedText.indexOf('[')
    return selectedText.slice(0, index);
}
function handle_dict_key_raw(selectedText: string) {
    let index = selectedText.indexOf("[")
    let text = selectedText.slice(index + 1);
    return text.slice(0, text.length - 1);
}

function handle_dict_key_unquote(selectedText: string) {
    let index = selectedText.indexOf("[")
    let text = selectedText.slice(index + 1);
    text = text.slice(0, text.length - 1);
    if (text[0] === '"' || text[0] === "'") {
        text = text.slice(1, text.length - 1);
    }
    return text;
    // return text.slice(0, text.length -1);
}


function handle_var_simple(selectedText: string) {
    if (selectedText.endsWith("es")) {
        return selectedText.slice(0, selectedText.length - 2)
    }
    if (selectedText.endsWith("s")) {
        return selectedText.slice(0, selectedText.length - 1)
    }

    return selectedText;
}


function _handle_var_with_label(selectedText: string, label: string) {
    if (label === 'raw') {
        return selectedText;
    }
    if (label === 'dict_var') {
        return handle_dict_var(selectedText)
    }
    if (label === 'dict_key_raw') {
        return handle_dict_key_raw(selectedText)
    }

    if (label == 'dict_key_unquote') {
        return handle_dict_key_unquote(selectedText)
    }

    if (label === 'var_simple') {
        return handle_var_simple(selectedText);
    }
}


export function handle_var(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let selection = textEditor.selections[0];
    service_position_history_add_position(selection.start);
    let document = textEditor.document;
    let selected_text = document.getText(selection);
    let items: vscode.QuickPickItem[] = [];
    items.push({
        'label': 'raw',
        'description': 'raw'
    })
    items.push({
        'label': 'dict_var',
        'description': 'dict_var'
    })
    items.push({
        'label': 'dict_key_raw',
        'description': 'dict_key_raw'
    })
    items.push({
        "label": 'dict_key_unquote',
        'description': 'dict_key_unquote'
    })
    items.push({
        "label": "var_simple",
        "description": "get var simple"
    })

    vscode.window.showQuickPick(items).then((item) => {
        let { label } = item;
        let out = _handle_var_with_label(selected_text, label);
        let newEndPost = new vscode.Position(selection.start.line, selection.start.character + out.length);
        // let
        textEditor.edit((builder) => {
            builder.replace(selection, out);
        }).then((success) => {
            // let newPosition = new vscode.Position(startPos.line, startPos.character + replaceText.length + 1)
            textEditor.selection = new vscode.Selection(newEndPost, newEndPost);
        })

    })

}