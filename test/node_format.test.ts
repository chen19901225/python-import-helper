import * as assert from 'assert';
import { format_dict_line, generate_dict_pair } from '../src/handler/handler_node_format';

suite("node format test", () => {
    test("format_dict_line", () => {
        let table:Array<[string, Array<string>]> = [
            [
                "dict(name=name, age=age)",
                [

                    "#dict(name=name, age=age)",
                    "dict(",
                    "     " + "name=name,",
                    "     " + "age=age",
                    ")"
                ]
            ]
        ]
        for (let i = 0; i < table.length; i++) {
            let [input_str, expected_arr] = table[i];
            let result_arr = format_dict_line(input_str);
            assert.deepEqual(expected_arr, result_arr)
        }

    });

    test("generate_dict", () => {

        let table:Array<[string, Array<string>]> = [
            [
                "a, b",
                [

                    "#a, b",
                    "a = a, b = b"
                ]
            ],
            [
                "a, b)",
                [
                    "#a, b)",
                    "a = a, b = b"
                ]
            ]
        ]
        for (let i = 0; i < table.length; i++) {
            let [input_str, expected_arr] = table[i];
            let result_arr = generate_dict_pair(input_str);
            assert.deepEqual(expected_arr, result_arr)
        }
    })
});