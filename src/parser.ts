
export function parse_function(definition: string) {
    const lines: Array<string> = definition.split("\n");

}

function parse_function_name(definition: string) {
    let match = definition.match('def\s*(\w+)\s*');
    if(!match){
        return "";
    }
    return match[0];
}

function parse_args(definition: string) {

}
function parse_kwargs(definition: string) {

}