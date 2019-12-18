import * as vscode from "vscode";
import { get_variable_list, extraVariablePart } from "../util"
import { update_last_used_variable } from './handler_get_last_used_variable'
import { insert_self } from "./handler_insert_self";
import { service_position_history_add_position } from "../service/service_position_history";

export function _extraVar(var_str: string) {
    let converted;
    let startswith_elements = ["isinstance(", "hasattr"]
    for (let ele of startswith_elements) {
        if (var_str.startsWith(ele)) {
            converted = var_str.substring(ele.length, var_str.indexOf(","))
            return converted;
        }
    }
    // if (var_str.startsWith("isinstance(")) {
    //     converted = var_str.substring("isinstance(".length, var_str.indexOf(","));
    // }
    // else if (var_str.startsWith("hasattr(")) {
    //     converted = var_str.substring("hasattr(".length, var_str.indexOf(","));
    // }
    // else {
    converted = extraVariablePart(var_str)
    // }
    return converted

}
function _insert(edit: vscode.TextEditorEdit, cusor: vscode.Position, context: string) {
    update_last_used_variable(context);
    edit.insert(cusor, context);
}
export function try_get_if_var(line: string): [boolean, Array<string>] {
    let start_array = ["if ", "elif ", "for ", "while "]
    line = line.trim()
    if (line.startsWith("# generated_by_dict_unpack:")) {
        let ele = line.split(":").pop()
        return [true, [ele.trim()]];
    }
    let trim_parenthes = (text: string): string => {
        if (text.startsWith("(")) {
            text = text.slice(1)
            text = text.trim()
            if (text.endsWith(")")) {
                text = text.slice(0, text.length - 1)
            }
        }
        return text;
    }
    let line_split_piece = (text: string): Array<string> => {
        // 根据and或者or分割text
        let pieces = []
        if (text.indexOf(" and ") > -1) {
            pieces = line.split(/\s+and\s+/)
        }
        else if (text.indexOf(" or ") > -1) {
            pieces = line.split(/\s+or\s+/)
        }
        else {
            pieces = [line];
        }
        return pieces
    }
    let local_split = (text: string, count: number = 1): Array<string> => {
        let out: Array<string> = []
        let tmp = '' + text;
        while (tmp.length > 0) {
            let index = tmp.indexOf(',')
            if (index == -1) {
                throw new Error("cannot find , in text " + tmp);
            }
            let piece = tmp.slice(0, index);
            out.push(piece);
            if (out.length == count) {
                out.push(tmp.slice(index + 1))
                break;
            }
        }
        return out;
    }
    for (let start_ele of start_array) {
        if (line.startsWith(start_ele)) {
            line = line.slice(start_ele.length);
            line = line.trim();
            if (line.endsWith(":")) {
                line = line.slice(0, line.length - 1)
            }
            line = line.trim()
            line = trim_parenthes(line);

            line = line.trim();
            let pieces = line_split_piece(line);

            let out = []
            for (let piece of pieces) {
                piece = piece.trim()
                piece = trim_parenthes(piece);


                piece = piece.trim()
                if (piece.startsWith("not ")) {
                    piece = piece.slice(4)
                }

                let trim_quote = (ele: string): string => {
                    if (ele.startsWith("'") && ele.endsWith("'")) {
                        ele = ele.slice(1, ele.length - 1)
                    }
                    if (ele.startsWith('"') && ele.endsWith('"')) {
                        ele = ele.slice(1, ele.length - 1)
                    }
                    return ele
                }

                // test hasattr
                if (piece.startsWith("hasattr(")) {
                    let content = piece.slice("hasattr(".length);
                    content = content.slice(0, content.length - 1);
                    let elements = content.split(",")
                    for (let ele of elements) {
                        ele = ele.trim();
                        ele = trim_quote(ele)
                        out.push(ele)
                    }
                }
                else if (piece.startsWith("isinstance(")) {
                    let content = piece.slice("isinstance(".length);
                    content = content.slice(0, content.length - 1);
                    let elements = local_split(content)
                    for (let ele of elements) {
                        ele = ele.trim();
                        ele = trim_quote(ele)
                        out.push(ele)
                    }
                }
                else if (piece.startsWith("getattr(")) {
                    let content = piece.slice("getattr(".length);
                    content = content.slice(0, content.length - 1);
                    let elements = local_split(content, 1);
                    for (let ele of elements) {
                        ele = ele.trim();
                        ele = trim_quote(ele)
                        out.push(ele)
                    }
                }
                else if (/.+\s+not\s+in\s+.+/.test(piece)) {
                    let _arr = piece.split(/\s+not\s+in\s+/)
                    for (let _ele of _arr) {
                        out.push(_ele)
                    }
                } else {
                    if (piece.indexOf(" in ") > 0) {
                        let _arr = piece.split(/\s+in\s+/)
                        for (let _ele of _arr) {
                            out.push(_ele)
                        }
                    }
                    else {
                        let firstIndex = piece.indexOf(" ")
                        if (firstIndex == -1) {
                            out.push(piece)
                        } else {
                            out.push(piece.slice(0, firstIndex))
                        }

                    }
                }

            }

            return [true, out]


        }
    }
    return [false, []]
}


export function get_last_if_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    service_position_history_add_position(cursor);
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let beginLineNo = Math.max(cursor.line - 10, 0)
    let currentIndent = line.firstNonWhitespaceCharacterIndex;
    let range = new vscode.Range(new vscode.Position(beginLineNo, 0),
        new vscode.Position(cursor.line, line.range.end.character))
    for (let i = cursor.line - 1; i >= beginLineNo; i--) {
        let content = document.lineAt(i).text;
        // if()
        let walkLindex = document.lineAt(i);
        if (walkLindex.firstNonWhitespaceCharacterIndex > currentIndent) {

            continue;
        }
        content = content.trim();
        let [flag, arr] = try_get_if_var(content);
        if (flag) {
            if (arr.length == 1) {
                // update_last_used_variable()
                _insert(edit, cursor, arr[0]);
            } else {
                let quickItems: vscode.QuickPickItem[] = []
                for (let var_name of arr) {
                    quickItems.push({
                        'label': var_name,
                        'description': var_name
                    })
                }
                vscode.window.showQuickPick(quickItems).then((item) => {
                    if (item) {
                        let { label } = item;
                        update_last_used_variable(label);
                        let activeEditor = vscode.window.activeTextEditor;

                        activeEditor.insertSnippet(new vscode.SnippetString(label), cursor);

                        // _insert(edit, cursor, _extraVar(vars[2]));    
                    }
                });

            }
            break;
        }
        // if (content.startsWith("if ") || content.startsWith("elif ") || content.startsWith("for")) {
        //     let emptyIndex = content.indexOf(" ")
        //     content = content.slice(emptyIndex)
        //     content = content.trim()
        //     if (content.startsWith("(")) {
        //         content = content.slice(1)
        //     }
        //     let vars = get_variable_list(content)
        //     if (vars.indexOf("in") > -1) {
        //         let in_index = vars.indexOf("in");
        //         let items: vscode.QuickPickItem[] = [];
        //         items.push({
        //             'label': vars[in_index - 1],
        //             "description": vars[in_index - 1]
        //         })
        //         items.push({
        //             'label': vars[in_index + 1],
        //             "description": vars[in_index + 1]
        //         })

        //         vscode.window.showQuickPick(items).then((item) => {
        //             if (item) {
        //                 let { label } = item;
        //                 update_last_used_variable(label);
        //                 let activeEditor = vscode.window.activeTextEditor;

        //                 activeEditor.insertSnippet(new vscode.SnippetString(label), cursor);

        //                 // _insert(edit, cursor, _extraVar(vars[2]));    
        //             }
        //         });

        //     } else {
        //         if (vars[0] === "not") {

        //             _insert(edit, cursor, _extraVar(vars[1]));
        //         } else {

        //             _insert(edit, cursor, _extraVar(vars[0]));
        //         }
        //     }



        //     break;
        // } else if (content.startsWith("# generated_by_dict_unpack:")) {
        //     let last_var = content.split(":").pop()
        //     last_var = last_var.trim()
        //     _insert(edit, cursor, last_var);
        //     break;
        // }

    }

}


export function get_last_if_varible_from_lines(lines: Array<string>) {

}