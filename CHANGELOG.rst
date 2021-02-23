Changelog
=========


0.7.3
-----
- Build(deps): bump thamos from 0.9.2 to 0.9.3. [dependabot-
  preview[bot]]

  Bumps [thamos](https://github.com/thoth-station/thamos) from 0.9.2 to 0.9.3.
  - [Release notes](https://github.com/thoth-station/thamos/releases)
  - [Changelog](https://github.com/thoth-station/thamos/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/thoth-station/thamos/compare/0.9.2...0.9.3)


v0.7.2 (2020-04-15)
-------------------

New
~~~
- Sync store on kernel restart. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue

Changes
~~~~~~~
- Silent stream output of Pipfile.create() [Marek Cermak]

Other
~~~~~
- :wrench: Patch 0.7.2. [Marek Cermak]
- :wrench: Patch 0.7.2. [Marek Cermak]


v0.7.1 (2020-04-15)
-------------------

Fix
~~~
- Remove temporary fix for the + button indent. [Marek Cermak]

Other
~~~~~
- :wrench: Patch 0.7.1. [Marek Cermak]


v0.7.0 (2020-04-09)
-------------------

New
~~~
- Dialog to restart kernel during sync. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/requirements.ts
  modified:   js/src/thoth.ts
  modified:   js/src/ui/components/button-install.vue
  modified:   js/src/ui/index.ts
  modified:   js/src/ui/store.ts
- Use micropipenv to install requirements. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/requirements.ts
  modified:   js/src/notebook.ts
  modified:   js/src/thoth.ts
  modified:   js/src/types/requirements.d.ts
  modified:   js/src/ui/components/button-install.vue
  modified:   js/src/ui/store.ts
- INSTALL req directly on a snackbar warning. [Marek Cermak]
- Notify user on requirements detection. [Marek Cermak]

  chg: dev: Refactor notifications and warnings

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    js/src/types/ui.ts
  modified:   js/src/types/index.d.ts
  modified:   js/src/ui/index.ts
  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
  new file:   js/src/ui/notify.ts
- Notify about detected packages. [Marek Cermak]
- Dependency detection and deletion improvements. [Marek Cermak]

  When deleting a package, the edit mode is triggered and changes are
  saved and synced after user saves them.

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Send user notifications about warnings. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/extension.js
  modified:   src/ui/components/button-install.vue
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue
- Added auto-installation on notebook startup. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/extension.js
  modified:   src/index.ts
  modified:   src/ui/index.ts
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue

Changes
~~~~~~~
- Added __version__ to the __init__ file. [Marek Cermak]

Fix
~~~
- Fixed %dep clear not cleaning up UI cache. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/requirements.ts
  modified:   js/src/ui/store.ts
- Fixed incorrect margin on buttons in general. [Marek Cermak]
- Fixed incorrect + button margin. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/core.ts
  modified:   js/src/ui/index.ts
  modified:   js/src/ui/ui.vue
- Create Pipfile before locking. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/extension.js

Other
~~~~~
- Build(deps): bump thamos from 0.8.1 to 0.9.2. [dependabot-
  preview[bot]]

  Bumps [thamos](https://github.com/thoth-station/thamos) from 0.8.1 to 0.9.2.
  - [Release notes](https://github.com/thoth-station/thamos/releases)
  - [Changelog](https://github.com/thoth-station/thamos/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/thoth-station/thamos/compare/0.8.1...0.9.2)
- Build(deps): bump thoth-python from 0.6.5 to 0.9.1. [dependabot-
  preview[bot]]

  Bumps [thoth-python](https://github.com/thoth-station/python) from 0.6.5 to 0.9.1.
  - [Release notes](https://github.com/thoth-station/python/releases)
  - [Changelog](https://github.com/thoth-station/python/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/thoth-station/python/compare/0.6.5...0.9.1)
- Build(deps): bump buefy from 0.8.12 to 0.8.15 in /js. [dependabot-
  preview[bot]]

  Bumps [buefy](https://github.com/buefy/buefy) from 0.8.12 to 0.8.15.
  - [Release notes](https://github.com/buefy/buefy/releases)
  - [Changelog](https://github.com/buefy/buefy/blob/dev/CHANGELOG.md)
  - [Commits](https://github.com/buefy/buefy/compare/v0.8.12...v0.8.15)
- Build(deps-dev): bump webpack from 4.41.6 to 4.42.0 in /js.
  [dependabot-preview[bot]]

  Bumps [webpack](https://github.com/webpack/webpack) from 4.41.6 to 4.42.0.
  - [Release notes](https://github.com/webpack/webpack/releases)
  - [Commits](https://github.com/webpack/webpack/compare/v4.41.6...v4.42.0)
- Build(deps-dev): bump @types/react from 16.9.2 to 16.9.23 in /js.
  [dependabot-preview[bot]]

  Bumps [@types/react](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/react) from 16.9.2 to 16.9.23.
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
  - [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/react)
- Build(deps-dev): bump @types/node from 12.7.12 to 13.7.4 in /js.
  [dependabot-preview[bot]]

  Bumps [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/node) from 12.7.12 to 13.7.4.
  - [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
  - [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/node)
- Build(deps): bump ipykernel from 5.1.3 to 5.1.4. [dependabot-
  preview[bot]]

  Bumps [ipykernel](https://ipython.org) from 5.1.3 to 5.1.4.
- Build(deps): bump vue and vue-template-compiler in /js. [dependabot-
  preview[bot]]

  Bumps [vue](https://github.com/vuejs/vue) and [vue-template-compiler](https://github.com/vuejs/vue). These dependencies needed to be updated together.

  Updates `vue` from 2.6.10 to 2.6.11
  - [Release notes](https://github.com/vuejs/vue/releases)
  - [Commits](https://github.com/vuejs/vue/compare/v2.6.10...v2.6.11)

  Updates `vue-template-compiler` from 2.6.10 to 2.6.11
  - [Release notes](https://github.com/vuejs/vue/releases)
  - [Commits](https://github.com/vuejs/vue/compare/v2.6.10...v2.6.11)
- Build(deps): bump vue-loader from 15.7.2 to 15.9.0 in /js.
  [dependabot-preview[bot]]

  Bumps [vue-loader](https://github.com/vuejs/vue-loader) from 15.7.2 to 15.9.0.
  - [Release notes](https://github.com/vuejs/vue-loader/releases)
  - [Changelog](https://github.com/vuejs/vue-loader/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/vuejs/vue-loader/compare/v15.7.2...v15.9.0)
- Build(deps): bump thamos from 0.7.2 to 0.8.1. [dependabot-
  preview[bot]]

  Bumps [thamos](https://github.com/thoth-station/thamos) from 0.7.2 to 0.8.1.
  - [Release notes](https://github.com/thoth-station/thamos/releases)
  - [Changelog](https://github.com/thoth-station/thamos/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/thoth-station/thamos/compare/0.7.2...0.8.1)
- Build(deps): bump style-loader from 1.0.0 to 1.1.3 in /js.
  [dependabot-preview[bot]]

  Bumps [style-loader](https://github.com/webpack-contrib/style-loader) from 1.0.0 to 1.1.3.
  - [Release notes](https://github.com/webpack-contrib/style-loader/releases)
  - [Changelog](https://github.com/webpack-contrib/style-loader/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/webpack-contrib/style-loader/compare/v1.0.0...v1.1.3)
- Build(deps): bump css-loader from 3.2.0 to 3.4.2 in /js. [dependabot-
  preview[bot]]

  Bumps [css-loader](https://github.com/webpack-contrib/css-loader) from 3.2.0 to 3.4.2.
  - [Release notes](https://github.com/webpack-contrib/css-loader/releases)
  - [Changelog](https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md)
  - [Commits](https://github.com/webpack-contrib/css-loader/compare/v3.2.0...v3.4.2)
- Build(deps-dev): bump webpack from 4.41.1 to 4.41.6 in /js.
  [dependabot-preview[bot]]

  Bumps [webpack](https://github.com/webpack/webpack) from 4.41.1 to 4.41.6.
  - [Release notes](https://github.com/webpack/webpack/releases)
  - [Commits](https://github.com/webpack/webpack/compare/v4.41.1...v4.41.6)
- Build(deps): bump buefy from 0.8.6 to 0.8.12 in /js. [dependabot-
  preview[bot]]

  Bumps [buefy](https://github.com/buefy/buefy) from 0.8.6 to 0.8.12.
  - [Release notes](https://github.com/buefy/buefy/releases)
  - [Changelog](https://github.com/buefy/buefy/blob/dev/CHANGELOG.md)
  - [Commits](https://github.com/buefy/buefy/compare/v0.8.6...v0.8.12)
- Build(deps): bump vue-property-decorator from 8.3.0 to 8.4.0 in /js.
  [dependabot-preview[bot]]

  Bumps [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) from 8.3.0 to 8.4.0.
  - [Release notes](https://github.com/kaorun343/vue-property-decorator/releases)
  - [Commits](https://github.com/kaorun343/vue-property-decorator/commits)
- Build(deps): [security] bump bleach from 3.1.0 to 3.1.1. [dependabot-
  preview[bot]]

  Bumps [bleach](https://github.com/mozilla/bleach) from 3.1.0 to 3.1.1. **This update includes a security fix.**
  - [Release notes](https://github.com/mozilla/bleach/releases)
  - [Changelog](https://github.com/mozilla/bleach/blob/master/CHANGES)
  - [Commits](https://github.com/mozilla/bleach/compare/v3.1.0...v3.1.1)
- Build(deps): bump vuex from 3.1.1 to 3.1.2 in /js. [dependabot-
  preview[bot]]

  Bumps [vuex](https://github.com/vuejs/vuex) from 3.1.1 to 3.1.2.
  - [Release notes](https://github.com/vuejs/vuex/releases)
  - [Commits](https://github.com/vuejs/vuex/compare/v3.1.1...v3.1.2)


v0.6.0 (2020-03-17)
-------------------

New
~~~
- Dependency detection and deletion improvements. [Marek Cermak]

  When deleting a package, the edit mode is triggered and changes are
  saved and synced after user saves them.

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Send user notifications about warnings. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/extension.js
  modified:   src/ui/components/button-install.vue
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue
- Added auto-installation on notebook startup. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/extension.js
  modified:   src/index.ts
  modified:   src/ui/index.ts
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue

Fix
~~~
- Create Pipfile before locking. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/cli/requirements.ts
  modified:   src/extension.js


v0.5.1 (2020-02-17)
-------------------

Fix
~~~
- Sync after installation. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/components/button-install.vue
  modified:   js/src/ui/store.ts

Other
~~~~~
- :wrench: Patch 0.5.1. [Marek Cermak]
- Fixed error if package misses github_url. [Marek Cermak]


v0.5.0 (2019-12-09)
-------------------

New
~~~
- Update the README. [Marek Cermak]
- Added UI screenshot to assets/ [Marek Cermak]
- Display the installed version as a tooltip. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/ui/components/field-installed.vue
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue
- Collect information about installed packages. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/thoth.ts
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue
- Added a column to show whether a package is installed. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   src/ui/components/field-installed.vue
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue

Changes
~~~~~~~
- Moved type prototypes to proto/ folder. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  renamed:    js/src/kernel.ts -> js/src/proto/kernel.ts
  renamed:    js/src/requirements.ts -> js/src/proto/requirements.ts
  modified:   js/src/notebook.ts
  modified:   js/src/thoth.ts
  modified:   js/src/ui/components/button-install.vue
  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Renaming of UI components. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  renamed:    js/src/ui/components/install.vue -> js/src/ui/components/button-install.vue
  renamed:    js/src/ui/components/package-field.vue -> js/src/ui/components/field-package.vue
  renamed:    js/src/ui/components/version-field.vue -> js/src/ui/components/field-version.vue
  modified:   js/src/ui/ui.vue

Fix
~~~
- Fixed incorrect size of health tag. [Marek Cermak]
- Fixed issue with null constraints. [Marek Cermak]

Other
~~~~~
- Build(deps-dev): bump typescript from 3.6.4 to 3.7.3 in /js.
  [dependabot-preview[bot]]

  Bumps [typescript](https://github.com/Microsoft/TypeScript) from 3.6.4 to 3.7.3.
  - [Release notes](https://github.com/Microsoft/TypeScript/releases)
  - [Commits](https://github.com/Microsoft/TypeScript/compare/v3.6.4...v3.7.3)
- Build(deps): bump jupyter-require from 0.5.0 to 0.6.1. [dependabot-
  preview[bot]]

  Bumps [jupyter-require](https://github.com/CermakM/jupyter-require) from 0.5.0 to 0.6.1.
  - [Release notes](https://github.com/CermakM/jupyter-require/releases)
  - [Changelog](https://github.com/CermakM/jupyter-require/blob/master/CHANGELOG.rst)
  - [Commits](https://github.com/CermakM/jupyter-require/compare/v0.5.0...v0.6.1)


v0.4.1 (2019-12-03)
-------------------

New
~~~
- Added Makefile patch target. [Marek Cermak]

Fix
~~~
- Fixed funny input prompt behaviour. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/notebook.ts
  modified:   js/src/types/nb.d.ts
  modified:   jupyter_nbrequirements/__init__.py

Other
~~~~~
- :wrench: Patch 0.4.1. [Marek Cermak]


v0.4.0 (2019-12-03)
-------------------

New
~~~
- Reload the extension when the kernel restarts. [Marek Cermak]
- Added .eslintignore. [Marek Cermak]
- Collect more data about packages. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   ../Makefile
  modified:   package.json
  modified:   src/types/index.d.ts
  modified:   src/ui/components/package-field.vue
  modified:   src/ui/store.ts
  modified:   src/ui/ui.vue
- Added version field component. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   js/src/ui/components/install.vue
  new file:   js/src/ui/components/version-field.vue
- Validate new packages before saving them. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    js/src/ui/components/package-finder.vue
  modified:   js/src/ui/components/package-field.vue
  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Added possibility to edit dependencies. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/index.ts
  modified:   js/src/cli/requirements.ts
  new file:   js/src/ui/components/package-field.vue
  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Fixed requirements installation via UI. [Marek Cermak]
- New widget to install requirements with UI. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  Changes to be committed:
  modified:   js/src/cli/requirements.ts
  modified:   js/src/core.ts
  modified:   js/src/thoth.ts
  modified:   js/src/types/nb.d.ts
  modified:   js/src/ui/components/package-finder.vue
  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
  modified:   js/webpack.config.js
- Execution without context. [Marek Cermak]
- Collapsible Requirements UI. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/index.ts
  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Clear packageFinder fields when package is added. [Marek Cermak]
- Move UI out of the notebook container. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/index.ts
  modified:   js/src/ui/ui.vue
- CLI commands trigger store sync. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/index.ts
  modified:   js/src/ui/store.ts
- Display loading message when UI is loading. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Added functionality to add requirements via UI. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/command.ts
  modified:   js/src/cli/requirements.ts
  modified:   js/src/ui/components/package-finder.vue
  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- %dep add can load requirements from Pipfile. [Marek Cermak]
- Allow package name aliases. [Marek Cermak]

  Added option to specify package name alias in `%dep add`. This is useful
  if package name differs from the import.

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/requirements.ts
  modified:   js/src/notebook.ts
  modified:   js/src/types/requirements.d.ts
  modified:   jupyter_nbrequirements/__init__.py

Changes
~~~~~~~
- Get rid of the assets folder. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    src/ui/assets/_ui.scss
  deleted:    src/ui/assets/style.scss
  modified:   webpack.common.js
  modified:   webpack.dev.js
  modified:   webpack.prod.js
- Use a common webpack config for dev/prod. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    webpack.config.prod.js
  modified:   package-lock.json
  modified:   package.json
  new file:   webpack.dev.js
  new file:   webpack.prod.js
- Make notification font bigger. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/index.ts
  modified:   js/src/utils.ts
- Use Custom VueContainer element. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/package-lock.json
  modified:   js/package.json
  modified:   js/src/index.ts
  new file:   js/src/ui/container.ts
  modified:   js/src/ui/index.ts
  modified:   js/src/ui/ui.vue
  modified:   js/webpack.config.js

Fix
~~~
- Fixed missing webpack common module. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  renamed:    webpack.config.js -> webpack.common.js
  modified:   webpack.dev.js
  modified:   webpack.prod.js
- Added forgotten modules to git. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  new file:   js/src/types/ui.ts
  new file:   js/src/ui/assets/_ui.scss
  new file:   js/src/ui/assets/style.scss
- Fixed issues with repo_data and versions. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/ui/components/package-field.vue
  modified:   src/ui/components/version-field.vue
  modified:   src/ui/store.ts
- Fixed misplaced loading position. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/extension.js
  modified:   js/src/ui/components/version-field.vue
  modified:   js/src/ui/index.ts
  modified:   js/src/ui/ui.vue
  modified:   js/webpack.config.js
- Emit version constraint with operator. [Marek Cermak]
- Fixed version constraint not being saved. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   src/ui/components/version-field.vue
  modified:   src/ui/ui.vue
- Fixed alert icon on update as well. [Marek Cermak]
- Allow editing multiple dependencies. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/store.ts
  modified:   js/src/ui/ui.vue
- Fixed incorrect event propagation. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/ui/components/package-finder.vue
  modified:   js/src/ui/container.ts
- Do not display page load when UI is expanded. [Marek Cermak]
- Fixed escaped newlines in Python strings. [Marek Cermak]

  Fixes: #66

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/index.ts
  modified:   js/src/thoth.ts
  modified:   js/src/utils.ts
- Fix `module 'distutils' has no attribute 'sysconfig'` [Marek Cermak]


v0.3.0 (2019-10-26)
-------------------

New
~~~
- Cell execution count is now chornological. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/core.ts
  modified:   js/src/notebook.ts
  modified:   js/src/types/nb.d.ts
  modified:   jupyter_nbrequirements/__init__.py

Changes
~~~~~~~
- "pipenv" as default resolution engine. [Marek Cermak]

  Until Thoth resolution engine becomes stable, pipenv has been chosen as
  the default resolution engine.

Fix
~~~
- Fix CLIENT_VERSION inference from branch. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .github/workflows/release.yml
  modified:   Makefile
- Cells are marked as finished properly. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/cli/command.ts
  modified:   js/src/cli/index.ts
  modified:   js/src/cli/requirements.ts
  modified:   js/src/core.ts
- :pushpin: Use jupyter-require>=0.4.0. [Marek Cermak]

  Fixes: https://github.com/CermakM/jupyter-nbrequirements/issues/41

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   Pipfile
  modified:   Pipfile.lock
  modified:   requirements.txt
- Error messages are more informative. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   js/src/core.ts
  modified:   js/src/thoth.ts
  modified:   js/src/types/io.d.ts


v0.2.1 (2019-10-22)
-------------------
- Fix incorrect indentation of notebook content. [Marek Cermak]

  Fixes: #42

  There seemed to have been an issue with the first line of notebook content being
  incorrectly indented, causing successive python calls to fail.


v0.2.0 (2019-10-22)
-------------------
- Generate CHANGELOG. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .gitchangelog.rc
  new file:   CHANGELOG.md
- Disable Kebechet until it is stable. [Marek Cermak]
- Fixed missing jinja2-cli. [Marek Cermak]
- Disable Kebechet version manager. [Marek Cermak]
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
- Add dependabot badge. [Marek Čermák]


v0.1.0 (2019-10-04)
-------------------
- Update requirements.txt respecting requirements in Pipfile. [Kebechet]
- Fix maintainer name and remove Kebechet issue labels. [Marek Cermak]

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  modified:   .github/ISSUE_TEMPLATE/minor-release.md
  modified:   .github/ISSUE_TEMPLATE/patch-release.md
  modified:   .github/ISSUE_TEMPLATE/pre-release.md
  modified:   .thoth.yaml
- Update issue templates. [Marek Čermák]

  Add Kebechet release templates
- Get rid of the static/ folder. [Marek Cermak]

  The static files are built during the package release workflow.

  Signed-off-by: Marek Cermak <macermak@redhat.com>

  deleted:    jupyter_nbrequirements/static/extension.js
  deleted:    jupyter_nbrequirements/static/index.js
- Update nodejs.yml. [Marek Cermak]

  Node CI can ignore stable and v* branches as the test runs in the
  release workflow anyway.
- Initial dependency lock. [root]
- Fix Kebechet missing `repositories` key. [Marek Cermak]
- Kebechet workflow. [Marek Cermak]
- Add Kebechet configuration file. [Marek Cermak]
- Add Node CI badge. [Marek Cermak]
- Update summary. [Marek Cermak]
- Create the MANIFEST.in file. [Marek Cermak]
- Get rid of the unused JS setup.py cmdclasses. [Marek Cermak]

  Since the JS code is built separately into a bundle using webpack, we
  don't need to run the NPM build during the python build.
- Format setup.py using black. [Marek Cermak]
- Install the tree command. [Marek Cermak]
- Run production build as part of nodejs workflow. [Marek Cermak]
- Fix missing externals in production mode. [Marek Cermak]
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
