"use strict";

const args = $$magic_args

Jupyter.notebook.get_requirements_locked(args.ignore_metadata)
    .then(async (r) => {
        if (args.to_file) {
            return await create_pipfile_lock(r, args.overwrite)
                .then(() => {
                    console.log("Pipfile.lock has been sucessfully created.")
                })
                .catch((err) => {
                    console.error("Failed to lock down dependencies.\n", err)
                })
        }

        // default, display requirements in Pipfile.lock format
        display(r, element)
    })
    .catch((err) => {
        console.error("Failed to get requirements.\n", err)
    })