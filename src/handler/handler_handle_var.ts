import * as vscode from "vscode";
import { error } from "util";
import { service_position_history_add_position, service_position_history_get_last_position } from "../service/service_position_history";
import { update_last_used_variable } from "./handler_get_last_used_variable";


let itemHistory: vscode.QuickPickItem[] = []


function addItemHistory(item: vscode.QuickPickItem) {
    let index = -1;
    if (itemHistory.length) {
        for (let i = 0; i < itemHistory.length; i++) {
            let walkItem = itemHistory[i];
            if (walkItem.label === item.label) {
                index = i;
            }
        }
        if (index > -1) {
            // itemHistory.indexOf()
            itemHistory.splice(index, 1)
        }
    }
    itemHistory.push(item);
}


function getLastItem(): [boolean, vscode.QuickPickItem | null] {
    if (itemHistory.length) {
        return [true, itemHistory[itemHistory.length - 1]]
    }
    return [false, null]
}



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

function handle_last_part(selected_text: string) {
    return selected_text.split(".").pop()
}

function handle_remove_prefix(selectedText: string) {
    let double_index = selectedText.indexOf('__')
    if (double_index > 0) {
        return selectedText.slice(double_index + 2)
    }
    if (selectedText.startsWith("_")) {
        selectedText = selectedText.slice(1);
    }
    let index = selectedText.indexOf("_")
    if (index > 0) {
        return selectedText.slice(index + 1)
    }
}

function handle_remove_private(selectedText: string) {
    if (selectedText.startsWith('_')) {
        return selectedText.slice(1)
    }
    return selectedText;

}

function handle_var_remove_last_part(selectedText: string) {
    let index = selectedText.lastIndexOf(".")
    if (index === -1) {
        return selectedText;
    }
    return selectedText.slice(0, index);
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
    if (label == 'var_last_part') {
        return handle_last_part(selectedText)
    }
    if (label == 'var_remove_prefix') {
        return handle_remove_prefix(selectedText);
    }
    if (label == 'var_remove_private') {
        return handle_remove_private(selectedText);
    }
    if (label == 'var_last_part_and_remove_private') {
        return handle_remove_private(handle_last_part(selectedText));
    }
    if (label == 'var_last_part_and_remove_prefix') {
        return handle_remove_prefix(handle_last_part(selectedText));
    }
    if (label == 'var_remove_last_part') {
        return handle_var_remove_last_part(selectedText);
    }
}


export function handle_var(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let selection;
    if (textEditor.selection.isEmpty) {
        let cursor = textEditor.selection.active;
        let start = service_position_history_get_last_position()
        selection = new vscode.Selection(start, cursor);
    } else {
        selection = textEditor.selections[0];
        service_position_history_add_position(selection.start);
    }


    let document = textEditor.document;
    let selected_text = document.getText(selection);
    let items: vscode.QuickPickItem[] = [];
    let [flag, last_item] = getLastItem();
    if (flag) {
        items.push(last_item);
    }


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
    items.push({
        'label': 'var_last_part',
        'description': 'var_last_part'
    })

    items.push({
        'label': 'var_remove_prefix',
        'description': 'var_remove_prefix'
    })

    items.push({
        'label': 'var_remove_private',
        'description': 'var_remove_private'
    })
    items.push({
        'label': 'var_last_part_and_remove_private',
        'description': 'var_last_part_and_remove_private'
    })
    items.push({
        'label': 'var_last_part_and_remove_prefix',
        'description': 'var_last_part_and_remove_prefix'
    })

    items.push({
        'label': 'var_remove_last_part',
        'description': 'var_remove_last_part'
    })


    for (let i = 0; i < items.length; i++) {
        let currentItem = items[i];
        currentItem[i].label = '' + (i + 1) + currentItem[i].label
    }


    vscode.window.showQuickPick(items).then((item) => {
        if (!item) {
            return;
        }
        let { description } = item;
        let out = _handle_var_with_label(selected_text, description);
        update_last_used_variable(out);
        addItemHistory(item);
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