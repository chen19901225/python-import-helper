# cqh-python-import-helper README

## text commands

### `cqh-python-import-helper.import-upgrade` (alt+k, u)
使得当前行的import,跑到最前面

<!-- 
### `cqh-python-import-help.select-current-line`:
select the current line from the first non emtpy position to end position
<strong>override `alt +L` key bind</strong> -->

### `cqh-python-import-helper.function_apply_self` : alt+-

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

    get current function args, so dont should type it
    ```
    def show(self, name1, name2)
        |
    ```
    generate `name1, name2`

#### note:
    your cursor should be right indent

### "cqh-python-import-helper.dict_unpack",
                
- "key": "alt+i"

convert `name1, name2=obj` -> `name1, name2 = obj1.name1, obj.name2`

convert `name1, name2=obj_d` -> `name1, name2 = obj_d['name1'], obj_d['name2']`

###  cqh-python-import-helper.dict_get_unpack
"key": "alt+o",

convert `name1, name2=obj_d` -> `name1, name2 = obj_d。。.get('name1'), obj_d.get('name2')`

### cqh-python-import-helper.dict_prepend
"key": "alt+u"

convert `name1, name2=source_` => `source_name1, source_name2 = name1, name2`

### cqh-python-import-helper.get_left_pattern
key: alt+h

insert left pattern before "="


### cqh-python-import-helper.get_left_last_pattern
key: alt+b
`self.name=` insert `name`


### cqh-python-import-helper.get_last_if_varaible
key: alt + \


### `insert self`: `alt +m`

插入 `self` 这个字符串


### move op end
key: alt + .
move to ", ', ], ), }

### show var list
key: alt + m
show function params list





## Features
