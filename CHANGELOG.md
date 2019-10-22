Changelog
=========


v0.2.0
------
- Update Release workflow. [Marek Cermak]
- Read release version from environment. [Marek Cermak]
- Generate CHANGELOG. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .gitchangelog.rc
  new file:   CHANGELOG.md
- Rename the release job to be more intuitive. [Marek Cermak]
- Run Python package release on `release` event. [Marek Cermak]
- Provide GITHUB_TOKEN to the Release Bot. [Marek Cermak]
- Start using Python Release Action (experimental) [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    conf.yaml
  deleted:    markdown.tpl
  deleted:    .conf.yaml
  modified:   .github/workflows/release.yml
- Disable Kebechet until it is stable. [Marek Cermak]
- Fixed missing jinja2-cli. [Marek Cermak]
- Added new release workflow. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   .github/workflows/package-release.yml
  modified:   .github/workflows/release.yml
  modified:   .gitignore
  modified:   release-conf.yaml
- Added configuration for Release Bot. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   .gitchangelog.rc
  new file:   .conf.yaml
  new file:   markdown.tpl
  new file:   release-conf.yaml
- Disable Kebechet version manager. [Marek Cermak]
- Merge pull request #31 from CermakM/notify. [Marek Čermák]

  Send notification after execution finishes
- Notify only if the windows is not focused. [Marek Cermak]
- Notify only if execution takes more than 30sec. [Marek Cermak]

  - customizable by `DEFAULT_NOTIFICATION_TIMEOUT`

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/index.ts
  modified:   src/extension.js
- Await requirements lock. [Marek Cermak]
- Send notification when execution finishes. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/index.ts
  modified:   src/utils.ts
- Add assets folder. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   assets/main-logo.png
  new file:   assets/main-logo.svg
- Merge pull request #22 from
  CermakM/dependabot/npm_and_yarn/js/types/node-12.7.12. [Marek Čermák]

  Bump @types/node from 12.7.5 to 12.7.12 in /js
- Bump @types/node from 12.7.5 to 12.7.12 in /js. [dependabot-
  preview[bot]]

  Bumps [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/node) from 12.7.5 to 12.7.12.
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
  - [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/node)
- Merge pull request #23 from CermakM/dependabot/npm_and_yarn/js/eslint-
  config-prettier-6.4.0. [Marek Čermák]

  Bump eslint-config-prettier from 6.3.0 to 6.4.0 in /js
- Bump eslint-config-prettier from 6.3.0 to 6.4.0 in /js. [dependabot-
  preview[bot]]

  Bumps [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) from 6.3.0 to 6.4.0.
  - [Release notes](https://github.com/prettier/eslint-config-prettier/releases)
  - [Changelog](https://github.com/prettier/eslint-config-prettier/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/prettier/eslint-config-prettier/compare/v6.3.0...v6.4.0)
- Merge pull request #29 from
  CermakM/dependabot/npm_and_yarn/js/webpack-4.41.1. [Marek Čermák]

  Bump webpack from 4.40.2 to 4.41.1 in /js
- Bump webpack from 4.40.2 to 4.41.1 in /js. [dependabot-preview[bot]]

  Bumps [webpack](https://github.com/webpack/webpack) from 4.40.2 to 4.41.1.
  - [Release notes](https://github.com/webpack/webpack/releases)
  - [Commits](https://github.com/webpack/webpack/compare/v4.40.2...v4.41.1)
- Merge pull request #20 from CermakM/dependabot/npm_and_yarn/js/ts-
  loader-6.2.0. [Marek Čermák]

  Bump ts-loader from 6.1.2 to 6.2.0 in /js
- Bump ts-loader from 6.1.2 to 6.2.0 in /js. [dependabot-preview[bot]]

  Bumps [ts-loader](https://github.com/TypeStrong/ts-loader) from 6.1.2 to 6.2.0.
  - [Release notes](https://github.com/TypeStrong/ts-loader/releases)
  - [Changelog](https://github.com/TypeStrong/ts-loader/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/TypeStrong/ts-loader/compare/v6.1.2...v6.2.0)
- Merge pull request #27 from
  CermakM/dependabot/npm_and_yarn/js/typescript-3.6.4. [Marek Čermák]

  Bump typescript from 3.6.3 to 3.6.4 in /js
- Bump typescript from 3.6.3 to 3.6.4 in /js. [dependabot-preview[bot]]

  Bumps [typescript](https://github.com/Microsoft/TypeScript) from 3.6.3 to 3.6.4.
  - [Release notes](https://github.com/Microsoft/TypeScript/releases)
  - [Commits](https://github.com/Microsoft/TypeScript/compare/v3.6.3...v3.6.4)
- Merge pull request #19 from CermakM/dependabot/pip/jupyter-
  require-0.3.3. [Marek Čermák]

  Bump jupyter-require from 0.3.2 to 0.3.3
- Bump jupyter-require from 0.3.2 to 0.3.3. [dependabot-preview[bot]]

  Bumps [jupyter-require](https://github.com/CermakM/jupyter-require) from 0.3.2 to 0.3.3.
  - [Release notes](https://github.com/CermakM/jupyter-require/releases)
  - [Changelog](https://github.com/CermakM/jupyter-require/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/CermakM/jupyter-require/compare/v0.3.2...v0.3.3)
- Add dependabot badge. [Marek Čermák]
- Update release.yml. [Marek Čermák]

  Use release/v* branch to trigger release.


v0.1.0 (2019-10-04)
-------------------
- Merge pull request #18 from CermakM/v0.1.0. [Marek Čermák]

  Release of version 0.1.0
- Release of version 0.1.0. [Kebechet]
- Merge pull request #17 from CermakM/pipfile-requirements-sync. [Marek
  Čermák]

  Update requirements.txt respecting requirements in Pipfile
- Update requirements.txt respecting requirements in Pipfile. [Kebechet]
- Fix maintainer name and remove Kebechet issue labels. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .github/ISSUE_TEMPLATE/minor-release.md
  modified:   .github/ISSUE_TEMPLATE/patch-release.md
  modified:   .github/ISSUE_TEMPLATE/pre-release.md
  modified:   .thoth.yaml
- Add more License and Release badges. [Marek Cermak]
- Update issue templates. [Marek Čermák]

  Add Kebechet release templates
- Update release.yml. [Marek Cermak]

  Only trigger PyPI release for v* branches
- Release candidate 0.1.0-rc0. [Marek Cermak]
- Get rid of the static/ folder. [Marek Cermak]

  The static files are built during the package release workflow.

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    jupyter_nbrequirements/static/extension.js
  deleted:    jupyter_nbrequirements/static/index.js
- Update nodejs.yml. [Marek Cermak]

  Node CI can ignore stable and v* branches as the test runs in the
  release workflow anyway.
- Update release.yml. [Marek Cermak]

  Both `branches-ignore` and `branches` can't be used at the same time,
  use negative pattern instead.
- Update release.yml. [Marek Cermak]

  - ignore master branch
- Merge pull request #9 from CermakM/kebechet-initial-lock. [Marek
  Čermák]

  Initial dependency lock
- Initial dependency lock. [root]
- Fix Kebechet missing `repositories` key. [Marek Cermak]
- Merge pull request #7 from CermakM/kebechet. [Marek Čermák]

  Kebechet
- Kebechet workflow. [Marek Cermak]
- Add Kebechet configuration file. [Marek Cermak]
- Add Node CI badge. [Marek Cermak]
- Update summary. [Marek Cermak]
- Merge pull request #6 from CermakM/setup. [Marek Čermák]

  Setup
- Update release.yml. [Marek Cermak]
- Fix typo in release.yml. [Marek Cermak]
- Create the MANIFEST.in file. [Marek Cermak]
- Get rid of the unused JS setup.py cmdclasses. [Marek Cermak]

  Since the JS code is built separately into a bundle using webpack, we
  don't need to run the NPM build during the python build.
- Format setup.py using black. [Marek Cermak]
- Install the tree command. [Marek Cermak]
- Add mode verbosity to the release action. [Marek Cermak]
- Run production build as part of nodejs workflow. [Marek Cermak]
- Fix missing externals in production mode. [Marek Cermak]
- Do not specify black as it only provides pre-releases. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   Pipfile
  modified:   requirements.txt
- Fix typo in release.yml. [Marek Cermak]
- Update and rename pythonpackage.yml to release.yml. [Marek Čermák]

  Action to release the package to PyPI
- Add dev dependencies and do minor fixes. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   Pipfile
  modified:   jupyter_nbrequirements/__about__.py
  modified:   jupyter_nbrequirements/__init__.py
  modified:   requirements.txt
  modified:   setup.py
- Format the code with black. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   jupyter_nbrequirements/__about__.py
  modified:   jupyter_nbrequirements/__init__.py
- Merge pull request #4 from CermakM/actions. [Marek Čermák]

  Setup Node.js CI
- Update nodejs workflow. [Marek Cermak]

  - pushd before running npm
- Update nodejs.yml. [Marek Čermák]
- Update the `usage` example. [Marek Cermak]

  Get rid of the unnecessary autoreload
- Add `ensure` example. [Marek Cermak]
- Update the `usage` example. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   README.md
  modified:   examples/usage/example.ipynb
- Update README. [Marek Cermak]
- Update issue templates. [Marek Čermák]
- Add linters before build and set test. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .eslintrc
  modified:   package.json
  modified:   src/types/nb.d.ts
  modified:   ../jupyter_nbrequirements/static/index.js
- Make logging more consistent. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .eslintrc
  modified:   src/core.ts
  modified:   src/thoth.ts
  modified:   ../jupyter_nbrequirements/static/index.js
- Implement common logging. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   src/config.ts
  modified:   package-lock.json
  modified:   package.json
  modified:   src/cli/command.ts
  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/core.ts
  modified:   src/extension.js
  modified:   src/notebook.ts
  modified:   src/thoth.ts
  modified:   ../jupyter_nbrequirements/static/extension.js
  modified:   ../jupyter_nbrequirements/static/index.js
- Disable eslint for webpack configs. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   webpack.config.js
  modified:   webpack.config.prod.js
- Enable eslint and fix reported issues. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .eslintrc
  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/core.ts
  modified:   src/extension.js
  modified:   src/index.ts
  modified:   src/kernel.ts
  modified:   src/notebook.ts
  modified:   src/requirements.ts
  modified:   src/thoth.ts
  modified:   src/types/index.d.ts
  modified:   src/types/io.d.ts
  modified:   src/utils.ts
  modified:   ../jupyter_nbrequirements/static/extension.js
  modified:   ../jupyter_nbrequirements/static/index.js
- Autoloading. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/extension.js
  modified:   ../jupyter_nbrequirements/static/extension.js
- Fix dep add --dev. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   ../jupyter_nbrequirements/static/index.js
- Revert the autoloading. [Marek Cermak]

  - postponed due to https://github.com/CermakM/jupyter-require/issues/8

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/extension.js
  modified:   src/notebook.ts
  modified:   ../jupyter_nbrequirements/static/extension.js
  modified:   ../jupyter_nbrequirements/static/index.js
- Autoload the python extension. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/extension.js
  modified:   ../jupyter_nbrequirements/static/extension.js
- Make `%kernel` a separate command. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/index.js
- Fix kernel setting. [Marek Cermak]

  - kernel name is always lowercase

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/notebook.ts
  modified:   ../jupyter_nbrequirements/static/index.js
- Fix kernel loading. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  renamed:    src/types/kernel.ts -> src/types/kernel.d.ts
  modified:   package-lock.json
  modified:   package.json
  modified:   src/cli/requirements.ts
  modified:   src/kernel.ts
  modified:   src/notebook.ts
  modified:   src/thoth.ts
  modified:   webpack.config.js
  modified:   ../jupyter_nbrequirements/static/index.js
- Always raise the parser exception. [Marek Cermak]
- Allow to skip kernel installation with ensure. [Marek Cermak]

  - %dep ensure --skip-kernel

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/index.js
- Dep ensure respects resolution engine. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/thoth.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/index.js
- Allow to select pipenv as the resolution engine. [Marek Cermak]

  - This allows for debugging and can serve as a fallback for users in
  case something is wrong with the Thoth pipeline

  - add proxies for locked requirements

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/extension.js
  modified:   src/kernel.ts
  modified:   src/notebook.ts
  modified:   src/requirements.ts
  modified:   src/thoth.ts
  modified:   src/types/requirements.d.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/extension.js
  modified:   ../jupyter_nbrequirements/static/index.js
- Allow to load requirements from a file. [Marek Cermak]
- Fix missing overwrite option in the Get command. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/index.js
- Add --version option to the %dep add command. [Marek Cermak]

  - strip quotes from arguments

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/index.js
- Requirements clear command. [Marek Cermak]

  Clear notebook requirements and locked requirements metadata.

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/index.js
- Fix typo. [Marek Cermak]

  - missing metadata accessor

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   ../jupyter_nbrequirements/static/index.js
- Change the behaviour of get_requirements. [Marek Cermak]

  - library usage is now gathered on each function call
  - fix ast module variable being overwritten in the script
- Requirements ensure command. [Marek Cermak]

  Ensure gets a project into a complete, reproducible, and likely compilable state.

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/thoth.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/static/index.js
- Requirements add command. [Marek Cermak]

  - display error output

  - fix requirements type
  - fix raising error on missing positional arguments

  - `dep` as an alias for `requirements`

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/notebook.ts
  modified:   src/thoth.ts
  modified:   src/types/nb.d.ts
  modified:   src/types/requirements.d.ts
  modified:   ../jupyter_nbrequirements/__init__.py
  modified:   ../jupyter_nbrequirements/magic_parser.py
  modified:   ../jupyter_nbrequirements/static/extension.js
  modified:   ../jupyter_nbrequirements/static/index.js
- Add static/ files. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   ../jupyter_nbrequirements/static/extension.js
  new file:   ../jupyter_nbrequirements/static/index.js
- Separate dev and prod builds. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   package.json
  modified:   webpack.config.js
  new file:   webpack.config.prod.js
- Document the CLI commands. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/command.ts
  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/thoth.ts
  modified:   ../jupyter_nbrequirements/__init__.py
- Requirements kernel command. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    ../jupyter_nbrequirements/snippets/README.md
  deleted:    ../jupyter_nbrequirements/snippets/requirements_kernel.js
  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/thoth.ts
  modified:   src/utils.ts
- Requirements install command. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    ../jupyter_nbrequirements/snippets/requirements_install.js
  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/thoth.ts
  modified:   src/utils.ts
- Modify linter settings. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .eslintrc
  modified:   package-lock.json
  modified:   package.json
  modified:   webpack.config.js
- Use advise_here. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/thoth.ts
  modified:   ../jupyter_nbrequirements/__init__.py
- Requirements lock command. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    ../jupyter_nbrequirements/snippets/requirements_lock.js
  modified:   src/cli/index.ts
  modified:   src/cli/requirements.ts
  modified:   src/thoth.ts
  modified:   src/types/io.d.ts
- Split types and preload python libraries. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   src/kernel.ts
  new file:   src/requirements.ts
  new file:   src/types/io.d.ts
  new file:   src/types/kernel.ts
  new file:   src/types/nb.d.ts
  new file:   src/types/requirements.d.ts
  modified:   src/cli/requirements.ts
  modified:   src/core.ts
  modified:   src/notebook.ts
  modified:   src/thoth.ts
  modified:   src/types/index.d.ts
  modified:   ../jupyter_nbrequirements/__init__.py
- Display stderr output from script execution. [Marek Cermak]

  - typings
  - logging
- Make sure --to-file works. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/notebook.ts
  modified:   src/thoth.ts
- Make sure --ignore-requirements work. [Marek Cermak]

  - add type kernel_info

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/notebook.ts
  modified:   src/thoth.ts
  new file:   src/types/kernel_info.ts
- [WIP] Implement cli-like command executor. [Marek Cermak]

  - snippets will be replaced by the command executor

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   ../examples/usage/example.ipynb
  modified:   package.json
  new file:   src/cli/command.ts
  new file:   src/cli/index.ts
  new file:   src/cli/requirements.ts
  modified:   src/index.ts
  modified:   src/utils.ts
  modified:   tsconfig.json
  modified:   webpack.config.js
  modified:   ../jupyter_nbrequirements/__init__.py
  deleted:    ../jupyter_nbrequirements/snippets/requirements.js
- Split into modules. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    src/types/notebook.d.ts
  new file:   src/core.ts
  new file:   src/notebook.ts
  new file:   src/thoth.ts
  new file:   src/types/index.d.ts
  modified:   ../examples/usage/example.ipynb
  modified:   package.json
  modified:   src/index.ts
  modified:   src/utils.ts
  modified:   tsconfig.json
  modified:   webpack.config.js
  modified:   ../jupyter_nbrequirements/__init__.py
  deleted:    ../jupyter_nbrequirements/snippets/requirements.js
- Add brief README. [Marek Cermak]
- Initial extension configuration. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .gitignore
  modified:   js/package.json
  modified:   js/src/index.ts
  modified:   js/src/utils.ts
  modified:   js/tsconfig.json
  modified:   js/webpack.config.js
  modified:   jupyter_nbrequirements/__init__.py
  new file:   js/.eslintrc
  new file:   js/.gitignore
  new file:   js/package-lock.json
  new file:   js/src/extension.js
  new file:   jupyter-config/notebook.d/jupyter-nbrequirements.json
  new file:   jupyter_nbrequirements/snippets/README.md
  renamed:    js/src/notebook.d.ts -> js/src/types/notebook.d.ts
  renamed:    jupyter_nbrequirements/static/requirements.js -> jupyter_nbrequirements/snippets/requirements.js
  renamed:    jupyter_nbrequirements/static/requirements_install.js -> jupyter_nbrequirements/snippets/requirements_install.js
  renamed:    jupyter_nbrequirements/static/requirements_kernel.js -> jupyter_nbrequirements/snippets/requirements_kernel.js
  renamed:    jupyter_nbrequirements/static/requirements_lock.js -> jupyter_nbrequirements/snippets/requirements_lock.js
  modified:   setup.py
- Add .gitignore. [Marek Cermak]
- Check config existence wrt Pipfile. [Marek Cermak]
- Add example notebook. [Marek Cermak]

  The notebook demonstrates end to end usage of jupyter-nbrequirements.
- Add README.md. [Marek Cermak]
- Setuptools. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   ../Pipfile
  new file:   ../requirements.txt
  new file:   ../setup.py
- Change ignore metadata short option to uppercase. [Marek Cermak]
- Fix missing import and workaround subparsers bug. [Marek Cermak]
- Kernel magic. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   ../../jupyter_nbrequirements/static/requirements_kernel.js
  modified:   ../../jupyter_nbrequirements/__init__.py
- Magic for installing requirements. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   ../../jupyter_nbrequirements/static/requirements_install.js
  modified:   ../../jupyter_nbrequirements/__init__.py
- Be consistent in requirements config magic arguments. [Marek Cermak]

  Do NOT allow to update default config through the magic arguments --
  this improves consistency of the function and predictability of the
  output.
- Magic for locking requirements. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   ../../jupyter_nbrequirements/static/requirements_lock.js
  modified:   ../../jupyter_nbrequirements/__init__.py
  modified:   ../../jupyter_nbrequirements/static/requirements.js
- Add magic parser module. [Marek Cermak]
- Requirements config magic. [Marek Cermak]
- Split requirements magic into sub-commands. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   jupyter_nbrequirements/__init__.py
  new file:   jupyter_nbrequirements/static/requirements.js
- Initial TS src files. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   src/index.ts
  new file:   src/notebook.d.ts
  new file:   src/utils.ts

  modified:   tsconfig.json
- Configure webpack. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   js/webpack.config.js

  modified:   js/package.json
  modified:   js/tsconfig.json
- Initial TypeScript setup. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   js/package.json
  new file:   js/tsconfig.json
- Add parameters to requirements magic. [Marek Cermak]
- Initial implementation of %%requirements magic. [Marek Cermak]
- Create `jupyter_nbrequirements` package. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   jupyter_nbrequirements/__about__.py
  new file:   jupyter_nbrequirements/__init__.py


