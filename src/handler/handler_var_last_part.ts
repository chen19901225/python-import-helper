import * as vscode from "vscode";
export function var_last_part(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    /*
    
    这个的作用是什么？
    
    */
    let start, end
    let lineNO;
    if(textEditor.selection.isEmpty){
        let cursor = textEditor.selection.active;
        lineNO = cursor.line;
        let line = textEditor.document.lineAt(cursor.line);
        [start, end] = get_last_part_range(line.text, cursor.character, cursor.character);
    } else {
        let selection = textEditor.selections[0];
        let line = textEditor.document.lineAt(selection.start.line);
        lineNO = selection.start.line;
        [start, end] = get_last_part_range(line.text, selection.start.character, selection.end.character);
    }
    
    if(end > start) {
        textEditor.selection = new vscode.Selection(
            new vscode.Position(lineNO, start),
            new vscode.Position(lineNO, end+1)
        );
    }

}
export function get_last_part_range(text: string, start: number, end: number): [number, number] {
    let length = text.length;
    while(end < length) {
        let ch = text[end];
        if(!/[a-zA-Z0-9]/.test(ch)){
            break;
        }
        end = end + 1;
    }

    while(start >=0){
        let ch = text[start];
        if(!/[a-zA-Z0-9]/.test(ch)){
            break;
        }
        start --;
    }
    return [start + 1, end -1];

}
