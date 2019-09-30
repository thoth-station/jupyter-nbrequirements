define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension.js":
/*!**************************!*\
  !*** ./src/extension.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Jupyter NBRequirements.\n *\n * This file contains the javascript that is run when the notebook is loaded.\n * It contains some requirejs configuration and the `load_ipython_extension`\n * which is required for any notebook extension.\n *\n * @link   https://github.com/CermakM/jupyter-nbrequirements#readme\n * @file   This file loads the Jupyter magic extension for managing notebook requirements.\n * @author Marek Cermak <macermak@redhat.com>\n * @since  0.0.1\n */\n\n/* eslint-disable */\n\nconst __extension__ = \"jupyter_nbrequirements\"\n\n// Some static assets may be required by the custom widget javascript. The base\n// url for the notebook is not known at build time and is therefore computed\n// dynamically.\n__webpack_require__.p = document.querySelector( \"body\" ).getAttribute( 'data-base-url' ) + 'nbextensions/jupyter-nbrequirements/';\n\n// Constants\nwindow.DEFAULT_RESOLUTION_ENGINE = \"thoth\"\n\n// Load the extension\nif ( window.require ) {\n    window.require.config( {\n        map: {\n            \"*\": {\n                \"nbrequirements\": \"nbextensions/jupyter-nbrequirements/index\"\n            }\n        }\n    } );\n    window.require( [ 'nbrequirements' ], () => console.log( \"Loaded extension: jupyter-nbrequirements\" ) )\n}\n\n// Export the required load_ipython_extension\nmodule.exports = {\n    load_ipython_extension: function () {// Autoload\n        // wait for both the kernel and the jupyter-require extension to be loaded\n        window.require( [\n            \"base/js/namespace\",\n            \"base/js/events\"\n        ], ( Jupyter, events ) => {\n            const options = {\n                silent: false,\n                // if there is an error, let user try to manually\n                // load the extension himself and finish the extension\n                // loading anyway\n                stop_on_error: true,\n                store_history: false\n            }\n\n            // Wait for the required extension to be loaded\n            events.one( \"extension_loaded.JupyterRequire\", () => {\n\n                console.info( \"Loading magic commands: [ '%dep', '%requirements', '%kernel' ]\" )\n\n                const cmd = \"%reload_ext \" + __extension__\n                Jupyter.notebook.kernel.execute( cmd, {}, options )\n\n            } )\n        } )\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvZXh0ZW5zaW9uLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2V4dGVuc2lvbi5qcz8xNWU4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSnVweXRlciBOQlJlcXVpcmVtZW50cy5cbiAqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgdGhlIGphdmFzY3JpcHQgdGhhdCBpcyBydW4gd2hlbiB0aGUgbm90ZWJvb2sgaXMgbG9hZGVkLlxuICogSXQgY29udGFpbnMgc29tZSByZXF1aXJlanMgY29uZmlndXJhdGlvbiBhbmQgdGhlIGBsb2FkX2lweXRob25fZXh0ZW5zaW9uYFxuICogd2hpY2ggaXMgcmVxdWlyZWQgZm9yIGFueSBub3RlYm9vayBleHRlbnNpb24uXG4gKlxuICogQGxpbmsgICBodHRwczovL2dpdGh1Yi5jb20vQ2VybWFrTS9qdXB5dGVyLW5icmVxdWlyZW1lbnRzI3JlYWRtZVxuICogQGZpbGUgICBUaGlzIGZpbGUgbG9hZHMgdGhlIEp1cHl0ZXIgbWFnaWMgZXh0ZW5zaW9uIGZvciBtYW5hZ2luZyBub3RlYm9vayByZXF1aXJlbWVudHMuXG4gKiBAYXV0aG9yIE1hcmVrIENlcm1hayA8bWFjZXJtYWtAcmVkaGF0LmNvbT5cbiAqIEBzaW5jZSAgMC4wLjFcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5jb25zdCBfX2V4dGVuc2lvbl9fID0gXCJqdXB5dGVyX25icmVxdWlyZW1lbnRzXCJcblxuLy8gU29tZSBzdGF0aWMgYXNzZXRzIG1heSBiZSByZXF1aXJlZCBieSB0aGUgY3VzdG9tIHdpZGdldCBqYXZhc2NyaXB0LiBUaGUgYmFzZVxuLy8gdXJsIGZvciB0aGUgbm90ZWJvb2sgaXMgbm90IGtub3duIGF0IGJ1aWxkIHRpbWUgYW5kIGlzIHRoZXJlZm9yZSBjb21wdXRlZFxuLy8gZHluYW1pY2FsbHkuXG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYXNlLXVybCcgKSArICduYmV4dGVuc2lvbnMvanVweXRlci1uYnJlcXVpcmVtZW50cy8nO1xuXG4vLyBDb25zdGFudHNcbndpbmRvdy5ERUZBVUxUX1JFU09MVVRJT05fRU5HSU5FID0gXCJ0aG90aFwiXG5cbi8vIExvYWQgdGhlIGV4dGVuc2lvblxuaWYgKCB3aW5kb3cucmVxdWlyZSApIHtcbiAgICB3aW5kb3cucmVxdWlyZS5jb25maWcoIHtcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgICBcIipcIjoge1xuICAgICAgICAgICAgICAgIFwibmJyZXF1aXJlbWVudHNcIjogXCJuYmV4dGVuc2lvbnMvanVweXRlci1uYnJlcXVpcmVtZW50cy9pbmRleFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9ICk7XG4gICAgd2luZG93LnJlcXVpcmUoIFsgJ25icmVxdWlyZW1lbnRzJyBdLCAoKSA9PiBjb25zb2xlLmxvZyggXCJMb2FkZWQgZXh0ZW5zaW9uOiBqdXB5dGVyLW5icmVxdWlyZW1lbnRzXCIgKSApXG59XG5cbi8vIEV4cG9ydCB0aGUgcmVxdWlyZWQgbG9hZF9pcHl0aG9uX2V4dGVuc2lvblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbG9hZF9pcHl0aG9uX2V4dGVuc2lvbjogZnVuY3Rpb24gKCkgey8vIEF1dG9sb2FkXG4gICAgICAgIC8vIHdhaXQgZm9yIGJvdGggdGhlIGtlcm5lbCBhbmQgdGhlIGp1cHl0ZXItcmVxdWlyZSBleHRlbnNpb24gdG8gYmUgbG9hZGVkXG4gICAgICAgIHdpbmRvdy5yZXF1aXJlKCBbXG4gICAgICAgICAgICBcImJhc2UvanMvbmFtZXNwYWNlXCIsXG4gICAgICAgICAgICBcImJhc2UvanMvZXZlbnRzXCJcbiAgICAgICAgXSwgKCBKdXB5dGVyLCBldmVudHMgKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHNpbGVudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gZXJyb3IsIGxldCB1c2VyIHRyeSB0byBtYW51YWxseVxuICAgICAgICAgICAgICAgIC8vIGxvYWQgdGhlIGV4dGVuc2lvbiBoaW1zZWxmIGFuZCBmaW5pc2ggdGhlIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgIC8vIGxvYWRpbmcgYW55d2F5XG4gICAgICAgICAgICAgICAgc3RvcF9vbl9lcnJvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdG9yZV9oaXN0b3J5OiBmYWxzZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXYWl0IGZvciB0aGUgcmVxdWlyZWQgZXh0ZW5zaW9uIHRvIGJlIGxvYWRlZFxuICAgICAgICAgICAgZXZlbnRzLm9uZSggXCJleHRlbnNpb25fbG9hZGVkLkp1cHl0ZXJSZXF1aXJlXCIsICgpID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyggXCJMb2FkaW5nIG1hZ2ljIGNvbW1hbmRzOiBbICclZGVwJywgJyVyZXF1aXJlbWVudHMnLCAnJWtlcm5lbCcgXVwiIClcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IFwiJXJlbG9hZF9leHQgXCIgKyBfX2V4dGVuc2lvbl9fXG4gICAgICAgICAgICAgICAgSnVweXRlci5ub3RlYm9vay5rZXJuZWwuZXhlY3V0ZSggY21kLCB7fSwgb3B0aW9ucyApXG5cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG59O1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/extension.js\n");

/***/ })

/******/ })});;