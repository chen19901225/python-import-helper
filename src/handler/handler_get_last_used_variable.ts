import * as vscode from "vscode";
let _last_used_variable: string = null;
let used_variables: Array<string> = [];
export function get_last_used_variable(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    if (used_variables.length === 0) {
        vscode.window.showErrorMessage("last_used_variable is null");
        return;
    }
    let currentPosition = textEditor.selection.active;
    if(used_variables.length === 1) {
        edit.insert(currentPosition, used_variables[0]);
    }
    let quickItems: vscode.QuickPickItem[] = []
    for(let i=used_variables.length -1; i>=0 ;i--) {
        let current_var = used_variables[i];
        quickItems.push({
            'label': current_var,
            'description': current_var
        })
    }
    
    vscode.window.showQuickPick(quickItems).then((item) => {
        if(item) {
            let current_var = item.label;
            let activeEditor = vscode.window.activeTextEditor;
            
            activeEditor.insertSnippet(new vscode.SnippetString(current_var), currentPosition)
            update_last_used_variable(current_var);
        }
    })
    
    

}
export function update_last_used_variable(current_var: string) {
    let index = used_variables.indexOf(current_var);
    if(index > -1) {
        used_variables.splice(index, 1);
    }
    used_variables.push(current_var);
    // _last_used_variable = current_var
}