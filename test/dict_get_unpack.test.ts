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
import {generate_replace_upack_string} from '../src/handler/handler_dict_get_unpack'
// Defines a Mocha test suite to group tests of similar kind together
suite("unpack Tests", () => {

    // Defines a Mocha unit test
    
    test("test source dict", () => {
        let line = "image, name=source_d";
        let out = generate_replace_upack_string(line);
        assert.equal(out, '.get("image"), source_d.get("name")')
    })
    test("test self.requests.headers", () => {
        let line = "org = self.request.headers";
        let out = generate_replace_upack_string(line);
        assert.equal(out, '.get("org")')
    })

    
});