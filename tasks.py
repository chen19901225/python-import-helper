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
    c.run("git commit -m 'test'")
    c.run("git push origin {}".format(branch_name))