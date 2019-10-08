import * as vscode from "vscode";
let _last_used_variable: string = null;
export function get_last_used_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    if (_last_used_variable === null) {
        vscode.window.showErrorMessage("last_used_variable is null");
        return;
    }
    let position = textEditor.selection.active;
    edit.insert(position, _last_used_variable);

}
export function update_last_used_variable(current_var: string) {
    _last_used_variable = current_var
}