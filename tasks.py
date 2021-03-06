from io import StringIO
import time
import json
import invoke
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
def commit(c, msg='ci'):
    # 如果没有提交的内容会触发
    try:
        out_buffer = StringIO()
        err_buffer = StringIO()
        cmd = 'git commit -m "{}"'.format(msg)
        print("commit cmd:{}".format(cmd))
        c.run(cmd,
              out_stream=out_buffer, err_stream=err_buffer)
    except invoke.exceptions.UnexpectedExit as e:
        # 当没有提交的内容时
        # err_buffer的内容为null
        # out_buffer的内容为
        # On branch master
        # Your branch is up to date with 'origin/master'.
        # nothing to commit, working tree clean

        # print(out_buffer.getvalue())
        err_out = err_buffer.getvalue()
        print("err_out {}".format(err_out))
        out_out = out_buffer.getvalue()
        print("out_buffer {}".format(out_out))
        if "nothing to commit, working tree clean" in out_out:
            print("nothing to commit, working tree clean, so continue")
        else:
            print("raise")
            raise


@task
def gd(c, msg='ci'):
    branch_name = get_branch_name(c)
    print("branch_name:{}".format(branch_name))
    c.run("git add .")
    print("before commit")
    commit(c, msg)

    print("after commit")
    # c.run("git push origin {}".format(branch_name))
    c_push(c)


@task
def c_push(c):
    branch_name = get_branch_name(c)
    result = c.run("git push origin {}".format(branch_name))
    # print("result:{}".format(result))


def get_version(v_str: str):
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

def wait( predict, timeout=20):
    now = int(time.time())
    end = now + timeout
    while 1:
        now = int(time.time())
        if now >= end:
            raise TimeoutError("Operation timeout after %f seconds" % timeout)
        result = predict()
        if result:
            break
        time.sleep(1)


def check_is_ahead(c):
    """
    预期的status:
        On branch master
        Your branch is ahead of 'origin/master' by 1 commit.
          (use "git push" to publish your local commits)

        nothing to commit, working tree clean
    
    """
    out_buffer = StringIO()
    err_buffer = StringIO()
    cmd = 'git status'
    print("commit cmd:{}".format(cmd))
    c.run(cmd,
            out_stream=out_buffer, err_stream=err_buffer)
    print("check_is_ahead, out_buffer", out_buffer.getvalue())
    print("check_is_ahead, err_buffer", err_buffer.getvalue())
    if "Your branch is ahead of " in out_buffer.getvalue():
        return True
    return False
    

@task
def patch(c):

    gd(c)
    print('commit and push before patch'.center(80, '='))
    c.run("git fetch")
    c.run("vsce publish patch")
    
    # 不sleep3秒的话，拿不到状态，有点郁闷 
    predict = functools.partial(check_is_ahead, c)
    wait(predict, timeout=30)
    print("complete after patch".center(80, '='))
    version = json.loads(open("package.json",'r', encoding='utf-8').read())['version']
    gd(c, 'deploy_with_version {}'.format(version))
