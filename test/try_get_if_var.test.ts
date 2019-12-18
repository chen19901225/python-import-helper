import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import * as parser from '../src/parser';
import { setFlagsFromString } from 'v8';
import { try_get_if_var } from '../src/handler/handler_get_last_if_variable';

// Defines a Mocha test suite to group tests of similar kind together
suite("try get if var", () => {

    // test("test hasattr", () => {
    //     let line = "if hasattr(a, 'name')";
    //     let [flag, arr] = try_get_if_var(line);

    // })
    test("test isinstance with tuple", () => {
        let line = "if isinstance(a, (list, tuple))"
        let [flag, arr] = try_get_if_var(line);
        assert.equal(flag, true);
        assert.deepEqual(arr, ["a", "(list, tuple)"])
    })
    test("test isintance oneclass", () => {
        let line = "if isinstance(a, int)"
        let [flag, arr] = try_get_if_var(line);
        assert.equal(flag, true);
        assert.deepEqual(arr, ["a", "int"])
    })
    test("test with and", () => {
        let line = "if (a is not None) and (b is not None)";
        let [flag, arr] = try_get_if_var(line);
        assert.equal(flag, true);
        assert.deepEqual(arr, ["a", "b"]);
    })
    test("test with or", () => {
        let line = "if (a is not None) or (b is not None)";
        let [flag, arr] = try_get_if_var(line);
        assert.equal(flag, true);
        assert.deepEqual(arr, ["a", "b"]);
    })
    test("test with parenthes", () => {
        let line = "if (a is not None):";
        let [flag, arr] = try_get_if_var(line);
        assert.equal(flag, true);
        assert.deepEqual(arr, ["a"]);
    })
    test("test by comment", () => {
        let line = "# generated_by_dict_unpack: self"
        let [flag, arr] = try_get_if_var(line)
        assert.equal(flag, true)
        assert.deepEqual(arr, ["self"])
    })
    test("test if not in", () => {
        let line = "if content not in (None, 0) "
        let [flag, arr] = try_get_if_var(line)
        assert.equal(flag, true)
        assert.deepEqual(arr, ['content', '(None, 0)'])
    })
    test("test if not", () => {
        let prefix_arr = ["if ", "elif", "for", "while"]
        let other = " not name:"
        for (let prefix of prefix_arr) {
            let line = prefix + other;
            let [flag, arr] = try_get_if_var(line);
            assert.equal(flag, true)
            assert.equal(arr[0], "name")
        }
    })
    test("test if hasattr", () => {
        let line = "if hasattr(self.request_start_line, 'status')"
        let [flag, arr] = try_get_if_var(line)
        assert.equal(flag, true)
        assert.deepEqual(arr, ["self.request_start_line", "status"])
    })

    test("test if in", () => {
        let line = "if a in b"
        let [flag, arr] = try_get_if_var(line)
        assert.equal(flag, true)
        assert.deepEqual(arr, ['a', 'b'])

    })

    test("test if and", () => {
        let line = "if a and b";
        let [flag, arr] = try_get_if_var(line)
        assert.equal(flag, true)
        assert.deepEqual(arr, ['a', 'b'])
    })

    test("test if simple", () => {
        let prefix_arr = ["if ", "elif", "for", "while"]
        let other = " name:"
        for (let prefix of prefix_arr) {
            let line = prefix + other;
            let [flag, arr] = try_get_if_var(line);
            assert.equal(flag, true)
            assert.equal(arr[0], "name")
        }

    })
    test("test def", () => {
        let line = "def line():"
        let [flag, arr] = try_get_if_var(line);
        assert.equal(flag, false)
    })




})