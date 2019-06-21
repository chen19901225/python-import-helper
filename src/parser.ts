
export function parse_function(definition: string) {

}

function parse_function_name(definition: string) {
    let match = definition.match(/def \s*(\w+)\s*\(/);
    if(!match){
        return "";
    }
    return match[1];
}

function parse_args(definition: string) {

}
function parse_kwargs(definition: string) {

}

let definition=`def hello_world_func(no_type, name: str,
    kw_no_type,
    kw_no_type_and_default=10
    name2:str = "hello") -> List[str, str]:`;

let function_name = parse_function_name(definition);
console.log("function_name", function_name);