#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function

from pathlib import Path

from setuptools import setup
from setuptools import find_packages


HERE = Path(__file__).parent
NAME = "jupyter_nbrequirements"

ABOUT = dict()
exec(Path(HERE, NAME, "__about__.py").read_text(), ABOUT)

README: str = Path(HERE, "README.md").read_text(encoding="utf-8")
REQUIREMENTS: list = Path(HERE, "requirements.txt").read_text().splitlines()


setup_args = dict(
    name=ABOUT["__title__"],
    version=ABOUT["__version__"],
    author=ABOUT["__author__"],
    author_email=ABOUT["__email__"],
    url=ABOUT["__uri__"],
    license=ABOUT["__license__"],
    description=ABOUT["__summary__"],
    long_description=README,
    long_description_content_type="text/markdown",
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Framework :: IPython",
        "Framework :: Jupyter",
        "License :: OSI Approved :: MIT License",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: JavaScript",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Topic :: Utilities",
    ],
    packages=find_packages(),
    package_data={NAME: ["static/*.js"]},
    include_package_data=True,
    data_files=[
        (
            "share/jupyter/nbextensions/jupyter-nbrequirements",
            [NAME + "/static/extension.js", NAME + "/static/index.js"],
        ),
        (
            "etc/jupyter/nbconfig/notebook.d",
            ["jupyter-config/notebook.d/jupyter-nbrequirements.json"],
        ),
    ],
    zip_safe=False,
    install_requires=REQUIREMENTS,
)

if __name__ == "__main__":
    setup(**setup_args)
