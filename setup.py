#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function

import json
import os
import platform
import sys

from distutils import log
from pathlib import Path

from setuptools import setup
from setuptools import find_packages
from setuptools import Command
from setuptools.command.build_py import build_py
from setuptools.command.sdist import sdist

from subprocess import check_call


HERE = Path(__file__).parent
NAME = 'jupyter_nbrequirements'

ABOUT = dict()
exec(Path(HERE, NAME, '__about__.py').read_text(), ABOUT)

README: str = Path(HERE, "README.md").read_text(encoding='utf-8')
REQUIREMENTS: list = Path(HERE, 'requirements.txt').read_text().splitlines()

npm_path = os.pathsep.join(
    [
        os.path.join(HERE, "node_modules", ".bin"),
        os.environ.get("PATH", os.defpath),
    ]
)
is_repo = HERE.joinpath(".git").exists()


# Load JS version from package.json
def js_version():
    path = Path(
        HERE, "package.json"
    )
    package_json = json.loads(path.read_text)
    version = package_json["version"]

    return version


def js_prerelease(command, strict=False):
    """Build minified js/css prior to another command."""
    class DecoratedCommand(command):
        def run(self):
            jsdeps = self.distribution.get_command_obj("jsdeps")
            if not is_repo and all(os.path.exists(t) for t in jsdeps.targets):
                # sdist, nothing to do
                command.run(self)
                return

            try:
                self.distribution.run_command("jsdeps")
            except Exception as e:
                missing = [t for t in jsdeps.targets if not os.path.exists(t)]
                if strict or missing:
                    log.warn("rebuilding js and css failed")
                    if missing:
                        log.error("missing files: %s" % missing)
                    raise e
                else:
                    log.warn("rebuilding js and css failed (not a problem)")
                    log.warn(str(e))
            command.run(self)
            update_package_data(self.distribution)

    return DecoratedCommand


def update_package_data(distribution):
    """update package_data to catch changes during setup"""
    build_py = distribution.get_command_obj("build_py")
    # distribution.package_data = find_package_data()
    # re-init build_py options which load package_data
    build_py.finalize_options()


class NPM(Command):
    description = "install package.json dependencies using npm"

    user_options = []
    node_modules = os.path.join(HERE, "node_modules")

    targets = [
        os.path.join(HERE, NAME, "static", "extension.js"),
        os.path.join(HERE, NAME, "static", "index.js"),
    ]

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def has_npm(self):
        try:
            ## shell=True needs to be passed for windows to look at non .exe files.
            shell = (sys.platform == 'win32')
            check_call(['npm', '--version'], shell=shell)
            return True
        except:
            return False

    def run(self):
        has_npm = self.has_npm()
        if not has_npm:
            log.error("`npm` unavailable.  If you're running this command using sudo, make sure `npm` is available to sudo")

        env = os.environ.copy()
        env['PATH'] = npm_path

        if self.has_npm():
            log.info("Installing build dependencies with npm.  This may take a while...")
            check_call(['npm', 'install'], cwd=HERE, stdout=sys.stdout, stderr=sys.stderr,
                       shell=(sys.platform == 'win32'))
            os.utime(self.node_modules, None)

        for t in self.targets:
            if not os.path.exists(t):
                msg = "Missing file: %s" % t
                if not has_npm:
                    msg += '\nnpm is required to build a development version of widgetsnbextension'
                raise ValueError(msg)


        # update package data in case this created new files
        update_package_data(self.distribution)


setup_args = dict(
    name=ABOUT['__title__'],
    version=ABOUT['__version__'],

    author=ABOUT['__author__'],
    author_email=ABOUT['__email__'],
    url=ABOUT['__uri__'],

    license=ABOUT['__license__'],

    description=ABOUT['__summary__'],
    long_description=README,
    long_description_content_type='text/markdown',

    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Framework :: IPython",
        "Framework :: Jupyter",
        "License :: OSI Approved :: MIT License",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: JavaScript",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Topic :: Utilities"
    ],

    packages=find_packages(),

    package_data={
        NAME: ["snippets/*.js", "static/*.js"]
    },
    include_package_data=True,

    data_files=[
        (
            "share/jupyter/nbextensions/jupyter-nbrequirements", [
                NAME + "/static/extension.js",
                NAME + "/static/index.js"
            ],
        ),
        (
            "etc/jupyter/nbconfig/notebook.d", [
                "jupyter-config/notebook.d/jupyter-nbrequirements.json"
            ]
        ),
    ],

    zip_safe=False,

    cmdclass=dict(
        build_py=js_prerelease(build_py),
        sdist=js_prerelease(sdist, strict=True),
        jsdeps=NPM,
    ),

    install_requires=REQUIREMENTS,
)

if __name__ == '__main__':
    setup(**setup_args)
