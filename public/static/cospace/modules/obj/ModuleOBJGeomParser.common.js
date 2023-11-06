module.exports =
/******/ (function(modules) { // webpackBootstrap
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

/***/ "3a68":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 作为多线程 thread 内部执行的任务处理功能的基类
 */

class BaseTaskInThread {
  constructor(enabled = true) {
    this.m_sysEnabled = false;
    this.m_sysEnabled = typeof ThreadCore !== "undefined";

    if (enabled) {
      if (this.m_sysEnabled) {
        ThreadCore.initializeExternModule(this);
      } else {
        throw Error("Can not find ThreadCore module !!!");
      }
    }
  }

  receiveData(data) {}

  postMessageToThread(data, transfers = null) {
    if (this.m_sysEnabled) {
      if (transfers != null) {
        ThreadCore.postMessageToThread(data);
      } else {
        ThreadCore.postMessageToThread(data, transfers);
      }
    }
  }

  getTaskClass() {
    throw Error("the taskClass value is illegal !!!");
    return 0;
  }

  dependencyFinish() {}

  getUniqueName() {
    throw Error("the uniqueName value is illegal !!!");
    return "";
  }

}

exports.BaseTaskInThread = BaseTaskInThread;

/***/ }),

/***/ "6155":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const BaseTaskInThread_1 = __webpack_require__("3a68");

const ObjDataParser_1 = __webpack_require__("eec2");
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */


class ModuleOBJGeomParser extends BaseTaskInThread_1.BaseTaskInThread {
  constructor() {
    super();
    console.log("ModuleOBJGeomParser::constructor()...");
  }

  parseFromStr(rdata, dataStr) {
    let models = [];
    let objParser = new ObjDataParser_1.ObjDataParser();
    let objMeshes = null;
    let transfers = [];

    try {
      objMeshes = objParser.Parse(dataStr);
    } catch (e) {
      console.error("parse obj geom model data error.");
    }

    if (objMeshes != null) {
      let len = objMeshes.length;

      for (let i = 0; i < len; ++i) {
        const mesh = objMeshes[i];
        const geom = mesh.geometry; // console.log("objMeshes["+i+"]: ", objMeshes[i]);

        const model = this.createModel(geom);
        model.uuid = mesh.name;

        if (model.vertices != null) {
          transfers.push(model.indices);
          transfers.push(model.vertices);
          transfers.push(model.normals);

          for (let j = 0, lj = model.uvsList.length; j < lj; ++j) {
            transfers.push(model.uvsList[j]);
          }
        }

        models.push(model);
      }
    }

    let modelData = {
      models: models
    };
    rdata.data = modelData;

    if (transfers.length > 0) {
      this.postMessageToThread(rdata, transfers);
    } else {
      this.postMessageToThread(rdata);
    }
  }

  createModel(geom) {
    let vtxTotal = geom.vertices.length;
    let vtCount = vtxTotal / 3;

    if (vtCount >= 3) {
      let indices = null;

      if (indices == null) {
        indices = vtCount <= 65535 ? new Uint16Array(vtCount) : new Uint32Array(vtCount);

        for (let i = 0; i < vtCount; ++i) {
          indices[i] = i;
        }
      }

      if (geom.normals == null || geom.normals == undefined) {
        console.error("parse obj geom model normals data error.");
      }

      let model = {
        uvsList: [new Float32Array(geom.uvs)],
        vertices: new Float32Array(geom.vertices),
        normals: new Float32Array(geom.normals),
        indices: indices
      };
      return model;
    } else {
      let model = {
        uvsList: null,
        vertices: null,
        normals: null,
        indices: null
      };
      return model;
    }
  }

  receiveData(rdata) {
    let dataBuf = rdata.streams[0];
    const readerBuf = new FileReader();

    readerBuf.onload = e => {
      this.parseFromStr(rdata, readerBuf.result);
    };

    readerBuf.readAsText(new Blob([dataBuf]));
  }

}

exports.ModuleOBJGeomParser = ModuleOBJGeomParser; // 这一句代码是必须有的

let ins = new ModuleOBJGeomParser();

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

/***/ "eec2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjDataParser", function() { return ObjDataParser; });
function ObjDataParser() {
  // o object_name | g group_name
  var object_pattern = /^[og]\s*(.+)?/; // mtllib file_reference

  var material_library_pattern = /^mtllib /; // usemtl material_name

  var material_use_pattern = /^usemtl /; // usemap map_name

  var map_use_pattern = /^usemap /;

  function ParserState() {
    var state = {
      objects: [],
      object: {},
      vertices: [],
      normals: [],
      colors: [],
      uvs: [],
      materials: {},
      materialLibraries: [],
      startObject: function (name, fromDeclaration) {
        // If the current object (initial from reset) is not from a g/o declaration in the parsed
        // file. We need to use it for the first parsed g/o to keep things in sync.
        console.log("startObject, name: ", name);

        if (this.object && this.object.fromDeclaration === false) {
          this.object.name = name;
          this.object.fromDeclaration = fromDeclaration !== false;
          return;
        }

        var previousMaterial = this.object && typeof this.object.currentMaterial === "function" ? this.object.currentMaterial() : undefined;

        if (this.object && typeof this.object._finalize === "function") {
          this.object._finalize(true);
        }

        this.object = {
          name: name || "",
          fromDeclaration: fromDeclaration !== false,
          geometry: {
            vertices: [],
            normals: [],
            colors: [],
            uvs: []
          },
          materials: [],
          smooth: true,
          startMaterial: function (name, libraries) {
            var previous = this._finalize(false); // New usemtl declaration overwrites an inherited material, except if faces were declared
            // after the material, then it must be preserved for proper MultiMaterial continuation.


            if (previous && (previous.inherited || previous.groupCount <= 0)) {
              this.materials.splice(previous.index, 1);
            }

            var material = {
              index: this.materials.length,
              name: name || "",
              mtllib: Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : "",
              smooth: previous !== undefined ? previous.smooth : this.smooth,
              groupStart: previous !== undefined ? previous.groupEnd : 0,
              groupEnd: -1,
              groupCount: -1,
              inherited: false,
              clone: function (index) {
                var cloned = {
                  index: typeof index === "number" ? index : this.index,
                  name: this.name,
                  mtllib: this.mtllib,
                  smooth: this.smooth,
                  groupStart: 0,
                  groupEnd: -1,
                  groupCount: -1,
                  inherited: false
                };
                cloned.clone = this.clone.bind(cloned);
                return cloned;
              }
            };
            this.materials.push(material);
            return material;
          },
          currentMaterial: function () {
            if (this.materials.length > 0) {
              return this.materials[this.materials.length - 1];
            }

            return undefined;
          },
          _finalize: function (end) {
            var lastMultiMaterial = this.currentMaterial();

            if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {
              lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
              lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
              lastMultiMaterial.inherited = false;
            } // Ignore objects tail materials if no face declarations followed them before a new o/g started.


            if (end && this.materials.length > 1) {
              for (var mi = this.materials.length - 1; mi >= 0; mi--) {
                if (this.materials[mi].groupCount <= 0) {
                  this.materials.splice(mi, 1);
                }
              }
            } // Guarantee at least one empty material, this makes the creation later more straight forward.


            if (end && this.materials.length === 0) {
              this.materials.push({
                name: "",
                smooth: this.smooth
              });
            }

            return lastMultiMaterial;
          }
        }; // Inherit previous objects material.
        // Spec tells us that a declared material must be set to all objects until a new material is declared.
        // If a usemtl declaration is encountered while this new object is being parsed, it will
        // overwrite the inherited material. Exception being that there was already face declarations
        // to the inherited material, then it will be preserved for proper MultiMaterial continuation.

        if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function") {
          var declared = previousMaterial.clone(0);
          declared.inherited = true;
          this.object.materials.push(declared);
        }

        console.log("add a new object: ", this.object);
        this.objects.push(this.object);
      },
      finalize: function () {
        if (this.object && typeof this.object._finalize === "function") {
          this.object._finalize(true);
        }
      },
      parseVertexIndex: function (value, len) {
        var index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 3) * 3;
      },
      parseNormalIndex: function (value, len) {
        var index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 3) * 3;
      },
      parseUVIndex: function (value, len) {
        var index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 2) * 2;
      },
      addVertex: function (a, b, c) {
        var src = this.vertices;
        var dst = this.object.geometry.vertices;
        dst.push(src[a + 0], src[a + 1], src[a + 2]);
        dst.push(src[b + 0], src[b + 1], src[b + 2]);
        dst.push(src[c + 0], src[c + 1], src[c + 2]);
      },
      addVertexPoint: function (a) {
        var src = this.vertices;
        var dst = this.object.geometry.vertices;
        dst.push(src[a + 0], src[a + 1], src[a + 2]);
      },
      addVertexLine: function (a) {
        var src = this.vertices;
        var dst = this.object.geometry.vertices;
        dst.push(src[a + 0], src[a + 1], src[a + 2]);
      },
      addNormal: function (a, b, c) {
        var src = this.normals;
        var dst = this.object.geometry.normals;
        dst.push(src[a + 0], src[a + 1], src[a + 2]);
        dst.push(src[b + 0], src[b + 1], src[b + 2]);
        dst.push(src[c + 0], src[c + 1], src[c + 2]);
      },
      addColor: function (a, b, c) {
        var src = this.colors;
        var dst = this.object.geometry.colors;
        dst.push(src[a + 0], src[a + 1], src[a + 2]);
        dst.push(src[b + 0], src[b + 1], src[b + 2]);
        dst.push(src[c + 0], src[c + 1], src[c + 2]);
      },
      addUV: function (a, b, c) {
        var src = this.uvs;
        var dst = this.object.geometry.uvs;
        dst.push(src[a + 0], src[a + 1]);
        dst.push(src[b + 0], src[b + 1]);
        dst.push(src[c + 0], src[c + 1]);
      },
      addUVLine: function (a) {
        var src = this.uvs;
        var dst = this.object.geometry.uvs;
        dst.push(src[a + 0], src[a + 1]);
      },
      addFace: function (a, b, c, ua, ub, uc, na, nb, nc) {
        var vLen = this.vertices.length;
        var ia = this.parseVertexIndex(a, vLen);
        var ib = this.parseVertexIndex(b, vLen);
        var ic = this.parseVertexIndex(c, vLen);
        this.addVertex(ia, ib, ic);

        if (this.colors.length > 0) {
          this.addColor(ia, ib, ic);
        }

        if (ua !== undefined && ua !== "") {
          var uvLen = this.uvs.length;
          ia = this.parseUVIndex(ua, uvLen);
          ib = this.parseUVIndex(ub, uvLen);
          ic = this.parseUVIndex(uc, uvLen);
          this.addUV(ia, ib, ic);
        }

        if (na !== undefined && na !== "") {
          // Normals are many times the same. If so, skip function call and parseInt.
          var nLen = this.normals.length;
          ia = this.parseNormalIndex(na, nLen);
          ib = na === nb ? ia : this.parseNormalIndex(nb, nLen);
          ic = na === nc ? ia : this.parseNormalIndex(nc, nLen);
          this.addNormal(ia, ib, ic);
        }
      },
      addPointGeometry: function (vertices) {
        this.object.geometry.type = "Points";
        var vLen = this.vertices.length;

        for (var vi = 0, l = vertices.length; vi < l; vi++) {
          this.addVertexPoint(this.parseVertexIndex(vertices[vi], vLen));
        }
      },
      addLineGeometry: function (vertices, uvs) {
        this.object.geometry.type = "Line";
        var vLen = this.vertices.length;
        var uvLen = this.uvs.length;

        for (var vi = 0, l = vertices.length; vi < l; vi++) {
          this.addVertexLine(this.parseVertexIndex(vertices[vi], vLen));
        }

        for (var uvi = 0, l = uvs.length; uvi < l; uvi++) {
          this.addUVLine(this.parseUVIndex(uvs[uvi], uvLen));
        }
      }
    };
    state.startObject("", false);
    return state;
  }

  this.Parse = function (text) {
    var state = new ParserState();

    if (text.indexOf("\r\n") !== -1) {
      // This is faster than String.split with regex that splits on both
      text = text.replace(/\r\n/g, "\n");
    }

    if (text.indexOf("\\\n") !== -1) {
      // join lines separated by a line continuation character (\)
      text = text.replace(/\\\n/g, "");
    }

    var lines = text.split("\n");
    var line = "",
        lineFirstChar = "";
    var lineLength = 0;
    var result = []; // Faster to just trim left side of the line. Use if available.

    var trimLeft = typeof "".trimLeft === "function";

    for (var i = 0, l = lines.length; i < l; i++) {
      line = lines[i];
      line = trimLeft ? line.trimLeft() : line.trim();
      lineLength = line.length;
      if (lineLength === 0) continue;
      lineFirstChar = line.charAt(0); // @todo invoke passed in handler if any

      if (lineFirstChar === "#") continue;

      if (lineFirstChar === "v") {
        var data = line.split(/\s+/);

        switch (data[0]) {
          case "v":
            state.vertices.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));

            if (data.length >= 7) {
              state.colors.push(parseFloat(data[4]), parseFloat(data[5]), parseFloat(data[6]));
            }

            break;

          case "vn":
            state.normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
            break;

          case "vt":
            state.uvs.push(parseFloat(data[1]), parseFloat(data[2]));
            break;
        }
      } else if (lineFirstChar === "f") {
        var lineData = line.substr(1).trim();
        var vertexData = lineData.split(/\s+/);
        var faceVertices = []; // Parse the face vertex data into an easy to work with format

        for (var j = 0, jl = vertexData.length; j < jl; j++) {
          var vertex = vertexData[j];

          if (vertex.length > 0) {
            var vertexParts = vertex.split("/");
            faceVertices.push(vertexParts);
          }
        } // console.log(faceVertices);
        // Draw an edge between the first vertex and all subsequent vertices to form an n-gon


        var v1 = faceVertices[0];

        for (var j = 1, jl = faceVertices.length - 1; j < jl; j++) {
          var v2 = faceVertices[j];
          var v3 = faceVertices[j + 1];
          state.addFace(v1[0], v2[0], v3[0], v1[1], v2[1], v3[1], v1[2], v2[2], v3[2]);
        }
      } else if (lineFirstChar === "l") {
        var lineParts = line.substring(1).trim().split(" ");
        var lineVertices = [],
            lineUVs = [];

        if (line.indexOf("/") === -1) {
          lineVertices = lineParts;
        } else {
          for (var li = 0, llen = lineParts.length; li < llen; li++) {
            var parts = lineParts[li].split("/");
            if (parts[0] !== "") lineVertices.push(parts[0]);
            if (parts[1] !== "") lineUVs.push(parts[1]);
          }
        }

        state.addLineGeometry(lineVertices, lineUVs);
      } else if (lineFirstChar === "p") {
        var lineData = line.substr(1).trim();
        var pointData = lineData.split(" ");
        state.addPointGeometry(pointData);
      } else if ((result = object_pattern.exec(line)) !== null) {
        // o object_name
        // or
        // g group_name
        // WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
        // var name = result[ 0 ].substr( 1 ).trim();
        var name = (" " + result[0].substr(1).trim()).substr(1);
        state.startObject(name);
      } else if (material_use_pattern.test(line)) {
        // material
        state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
      } else if (material_library_pattern.test(line)) {
        // mtl file
        state.materialLibraries.push(line.substring(7).trim());
      } else if (map_use_pattern.test(line)) {
        // the line is parsed but ignored since the loader assumes textures are defined MTL files
        // (according to https://www.okino.com/conv/imp_wave.htm, 'usemap' is the old-style Wavefront texture reference method)
        console.warn('ObjDataParser: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');
      } else if (lineFirstChar === "s") {
        result = line.split(" "); // smooth shading
        // @todo Handle files that have varying smooth values for a set of faces inside one geometry,
        // but does not define a usemtl for each face set.
        // This should be detected and a dummy material created (later MultiMaterial and geometry groups).
        // This requires some care to not create extra material on each smooth value for "normal" obj files.
        // where explicit usemtl defines geometry groups.
        // Example asset: examples/models/obj/cerberus/Cerberus.obj

        /*
        				 * http://paulbourke.net/dataformats/obj/
        				 * or
        				 * http://www.cs.utah.edu/~boulos/cs3505/obj_spec.pdf
        				 *
        				 * From chapter "Grouping" Syntax explanation "s group_number":
        				 * "group_number is the smoothing group number. To turn off smoothing groups, use a value of 0 or off.
        				 * Polygonal elements use group numbers to put elements in different smoothing groups. For free-form
        				 * surfaces, smoothing groups are either turned on or off; there is no difference between values greater
        				 * than 0."
        				 */

        if (result.length > 1) {
          var value = result[1].trim().toLowerCase();
          state.object.smooth = value !== "0" && value !== "off";
        } else {
          // ZBrush can produce "s" lines #11707
          state.object.smooth = true;
        }

        var material = state.object.currentMaterial();
        if (material) material.smooth = state.object.smooth;
      } else {
        // Handle null terminated files without exception
        if (line === "\0") continue;
        console.warn('ObjDataParser: Unexpected line: "' + line + '"');
      }
    }

    state.finalize();
    return state.objects;
  };
}



/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("6155");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });