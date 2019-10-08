import * as vscode from "vscode";
import { parse_function, FunctionDef } from '../parser';
import {update_last_used_variable} from './handler_get_last_used_variable'
import { get_variable_list, extraVariablePart, getLineIndent, removeVarType } from '../util'
/**
 * 
 * 支持的功能: 
 * 1. 直接获取上一行，左行的变量
 *      如果上一行是one, two= self.one, self.two, 直接输出 `one, two`
 * 2. 只获取上一行<=当前缩进的变量
 * 如果 是以下内容
 * ```
 * one = "test"
 * if is_test:
 *     two = "test"
 * 
 * ```
 * 当indent是4的时候，获取的是`two`, 当indent=0的时候，获取的是`one`
 *  
 */
export function get_last_line_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    /**
     * 改的目的假如有以下这种情况
     *      one, two = self.one, self.two
     *      one, two = created_
     * 我希望(one, two), 能有快捷键直接获取上一行的变量
     */

     /**
      * 改进2， 我希望添加缩进
      */
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let currentIndent = getLineIndent(line.text);
    let beginLineNo = Math.max(cursor.line - 50, 0)
    let range = new vscode.Range(new vscode.Position(beginLineNo, 0),
        new vscode.Position(cursor.line, 0))
    let lines = document.getText(range).split(/\r?\n/);
    let [found, vars] = find_last_vars(lines, currentIndent);
    if (found) {
        update_last_used_variable(vars)
        edit.insert(cursor, vars);
    }
    

}

export function find_last_vars(lines: Array<string>, indent: number): [boolean, string] {
    for (let i = lines.length - 1; i >= 0; i--) {
        let content = lines[i];
        let lineIndent = getLineIndent(content);
        if(lineIndent> indent) {
            continue;
        }
        content = content.trim();
        if(content[0] === '#') { // 注释
            continue;
        }
        let index = content.indexOf("=")

        if (index > -1 && content[index + 1] !== '=' && content[index - 1] !== '!') {
            // 忽略 a== b 或者 a!=b 这种情况
            let vars = content.split("=")[0].trim();
            return [true, removeVarType(vars)]
        }
    }

    return [false, ""]

}
