/**
 * Jupyter NBRequirements.
 *
 * Jupyter magic extension for managing notebook requirements.
 *
 * @link   https://github.com/CermakM/jupyter-nbrequirements#readme
 * @file   Jupyter magic extension for managing notebook requirements.
 * @author Marek Cermak <macermak@redhat.com>
 * @since  0.0.1
 */
import { createUI, store } from "./ui"

export { cli } from "./cli"
export { Logger } from "./config"
export { version } from "../package.json"

export const vm = createUI()
export { store }
