from __future__ import with_statement
from fabric.api import *

env.hosts = ['web109']

def gitpull():
    with cd('~/webapps/who/'):
        run('git pull')