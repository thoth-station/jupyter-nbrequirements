# jupyter-nbrequirements &nbsp;[![License](https://img.shields.io/github/license/mashape/apistatus.svg?label=License)](https://github.com/CermakM/jupyter-nbrequirements/blob/master/LICENSE)

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=CermakM/jupyter-nbrequirements)](https://dependabot.com)
[![Node CI](https://github.com/cermakm/jupyter-nbrequirements/workflows/Node%20CI/badge.svg)](https://github.com/cermakm/jupyter-nbrequirements/actions) &nbsp;
[![Release](https://img.shields.io/github/v/tag/cermakm/jupyter-nbrequirements.svg?sort=semver&label=Release)](https://github.com/CermakM/jupyter-nbrequirements/releases/latest)



Dependency management and optimization in Jupyter Notebooks.

<br>

## About

This extension provides control over the notebook dependencies.

The main goals of the project are the following:

  - manage notebook requirements without leaving the notebook
  - provide a unique and optimized* environment for each notebook

*The requirements are optimized using the [Thoth] resolution engine

<br>

## Installation

```bash
pip install jupyter-nbrequirements
```

And enable the required extensions (might not be needed with the latest version, but to be sure..)

```bash
jupyter nbextension install --user --py jupyter_nbrequirements
```

<br>

## Usage

#### NBRequirements UI

Since [v0.4.0](https://github.com/CermakM/jupyter-nbrequirements/releases/tag/v0.4.0), we've introduced a new UI! Check it out, interact with it and see what it can offer you!

<div style="text-align:center">
<img alt="NBRequirements UI" src="https://raw.githubusercontent.com/CermakM/jupyter-nbrequirements/master/assets/ui.png">
</div>

Our development efforts will from now on focus primarily on improving the UI.

#### The old-school approach

The Jupyter magic is in sync with the UI, so don't worry old schoolers, you can still run the commands manually and the existing notebooks will work!

#### Create the environment for the notebook to run in

Say we want to do an EDA, we will probably need [pandas](https://pandas.pydata.org), a visualization library like [plotly](https://plot.ly) and some additional libraries to make our lives easier, like [sklearn](https://scikit-learn.org/stable/) and [pandas-profiling](https://github.com/pandas-profiling/pandas-profiling).

In a Jupyter notebook cell:

```
%dep add pandas --version ">=0.24.0"
%dep add plotly
%dep add sklearn
%dep add pandas-profiling
```

And perhaps our code would need some refactoring and linter checks later on, so let's add a `dev` dependency.

```
%dep add --dev black
```

You can now check the requirements that your notebook has by issuing `%requirements` (or `%dep`, which is just an alias for it) command:

```
%requirements
```
```
[packages]
pandas = ">=0.24.0"
plotly = "*"
sklearn = "*"
pandas-profiling = "*"

[dev-packages]
black = "*"

[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[requires]
python_version = "3.6"
```

Up to this point, we've been working only with the metadata. In order to create the environment and actually install the dependencies, you run the `%dep ensure` command (insipired by the golang's [dep](https://github.com/golang/dep), for those familiar with Golang).

```
%dep ensure
```

> Since this project is still under development and it uses the [Thoth] resolution engine to optimize the notebook dependencies (which is also still under development as well), in case something goes wrong, `ensure` accepts the `engine` parameter, which can be set to `pipenv`

```
%dep ensure --engine pipenv
```

Check out the [examples](/examples/) for more info.

<br>

## Future plans:

See the [Project Board](https://github.com/CermakM/jupyter-nbrequirements/projects).

<br>

---

> Author: Marek Cermak <macermak@redhat.com>, @AICoE - Project Thoth


<!-- References -->

[Thoth]: https://github.com/thoth-station
