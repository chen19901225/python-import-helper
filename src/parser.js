"use strict";
exports.__esModule = true;
function parse_function(definition) {
}
exports.parse_function = parse_function;
function parse_function_name(definition) {
    var match = definition.match(/def \s*(\w+)\s*\(/);
    if (!match) {
        return "";
    }
    return match[1];
}
function parse_args(definition) {
}
function parse_kwargs(definition) {
}
var definition = "def hello_world_func(no_type, name: str,\n    kw_no_type,\n    kw_no_type_and_default=10\n    name2:str = \"hello\") -> List[str, str]:";
var function_name = parse_function_name(definition);
console.log("function_name", function_name);
