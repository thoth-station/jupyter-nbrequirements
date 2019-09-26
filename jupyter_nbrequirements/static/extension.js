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

eval("/**\n * Jupyter NBRequirements.\n *\n * This file contains the javascript that is run when the notebook is loaded.\n * It contains some requirejs configuration and the `load_ipython_extension`\n * which is required for any notebook extension.\n *\n * @link   https://github.com/CermakM/jupyter-nbrequirements#readme\n * @file   This file loads the Jupyter magic extension for managing notebook requirements.\n * @author Marek Cermak <macermak@redhat.com>\n * @since  0.0.1\n */\n\n// Some static assets may be required by the custom widget javascript. The base\n// url for the notebook is not known at build time and is therefore computed\n// dynamically.\n__webpack_require__.p = document.querySelector( 'body' ).getAttribute( 'data-base-url' ) + 'nbextensions/jupyter-nbrequirements/';\n\n// Constants\nwindow.DEFAULT_RESOLUTION_ENGINE = \"thoth\"\n\n// Load the extension\nif ( window.require ) {\n    window.require.config( {\n        map: {\n            \"*\": {\n                \"nbrequirements\": \"nbextensions/jupyter-nbrequirements/index\"\n            }\n        }\n    } );\n    window.require( [ 'nbrequirements' ], () => console.log( \"Loaded extension: jupyter-nbrequirements\" ) )\n}\n\n// Export the required load_ipython_extension\nmodule.exports = {\n    load_ipython_extension: function () { }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvZXh0ZW5zaW9uLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2V4dGVuc2lvbi5qcz8xNWU4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSnVweXRlciBOQlJlcXVpcmVtZW50cy5cbiAqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgdGhlIGphdmFzY3JpcHQgdGhhdCBpcyBydW4gd2hlbiB0aGUgbm90ZWJvb2sgaXMgbG9hZGVkLlxuICogSXQgY29udGFpbnMgc29tZSByZXF1aXJlanMgY29uZmlndXJhdGlvbiBhbmQgdGhlIGBsb2FkX2lweXRob25fZXh0ZW5zaW9uYFxuICogd2hpY2ggaXMgcmVxdWlyZWQgZm9yIGFueSBub3RlYm9vayBleHRlbnNpb24uXG4gKlxuICogQGxpbmsgICBodHRwczovL2dpdGh1Yi5jb20vQ2VybWFrTS9qdXB5dGVyLW5icmVxdWlyZW1lbnRzI3JlYWRtZVxuICogQGZpbGUgICBUaGlzIGZpbGUgbG9hZHMgdGhlIEp1cHl0ZXIgbWFnaWMgZXh0ZW5zaW9uIGZvciBtYW5hZ2luZyBub3RlYm9vayByZXF1aXJlbWVudHMuXG4gKiBAYXV0aG9yIE1hcmVrIENlcm1hayA8bWFjZXJtYWtAcmVkaGF0LmNvbT5cbiAqIEBzaW5jZSAgMC4wLjFcbiAqL1xuXG4vLyBTb21lIHN0YXRpYyBhc3NldHMgbWF5IGJlIHJlcXVpcmVkIGJ5IHRoZSBjdXN0b20gd2lkZ2V0IGphdmFzY3JpcHQuIFRoZSBiYXNlXG4vLyB1cmwgZm9yIHRoZSBub3RlYm9vayBpcyBub3Qga25vd24gYXQgYnVpbGQgdGltZSBhbmQgaXMgdGhlcmVmb3JlIGNvbXB1dGVkXG4vLyBkeW5hbWljYWxseS5cbl9fd2VicGFja19wdWJsaWNfcGF0aF9fID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2JvZHknICkuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYXNlLXVybCcgKSArICduYmV4dGVuc2lvbnMvanVweXRlci1uYnJlcXVpcmVtZW50cy8nO1xuXG4vLyBDb25zdGFudHNcbndpbmRvdy5ERUZBVUxUX1JFU09MVVRJT05fRU5HSU5FID0gXCJ0aG90aFwiXG5cbi8vIExvYWQgdGhlIGV4dGVuc2lvblxuaWYgKCB3aW5kb3cucmVxdWlyZSApIHtcbiAgICB3aW5kb3cucmVxdWlyZS5jb25maWcoIHtcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgICBcIipcIjoge1xuICAgICAgICAgICAgICAgIFwibmJyZXF1aXJlbWVudHNcIjogXCJuYmV4dGVuc2lvbnMvanVweXRlci1uYnJlcXVpcmVtZW50cy9pbmRleFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9ICk7XG4gICAgd2luZG93LnJlcXVpcmUoIFsgJ25icmVxdWlyZW1lbnRzJyBdLCAoKSA9PiBjb25zb2xlLmxvZyggXCJMb2FkZWQgZXh0ZW5zaW9uOiBqdXB5dGVyLW5icmVxdWlyZW1lbnRzXCIgKSApXG59XG5cbi8vIEV4cG9ydCB0aGUgcmVxdWlyZWQgbG9hZF9pcHl0aG9uX2V4dGVuc2lvblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbG9hZF9pcHl0aG9uX2V4dGVuc2lvbjogZnVuY3Rpb24gKCkgeyB9XG59O1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/extension.js\n");

/***/ })

/******/ })});;