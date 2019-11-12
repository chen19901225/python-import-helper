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



function handle_dict_get_var(selectedText: string) {
    let index = selectedText.indexOf('[')
    return selectedText.slice(0, index);
}
function handle_dict_get_key(selectedText: string) {
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

function handle_raw(selectedText: string) {
    return selectedText;
}

function handle_var_remove_last_part(selectedText: string) {
    let index = selectedText.lastIndexOf(".")
    if (index === -1) {
        return selectedText;
    }
    return selectedText.slice(0, index);
}



function _handle_var_with_label(selectedText: string, label: string, routes: Array<[number, string, (text:string) => string, string]>) {
    for(let [index, description, func, label] of routes) {
        if(description === selectedText) {

            return func(selectedText);
        }
    }
}

function handle_var_last_part_and_remove_private(selectedText: string) {
    return handle_remove_private(handle_last_part(selectedText));
}
function handle_var_last_part_and_remove_prefix(selectedText: string) {
    return handle_remove_prefix(handle_last_part(selectedText));
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
    let routes:Array<[number, string, (text:string) => string, string]> = [
        [10, 'raw', handle_raw, "保存原样"],
        [11, 'dict_get_var', handle_dict_get_var, "a['c']获取a"],
        [12, 'dict_get_key', handle_dict_get_key, "a['c']获取'c'"],
        [13, 'dict_key_unquote', handle_dict_key_unquote, "a['c']获取c"],
        [14, 'var_simple', handle_var_simple, '获取单数形式'],
        [15, 'var_last_part', handle_last_part, '获取最后一部分eg: a.b 获取 b'],
        [16, 'var_remove_prefix', handle_remove_prefix, '去掉前缀,ab__c获取c'],
        [17, 'var_remove_private', handle_remove_private, '去掉私有前缀, _a返回a'],
        [18, 'var_remove_last_part', handle_var_remove_last_part, '去掉最后一部分'],
        [50, 'var_last_part_and_remove_private', handle_var_last_part_and_remove_private, "先获取最后一部分，再去掉私有前缀"],
        [51, 'var_last_part_and_remove_prefix', handle_var_last_part_and_remove_prefix, '先获取最后一部分, 再去掉前缀']
    ]

    let indexLength = 2;
    let formatIndex = (index: number): string => {
        let prefix = '0'.repeat(indexLength) + index.toString()
        return prefix.slice(prefix.length - indexLength);
    }
    for(let [index, description, func, label] of routes) {
        let formated_index = formatIndex(index);
        label = formated_index + label
        items.push({
            label,
            description
        })
    }




    // let length = items.length;
    // if (length < 10) {
    //     length = 1
    // } else {
    //     let strCount = (length - (length % 10)).toString();
    //     let _count = 1;
    //     for (let ch of strCount) {
    //         if (ch == '0') {
    //             _count += 1;
    //         }
    //     }
    //     length = _count

    // }

    // for (let i = 0; i < items.length; i++) {
    //     let currentItem = items[i];
    //     let prefix = "" + (i + 10)
    //     prefix = "0".repeat(length) + prefix;
    //     prefix = prefix.slice(prefix.length - length) + "."
    //     currentItem.label = prefix + currentItem.label
    // }


    vscode.window.showQuickPick(items).then((item) => {
        if (!item) {
            return;
        }
        let { description } = item;
        let out = _handle_var_with_label(selected_text, description, routes);
        update_last_used_variable(out);
        addItemHistory({ 'label': item.description, 'description': item.description });
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