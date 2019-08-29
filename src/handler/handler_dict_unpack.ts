import * as vscode from "vscode";
import { error } from "util";
import { get_variable_list } from "../util";

export function handler_dict_unpack(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let replaceContent = generate_insert_string(line.text);
    // edit.replace(line.range, replaceContent);
    edit.insert(cursor, replaceContent);
}
export function handler_dict_prepend(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    // 插入前缀
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let replaceContent = generate_replace_string(line.text);
    let newPosition = new vscode.Position(cursor.line, line.range.start.character + replaceContent.length);
    textEditor.edit((builder) => {
        builder.replace(new vscode.Range(new vscode.Position(cursor.line, line.firstNonWhitespaceCharacterIndex), line.range.end), replaceContent);
    }).then((success) => {
        textEditor.selection = new vscode.Selection(newPosition, newPosition);
    })

    textEditor.selection = new vscode.Selection(newPosition, newPosition);
    // edit.replace(line.range, replaceContent);
}

export function generate_replace_string(source: string) {
    let element_list: Array<string> = [];
    let run = "";
    element_list = get_variable_list(source);

    if (element_list.length == 0) {
        console.error("element_list is null");
        vscode.window.showErrorMessage("element_list is zero length");
        throw new error("element_list is 0 length");
    }
    let out = [];
    let prepend_ele: string = element_list.pop();
    let right_side_list = []
    for (let ele of element_list) {
        ele = ele.trim();
        if (!ele) {
            continue;
        }
        if (ele === "=") {
            out.push(ele);
            continue;
        }
        out.push(prepend_ele + ele);
        right_side_list.push(ele)
    }



    return out.join(", ") + " = " + right_side_list.join(", ");

}

export function generate_insert_string(source: string) {
    let element_list = [];
    let run = "";

    // 第一步分割变量
    element_list = get_variable_list(source);

    let out = [];
    let source_var: string = element_list.pop(); // 右边第一个变量
    let right_side_list = []
    let is_first = true;
    let handle_dict = (source_var, new_ele, is_first) => {
        if (is_first) {
            right_side_list.push(`["${new_ele}"]`);
            return false;
        } else {
            right_side_list.push(`${source_var}["${new_ele}"]`)
            return false;
        }
    }
    let handle_instance = (source_var, new_ele, is_first) => {
        if (!is_first) {
            right_side_list.push(`${source_var}.${new_ele}`)
            return false;
        } else {
            // is_first = false;
            right_side_list.push(`.${new_ele}`)
            return !is_first
        }
    }
    for (let ele of element_list) {
        out.push(ele);
        let new_ele: string = ele;
        let current_handle = handle_instance;
        if (new_ele.includes("[") && new_ele.includes(']')) {
            new_ele = new_ele.split('[')[1];
            new_ele = new_ele.slice(0, new_ele.length - 1);
            new_ele = new_ele.slice(1, new_ele.length - 1);
            current_handle = handle_dict;
        } else if (new_ele.includes(".")) {
            new_ele = new_ele.split(".").pop();
            current_handle = handle_instance
        } else if (source_var.endsWith("_d") || source_var.endsWith("_dict")) {
            current_handle = handle_dict;
        }
        is_first = current_handle(source_var, new_ele, is_first);

        // if () { // dict添加
        //     if (!is_first) {
        //         right_side_list.push(`${source_var}["${new_ele}"]`)
        //     } else {
        //         is_first = false;
        //         right_side_list.push(`["${new_ele}"]`)
        //     }

        // }
        // else {


        // }
    }
    return right_side_list.join(", ")
}