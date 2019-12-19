import functools
from invoke import task

import re


def get_branch_name(c):
    out = c.run("git branch")
    # print(out)
    lines = out.stdout.splitlines()
    if not lines:
        return 'master'
    current_branch_line = [ele for ele in lines if ele.startswith("*")][0]
    print(current_branch_line)
    current_branch = re.split(r"\s+", current_branch_line)[-1]
    return current_branch


@task
def gd(c):
    branch_name = get_branch_name(c)
    print("branch_name:{}".format(branch_name))
    c.run("git add .")
    print("before commit")
    try:
        result = c.run("git commit -m 'test'")
    except Exception as e:
        import logging
        logging.error("fail to run commit %r" % e, exc_info=True)
        
    
    print("commit result:{}".format(result))
    print("after commit")
    # c.run("git push origin {}".format(branch_name))
    c_push(c)

@task
def c_push(c):
    branch_name = get_branch_name(c)
    result = c.run("git push origin {}".format(branch_name))
    print("result:{}".format(result))


def get_version( v_str: str):
    if not v_str.startswith("v"):
        return [-1]
    # if '--' in v_str:
    #     v_str = v_str.split('--')[0]
    v_str = v_str[1:]
    try:
        li = list(map(int, v_str.split('.')))
    except ValueError:
        # 遇到这种v0.0.0rc
        li = [-1]
    return li


@task
def new_tag_get(c, branch_name):
    result = c.run("git tag -l")
    lines = result.stdout.splitlines()
    lines = sorted(lines, key=functools.partial(get_version), reverse=True)
    return lines[0]


@task
def patch(c):
    gd(c)
    c.run("git fetch")
    c.run("vsce publish patch")
    