(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ModuleDracoGeomEncoder"] = factory();
	else
		root["ModuleDracoGeomEncoder"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1eb2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* unused harmony default export */ var _unused_webpack_default_export = (null);


/***/ }),

/***/ "2e55":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class DracoTaskCMD {}
/**
 * 处理数据
 */


DracoTaskCMD.PARSE = "DRACO_PARSE";
DracoTaskCMD.ENCODE = "DRACO_ENCODE";
/**
 * 从其他线程获取数据
 */

DracoTaskCMD.THREAD_ACQUIRE_DATA = "DRACO_THREAD_ACQUIRE_DATA";
/**
 * 向其他线程发送数据
 */

DracoTaskCMD.THREAD_TRANSMIT_DATA = "DRACO_THREAD_TRANSMIT_DATA";
exports.DracoTaskCMD = DracoTaskCMD;

/***/ }),

/***/ "77de":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DracoTaskCMD_1 = __webpack_require__("2e55");

let CMD = DracoTaskCMD_1.DracoTaskCMD;

class ModuleDracoGeomEncoder {
  receiveCall(data) {
    console.log("ModuleDracoGeomEncoder::receiveCall()..., data: ", data);
    let losstime = Date.now();
    let streams = data.streams;
    const encoderModule = this.encoder;
    const encoder = new encoderModule.Encoder(); // console.log("ModuleDracoGeomEncoder::receiveCall()..., encoder: ", encoder);

    let descriptor = data.descriptor;
    let speed = Math.round(10 - descriptor.compressionLevel);

    if (speed < 0) {
      speed = 0;
    } else if (speed > 10) {
      speed = 10;
    } // console.log("encode to draco speed: ", speed);


    encoder.SetSpeedOptions(speed, speed);
    encoder.SetAttributeQuantization(encoderModule.POSITION, descriptor.posQuantization);
    encoder.SetAttributeQuantization(encoderModule.TEX_COORD, descriptor.uvQuantization);
    encoder.SetAttributeQuantization(encoderModule.NORMAL, descriptor.nvQuantization);
    encoder.SetAttributeQuantization(encoderModule.GENERIC, descriptor.genericQuantization);
    const meshBuilder = new encoderModule.MeshBuilder();
    const dracoMesh = new encoderModule.Mesh(); // console.log("ModuleDracoGeomEncoder::receiveCall()..., dracoMesh: ", dracoMesh);
    // {vertices: ArrayBuffer, uv: ArrayBuffer, normals: ArrayBuffer, indices: ArrayBuffer};

    const mesh = {
      indices: streams[3],
      vertices: streams[0],
      texcoords: streams[1],
      normals: streams[2],
      colors: null
    }; // let speed = 10;
    // encoder.SetSpeedOptions(speed, speed);
    // encoder.SetAttributeQuantization(encoderModule.POSITION, 10);
    // encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);

    const numFaces = mesh.indices.length / 3;
    const numPoints = mesh.vertices.length;
    meshBuilder.AddFacesToMesh(dracoMesh, numFaces, mesh.indices); // console.log("numFaces: ",numFaces);
    // console.log("numPoints: ",numPoints);
    // console.log("mesh: ",mesh);

    meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.POSITION, numPoints, 3, mesh.vertices);

    if (mesh.normals != null) {
      meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.NORMAL, numPoints, 3, mesh.normals);
    }

    if (mesh.colors != null) {
      meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.COLOR, numPoints, 3, mesh.colors);
    }

    if (mesh.texcoords != null) {
      meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.TEX_COORD, numPoints, 2, mesh.texcoords);
    } // let method = "edgebreaker";
    // method = "sequential";
    // if (method === "edgebreaker") {
    // 	encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING);
    // } else if (method === "sequential") {
    // 	encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);
    // }


    const encodedData = new encoderModule.DracoInt8Array(); // Use default encoding setting.

    const encodedLen = encoder.EncodeMeshToDracoBuffer(dracoMesh, encodedData); // draco file buf

    const fileData = new Int8Array(encodedLen);

    for (let i = 0; i < encodedLen; i++) {
      fileData[i] = encodedData.GetValue(i);
    }

    encoderModule.destroy(dracoMesh);
    encoderModule.destroy(meshBuilder);
    encoderModule.destroy(encoder);
    encoderModule.destroy(encodedData);
    console.log("draco encode lossTime: ", Date.now() - losstime);
    console.log("ModuleDracoGeomEncoder::receiveCall()..., encodedLen: ", encodedLen);
    let transfers = new Array(streams.length + 1);

    for (let i = 0; i < streams.length; ++i) {
      transfers[i] = streams[i].buffer;
    }

    transfers[streams.length] = fileData.buffer;
    let dataObj = {
      data: fileData,
      transfers: transfers,
      errorFlag: 0
    };
    return dataObj;
  }

}
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */


class DracoGeomEncodeTask {
  constructor() {
    this.m_dependencyFinish = false;
    this.m_wasmData = null;
    this.m_currTaskClass = -1;
    this.threadIndex = 0;
    this.encoder = null;
    this.encoderObj = {
      wasmBinary: null
    };
    this.dracoParser = new ModuleDracoGeomEncoder();
    this.m_currTaskClass = ThreadCore.getCurrTaskClass();
    console.log("DracoGeomEncodeTask::constructor(), currTaskClass: ", this.m_currTaskClass);
    ThreadCore.setCurrTaskClass(this.m_currTaskClass);
    ThreadCore.acquireData(this, {}, CMD.THREAD_ACQUIRE_DATA);
    ThreadCore.useDependency(this);
    ThreadCore.resetCurrTaskClass();
  }

  postDataMessage(data, transfers) {
    ThreadCore.postMessageToThread(data, transfers);
  }

  initEncoder(data) {
    let bin = data.streams[0];
    this.encoderObj["wasmBinary"] = bin;

    this.encoderObj["onModuleLoaded"] = module => {
      this.encoder = module;
      this.dracoParser.encoder = module;
      ThreadCore.setCurrTaskClass(this.m_currTaskClass);
      ThreadCore.transmitData(this, data, CMD.THREAD_TRANSMIT_DATA, [bin]);
      ThreadCore.initializeExternModule(this);
      ThreadCore.resetCurrTaskClass();
    };

    DracoEncoderModule(this.encoderObj);
  }

  receiveData(data) {
    // console.log("data.taskCmd: ", data.taskCmd);
    switch (data.taskCmd) {
      case CMD.ENCODE:
        let parseData = this.dracoParser.receiveCall(data);
        data.data = {
          buf: parseData.data,
          errorFlag: parseData.errorFlag
        };
        this.postDataMessage(data, parseData.transfers);
        break;

      case CMD.THREAD_ACQUIRE_DATA:
        this.threadIndex = data.threadIndex;
        this.m_wasmData = data.data; //console.log("#####$$$ Sub Worker mesh parser task DRACO_THREAD_ACQUIRE_DATA, data: ", data);

        if (this.m_dependencyFinish && this.m_wasmData != null) {
          this.initEncoder(this.m_wasmData);
        }

        break;

      default:
        //postDataMessage(data);
        break;
    }
  }

  getUniqueName() {
    return "dracoGeomEncoder";
  }

  dependencyFinish() {
    this.m_dependencyFinish = true;

    if (this.m_dependencyFinish && this.m_wasmData != null) {
      this.initEncoder(this.m_wasmData);
    }
  }

}

exports.DracoGeomEncodeTask = DracoGeomEncodeTask; // 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码

let ins = new DracoGeomEncodeTask();

/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("77de");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });
});