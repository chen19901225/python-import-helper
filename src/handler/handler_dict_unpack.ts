import * as vscode from "vscode";
import { parse_function, FunctionDef } from '../parser';

export function handler_dict_unpack(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let replaceContent = generate_replace_upack_string(line.text);
    // edit.replace(line.range, replaceContent);
    edit.insert(cursor, replaceContent);
}

export function generate_replace_upack_string(source: string) {
    let element_list = [];
    let run="";
    for (let ch of source) {
        if(ch.match(/[_a-zA-Z0-9]/)) {
            run +=ch;
        } else {
            if(run && run.length  > 0) {
                element_list.push(run)
                run = "";
            }
        }
    }
    if(run && run.length>0) {
        element_list.push(run);
    }
    if(element_list.length == 0) {
        console.error("element_list is null");
        return "";
    }
    let out = [];
    let source_var: string = element_list.pop();
    let right_side_list = []
    let is_first = true;
    for (let ele of element_list) {
        out.push(ele);
        if(source_var.endsWith("_d") || source_var.endsWith("_dict")) {
            if(!is_first) {
                right_side_list.push(`${source_var}["${ele}"]`)
            } else {
                is_first = false;
                right_side_list.push(`["${ele}"]`)
            }
            
        } else if (source_var.endsWith("_")) {
            if(!is_first) {
                right_side_list.push(`${source_var}${ele}`)
            } else {
                is_first = false;
                right_side_list.push(`${ele}`)
            }
        }
        else {
            if(!is_first) {
                right_side_list.push(`${source_var}.${ele}`)
            } else {
                is_first = false;
                right_side_list.push(`.${ele}`)
            }
            
        }
    }
    return right_side_list.join(", ")
}