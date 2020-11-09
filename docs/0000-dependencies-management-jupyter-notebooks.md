# Dependencies management in Jupyter Notebooks

## Context and Problem Statement

How to guarantee reproducibility of Jupyter Notebooks?

In order to allow any user to re run the notebook with similar behaviour, it's important that each notebook is shipped with dependencies requirements
that include direct and transitive dependencies. This would also enforce and support security, reproducibility, traecability.

Notebooks should be treated as component/service that use their own dependencies, therefore when storing notebooks,
they should be stored with dependencies so that an image can be built to run them or they can be shared and reused by others.

## Decision Drivers <!-- optional -->

* user prospective
* reproducibility
* traecability

## Considered Options

* 1. Jupyter notebook without dependencies (no reproducibility)
* 2. Jupyter notebook without dependencies embedded in json file but with Pipfile/Pipfile.lock always present (Jupyter notebook and requirements are decoupled)
* 3. Jupyter notebook with dependencies embedded in json file of the notebook and Pipfile/Pipfile.lock present

## Decision Outcome

The option selected is 3. because:

* enforce reproducibility
* enforce traceability between notebook and requirements

### Positive Consequences <!-- optional -->

* Satisfy reproducibility, traecability, shareability.
* Notebooks are coupled with dependencies in their metadata.
