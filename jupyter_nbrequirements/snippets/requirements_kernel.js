"use strict";

const args = $$magic_args
const kernel = Jupyter.notebook.kernel

if ( args.sub_command === "install" ){
    install_kernel(args.name)
        .then( (name) => load_kernel(name))
        .then( (name) => console.log(`Kernel spec '${name}' is ready.`) )
}
else if ( args.sub_command === "set" ) {
    console.log(`Setting kernel '${name}'`)

    set_kernel(args.name)
        .then( (name) => console.log(`Kernel '${name}' has been set.`))
}

else {
    // display kernel info and exit
    kernel.kernel_info( (msg) => {
        const content = Object.entries(_.omit(msg.content, ["banner", "help_links"])).sort()
        const kernel_info = {
            name: Jupyter.notebook.kernel.name,
            ..._.object(content)
        }

        display(kernel_info, element)
    })
}