//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
// import * as parser from '../src/parser';
import { setFlagsFromString } from 'v8';
import {generate_replace_upack_string} from '../src/handler/handler_dict_unpack'
// Defines a Mocha test suite to group tests of similar kind together
suite("unpack Tests", () => {

    // Defines a Mocha unit test
    test("test source instance", () => {
        let line = "image, name=source";
        let out = generate_replace_upack_string(line);
        assert.equal(out, ".image, source.name")
    });

    test("test source dict", () => {
        let line = "image, name=source_d";
        let out = generate_replace_upack_string(line);
        assert.equal(out, '["image"], source_d["name"]')
    })

    test("test source prepend", () => {
        let line = "image, name=source_";
        let out = generate_replace_upack_string(line);
        assert.equal(out, 'image, source_name')
    })

    
});