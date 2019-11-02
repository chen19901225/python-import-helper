import * as vscode from "vscode";
import { error } from "util";
import { get_variable_list } from "../util";

function has_comment(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let indent = line.firstNonWhitespaceCharacterIndex;
    for (let i = 0; i < 100; i++) {
        let lineIndex = cursor.line - i;
        // let lineText = document.lineAt(lineIndex).text.trim();
        let walkLine = document.lineAt(lineIndex);
        let walkLineText = walkLine.text.trim();
        if (walkLine.firstNonWhitespaceCharacterIndex > indent) {
            continue
        }
        if (walkLineText.startsWith("# generated_by_dict_unpack")) {
            return true;
        }
    }
    return false;
}

export function handler_dict_unpack(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let indent = line.firstNonWhitespaceCharacterIndex;
    let has_insert_comment = has_comment(textEditor, edit);
    let replace_list = generate_insert_string(line.text, indent, has_insert_comment);
    let replaceContent = replace_list.join('\n');
    let endLine = cursor.line + replace_list.length - 1;
    let endCol = replace_list[replace_list.length - 1].length;
    let newPosition = new vscode.Position(endLine,
        endCol);

    // 现在这个也是replaced string
    //理由就是太长的话，需要格式化
    // 但是这样有个问题，replace之后的鼠标在哪里呢？
    // 算了还是insert吧
    // edit.replace(line.range, replaceContent);
    // edit.insert(cursor, replaceContent);

    textEditor.edit(builder => {
        builder.replace(line.range, replaceContent)


    }).then(success => {
        textEditor.selection = new vscode.Selection(newPosition, newPosition);
    })
}
export function handler_dict_prepend(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    // 插入前缀
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    vscode.window.showInputBox({
        password: false,
        placeHolder: "prefix",
        prompt: "请输入prefix",

    }).then((msg) => {
        if (!msg) {
            return;
        }
        msg = msg.trim();
        if (!msg) {
            return;
        }
        let replaceContent = generate_replace_string(line.text, msg);
        let newPosition = new vscode.Position(cursor.line, line.range.start.character + replaceContent.length + 1);
        textEditor.edit((builder) => {
            builder.replace(new vscode.Range(new vscode.Position(cursor.line, line.firstNonWhitespaceCharacterIndex), line.range.end), replaceContent);
        }).then((success) => {
            textEditor.selection = new vscode.Selection(newPosition, newPosition);
        })
    })


    // textEditor.selection = new vscode.Selection(newPosition, newPosition);
    // edit.replace(line.range, replaceContent);
}

export function generate_replace_string(source: string, prefix: string) {
    let element_list: Array<string> = [];
    let run = "";
    let [left, right] = source.split("=")
    element_list = get_variable_list(left);

    if (element_list.length == 0) {
        console.error("element_list is null");
        vscode.window.showErrorMessage("element_list is zero length");
        throw new error("element_list is 0 length");
    }
    let out = [];
    // let prepend_ele: string = element_list.pop();
    for (let ele of element_list) {
        ele = ele.trim();
        if (!ele) {
            continue;
        }
        // if (ele === "=") {
        //     is_left = false;
        //     out.push(ele);
        //     continue;
        // }
        out.push(prefix + ele);
        // if (is_left) {

        // } else {
        //     right_side_list.push(ele)
        // }


    }



    return out.join(", ") + " = " + right;

}

export function generate_insert_string(source: string,
    indent: number = 0, has_insert_comment = false) {
    let element_list = [];
    let run = "";

    // 第一步分割变量
    element_list = get_variable_list(source);

    let out = [];
    let source_var: string = element_list.pop(); // 右边第一个变量
    let right_side_list = []
    let left_side_list = []
    let is_first = false;
    let indent_string = ' '.repeat(indent);
    let handle_dict = (source_var, new_ele, is_first) => {
        right_side_list.push(`${source_var}["${new_ele}"]`)
        return false;
    }
    let handle_instance = (source_var, new_ele, is_first) => {
        right_side_list.push(`${source_var}.${new_ele}`)
        return false;

    }
    let handle_remove_prefix = (source_var, new_ele, is_first) => {
        right_side_list.push(`${source_var}${new_ele}`)
        return false;
    }
    for (let ele of element_list) {
        // out.push(ele);
        if (ele === '=') {
            break;
        }
        left_side_list.push(ele.trim());
        let new_ele: string = ele;
        let current_handle = handle_instance;
        if (new_ele.includes("[") && new_ele.includes(']')) {
            new_ele = new_ele.split('[')[1];
            new_ele = new_ele.slice(0, new_ele.length - 1);
            new_ele = new_ele.slice(1, new_ele.length - 1);
            current_handle = handle_dict;
        }else if(source_var.endsWith("_")) { // 这种
            //username, password = request.auth_
            //expect 
            // username = request.auth_username
            // password = request.auth_password
            current_handle = handle_remove_prefix
        }
         else if (new_ele.includes(".")) {
            new_ele = new_ele.split(".").pop();
            current_handle = handle_instance
        } else if (source_var.endsWith("_d") || source_var.endsWith("_dict") || source_var.startsWith("d_") || source_var === 'd') {
            current_handle = handle_dict;
        }
        is_first = current_handle(source_var, new_ele, is_first);
    }
    // let final_str =  right_side_list.join(", \\\n")
    let out_list = [];
    if (!has_insert_comment) {
        out_list.push(`${indent_string}# generated_by_dict_unpack: ${source_var}`);
    }
    for (let i = 0; i < left_side_list.length; i++) {
        let left_part = left_side_list[i];
        let right_part = right_side_list[i];
        out_list.push(`${indent_string}${left_part} = ${right_part}`);
    }
    return out_list;
    // return final_str

}