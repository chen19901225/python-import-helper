
export function parse_function(definition: string) {

}

export function parse_function_name(definition: string) {
    let match = definition.match(/def \s*(\w+)\s*\(/);
    if (!match) {
        return "";
    }
    return match[1];
}
export function parse_parse_params(definition: string) {
    let match = definition.match(/def\s*(\w+)\s*\(([\s\S]+)\)\s*(->\s*[ \w\[\],]*)?\s*:/);
    if (!match) {
        throw Error(`cannot match ${definition}`);
    }
    let params_str = match[2];
    let params_length = params_str.length;
    let out_list = [];
    let expected_map = {
        "'": "'",
        '"': '"',
        '{': '}',
        '[': ']',
        '(': ')'
    }
    let handle_position = (current_index: number, current_word: string, expected: string = "") => {
        if (params_length === current_index) {
            if (current_word && current_word.trim().length > 0) {
                out_list.push(current_word.trim());
            }

            return;
        }
        let ch = params_str.charAt(current_index);
        if (expected !== "") {
            if (current_word && current_word[current_word.length - 1] === "\\") {
                handle_position(current_index + 1, current_word + ch, expected);
            } else {
                if (ch === expected) {
                    handle_position(current_index + 1, current_word + ch, "");
                } else {
                    handle_position(current_index + 1, current_word + ch, expected);
                }
            }
        } else {
            // expected === ""
            if (ch in expected_map) {
                let expected_ch = expected_map[ch];
                handle_position(current_index + 1, current_word + ch, expected_ch);
            } else {
                if (ch == ',') {
                    current_word=current_word.trim();
                    out_list.push(current_word);
                    handle_position(current_index + 1, "", "");
                }else {
                    handle_position(current_index + 1, current_word + ch, expected);
                }
            }

        }

    }
    handle_position(0, "", "");
    return out_list;

}

export function parse_args(params: Array<string>) {

}
export function parse_kwargs(params: Array<string>) {

}

let definition = `def hello_world_func(no_type, name: str,
    kw_no_type,
    kw_no_type_and_default=10,
    name2:str = "hello") -> List[str, str]:`;

let function_name = parse_function_name(definition);
console.log("function_name", function_name);
let params_lines = parse_parse_params(definition);
console.log("params_lines:", params_lines);