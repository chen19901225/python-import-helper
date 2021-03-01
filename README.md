# cqh-python-import-helper README



## text commands

### `cqh-python-import-helper.import-upgrade` (alt+k, u)
使得当前行的import,跑到最前面

<!-- 
### `cqh-python-import-help.select-current-line`:
select the current line from the first non emtpy position to end position
<strong>override `alt +L` key bind</strong> -->

### `cqh-python-import-helper.function_apply_self` : `alt+-`


[//]: cqh_goto: __proj__/src/handler/function_apply_self.ts||function_apply_self

    generate code for `def func(self,name1, name2)` into

    ```
    self.name1 = name1
    self.name2 = name2
    ```

### `cqh-python-import-helper.get_parent_args_dict`: `alt+]`

    对于 function `def show(self, name1, name2)`, 会插入 `name1=name1,name2=name2`
   

### `cqh-python-import-helper.get_parent_name` alt+[

    获取当前的代码所在的 function的名字


### `cqh-python-import-helper.get_parent_original_args` alt + 0


[//]: cqh_goto: __proj__/src/handler/handler_get_original_parent_args.ts||get_original_parent_args

    get current function args, so dont should type it
    ```
    def show(self, name1, name2)
        |
    ```
    generate `name1, name2`

* `def show(self, name1, name2)` => `name1, name2`

* `def show(self, name1, name2=0)` => `name1, name2=0`



### "cqh-python-import-helper.dict_unpack",
                
- "key": "alt+i"

[//]: cqh_goto: __proj__/src/handler/handler_dict_unpack.ts||handler_dict_unpack

examples:

*  `name1, name2=obj` -> `name1, name2 = obj1.name1, obj.name2`

*  `name1, name2=obj_d` -> `name1, name2 = obj_d['name1'], obj_d['name2']`

* a, b = q_ => a, b = q_a, q_b

* a, b = q(" => a, b = q("a"), q("n")

* a, b = q(' => a, b = q('a'), q('n')

* a, b = q( => a, b = q(a), q(b)

* a, b = .c() => a, b = a.c(), b.c()


###  cqh-python-import-helper.dict_get_unpack
"key": "alt+o",

[//]: cqh_goto: __proj__/src/handler/handler_dict_get_unpack.ts||handler_dict_get_unpack

convert `name1, name2=obj_d` -> `name1, name2 = obj_d。。.get('name1'), obj_d.get('name2')`

### cqh-python-import-helper.dict_prepend
"key": "alt+u"

[//]: cqh_goto: __proj__/src/handler/handler_dict_unpack.ts||handler_dict_prepend

convert `name1, name2=source_` => `source_name1, source_name2 = name1, name2`

### cqh-python-import-helper.get_left_pattern
key: alt+h

insert left pattern before "="

[//]: cqh_goto: __proj__/src/handler/handler_get_left_pattern.ts||insert_left_pattern

examples:

* `a = ` => `a`

* `a:int =` => `a`

* `'a:'` => `a`

*  `"a:"` => `a`

* `dict(name=` => `name`

* `name__d =` => `["name_d", "name", "d"]`

* `data["show"]` => `['data["show"]', "data", "show"]`

* `data["show__eq"]` => `['data["show__eq"]', "data", "show__eq", "show", "eq"]`

* `this.name__alias =` => `['this.name__alias', 'this', 'name__alias', 'name', 'alias']`



### cqh-python-import-helper.get_left_last_pattern
key: alt+b

这个基本没有用到过吧

`self.name=` insert `name`


### cqh-python-import-helper.get_last_if_varaible
key: alt + \

获取最近的if 所在行的 变量

[//]: cqh_goto: __proj__/src/handler/handler_get_last_if_variable.ts||get_last_if_variable


[//]: cqh_goto: __proj__/test/try_get_if_var.test.ts

* `if (key, value) in arr:` => ['key, value', 'key', 'value', 'arr']

* `for ele in arr:` =>  ["ele", "arr"]

* `for (key, value) in d:` => ["key, value", "key", "value", "d"]

* `for key, value in d:` => ["key, value", "key", "value", "d"]

* `for (key, value) in d.items()` => ["key, value", "key", "value", "d"]

* `for (key, value) in self.d.items()` => ["key, value", "key", "value", "self.d"]

* `if isinstance(a, (list, tuple))` => ["a", "(list, tuple)"]

### `insert self`: `alt +m`

现在变成插入字符串列表

[//]: cqh_goto: __proj__/src/handler/handler_insert_self.ts
插入 `self` 这个字符串


## `获取当前的文件名字`: `alt+k f`

[//]: cqh_goto:  __proj__/src/handler/handler_file_name.ts

### move op end
key: alt + .
move to ", ', ], ), }

### show var list
插入变量


[//]: cqh_goto:__proj__/src/handler/handler_insert_self.ts||__insert_self__@@@2

key: `alt + m`

配置例子

```
[
    {"name": "from", "list": ["from"]},
    {"name": "import", "list": ["import"]},
    {"name": "self", "list": ["self"]},
    {"name": "typingList", "list": ["from typing import List"]}

]
```

show function params list



### `cqh-python-import-help.select-current-line` : 



### 获取上一行的变量 `cqh-python-import-helper.get_last_line_variable`: `alt+~`


[//]: cqh_goto: __proj__/src/handler/handler_get_last_line_variable.ts||get_last_line_variable


### 格式化 `node-format`: `alt + k n`

[//]: cqh_goto: __proj__/src/handler/handler_node_format.ts||node_format

#### generate_dict_pair

* `a, b, c` => `a=a, b=b,c=c`

#### def_arg_split_line

* `def fun(a, b, c` => `def fun(a,\nb,\nc`

#### dict_split_line

* `a=0,b=1,c=2` => `a=0,\nb=1\n,c=2\n`

#### apply_split_line


* `dict(a=a,b=b,c=c)` => `dict(a=a,\nb=b,\nc=c\n)`

### string list

一般用于sign的时候

* `a, b, c` => `["{a}", "{b}", "{c}"]`

## Features
