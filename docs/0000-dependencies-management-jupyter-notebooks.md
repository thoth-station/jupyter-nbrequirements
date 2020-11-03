# [short title of solved problem and solution]

* Status: [proposed | rejected | accepted | deprecated | … | superseded by [ADR-0005](0005-example.md)] <!-- optional -->
* Deciders: [list everyone involved in the decision] <!-- optional -->
* Date: [YYYY-MM-DD when the decision was last updated] <!-- optional -->

Technical Story: [description | ticket/issue URL] <!-- optional -->

## Context and Problem Statement

How to guarantee reproducibility of Jupyter Notebooks?

In order to allow any user to re run the notebook having similar behaviour, it's important that each notebook is shipped with dependencies requirements
that include direct and transitive dependencies. This would also enforce and support security, reproducibility, traecability.

Each notebook should be treated as single component/service that use its own dependencies, therefore when storing notebooks, they should be created in a specific repo.

## Decision Drivers <!-- optional -->

* user prospective
* reproducibility
* traecability

## Considered Options

* 1. Jupyter notebook without dependencies (no reproducibility)
* 2. Jupyter notebook with dependencies embedded in json file of the notebook (conflict with local requirements (Pipfile/Pipfile.lock))
* 3. Jupyter notebook without dependencies embedded in json file but with Pipfile/Pipfile.lock always present (Jupyter notebook and requirements are decoupled)
* 4. Jupyter notebook with sha256 embedded in json file that matches Pipfile/Pipfile.lock sha256 always present (Jupyter notebook and requirements are coupled)

## Decision Outcome

The option select is 4. because:

* avoid conflicts in dependencies and enforce security also
* enforce reproducibility
* enforce traceability between notebook and requirements

### Positive Consequences <!-- optional -->

* Satisfy reproducibility, traecability, shareability.
* Each notebook need to be treated as single service/task with its own dependencies.
