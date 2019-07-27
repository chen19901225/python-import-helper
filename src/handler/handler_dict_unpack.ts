import * as vscode from "vscode";
import { error } from "util";

export function handler_dict_unpack(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let replaceContent = generate_insert_string(line.text);
    // edit.replace(line.range, replaceContent);
    edit.insert(cursor, replaceContent);
}
export function handler_dict_prepend(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let replaceContent = generate_replace_string(line.text);
    let newPosition = new vscode.Position(cursor.line, line.range.start.character + replaceContent.length);
    edit.replace(new vscode.Range(new vscode.Position(cursor.line, line.firstNonWhitespaceCharacterIndex), line.range.end), replaceContent);
    textEditor.selection = new vscode.Selection(newPosition, newPosition);
    // edit.replace(line.range, replaceContent);
}

export function generate_replace_string(source: string) {
    let element_list: Array<string> = [];
    let run = "";
    for (let ch of source) {
        if (ch.match(/[_a-zA-Z0-9.\[\]"'\(\)]/)) {
            run += ch;
        } else {
            if (run && run.length > 0) {
                element_list.push(run)
                run = "";
            }

        }
    }
    if (run && run.length > 0) {
        element_list.push(run);
    }
    if (element_list.length == 0) {
        console.error("element_list is null");
        vscode.window.showErrorMessage("element_list is zero length");
        throw new error("element_list is 0 length");
    }
    let out = [];
    let prepend_ele: string = element_list.pop();
    if(!prepend_ele.endsWith('_')) {
        prepend_ele += "_";
    }
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
    for (let ch of source) {
        if (ch.match(/[_a-zA-Z0-9.\[\]"'\(\)]/)) {
            run += ch;
        } else {
            if (run && run.length > 0) {
                element_list.push(run)
                run = "";
            }
        }
    }
    if (run && run.length > 0) {
        element_list.push(run);
    }
    if (element_list.length == 0) {
        console.error("element_list is null");
        return "";
    }
    let out = [];
    let source_var: string = element_list.pop();
    let right_side_list = []
    let is_first = true;
    for (let ele of element_list) {
        out.push(ele);
        let new_ele = ele.split(".").pop();
        if (source_var.endsWith("_d") || source_var.endsWith("_dict")) {
            if (!is_first) {
                right_side_list.push(`${source_var}["${new_ele}"]`)
            } else {
                is_first = false;
                right_side_list.push(`["${new_ele}"]`)
            }

        } else if (source_var.endsWith("_")) {
            if (!is_first) {
                right_side_list.push(`${source_var}${new_ele}`)
            } else {
                is_first = false;
                right_side_list.push(`${new_ele}`)
            }
        }
        else {
            if (!is_first) {
                right_side_list.push(`${source_var}.${new_ele}`)
            } else {
                is_first = false;
                right_side_list.push(`.${new_ele}`)
            }

        }
    }
    return right_side_list.join(", ")
}