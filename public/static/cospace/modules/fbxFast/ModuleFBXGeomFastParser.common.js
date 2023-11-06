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

/***/ "0063":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * thanks for threejs LoaderUtils module.
 */

class LoaderUtils {
  static decodeText(array) {
    if (typeof TextDecoder !== 'undefined') {
      return new TextDecoder().decode(array);
    } // Avoid the String.fromCharCode.apply(null, array) shortcut, which
    // throws a "maximum call stack size exceeded" error for large arrays.


    let s = '';

    for (let i = 0, il = array.length; i < il; i++) {
      // Implicitly assumes little-endian.
      s += String.fromCharCode(array[i]);
    }

    try {
      // merges multi-byte utf-8 characters.
      return decodeURIComponent(escape(s));
    } catch (e) {
      // see #16358
      return s;
    }
  }

  static extractUrlBase(url) {
    const index = url.lastIndexOf('/');
    if (index === -1) return './';
    return url.substr(0, index + 1);
  }

  static resolveURL(url, path) {
    // Invalid URL
    if (typeof url !== 'string' || url === '') return ''; // Host Relative URL

    if (/^https?:\/\//i.test(path) && /^\//.test(url)) {
      path = path.replace(/(^https?:\/\/[^\/]+).*/i, '$1');
    } // Absolute URL http://,https://,//


    if (/^(https?:)?\/\//i.test(url)) return url; // Data URI

    if (/^data:.*,.*$/i.test(url)) return url; // Blob URL

    if (/^blob:.*$/i.test(url)) return url; // Relative URL

    return path + url;
  }

}

exports.LoaderUtils = LoaderUtils;

/***/ }),

/***/ "026b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const HttpFileLoader_1 = __webpack_require__("5b39");

const Utils_1 = __webpack_require__("f689");

const Utils_2 = __webpack_require__("f689");

const BufferBinaryParser_1 = __webpack_require__("937b");

const TextParser_1 = __webpack_require__("9259");

const FBXTreeBufferParser_1 = __webpack_require__("8b17");

class FBXBufferLoader {
  constructor() {
    this.m_loader = new HttpFileLoader_1.HttpFileLoader();
    this.m_parseOnLoad = null;
    this.m_parseIndex = 0;
    this.m_url = "";
    this.m_tidGeom = -1;
    this.m_tidBin = -1;
  }

  load(url, onLoad, onProgress = null, onError = null) {
    this.m_loader.load(url, (buf, url) => {
      let modelMap = new Map();
      let bufferMap = this.parseGeometry(buf, url); // console.log("###XXX bufferMap: ", bufferMap);

      for (let [key, value] of bufferMap) {
        modelMap.set(key, value.toGeometryModel());
      }

      if (onLoad != null) {
        onLoad(modelMap, url);
      }
    }, onProgress, (status, url) => {
      console.error("load fbx data error, url: ", url);

      if (onError != null) {
        onError(status, url);
      }
    });
  }

  parseGeometry(buffer, path) {
    // console.log("FBXBufferLoader::parseGeomdtry(), buffer.byteLength: ", buffer.byteLength);
    // console.log("FBXBufferLoader::parseGeomdtry(), isFbxFormatBinary( buffer ): ", isFbxFormatBinary( buffer ));
    let fbxTree;

    if (Utils_2.isFbxFormatBinary(buffer)) {
      this.m_binParser = new BufferBinaryParser_1.BufferBinaryParser();
      fbxTree = this.m_binParser.parse(buffer);
    } else {
      const FBXText = Utils_1.convertArrayBufferToString(buffer);

      if (!Utils_1.isFbxFormatASCII(FBXText)) {
        throw new Error('FBXBufferLoader: Unknown format.');
      }

      if (Utils_1.getFbxVersion(FBXText) < 7000) {
        throw new Error('FBXBufferLoader: FBX version not supported, FileVersion: ' + Utils_1.getFbxVersion(FBXText));
      }

      fbxTree = new TextParser_1.TextParser().parse(FBXText);
    }

    this.m_fbxTreeBufParser = new FBXTreeBufferParser_1.FBXTreeBufferParser();
    return this.m_fbxTreeBufParser.parse(fbxTree, this.m_binParser.getReader());
  }

  loadBySteps(url, onLoad, onProgress = null, onError = null) {
    if (this.m_fbxTreeBufParser == null) {
      this.m_loader.load(url, (buf, url) => {
        this.m_parseOnLoad = onLoad;
        this.m_parseIndex = 0;
        this.m_url = url;
        this.parseGeometryBySteps(buf, url);
      }, onProgress, (status, url) => {
        console.error("load fbx data error, url: ", url);

        if (onError != null) {
          onError(status, url);
        }
      });
    } else {
      console.error("正在解析中，请稍后");
    }
  }

  parseBufBySteps(buf, url, onLoad) {
    this.m_parseOnLoad = onLoad;
    this.m_parseIndex = 0;
    this.m_url = url;
    this.parseGeometryBySteps(buf, url);
  }

  updateGeomParse() {
    let delay = 50; // 20 fps

    if (this.m_tidGeom > -1) {
      clearTimeout(this.m_tidGeom);
    }

    if (this.m_fbxTreeBufParser != null && this.m_fbxTreeBufParser.isParsing()) {
      let id = this.m_fbxTreeBufParser.getGeomBufId();
      let model = this.m_fbxTreeBufParser.parseGeomBufNext();
      this.m_parseIndex++;
      let tot = this.m_fbxTreeBufParser.getParseTotal();
      let onLoad = this.m_parseOnLoad;

      if (this.m_parseIndex < this.m_fbxTreeBufParser.getParseTotal()) {
        this.m_tidGeom = setTimeout(this.updateGeomParse.bind(this), delay);
      } else {
        this.m_parseOnLoad = null;
        this.m_fbxTreeBufParser = null;
      }

      onLoad(model.toGeometryModel(), model, this.m_parseIndex - 1, tot, this.m_url);
    }
  }

  startupParseGeom() {
    // console.log("FBXBufferLoader::startupParseGeom()...");
    this.m_tidGeom = setTimeout(this.updateGeomParse.bind(this), 30); // let model = this.m_fbxTreeBufParser.parseGeomBufAt( 7 );
    // this.m_parseIndex++;
    // let tot = this.m_fbxTreeBufParser.getParseTotal();
    // let onLoad = this.m_parseOnLoad;
    // onLoad(model.toGeometryModel(), model, this.m_parseIndex-1, tot, this.m_url);
  }

  parseModelAt(i) {// let model = this.m_fbxTreeBufParser.parseGeomBufAt( i );
    // this.m_parseIndex++;
    // let tot = this.m_fbxTreeBufParser.getParseTotal();
    // let onLoad = this.m_parseOnLoad;
    // onLoad(model.toGeometryModel(), model, this.m_parseIndex-1, tot, this.m_url);
  }

  updateBinParse() {
    if (this.m_tidBin > -1) {
      clearTimeout(this.m_tidBin);
    }

    let delay = 20; // 50 fps

    if (this.m_binParser != null) {
      this.m_binParser.parseNext();

      if (this.m_binParser.isParsing()) {
        this.m_tidBin = setTimeout(this.updateBinParse.bind(this), delay);
      } else {
        this.m_fbxTreeBufParser = new FBXTreeBufferParser_1.FBXTreeBufferParser();
        this.m_fbxTreeBufParser.parseBegin(this.m_binParser.getFBXTree(), this.m_binParser.getReader());

        if (this.m_fbxTreeBufParser != null) {
          this.startupParseGeom();
        } // console.log("##$$$ ############ parse bin end, totalBP: ", this.m_binParser.totalBP, this.m_binParser.totalBPTime);


        this.m_binParser = null;
      }
    }
  }

  parseGeometryBySteps(buffer, path) {
    // console.log("FBXBufferLoader::parseGeomdtry(), buffer.byteLength: ", buffer.byteLength);
    // console.log("FBXBufferLoader::parseGeomdtry(), isFbxFormatBinary( buffer ): ", isFbxFormatBinary( buffer ));
    let fbxTree;

    if (Utils_2.isFbxFormatBinary(buffer)) {
      this.m_binParser = new BufferBinaryParser_1.BufferBinaryParser();
      this.m_binParser.parseBegin(buffer);
      this.m_tidBin = setTimeout(this.updateBinParse.bind(this), 18);
    } else {
      const FBXText = Utils_1.convertArrayBufferToString(buffer);

      if (!Utils_1.isFbxFormatASCII(FBXText)) {
        throw new Error('FBXBufferLoader: Unknown format.');
      }

      if (Utils_1.getFbxVersion(FBXText) < 7000) {
        throw new Error('FBXBufferLoader: FBX version not supported, FileVersion: ' + Utils_1.getFbxVersion(FBXText));
      }

      fbxTree = new TextParser_1.TextParser().parse(FBXText);
      this.m_fbxTreeBufParser = new FBXTreeBufferParser_1.FBXTreeBufferParser();
      this.m_fbxTreeBufParser.parseBegin(fbxTree, null);
    }
  }

}

exports.FBXBufferLoader = FBXBufferLoader;

/***/ }),

/***/ "1280":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const Utils_1 = __webpack_require__("f689");

const FBXBufferObject_1 = __webpack_require__("8310");

const ElementGeomData_1 = __webpack_require__("5ab6");

const BufPropertyParser_1 = __webpack_require__("c758"); // parse Geometry data from FBXTree and return map of BufferGeometries


class GeometryBufferParser {
  constructor() {
    this.m_parseTotal = 0;
    this.m_reader = null;
    this.m_bufPpt = new BufPropertyParser_1.BufPropertyParser();
    this.m_egd = new ElementGeomData_1.ElementGeomData();
  }

  setReader(reader) {
    this.m_reader = reader;
  }

  parseGeomBuf(deformers, fbxTree, connections, immediate = true) {
    const geometryMap = new Map();

    if ('Geometry' in fbxTree.Objects) {
      const geoNodes = fbxTree.Objects.Geometry;
      let id = 0;
      let idLst = [];
      let nodeIDList = [];
      this.m_idLst = idLst;
      this.m_nodeIDList = nodeIDList; // for ( const nodeID in geoNodes ) {
      // 	id = parseInt( nodeID );
      // 	const relationships = connections.get( id );
      // 	const geoBuf = this.parseGeometryBuffer( relationships, geoNodes[ nodeID ], deformers, fbxTree );
      // 	geometryMap.set( id, geoBuf );
      // }

      for (const nodeID in geoNodes) {
        idLst.push(parseInt(nodeID));
        nodeIDList.push(nodeID);
      }

      for (let i = 0; i < idLst.length; ++i) {
        id = idLst[i];
        const relationships = connections.get(id);
        const geoBuf = this.parseGeometryBuffer(relationships, geoNodes[nodeIDList[i]], deformers, fbxTree);
        geometryMap.set(id, geoBuf);
      } // console.log("geoInfo.vertexIndices.length: ", geoInfo.vertexIndices.length);
      // console.log("geometryMap: ",geometryMap);

    }

    return geometryMap;
  }

  parseGeomBufBegin(deformers, fbxTree, connections) {
    //const geometryMap: Map<number, FBXBufferObject> = new Map();
    if ('Geometry' in fbxTree.Objects) {
      this.m_deformers = deformers;
      this.m_fbxTree = fbxTree;
      this.m_connections = connections;
      this.m_idLst = [];
      this.m_nodeIDList = [];
      const geoNodes = fbxTree.Objects.Geometry;

      for (const nodeID in geoNodes) {
        let geoNode = geoNodes[nodeID]; // if(geoNode.attrType != "NurbsCurve") {

        if (geoNode.attrType == "Mesh") {
          this.m_idLst.push(parseInt(nodeID));
          this.m_nodeIDList.push(nodeID);
        }
      }

      this.m_parseTotal = this.m_idLst.length;
    } //return geometryMap;

  }

  getGeomBufId() {
    if (this.isParsing()) {
      return this.m_idLst[this.m_idLst.length - 1];
    }

    return -1;
  }

  parseGeomBufNext() {
    // console.log("GeometryBufferParser::parseGeomBufNext(), this.isParsing(): ",this.isParsing());
    if (this.isParsing()) {
      const geoNodes = this.m_fbxTree.Objects.Geometry;
      let id = this.m_idLst.pop();
      let ID = this.m_nodeIDList.pop(); // let geoNode = geoNodes[ ID ];
      // console.log("GeometryBufferParser::parseGeomBufNext(), ID: ",ID, geoNodes[ ID ]);

      const relationships = this.m_connections.get(id);
      let obj = this.parseGeometryBuffer(relationships, geoNodes[ID], this.m_deformers, this.m_fbxTree); // if(geoNode.attrType == "NurbsCurve") {
      // 	//console.log();
      // }

      if (obj != null) {
        obj.ID = ID;
        obj.id = id;
      }

      if (!this.isParsing()) {
        this.m_reader = null;
      }

      return obj;
    }

    return null;
  }

  parseGeomBufAt(i) {
    if (i >= 0 && i < this.m_idLst.length) {
      if (this.isParsing()) {
        const geoNodes = this.m_fbxTree.Objects.Geometry;
        let id = this.m_idLst[i];
        let ID = this.m_nodeIDList[i];
        const relationships = this.m_connections.get(id);
        let obj = this.parseGeometryBuffer(relationships, geoNodes[ID], this.m_deformers, this.m_fbxTree);

        if (obj != null) {
          obj.ID = ID;
          obj.id = id;
        }

        if (!this.isParsing()) {
          this.m_reader = null;
        }

        return obj;
      }
    }

    return null;
  }

  isParsing() {
    return this.m_idLst != null && this.m_idLst.length > 0;
  }

  getParseTotal() {
    return this.m_parseTotal;
  } // Parse single node in FBXTree.Objects.Geometry


  parseGeometryBuffer(relationships, geoNode, deformers, fbxTree) {
    switch (geoNode.attrType) {
      case 'Mesh':
        return this.parseMeshGeometryBuffer(relationships, geoNode, deformers, fbxTree);
        break;

      case 'NurbsCurve':
        return this.parseNurbsGeometry(geoNode);
        break;
    }
  } // Parse single node mesh geometry in FBXTree.Objects.Geometry


  parseMeshGeometryBuffer(relationships, geoNode, deformers, fbxTree) {
    //console.log("GeometryBufferParser::genGeometryBuffers(), skeleton: ",skeleton);
    // let time = Date.now();
    console.log("geoNode: ", geoNode);
    const geoInfo = this.parseGeoNode(geoNode); // let lossTime: number = Date.now() - time;
    // console.log("XXX geoInfo lossTime: ", lossTime);

    const obj = this.getBufObj(geoInfo); // console.log("GeometryBufferParser::genGeometryBuffers(), buffers: ",buffers);

    return obj;
  }

  parseGeoNode(geoNode) {
    const geoInfo = {};
    geoInfo.vertexPositions = geoNode.Vertices !== undefined ? geoNode.Vertices.a : [];
    geoInfo.vertexIndices = geoNode.PolygonVertexIndex !== undefined ? geoNode.PolygonVertexIndex.a : []; // if ( geoNode.LayerElementColor ) {
    // 	geoInfo.color = this.parseVertexColors( geoNode.LayerElementColor[ 0 ] );
    // }
    // if ( geoNode.LayerElementMaterial ) {
    // 	geoInfo.material = this.parseMaterialIndices( geoNode.LayerElementMaterial[ 0 ] );
    // }

    if (geoNode.LayerElementNormal) {
      geoInfo.normal = this.parseNormals(geoNode.LayerElementNormal[0]);
    }

    if (geoNode.LayerElementUV) {
      geoInfo.uv = [];
      let i = 0;

      while (geoNode.LayerElementUV[i]) {
        if (geoNode.LayerElementUV[i].UV) {
          geoInfo.uv.push(this.parseUVs(geoNode.LayerElementUV[i]));
        }

        i++;
      }
    }

    geoInfo.weightTable = {};
    return geoInfo;
  }

  parseData(params) {
    return this.m_bufPpt.parseDirec(this.m_reader, params);
  }

  getBufObj(geoInfo) {
    let polygonIndex = 0;
    let faceLength = 0;
    let facePositionIndexes = new Array(36);
    let faceNormals = new Array(36);
    let faceColors = new Array(36);
    let faceUVs = null;
    let faceWeights = [];
    let faceWeightIndices = [];
    let uvList = geoInfo.uv;
    let advancedModel = geoInfo.vertexPositions.length == 5;

    if (advancedModel) {
      // console.log("advancedModel, geoInfo: ", geoInfo);
      geoInfo.vertexIndices = this.parseData(geoInfo.vertexIndices);
      geoInfo.vertexPositions = this.parseData(geoInfo.vertexPositions);

      if (geoInfo.normal != null || geoInfo.normal != undefined) {
        geoInfo.normal.buffer = this.parseData(geoInfo.normal.buffer);
        geoInfo.normal.indices = this.parseData(geoInfo.normal.indices);
      } else {
        geoInfo.normal = null;
      }

      if (uvList != null && uvList.length > 0) {
        uvList[0].buffer = this.parseData(uvList[0].buffer);
      } // console.log("A0 geoInfo: ", geoInfo);


      return this.m_egd.createBufObject(geoInfo);
    } // console.log("A1 geoInfo: ", geoInfo);
    // console.log("VVV-XXX advancedModel is False.");


    const bufObj = new FBXBufferObject_1.FBXBufferObject();
    bufObj.isEntity = true;
    let vivs = geoInfo.vertexIndices; // let vvs = geoInfo.vertexPositions;
    // console.log("geoInfo.vertexIndices: ", geoInfo.vertexIndices);
    // console.log("geoInfo.vertexPositions: ", vvs);
    // console.log("geoInfo normal: ", geoInfo.normal.buffer);
    // console.log("geoInfo uv[0]: ", geoInfo.uv[0].buffer);
    // console.log("geoInfo.vertexIndices.length: ", geoInfo.vertexIndices.length);
    // let normalData: number[] = new Array(vvs.length);

    let oivsLen = geoInfo.vertexIndices.length; //console.log("XXX oivsLen: ",oivsLen);

    let time = Date.now();
    let materialIndex = 0; // let miBoo = geoInfo.material && geoInfo.material.mappingType !== 'AllSame';

    let trisTotal = 0;

    for (let i = 0; i < oivsLen; ++i) {
      faceLength++;

      if (vivs[i] < 0) {
        trisTotal += faceLength - 2;
        faceLength = 0;
      }
    }

    let vsLen = trisTotal * 9;
    bufObj.vertex = new Float32Array(vsLen);
    bufObj.normal = new Float32Array(vsLen);
    let uvs = bufObj.uvs;
    let guvLen = 0;
    let guv = null;

    if (geoInfo.uv) {
      guvLen = geoInfo.uv.length;
      guv = geoInfo.uv;
      faceUVs = [];

      for (let j = 0; j < guvLen; ++j) {
        faceUVs.push(new Array(36));
        uvs[j] = new Float32Array(trisTotal * 6);
      }

      bufObj.uvs = uvs;
    }

    let lossTimeA = Date.now() - time;
    faceLength = 0;

    for (let i = 0; i < oivsLen; ++i) {
      let endOfFace = false;
      let vertexIndex = vivs[i];

      if (vertexIndex < 0) {
        vertexIndex = vertexIndex ^ -1; // equivalent to ( x * -1 ) - 1

        endOfFace = true;
      }

      let fi = faceLength * 3;
      const a = vertexIndex * 3; // facePositionIndexes.push( a, a + 1, a + 2 );

      facePositionIndexes[fi] = a;
      facePositionIndexes[fi + 1] = a + 1;
      facePositionIndexes[fi + 2] = a + 2; // if ( geoInfo.color ) {
      // 	const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color );
      // 	//faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );
      // faceColors[fi] = data[0];
      // faceColors[fi+1] = data[1];
      // faceColors[fi+2] = data[2];
      // }

      if (geoInfo.normal) {
        //console.log("calc normal: ",geoInfo.normal.mappingType);
        const data = Utils_1.getData(i, polygonIndex, vertexIndex, geoInfo.normal); // faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );

        faceNormals[fi] = data[0];
        faceNormals[fi + 1] = data[1];
        faceNormals[fi + 2] = data[2]; // normalData[a] = data[0];
        // normalData[a+1] = data[1];
        // normalData[a+2] = data[2];
      }

      if (guv != null) {
        fi = faceLength * 2;

        for (let j = 0; j < guvLen; ++j) {
          const data = Utils_1.getData(i, polygonIndex, vertexIndex, guv[j]);
          faceUVs[j][fi] = data[0];
          faceUVs[j][fi + 1] = data[1];
        }
      }

      faceLength++;

      if (endOfFace) {
        // console.log("facePositionIndexes: ",facePositionIndexes);
        this.genFace(bufObj, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength);
        polygonIndex++;
        faceLength = 0; // faceWeights = [];
        // faceWeightIndices = [];
      }
    }

    ;
    let lossTime = Date.now() - time; // console.log("XXX normalData: ",normalData);

    console.log("XXX lossTime: ", lossTime, ",preCompute lossTime: ", lossTimeA);
    console.log("XXX vertex.length:", bufObj.vertex.length, ", vsLen:", vsLen, ", oivsLen:", oivsLen);

    if (oivsLen > 2000000) {
      console.log("XXX larger geom vertices total.....");
    } // buffers.indices = indices;
    // //pvs
    // buffers.indices = pvs.length <= 65535 ? new Uint16Array(pvs) : new Uint32Array(pvs);


    return bufObj;
  } // Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris


  genFace(bufObj, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength) {
    console.log("XXXX genFace() bufObj.uvs: ", bufObj.uvs);
    let vps = geoInfo.vertexPositions;
    let vs = bufObj.vertex;
    let nvs = bufObj.normal;
    let uvs = bufObj.uvs;
    let i3 = bufObj.i3;
    let i2 = bufObj.i2; // let colorBoo = geoInfo.color != null;

    let normalBoo = geoInfo.normal != null;
    let uvBoo = geoInfo.uv != null; // let miBoo = geoInfo.material && geoInfo.material.mappingType !== 'AllSame';

    for (let i = 2; i < faceLength; i++) {
      vs[i3] = vps[facePositionIndexes[0]];
      vs[i3 + 1] = vps[facePositionIndexes[1]];
      vs[i3 + 2] = vps[facePositionIndexes[2]];
      vs[i3 + 3] = vps[facePositionIndexes[(i - 1) * 3]];
      vs[i3 + 4] = vps[facePositionIndexes[(i - 1) * 3 + 1]];
      vs[i3 + 5] = vps[facePositionIndexes[(i - 1) * 3 + 2]];
      vs[i3 + 6] = vps[facePositionIndexes[i * 3]];
      vs[i3 + 7] = vps[facePositionIndexes[i * 3 + 1]];
      vs[i3 + 8] = vps[facePositionIndexes[i * 3 + 2]]; // if ( colorBoo ) {
      // 	bufObj.colors.push( faceColors[ 0 ] );
      // 	bufObj.colors.push( faceColors[ 1 ] );
      // 	bufObj.colors.push( faceColors[ 2 ] );
      // 	bufObj.colors.push( faceColors[ ( i - 1 ) * 3 ] );
      // 	bufObj.colors.push( faceColors[ ( i - 1 ) * 3 + 1 ] );
      // 	bufObj.colors.push( faceColors[ ( i - 1 ) * 3 + 2 ] );
      // 	bufObj.colors.push( faceColors[ i * 3 ] );
      // 	bufObj.colors.push( faceColors[ i * 3 + 1 ] );
      // 	bufObj.colors.push( faceColors[ i * 3 + 2 ] );
      // }

      if (normalBoo) {
        nvs[i3] = faceNormals[0];
        nvs[i3 + 1] = faceNormals[1];
        nvs[i3 + 2] = faceNormals[2];
        nvs[i3 + 3] = faceNormals[(i - 1) * 3];
        nvs[i3 + 4] = faceNormals[(i - 1) * 3 + 1];
        nvs[i3 + 5] = faceNormals[(i - 1) * 3 + 2];
        nvs[i3 + 6] = faceNormals[i * 3];
        nvs[i3 + 7] = faceNormals[i * 3 + 1];
        nvs[i3 + 8] = faceNormals[i * 3 + 2];
      }

      if (uvBoo) {
        const guv = geoInfo.uv;

        for (let j = 0, jl = guv.length; j < jl; j++) {
          const fuvs = faceUVs[j];
          const puvs = uvs[j];
          puvs[i2] = fuvs[0];
          puvs[i2 + 1] = fuvs[1];
          puvs[i2 + 2] = fuvs[(i - 1) * 2];
          puvs[i2 + 3] = fuvs[(i - 1) * 2 + 1];
          puvs[i2 + 4] = fuvs[i * 2];
          puvs[i2 + 5] = fuvs[i * 2 + 1];
        }
      }

      i3 += 9;
      i2 += 6;
    }

    bufObj.i3 = i3;
    bufObj.i2 = i2;
    console.log("XXXX bufObj.uvs: ", bufObj.uvs);
  } // Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists


  parseNormals(NormalNode) {
    const mappingType = NormalNode.MappingInformationType;
    const referenceType = NormalNode.ReferenceInformationType;
    const buffer = NormalNode.Normals.a;
    let indexBuffer = [];

    if (referenceType === 'IndexToDirect') {
      if ('NormalIndex' in NormalNode) {
        indexBuffer = NormalNode.NormalIndex.a;
      } else if ('NormalsIndex' in NormalNode) {
        indexBuffer = NormalNode.NormalsIndex.a;
      }
    }

    return {
      dataSize: 3,
      buffer: buffer,
      indices: indexBuffer,
      mappingType: mappingType,
      referenceType: referenceType
    };
  } // Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists


  parseUVs(UVNode) {
    const mappingType = UVNode.MappingInformationType;
    const referenceType = UVNode.ReferenceInformationType;
    const buffer = UVNode.UV.a;
    let indexBuffer = [];

    if (referenceType === 'IndexToDirect') {
      indexBuffer = UVNode.UVIndex.a;
    } // console.log("parseUVs(), buffer: ", buffer);


    return {
      dataSize: 2,
      buffer: buffer,
      indices: indexBuffer,
      mappingType: mappingType,
      referenceType: referenceType
    };
  } // Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists


  parseVertexColors(ColorNode) {
    const mappingType = ColorNode.MappingInformationType;
    const referenceType = ColorNode.ReferenceInformationType;
    const buffer = ColorNode.Colors.a;
    let indexBuffer = [];

    if (referenceType === 'IndexToDirect') {
      indexBuffer = ColorNode.ColorIndex.a;
    }

    return {
      dataSize: 4,
      buffer: buffer,
      indices: indexBuffer,
      mappingType: mappingType,
      referenceType: referenceType
    };
  } // Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists


  parseMaterialIndices(MaterialNode) {
    const mappingType = MaterialNode.MappingInformationType;
    const referenceType = MaterialNode.ReferenceInformationType;

    if (mappingType === 'NoMappingInformation') {
      return {
        dataSize: 1,
        buffer: [0],
        indices: [0],
        mappingType: 'AllSame',
        referenceType: referenceType
      };
    }

    const materialIndexBuffer = MaterialNode.Materials.a; // Since materials are stored as indices, there's a bit of a mismatch between FBX and what
    // we expect.So we create an intermediate buffer that points to the index in the buffer,
    // for conforming with the other functions we've written for other data.

    const materialIndices = [];

    for (let i = 0; i < materialIndexBuffer.length; ++i) {
      materialIndices.push(i);
    }

    return {
      dataSize: 1,
      buffer: materialIndexBuffer,
      indices: materialIndices,
      mappingType: mappingType,
      referenceType: referenceType
    };
  } // Generate a NurbGeometry from a node in FBXTree.Objects.Geometry


  parseNurbsGeometry(geoNode) {
    return null;
  }

}

exports.GeometryBufferParser = GeometryBufferParser;

/***/ }),

/***/ "18c7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const EulerOrder_1 = __webpack_require__("cc7a");

const OrientationType_1 = __importDefault(__webpack_require__("abdb"));

class Matrix4 {
  constructor(pfs32 = null, index = 0) {
    this.m_uid = -1;
    this._mvx = new Vector3D_1.default();
    this._mvy = new Vector3D_1.default();
    this._mvz = new Vector3D_1.default();
    this.m_index = 0;
    this.m_fs32 = null;
    this.m_localFS32 = null;
    this.m_index = index;

    if (pfs32 != null) {
      this.m_uid = Matrix4.s_uid++;
      this.m_fs32 = pfs32;
      this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
    } else {
      this.m_uid = Matrix4.s_isolatedUid++;
      this.m_fs32 = new Float32Array(16);
      this.m_fs32.set(Matrix4.s_InitData, 0);
      this.m_localFS32 = this.m_fs32;
    }
  }

  setData(data) {
    if (data.length == 16) {
      this.m_localFS32.set(data);
    }
  }

  getCapacity() {
    return 16;
  }

  GetMaxUid() {
    return Matrix4.s_uid;
  }

  getUid() {
    return this.m_uid;
  }

  getLocalFS32() {
    return this.m_localFS32;
  }

  getFS32() {
    return this.m_fs32;
  }

  getFSIndex() {
    return this.m_index;
  }

  identity() {
    this.m_localFS32.set(Matrix4.s_InitData, 0);
  }

  determinant() {
    let lfs = this.m_localFS32;
    return (lfs[0] * lfs[5] - lfs[4] * lfs[1]) * (lfs[10] * lfs[15] - lfs[14] * lfs[11]) - (lfs[0] * lfs[9] - lfs[8] * lfs[1]) * (lfs[6] * lfs[15] - lfs[14] * lfs[7]) + (lfs[0] * lfs[13] - lfs[12] * lfs[1]) * (lfs[6] * lfs[11] - lfs[10] * lfs[7]) + (lfs[4] * lfs[9] - lfs[8] * lfs[5]) * (lfs[2] * lfs[15] - lfs[14] * lfs[3]) - (lfs[4] * lfs[13] - lfs[12] * lfs[5]) * (lfs[2] * lfs[11] - lfs[10] * lfs[3]) + (lfs[8] * lfs[13] - lfs[12] * lfs[9]) * (lfs[2] * lfs[7] - lfs[6] * lfs[3]);
  }

  multiplyMatrices(a, b) {
    const ae = a.getLocalFS32();
    const be = b.getLocalFS32();
    const fs = this.getLocalFS32();
    const a11 = ae[0],
          a12 = ae[4],
          a13 = ae[8],
          a14 = ae[12];
    const a21 = ae[1],
          a22 = ae[5],
          a23 = ae[9],
          a24 = ae[13];
    const a31 = ae[2],
          a32 = ae[6],
          a33 = ae[10],
          a34 = ae[14];
    const a41 = ae[3],
          a42 = ae[7],
          a43 = ae[11],
          a44 = ae[15];
    const b11 = be[0],
          b12 = be[4],
          b13 = be[8],
          b14 = be[12];
    const b21 = be[1],
          b22 = be[5],
          b23 = be[9],
          b24 = be[13];
    const b31 = be[2],
          b32 = be[6],
          b33 = be[10],
          b34 = be[14];
    const b41 = be[3],
          b42 = be[7],
          b43 = be[11],
          b44 = be[15];
    fs[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    fs[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    fs[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    fs[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    fs[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    fs[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    fs[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    fs[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    fs[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    fs[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    fs[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    fs[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    fs[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    fs[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    fs[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    fs[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
  }

  multiply(ma, mb = null) {
    if (ma != null && mb != null) {
      return this.multiplyMatrices(ma, mb);
    } else if (ma != null) {
      return this.multiplyMatrices(this, ma);
    }

    return this;
  }

  premultiply(m) {
    if (m != this && m != null) {
      return this.multiplyMatrices(m, this);
    }

    return this;
  }

  append(lhs) {
    let lfs32 = lhs.getLocalFS32();
    let fs = this.m_localFS32;
    let m111 = fs[0];
    let m121 = fs[4];
    let m131 = fs[8];
    let m141 = fs[12];
    let m112 = fs[1];
    let m122 = fs[5];
    let m132 = fs[9];
    let m142 = fs[13];
    let m113 = fs[2];
    let m123 = fs[6];
    let m133 = fs[10];
    let m143 = fs[14];
    let m114 = fs[3];
    let m124 = fs[7];
    let m134 = fs[11];
    let m144 = fs[15];
    let m211 = lfs32[0];
    let m221 = lfs32[4];
    let m231 = lfs32[8];
    let m241 = lfs32[12];
    let m212 = lfs32[1];
    let m222 = lfs32[5];
    let m232 = lfs32[9];
    let m242 = lfs32[13];
    let m213 = lfs32[2];
    let m223 = lfs32[6];
    let m233 = lfs32[10];
    let m243 = lfs32[14];
    let m214 = lfs32[3];
    let m224 = lfs32[7];
    let m234 = lfs32[11];
    let m244 = lfs32[15];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
    fs[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
    fs[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
    fs[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
    fs[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
    fs[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
    fs[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
    fs[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
  }

  append3x3(lhs) {
    let lfs32 = lhs.getLocalFS32();
    let fs = this.m_localFS32;
    let m111 = fs[0];
    let m121 = fs[4];
    let m131 = fs[8];
    let m112 = fs[1];
    let m122 = fs[5];
    let m132 = fs[9];
    let m113 = fs[2];
    let m123 = fs[6];
    let m133 = fs[10];
    let m211 = lfs32[0];
    let m221 = lfs32[4];
    let m231 = lfs32[8];
    let m212 = lfs32[1];
    let m222 = lfs32[5];
    let m232 = lfs32[9];
    let m213 = lfs32[2];
    let m223 = lfs32[6];
    let m233 = lfs32[10];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233;
  }

  appendRotationPivot(radian, axis, pivotPoint = null) {
    if (pivotPoint == null) {
      pivotPoint = Vector3D_1.default.Z_AXIS;
    }

    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
    this.append(Matrix4.s_tMat4);
  }

  appendRotation(radian, axis) {
    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    this.append(Matrix4.s_tMat4);
  }

  appendRotationX(radian) {
    Matrix4.s_tMat4.rotationX(radian);
    this.append3x3(Matrix4.s_tMat4);
  }

  appendRotationY(radian) {
    Matrix4.s_tMat4.rotationY(radian);
    this.append3x3(Matrix4.s_tMat4);
  }

  appendRotationZ(radian) {
    Matrix4.s_tMat4.rotationZ(radian);
    this.append3x3(Matrix4.s_tMat4);
  } // 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)


  appendRotationEulerAngle(radianX, radianY, radianZ) {
    Matrix4.s_tMat4.rotationY(radianY);
    this.append3x3(Matrix4.s_tMat4);
    Matrix4.s_tMat4.rotationX(radianX);
    this.append3x3(Matrix4.s_tMat4);
    Matrix4.s_tMat4.rotationZ(radianZ);
    this.append3x3(Matrix4.s_tMat4);
  }

  setScale(v3) {
    let fs = this.m_localFS32;
    fs[0] = v3.x;
    fs[5] = v3.y;
    fs[10] = v3.z;
    return this;
  }

  setScaleXYZ(xScale, yScale, zScale) {
    let fs = this.m_localFS32;
    fs[0] = xScale;
    fs[5] = yScale;
    fs[10] = zScale;
  }

  getScale(outV3) {
    let fs = this.m_localFS32;
    outV3.x = fs[0];
    outV3.y = fs[5];
    outV3.z = fs[10];
  }

  setRotationEulerAngle(radianX, radianY, radianZ) {
    let fs = this.m_localFS32; //let sx:number = fs[0];
    //let sy:number = fs[5];
    //let sz:number = fs[10];

    let cosX = Math.cos(radianX);
    let sinX = Math.sin(radianX);
    let cosY = Math.cos(radianY);
    let sinY = Math.sin(radianY);
    let cosZ = Math.cos(radianZ);
    let sinZ = Math.sin(radianZ);
    let cosZsinY = cosZ * sinY;
    let sinZsinY = sinZ * sinY;
    let cosYscaleX = cosY * fs[0];
    let sinXscaleY = sinX * fs[5];
    let cosXscaleY = cosX * fs[5];
    let cosXscaleZ = cosX * fs[10];
    let sinXscaleZ = sinX * fs[10];
    fs[1] = sinZ * cosYscaleX;
    fs[2] = -sinY * fs[0];
    fs[0] = cosZ * cosYscaleX;
    fs[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
    fs[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
    fs[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
    fs[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
    fs[6] = cosY * sinXscaleY;
    fs[10] = cosY * cosXscaleZ;
  }

  setRotationEulerAngle2(cosX, sinX, cosY, sinY, cosZ, sinZ) {
    let fs = this.m_localFS32; //let sx:number = fs[0];
    //let sy:number = fs[5];
    //let sz:number = fs[10];
    //	let cosX: number = Math.cos(radianX);
    //	let sinX:number = Math.sin(radianX);
    //	let cosY:number = Math.cos(radianY);
    //	let sinY:number = Math.sin(radianY);
    //	let cosZ:number = Math.cos(radianZ);
    //	let sinZ:number = Math.sin(radianZ);

    let cosZsinY = cosZ * sinY;
    let sinZsinY = sinZ * sinY;
    let cosYscaleX = cosY * fs[0];
    let sinXscaleY = sinX * fs[5];
    let cosXscaleY = cosX * fs[5];
    let cosXscaleZ = cosX * fs[10];
    let sinXscaleZ = sinX * fs[10];
    fs[1] = sinZ * cosYscaleX;
    fs[2] = -sinY * fs[0];
    fs[0] = cosZ * cosYscaleX;
    fs[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
    fs[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
    fs[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
    fs[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
    fs[6] = cosY * sinXscaleY;
    fs[10] = cosY * cosXscaleZ;
  }

  compose(position, quaternion, scale) {
    const fs = this.m_localFS32;
    const x = quaternion.x,
          y = quaternion.y,
          z = quaternion.z,
          w = quaternion.w;
    const x2 = x + x,
          y2 = y + y,
          z2 = z + z;
    const xx = x * x2,
          xy = x * y2,
          xz = x * z2;
    const yy = y * y2,
          yz = y * z2,
          zz = z * z2;
    const wx = w * x2,
          wy = w * y2,
          wz = w * z2;
    const sx = scale.x,
          sy = scale.y,
          sz = scale.z;
    fs[0] = (1 - (yy + zz)) * sx;
    fs[1] = (xy + wz) * sx;
    fs[2] = (xz - wy) * sx;
    fs[3] = 0;
    fs[4] = (xy - wz) * sy;
    fs[5] = (1 - (xx + zz)) * sy;
    fs[6] = (yz + wx) * sy;
    fs[7] = 0;
    fs[8] = (xz + wy) * sz;
    fs[9] = (yz - wx) * sz;
    fs[10] = (1 - (xx + yy)) * sz;
    fs[11] = 0;
    fs[12] = position.x;
    fs[13] = position.y;
    fs[14] = position.z;
    fs[15] = 1;
    return this;
  }

  makeRotationFromQuaternion(q) {
    return this.compose(Vector3D_1.default.ZERO, q, Vector3D_1.default.ONE);
  }

  makeRotationFromEuler(euler) {
    if (euler == null) {
      console.error('Matrix4::makeRotationFromEuler() now expects a Euler rotation rather than a Vector3D and order.');
    }

    const fs = this.m_localFS32;
    const x = euler.x,
          y = euler.y,
          z = euler.z;
    const a = Math.cos(x),
          b = Math.sin(x);
    const c = Math.cos(y),
          d = Math.sin(y);
    const e = Math.cos(z),
          f = Math.sin(z);

    if (euler.order === EulerOrder_1.EulerOrder.XYZ) {
      const ae = a * e,
            af = a * f,
            be = b * e,
            bf = b * f;
      fs[0] = c * e;
      fs[4] = -c * f;
      fs[8] = d;
      fs[1] = af + be * d;
      fs[5] = ae - bf * d;
      fs[9] = -b * c;
      fs[2] = bf - ae * d;
      fs[6] = be + af * d;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.YXZ) {
      const ce = c * e,
            cf = c * f,
            de = d * e,
            df = d * f;
      fs[0] = ce + df * b;
      fs[4] = de * b - cf;
      fs[8] = a * d;
      fs[1] = a * f;
      fs[5] = a * e;
      fs[9] = -b;
      fs[2] = cf * b - de;
      fs[6] = df + ce * b;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.ZXY) {
      const ce = c * e,
            cf = c * f,
            de = d * e,
            df = d * f;
      fs[0] = ce - df * b;
      fs[4] = -a * f;
      fs[8] = de + cf * b;
      fs[1] = cf + de * b;
      fs[5] = a * e;
      fs[9] = df - ce * b;
      fs[2] = -a * d;
      fs[6] = b;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.ZYX) {
      const ae = a * e,
            af = a * f,
            be = b * e,
            bf = b * f;
      fs[0] = c * e;
      fs[4] = be * d - af;
      fs[8] = ae * d + bf;
      fs[1] = c * f;
      fs[5] = bf * d + ae;
      fs[9] = af * d - be;
      fs[2] = -d;
      fs[6] = b * c;
      fs[10] = a * c;
    } else if (euler.order === EulerOrder_1.EulerOrder.YZX) {
      const ac = a * c,
            ad = a * d,
            bc = b * c,
            bd = b * d;
      fs[0] = c * e;
      fs[4] = bd - ac * f;
      fs[8] = bc * f + ad;
      fs[1] = f;
      fs[5] = a * e;
      fs[9] = -b * e;
      fs[2] = -d * e;
      fs[6] = ad * f + bc;
      fs[10] = ac - bd * f;
    } else if (euler.order === EulerOrder_1.EulerOrder.XZY) {
      const ac = a * c,
            ad = a * d,
            bc = b * c,
            bd = b * d;
      fs[0] = c * e;
      fs[4] = -f;
      fs[8] = d * e;
      fs[1] = ac * f + bd;
      fs[5] = a * e;
      fs[9] = ad * f - bc;
      fs[2] = bc * f - ad;
      fs[6] = b * e;
      fs[10] = bd * f + ac;
    } // reset bottom row


    fs[3] = 0;
    fs[7] = 0;
    fs[11] = 0; // reset last column

    fs[12] = 0;
    fs[13] = 0;
    fs[14] = 0;
    fs[15] = 1;
    return this;
  }

  extractRotation(m) {
    // this method does not support reflection matrices
    const fs = this.m_localFS32;
    const me = m.getLocalFS32();
    const v3 = Matrix4.m_v3;
    m.copyColumnTo(0, v3);
    const scaleX = 1.0 / v3.getLength();
    m.copyColumnTo(1, v3);
    const scaleY = 1.0 / v3.getLength();
    m.copyColumnTo(2, v3);
    const scaleZ = 1.0 / v3.getLength();
    fs[0] = me[0] * scaleX;
    fs[1] = me[1] * scaleX;
    fs[2] = me[2] * scaleX;
    fs[3] = 0;
    fs[4] = me[4] * scaleY;
    fs[5] = me[5] * scaleY;
    fs[6] = me[6] * scaleY;
    fs[7] = 0;
    fs[8] = me[8] * scaleZ;
    fs[9] = me[9] * scaleZ;
    fs[10] = me[10] * scaleZ;
    fs[11] = 0;
    fs[12] = 0;
    fs[13] = 0;
    fs[14] = 0;
    fs[15] = 1;
    return this;
  }

  copyTranslation(m) {
    const fs = this.m_localFS32,
          me = m.getLocalFS32();
    fs[12] = me[12];
    fs[13] = me[13];
    fs[14] = me[14];
    return this;
  }

  setTranslationXYZ(px, py, pz) {
    this.m_localFS32[12] = px;
    this.m_localFS32[13] = py;
    this.m_localFS32[14] = pz;
  }

  setTranslation(v3) {
    this.m_localFS32[12] = v3.x;
    this.m_localFS32[13] = v3.y;
    this.m_localFS32[14] = v3.z;
  }

  appendScaleXYZ(xScale, yScale, zScale) {
    const fs = this.m_localFS32;
    fs[0] *= xScale;
    fs[1] *= xScale;
    fs[2] *= xScale;
    fs[3] *= xScale;
    fs[4] *= yScale;
    fs[5] *= yScale;
    fs[6] *= yScale;
    fs[7] *= yScale;
    fs[8] *= zScale;
    fs[9] *= zScale;
    fs[10] *= zScale;
    fs[11] *= zScale;
  }

  appendScaleXY(xScale, yScale) {
    const fs = this.m_localFS32;
    fs[0] *= xScale;
    fs[1] *= xScale;
    fs[2] *= xScale;
    fs[3] *= xScale;
    fs[4] *= yScale;
    fs[5] *= yScale;
    fs[6] *= yScale;
    fs[7] *= yScale;
  }

  appendTranslationXYZ(px, py, pz) {
    this.m_localFS32[12] += px;
    this.m_localFS32[13] += py;
    this.m_localFS32[14] += pz;
  }

  appendTranslation(v3) {
    this.m_localFS32[12] += v3.x;
    this.m_localFS32[13] += v3.y;
    this.m_localFS32[14] += v3.z;
  }

  copyColumnFrom(column_index, v3) {
    const fs = this.m_localFS32;

    switch (column_index) {
      case 0:
        {
          fs[0] = v3.x;
          fs[1] = v3.y;
          fs[2] = v3.z;
          fs[3] = v3.w;
        }
        break;

      case 1:
        {
          fs[4] = v3.x;
          fs[5] = v3.y;
          fs[6] = v3.z;
          fs[7] = v3.w;
        }
        break;

      case 2:
        {
          fs[8] = v3.x;
          fs[9] = v3.y;
          fs[10] = v3.z;
          fs[11] = v3.w;
        }
        break;

      case 3:
        {
          fs[12] = v3.x;
          fs[13] = v3.y;
          fs[14] = v3.z;
          fs[15] = v3.w;
        }
        break;

      default:
        break;
    }
  }

  copyColumnTo(column_index, outV3) {
    const fs = this.m_localFS32;
    column_index <<= 2;
    outV3.x = fs[column_index];
    outV3.y = fs[1 + column_index];
    outV3.z = fs[2 + column_index];
    outV3.w = fs[3 + column_index];
  }

  setF32ArrAndIndex(fs32Arr, index = 0) {
    if (fs32Arr != null && index >= 0) {
      this.m_fs32 = fs32Arr;
      this.m_index = index;
      this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
    }
  }

  setF32ArrIndex(index = 0) {
    if (index >= 0) {
      this.m_index = index;
      this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
    }
  }

  setF32Arr(fs32Arr) {
    if (fs32Arr != null) {
      this.m_fs32 = fs32Arr;
    }
  }

  copyFromF32Arr(fs32Arr, index = 0) {
    //let subArr:Float32Array = fs32Arr.subarray(index, index + 16);
    //this.m_localFS32.set(fs32Arr.subarray(index, index + 16), 0);
    let i = 0;

    for (let end = index + 16; index < end; index++) {
      this.m_localFS32[i] = fs32Arr[index];
      ++i;
    }
  }

  copyToF32Arr(fs32Arr, index = 0) {
    fs32Arr.set(this.m_localFS32, index);
  }

  copy(smat) {
    this.m_localFS32.set(smat.getLocalFS32(), 0);
    return this;
  }

  copyFrom(smat) {
    this.m_localFS32.set(smat.getLocalFS32(), 0);
  }

  copyTo(dmat) {
    //dmat.copyFrom(this);
    dmat.getLocalFS32().set(this.getLocalFS32(), 0);
  }

  copyRawDataFrom(float_rawDataArr, rawDataLength = 16, index = 0, bool_tp = false) {
    if (bool_tp) this.transpose();
    rawDataLength = rawDataLength - index;
    let c = 0;

    while (c < rawDataLength) {
      this.m_fs32[this.m_index + c] = float_rawDataArr[c + index];
      ++c;
    }

    if (bool_tp) this.transpose();
  }

  copyRawDataTo(float_rawDataArr, rawDataLength = 16, index = 0, bool_tp = false) {
    if (bool_tp) this.transpose();
    let c = 0;

    while (c < rawDataLength) {
      float_rawDataArr[c + index] = this.m_fs32[this.m_index + c];
      ++c;
    }

    if (bool_tp) this.transpose();
  }

  copyRowFrom(row_index, v3) {
    const fs = this.m_localFS32;

    switch (row_index) {
      case 0:
        {
          fs[0] = v3.x;
          fs[4] = v3.y;
          fs[8] = v3.z;
          fs[12] = v3.w;
        }
        break;

      case 1:
        {
          fs[1] = v3.x;
          fs[5] = v3.y;
          fs[9] = v3.z;
          fs[13] = v3.w;
        }
        break;

      case 2:
        {
          fs[2] = v3.x;
          fs[6] = v3.y;
          fs[10] = v3.z;
          fs[14] = v3.w;
        }
        break;

      case 3:
        {
          fs[3] = v3.x;
          fs[7] = v3.y;
          fs[11] = v3.z;
          fs[15] = v3.w;
        }
        break;

      default:
        break;
    }
  }

  copyRowTo(row_index, v3) {
    const fs = this.m_localFS32;
    v3.x = fs[row_index];
    v3.y = fs[4 + row_index];
    v3.z = fs[8 + row_index];
    v3.w = fs[12 + row_index];
  }
  /**
   * @param orientationStyle the value example: OrientationType.EULER_ANGLES
   * @returns [position, rotation, scale]
   */


  decompose(orientationStyle) {
    // TODO: optimize after 4 lines
    let vec = [];
    let mr = Matrix4.s_tMat4;
    let rfs = mr.getLocalFS32(); //let mrfsI = mr.getFSIndex();
    //std::memcpy(&mr, m_rawData, m_rawDataSize);

    mr.copyFrom(this); ///*

    let pos = new Vector3D_1.default(rfs[12], rfs[13], rfs[14]);
    let scale = new Vector3D_1.default();
    scale.x = Math.sqrt(rfs[0] * rfs[0] + rfs[1] * rfs[1] + rfs[2] * rfs[2]);
    scale.y = Math.sqrt(rfs[4] * rfs[4] + rfs[5] * rfs[5] + rfs[6] * rfs[6]);
    scale.z = Math.sqrt(rfs[8] * rfs[8] + rfs[9] * rfs[9] + rfs[10] * rfs[10]);
    if (rfs[0] * (rfs[5] * rfs[10] - rfs[6] * rfs[9]) - rfs[1] * (rfs[4] * rfs[10] - rfs[6] * rfs[8]) + rfs[2] * (rfs[4] * rfs[9] - rfs[5] * rfs[8]) < 0) scale.z = -scale.z;
    rfs[0] /= scale.x;
    rfs[1] /= scale.x;
    rfs[2] /= scale.x;
    rfs[4] /= scale.y;
    rfs[5] /= scale.y;
    rfs[6] /= scale.y;
    rfs[8] /= scale.z;
    rfs[9] /= scale.z;
    rfs[10] /= scale.z;
    let rot = new Vector3D_1.default();

    switch (orientationStyle) {
      case OrientationType_1.default.AXIS_ANGLE:
        {
          rot.w = MathConst_1.default.SafeACos((rfs[0] + rfs[5] + rfs[10] - 1) / 2);
          let len = Math.sqrt((rfs[6] - rfs[9]) * (rfs[6] - rfs[9]) + (rfs[8] - rfs[2]) * (rfs[8] - rfs[2]) + (rfs[1] - rfs[4]) * (rfs[1] - rfs[4]));

          if (len > MathConst_1.default.MATH_MIN_POSITIVE) {
            rot.x = (rfs[6] - rfs[9]) / len;
            rot.y = (rfs[8] - rfs[2]) / len;
            rot.z = (rfs[1] - rfs[4]) / len;
          } else rot.x = rot.y = rot.z = 0;
        }
        break;

      case OrientationType_1.default.QUATERNION:
        {
          let tr = rfs[0] + rfs[5] + rfs[10];

          if (tr > 0) {
            rot.w = Math.sqrt(1 + tr) / 2;
            rot.x = (rfs[6] - rfs[9]) / (4 * rot.w);
            rot.y = (rfs[8] - rfs[2]) / (4 * rot.w);
            rot.z = (rfs[1] - rfs[4]) / (4 * rot.w);
          } else if (rfs[0] > rfs[5] && rfs[0] > rfs[10]) {
            rot.x = Math.sqrt(1 + rfs[0] - rfs[5] - rfs[10]) / 2;
            rot.w = (rfs[6] - rfs[9]) / (4 * rot.x);
            rot.y = (rfs[1] + rfs[4]) / (4 * rot.x);
            rot.z = (rfs[8] + rfs[2]) / (4 * rot.x);
          } else if (rfs[5] > rfs[10]) {
            rot.y = Math.sqrt(1 + rfs[5] - rfs[0] - rfs[10]) / 2;
            rot.x = (rfs[1] + rfs[4]) / (4 * rot.y);
            rot.w = (rfs[8] - rfs[2]) / (4 * rot.y);
            rot.z = (rfs[6] + rfs[9]) / (4 * rot.y);
          } else {
            rot.z = Math.sqrt(1 + rfs[10] - rfs[0] - rfs[5]) / 2;
            rot.x = (rfs[8] + rfs[2]) / (4 * rot.z);
            rot.y = (rfs[6] + rfs[9]) / (4 * rot.z);
            rot.w = (rfs[1] - rfs[4]) / (4 * rot.z);
          }
        }
        break;

      case OrientationType_1.default.EULER_ANGLES:
        {
          rot.y = Math.asin(-rfs[2]);

          if (rfs[2] != 1 && rfs[2] != -1) {
            rot.x = Math.atan2(rfs[6], rfs[10]);
            rot.z = Math.atan2(rfs[1], rfs[0]);
          } else {
            rot.z = 0;
            rot.x = Math.atan2(rfs[4], rfs[5]);
          }
        }
        break;

      default:
        break;
    }

    ;
    vec.push(pos);
    vec.push(rot);
    vec.push(scale);
    mr = null;
    return vec;
  }

  invert() {
    let d = this.determinant();
    let invertable = Math.abs(d) > MathConst_1.default.MATH_MIN_POSITIVE;

    if (invertable) {
      let fs = this.m_localFS32;
      d = 1.0 / d;
      let m11 = fs[0];
      let m21 = fs[4];
      let m31 = fs[8];
      let m41 = fs[12];
      let m12 = fs[1];
      let m22 = fs[5];
      let m32 = fs[9];
      let m42 = fs[13];
      let m13 = fs[2];
      let m23 = fs[6];
      let m33 = fs[10];
      let m43 = fs[14];
      let m14 = fs[3];
      let m24 = fs[7];
      let m34 = fs[11];
      let m44 = fs[15];
      fs[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
      fs[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
      fs[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
      fs[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
      fs[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
      fs[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
      fs[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
      fs[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
      fs[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
      fs[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
      fs[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
      fs[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
      fs[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
      fs[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
      fs[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
      fs[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
    }

    ;
    return invertable;
  }

  invertThis() {
    this.invert();
    return this;
  }

  pointAt(pos, at, up) {
    //TODO: need optimize
    if (at == null) at = new Vector3D_1.default(0.0, 0.0, -1.0);
    if (up == null) up = new Vector3D_1.default(0.0, -1.0, 0.0);
    let dir = at.subtract(pos);
    let vup = up.clone(); //Vector3D right;

    dir.normalize();
    vup.normalize();
    let dir2 = dir.clone().scaleBy(vup.dot(dir));
    vup.subtractBy(dir2);
    if (vup.getLength() > MathConst_1.default.MATH_MIN_POSITIVE) vup.normalize();else if (dir.x != 0) vup.setTo(-dir.y, dir.x, 0);else vup.setTo(1, 0, 0);
    let right = vup.crossProduct(dir);
    right.normalize();
    let fs = this.m_localFS32;
    fs[0] = right.x;
    fs[4] = right.y;
    fs[8] = right.z;
    fs[12] = 0.0;
    fs[1] = vup.x;
    fs[5] = vup.y;
    fs[9] = vup.z;
    fs[13] = 0.0;
    fs[2] = dir.x;
    fs[6] = dir.y;
    fs[10] = dir.z;
    fs[14] = 0.0;
    fs[3] = pos.x;
    fs[7] = pos.y;
    fs[11] = pos.z;
    fs[15] = 1.0;
  }

  prepend(rhs) {
    let rfs32 = rhs.getLocalFS32();
    let fs = this.m_localFS32;
    let m111 = rfs32[0];
    let m121 = rfs32[4];
    let m131 = rfs32[8];
    let m141 = rfs32[12];
    let m112 = rfs32[1];
    let m122 = rfs32[5];
    let m132 = rfs32[9];
    let m142 = rfs32[13];
    let m113 = rfs32[2];
    let m123 = rfs32[6];
    let m133 = rfs32[10];
    let m143 = rfs32[14];
    let m114 = rfs32[3];
    let m124 = rfs32[7];
    let m134 = rfs32[11];
    let m144 = rfs32[15];
    let m211 = fs[0];
    let m221 = fs[4];
    let m231 = fs[8];
    let m241 = fs[12];
    let m212 = fs[1];
    let m222 = fs[5];
    let m232 = fs[9];
    let m242 = fs[13];
    let m213 = fs[2];
    let m223 = fs[6];
    let m233 = fs[10];
    let m243 = fs[14];
    let m214 = fs[3];
    let m224 = fs[7];
    let m234 = fs[11];
    let m244 = fs[15];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
    fs[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
    fs[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
    fs[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
    fs[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
    fs[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
    fs[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
    fs[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
  }

  prepend3x3(rhs) {
    let rfs32 = rhs.getLocalFS32();
    let fs = this.m_localFS32;
    let m111 = rfs32[0];
    let m121 = rfs32[4];
    let m131 = rfs32[8];
    let m112 = rfs32[1];
    let m122 = rfs32[5];
    let m132 = rfs32[9];
    let m113 = rfs32[2];
    let m123 = rfs32[6];
    let m133 = rfs32[10];
    let m211 = fs[0];
    let m221 = fs[4];
    let m231 = fs[8];
    let m212 = fs[1];
    let m222 = fs[5];
    let m232 = fs[9];
    let m213 = fs[2];
    let m223 = fs[6];
    let m233 = fs[10];
    fs[0] = m111 * m211 + m112 * m221 + m113 * m231;
    fs[1] = m111 * m212 + m112 * m222 + m113 * m232;
    fs[2] = m111 * m213 + m112 * m223 + m113 * m233;
    fs[4] = m121 * m211 + m122 * m221 + m123 * m231;
    fs[5] = m121 * m212 + m122 * m222 + m123 * m232;
    fs[6] = m121 * m213 + m122 * m223 + m123 * m233;
    fs[8] = m131 * m211 + m132 * m221 + m133 * m231;
    fs[9] = m131 * m212 + m132 * m222 + m133 * m232;
    fs[10] = m131 * m213 + m132 * m223 + m133 * m233;
  }

  prependRotationPivot(radian, axis, pivotPoint) {
    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
    this.prepend(Matrix4.s_tMat4);
  }

  prependRotation(radian, axis) {
    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    this.prepend(Matrix4.s_tMat4);
  }

  prependRotationX(radian) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationX(radian);
    this.prepend3x3(Matrix4.s_tMat4);
  }

  prependRotationY(radian) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationY(radian);
    this.prepend3x3(Matrix4.s_tMat4);
  }

  prependRotationZ(radian) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationZ(radian);
    this.prepend3x3(Matrix4.s_tMat4);
  } // 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)


  prependRotationEulerAngle(radianX, radianY, radianZ) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationY(radianY);
    this.prepend3x3(Matrix4.s_tMat4); //s_tempMat.identity();

    Matrix4.s_tMat4.rotationX(radianX);
    this.prepend3x3(Matrix4.s_tMat4); //s_tempMat.identity();

    Matrix4.s_tMat4.rotationZ(radianZ);
    this.prepend3x3(Matrix4.s_tMat4);
  }

  prependScale(xScale, yScale, zScale) {
    const fs = this.m_localFS32;
    fs[0] *= xScale;
    fs[1] *= yScale;
    fs[2] *= zScale;
    fs[4] *= xScale;
    fs[5] *= yScale;
    fs[6] *= zScale;
    fs[8] *= xScale;
    fs[9] *= yScale;
    fs[10] *= zScale;
    fs[12] *= xScale;
    fs[13] *= yScale;
    fs[14] *= zScale;
  }

  prependScaleXY(xScale, yScale) {
    const fs = this.m_localFS32;
    fs[0] *= xScale;
    fs[1] *= yScale;
    fs[4] *= xScale;
    fs[5] *= yScale;
    fs[8] *= xScale;
    fs[9] *= yScale;
    fs[12] *= xScale;
    fs[13] *= yScale;
  }

  prependTranslationXYZ(px, py, pz) {
    Matrix4.s_tMat4.identity(); //Matrix4.s_tMat4.setPositionXYZ(px, py, pz);

    this.prepend(Matrix4.s_tMat4);
  }

  prependTranslation(v3) {
    Matrix4.s_tMat4.identity(); //Matrix4.s_tMat4.setPositionXYZ(v3.x, v3.y, v3.z);

    this.prepend(Matrix4.s_tMat4);
  }

  recompose(components, orientationStyle) {
    if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
    this.identity();
    let scale = Matrix4.s_tMat4.getFS32();
    scale[0] = scale[1] = scale[2] = components[2].x;
    scale[4] = scale[5] = scale[6] = components[2].y;
    scale[8] = scale[9] = scale[10] = components[2].z;
    let fs = this.m_localFS32;

    switch (orientationStyle) {
      case OrientationType_1.default.EULER_ANGLES:
        {
          let cx = Math.cos(components[1].x);
          let cy = Math.cos(components[1].y);
          let cz = Math.cos(components[1].z);
          let sx = Math.sin(components[1].x);
          let sy = Math.sin(components[1].y);
          let sz = Math.sin(components[1].z);
          fs[0] = cy * cz * scale[0];
          fs[1] = cy * sz * scale[1];
          fs[2] = -sy * scale[2];
          fs[3] = 0;
          fs[4] = (sx * sy * cz - cx * sz) * scale[4];
          fs[5] = (sx * sy * sz + cx * cz) * scale[5];
          fs[6] = sx * cy * scale[6];
          fs[7] = 0;
          fs[8] = (cx * sy * cz + sx * sz) * scale[8];
          fs[9] = (cx * sy * sz - sx * cz) * scale[9];
          fs[10] = cx * cy * scale[10];
          fs[11] = 0;
          fs[12] = components[0].x;
          fs[13] = components[0].y;
          fs[14] = components[0].z;
          fs[15] = 1;
        }
        break;

      default:
        {
          let x = components[1].x;
          let y = components[1].y;
          let z = components[1].z;
          let w = components[1].w;

          if (orientationStyle == OrientationType_1.default.AXIS_ANGLE) {
            let halfW = 0.5 * w;
            x *= Math.sin(halfW);
            y *= Math.sin(halfW);
            z *= Math.sin(halfW);
            w = Math.cos(halfW);
          }

          ;
          fs[0] = (1 - 2 * y * y - 2 * z * z) * scale[0];
          fs[1] = (2 * x * y + 2 * w * z) * scale[1];
          fs[2] = (2 * x * z - 2 * w * y) * scale[2];
          fs[3] = 0;
          fs[4] = (2 * x * y - 2 * w * z) * scale[4];
          fs[5] = (1 - 2 * x * x - 2 * z * z) * scale[5];
          fs[6] = (2 * y * z + 2 * w * x) * scale[6];
          fs[7] = 0;
          fs[8] = (2 * x * z + 2 * w * y) * scale[8];
          fs[9] = (2 * y * z - 2 * w * x) * scale[9];
          fs[10] = (1 - 2 * x * x - 2 * y * y) * scale[10];
          fs[11] = 0;
          fs[12] = components[0].x;
          fs[13] = components[0].y;
          fs[14] = components[0].z;
          fs[15] = 1;
        }
        break;
    }

    ; //TODO: need thinking

    if (components[2].x == 0) this.m_localFS32[0] = 0; // 1e-15;

    if (components[2].y == 0) this.m_localFS32[5] = 0; // 1e-15;

    if (components[2].z == 0) this.m_localFS32[10] = 0; // 1e-15;

    scale = null;
    return true;
  }

  setThreeAxes(x_axis, y_axis, z_axis) {
    let vs = this.m_localFS32;
    vs[0] = x_axis.x;
    vs[1] = x_axis.y;
    vs[2] = x_axis.z;
    vs[4] = y_axis.x;
    vs[5] = y_axis.y;
    vs[6] = y_axis.z;
    vs[8] = z_axis.x;
    vs[9] = z_axis.y;
    vs[10] = z_axis.z;
  }

  deltaTransformVector(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    return new Vector3D_1.default(x * this.m_localFS32[0] + y * this.m_localFS32[4] + z * this.m_localFS32[8], x * this.m_localFS32[1] + y * this.m_localFS32[5] + z * this.m_localFS32[9], x * this.m_localFS32[2] + y * this.m_localFS32[6] + z * this.m_localFS32[10], 0.0);
  }

  deltaTransformVectorSelf(v3) {
    let fs = this.m_localFS32;
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    v3.x = x * fs[0] + y * fs[4] + z * fs[8];
    v3.y = x * fs[1] + y * fs[5] + z * fs[9];
    v3.z = x * fs[2] + y * fs[6] + z * fs[10];
  }

  deltaTransformOutVector(v3, out_v3) {
    let fs = this.m_localFS32;
    out_v3.x = v3.x * fs[0] + v3.y * fs[4] + v3.z * fs[8];
    out_v3.y = v3.x * fs[1] + v3.y * fs[5] + v3.z * fs[9];
    out_v3.z = v3.x * fs[2] + v3.y * fs[6] + v3.z * fs[10];
  }

  transformVector(v3) {
    let fs = this.m_localFS32;
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    return new Vector3D_1.default(x * fs[0] + y * fs[4] + z * fs[8] + fs[12], x * fs[1] + y * fs[5] + z * fs[9] + fs[13], x * fs[2] + y * fs[6] + z * fs[10] + fs[14], x * fs[3] + y * fs[7] + z * fs[11] + fs[15]);
  }

  transformOutVector(v3, out_v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let fs = this.m_localFS32;
    out_v3.setTo(x * fs[0] + y * fs[4] + z * fs[8] + fs[12], x * fs[1] + y * fs[5] + z * fs[9] + fs[13], x * fs[2] + y * fs[6] + z * fs[10] + fs[14], x * fs[3] + y * fs[7] + z * fs[11] + fs[15]);
  }

  transformOutVector3(v3, out_v3) {
    let fs = this.m_localFS32;
    out_v3.x = v3.x * fs[0] + v3.y * fs[4] + v3.z * fs[8] + fs[12];
    out_v3.y = v3.x * fs[1] + v3.y * fs[5] + v3.z * fs[9] + fs[13];
    out_v3.z = v3.x * fs[2] + v3.y * fs[6] + v3.z * fs[10] + fs[14];
  }

  transformVector3Self(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let fs = this.m_localFS32;
    v3.x = x * fs[0] + y * fs[4] + z * fs[8] + fs[12];
    v3.y = x * fs[1] + y * fs[5] + z * fs[9] + fs[13];
    v3.z = x * fs[2] + y * fs[6] + z * fs[10] + fs[14];
  }

  transformVectorSelf(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let fs = this.m_localFS32;
    v3.setTo(x * fs[0] + y * fs[4] + z * fs[8] + fs[12], x * fs[1] + y * fs[5] + z * fs[9] + fs[13], x * fs[2] + y * fs[6] + z * fs[10] + fs[14], x * fs[3] + y * fs[7] + z * fs[11] + fs[15]);
  }

  transformVectors(float_vinArr, vinLength, float_voutArr) {
    let i = 0;
    let x, y, z;
    let pfs = this.m_localFS32;
    vinLength -= 3;

    while (i <= vinLength) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_voutArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_voutArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_voutArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transformVectorsSelf(float_vinArr, vinLength) {
    let i = 0;
    let x, y, z;
    let pfs = this.m_localFS32;
    vinLength -= 3;

    while (i <= vinLength) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transformVectorsRangeSelf(float_vinArr, begin, end) {
    let i = begin;
    let x, y, z;
    let pfs = this.m_localFS32;
    end -= 3;

    while (i <= end) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transpose() {
    Matrix4.s_tMat4.copyFrom(this);
    let fs32 = Matrix4.s_tMat4.getFS32();
    let fs = this.m_localFS32;
    fs[1] = fs32[4];
    fs[2] = fs32[8];
    fs[3] = fs32[12];
    fs[4] = fs32[1];
    fs[6] = fs32[9];
    fs[7] = fs32[13];
    fs[8] = fs32[2];
    fs[9] = fs32[6];
    fs[11] = fs32[14];
    fs[12] = fs32[3];
    fs[13] = fs32[7];
    fs[14] = fs32[11];
  }

  interpolateTo(toMat, float_percent) {
    let fs32 = toMat.getFS32();
    let fsI = toMat.getFSIndex();
    let _g = 0;
    let i = this.m_index;

    while (_g < 16) {
      this.m_fs32[i] += (fs32[fsI + _g] - this.m_fs32[i]) * float_percent;
      ++i;
      ++_g;
    }
  }

  getAxisRotation(x, y, z, radian) {
    radian = -radian;
    let fs = this.m_localFS32;
    let s = Math.sin(radian),
        c = Math.cos(radian);
    let t = 1.0 - c;
    fs[0] = c + x * x * t;
    fs[5] = c + y * y * t;
    fs[10] = c + z * z * t;
    let tmp1 = x * y * t;
    let tmp2 = z * s;
    fs[4] = tmp1 + tmp2;
    fs[1] = tmp1 - tmp2;
    tmp1 = x * z * t;
    tmp2 = y * s;
    fs[8] = tmp1 - tmp2;
    fs[2] = tmp1 + tmp2;
    tmp1 = y * z * t;
    tmp2 = x * s;
    fs[9] = tmp1 + tmp2;
    fs[6] = tmp1 - tmp2;
  }

  rotationX(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.m_localFS32[0] = 1.0;
    this.m_localFS32[1] = 0.0;
    this.m_localFS32[2] = 0.0;
    this.m_localFS32[4] = 0.0;
    this.m_localFS32[5] = c;
    this.m_localFS32[6] = s;
    this.m_localFS32[8] = 0.0;
    this.m_localFS32[9] = -s;
    this.m_localFS32[10] = c;
  }

  rotationY(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.m_localFS32[0] = c;
    this.m_localFS32[1] = 0.0;
    this.m_localFS32[2] = -s;
    this.m_localFS32[4] = 0.0;
    this.m_localFS32[5] = 1.0;
    this.m_localFS32[6] = 0.0;
    this.m_localFS32[8] = s;
    this.m_localFS32[9] = 0.0;
    this.m_localFS32[10] = c;
  }

  rotationZ(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.m_localFS32[0] = c;
    this.m_localFS32[1] = s;
    this.m_localFS32[2] = 0.0;
    this.m_localFS32[4] = -s;
    this.m_localFS32[5] = c;
    this.m_localFS32[6] = 0.0;
    this.m_localFS32[8] = 0.0;
    this.m_localFS32[9] = 0.0;
    this.m_localFS32[10] = 1.0;
  } /////////////////////////////////////////////////////////////


  toString() {
    let str = "\n" + this.m_localFS32[0] + "," + this.m_localFS32[1] + "," + this.m_localFS32[2] + "," + this.m_localFS32[3] + "\n";
    str += this.m_localFS32[4] + "," + this.m_localFS32[5] + "," + this.m_localFS32[6] + "," + this.m_localFS32[7] + "\n";
    str += this.m_localFS32[8] + "," + this.m_localFS32[9] + "," + this.m_localFS32[10] + "," + this.m_localFS32[11] + "\n";
    str += this.m_localFS32[12] + "," + this.m_localFS32[13] + "," + this.m_localFS32[14] + "," + this.m_localFS32[15] + "\n";
    return str;
  }

  transformPerspV4Self(v4) {
    const fs = this.m_localFS32;
    v4.w = v4.z;
    v4.x *= fs[0];
    v4.y *= fs[5];
    v4.z *= fs[10];
    v4.z += fs[14];
    v4.w *= fs[11];
    v4.w += fs[15];
  }

  clone() {
    let m = new Matrix4();
    m.copyFrom(this);
    return m;
  } ///////
  // view etc..
  ///////////////////////////////////////////


  perspectiveRH(fovy, aspect, zNear, zFar) {
    //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
    const fs = this.m_localFS32;
    let tanHalfFovy = Math.tan(fovy * 0.5);
    this.identity();
    fs[0] = 1.0 / (aspect * tanHalfFovy);
    fs[5] = 1.0 / tanHalfFovy;
    fs[10] = -(zFar + zNear) / (zFar - zNear);
    fs[11] = -1.0;
    fs[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
  }

  perspectiveRH2(fovy, pw, ph, zNear, zFar) {
    let focalLength = pw / Math.tan(fovy * 0.5);
    let m0 = focalLength / pw;
    let m5 = focalLength / ph;
    let m10 = -zFar / (zFar - zNear);
    let m14 = -zNear * m10;
    this.identity();
    const fs = this.m_localFS32;
    fs[0] = m0;
    fs[5] = m5;
    fs[10] = m10;
    fs[11] = -1.0;
    fs[14] = m14;
  }

  orthoRH(b, t, l, r, zNear, zFar) {
    this.identity();
    const fs = this.m_localFS32;
    fs[0] = 2.0 / (r - l);
    fs[5] = 2.0 / (t - b);
    fs[10] = -2.0 / (zFar - zNear);
    fs[12] = -(r + l) / (r - l);
    fs[13] = -(t + b) / (t - b);
    fs[14] = -(zFar + zNear) / (zFar - zNear);
    fs[15] = 1.0;
  }

  perspectiveLH(fovy, aspect, zNear, zFar) {
    //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
    let tanHalfFovy = Math.tan(fovy * 0.5);
    this.identity();
    const fs = this.m_localFS32;
    fs[0] = 1.0 / (aspect * tanHalfFovy);
    fs[5] = 1.0 / tanHalfFovy;
    fs[10] = (zFar + zNear) / (zFar - zNear);
    fs[11] = 1.0;
    fs[14] = 2.0 * zFar * zNear / (zFar - zNear);
  }

  orthoLH(b, t, l, r, zNear, zFar) {
    this.identity();
    const fs = this.m_localFS32;
    fs[0] = 2.0 / (r - l); // / (aspect * tanHalfFovy);

    fs[5] = 2.0 / (t - b); // / tanHalfFovy;

    fs[10] = 2.0 / (zFar - zNear);
    fs[12] = -(r + l) / (r - l);
    fs[13] = -(t + b) / (t - b);
    fs[14] = -(zFar + zNear) / (zFar - zNear);
    fs[15] = 1.0;
  }

  lookAtRH(eyePos, atPos, up) {
    this.identity();
    let f = atPos.subtract(eyePos);
    f.normalize();
    let s = f.crossProduct(up);
    s.normalize();
    let u = s.crossProduct(f);
    s.w = -s.dot(eyePos);
    u.w = -u.dot(eyePos);
    f.w = f.dot(eyePos);
    f.negate();
    this.copyRowFrom(0, s);
    this.copyRowFrom(1, u);
    this.copyRowFrom(2, f);
  }

  lookAtLH(eyePos, atPos, up) {
    this.identity();
    let f = atPos.subtract(eyePos);
    f.normalize();
    let s = f.crossProduct(up);
    s.normalize();
    let u = s.crossProduct(f);
    s.w = -s.dot(eyePos);
    u.w = -u.dot(eyePos);
    f.w = -f.dot(eyePos);
    this.copyRowFrom(0, s);
    this.copyRowFrom(1, u);
    this.copyRowFrom(2, f);
  }

  destroy() {
    this.m_localFS32 = null;
    this.m_fs32 = null;
    this.m_index = -1;
  }

}

Matrix4.s_InitData = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
Matrix4.m_v3 = new Vector3D_1.default();
Matrix4.s_uid = 0;
Matrix4.s_isolatedUid = 0x4ffff;
Matrix4.s_tMat4 = new Matrix4();
exports.default = Matrix4;

/***/ }),

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

/***/ "5ab6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const FBXBufferObject_1 = __webpack_require__("8310");

class ElementGeomData {
  constructor() {}

  calcVtxIVS(sivs) {
    //[0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 3, 1, 9, 7, -6, 6, 7, 9, -9, 8, 9, 1, -1, 0, 2, 4, 6, -9]
    // console.log("sivs: ",sivs);
    let s = sivs; //let ivs: number[] = [];

    let step = 0;
    let sivsLen = sivs.length;
    let ivsLen = 0;

    for (let i = 0; i < sivsLen; ++i) {
      step++;

      if (s[i] < 0) {
        if (step == 4) {
          // ivs.push(i - 3, i - 2, i-1);
          // ivs.push(i, i - 3, i-1);
          ivsLen += 6;
        } else if (step == 3) {
          // ivs.push(i - 2, i - 1, i);
          ivsLen += 3;
        } else {
          for (let j = step - 2; j > 0; j--) {
            // ivs.push(i, i - j - 1, i - j);
            ivsLen += 3;
          }
        }

        step = 0;
      }
    }

    let ivs = ivsLen > 65535 ? new Uint32Array(ivsLen) : new Uint16Array(ivsLen);
    let k = 0;

    for (let i = 0; i < sivsLen; ++i) {
      step++;

      if (s[i] < 0) {
        if (step == 4) {
          ivs[k] = i - 3;
          ivs[k + 1] = i - 2;
          ivs[k + 2] = i - 1;
          ivs[k + 3] = i;
          ivs[k + 4] = i - 3;
          ivs[k + 5] = i - 1;
          k += 6; // ivs.push(i - 3, i - 2, i-1);
          // ivs.push(i, i - 3, i-1);
        } else if (step == 3) {
          // ivs.push(i - 2, i - 1, i);
          ivs[k] = i - 2;
          ivs[k + 1] = i - 1;
          ivs[k + 2] = i;
          k += 3;
        } else {
          for (let j = step - 2; j > 0; j--) {
            // ivs.push(i, i - j - 1, i - j);
            ivs[k] = i;
            ivs[k + 1] = i - j - 1;
            ivs[k + 2] = i - j;
            k += 3;
          }
        }

        step = 0;
      }
    }

    return ivs;
  }

  buildVS(sivs, svs, sivsLen) {
    let vsLen = sivs.length * 3;
    let vs = new Float32Array(vsLen);
    let sk = 0;
    let k = 0;

    for (let i = 0; i < sivsLen; ++i) {
      k = i * 3;
      sk = sivs[i];
      if (sk < 0) sk = sk * -1 - 1;
      sk *= 3;
      vs[k] = svs[sk];
      vs[k + 1] = svs[sk + 1];
      vs[k + 2] = svs[sk + 2];
      k += 3;
    }

    return vs;
  }

  buildNVS(sivs, snvs, sivsLen) {
    let nvs = null;
    let vsLen = sivs.length * 3;

    if (snvs == null || snvs.length == vsLen) {
      if (snvs != null) {
        nvs = new Float32Array(snvs);
      }
    } else {
      let sk = 0;
      let k = 0;
      nvs = new Float32Array(vsLen);

      for (let i = 0; i < sivsLen; ++i) {
        k = i * 3;
        sk = sivs[i];
        if (sk < 0) sk = sk * -1 - 1;
        sk *= 3;
        nvs[k] = snvs[sk];
        nvs[k + 1] = snvs[sk + 1];
        nvs[k + 2] = snvs[sk + 2];
        k += 3;
      }
    }

    return nvs;
  }

  buildUVS(sivs, suvs) {
    let uvs = null;
    let vsLen = sivs.length * 2;

    if (suvs == null || suvs.length == vsLen) {
      if (suvs != null) {
        uvs = new Float32Array(suvs);
      }
    } else {
      let sk = 0;
      let k = 0;
      uvs = new Float32Array(vsLen);

      for (let i = 0; i < vsLen; ++i) {
        k = i * 2;
        sk = sivs[i];
        if (sk < 0) sk = sk * -1 - 1;
        sk *= 2;
        uvs[k] = suvs[sk];
        uvs[k + 1] = suvs[sk + 1];
        k += 2;
      }
    }

    return uvs;
  }

  buildBufs(obj, sivs, svs, snvs, suvs, suvivs) {
    let vsLen = sivs.length * 3;
    let sivsLen = sivs.length;
    let nvs = null;
    let ivs = this.calcVtxIVS(sivs);
    obj.vertex = this.buildVS(sivs, svs, sivsLen);
    obj.normal = this.buildNVS(sivs, snvs, sivsLen);

    if (suvs) {
      obj.uvs = [this.buildUVS(suvivs, suvs)];
    } else {
      obj.uvs = null;
    }

    obj.indices = ivs;
    return;
    let vs = new Float32Array(vsLen);
    let sk = 0;
    let k = 0;

    if (snvs == null || snvs.length == vsLen) {
      if (snvs != null) {
        nvs = new Float32Array(snvs);
      }

      for (let i = 0; i < sivsLen; ++i) {
        k = i * 3;
        sk = sivs[i];
        if (sk < 0) sk = sk * -1 - 1;
        sk *= 3;
        vs[k] = svs[sk];
        vs[k + 1] = svs[sk + 1];
        vs[k + 2] = svs[sk + 2];
        k += 3;
      }
    } else {
      if (snvs != null) {
        nvs = new Float32Array(vsLen);

        for (let i = 0; i < sivsLen; ++i) {
          k = i * 3;
          sk = sivs[i];
          if (sk < 0) sk = sk * -1 - 1;
          sk *= 3;
          vs[k] = svs[sk];
          vs[k + 1] = svs[sk + 1];
          vs[k + 2] = svs[sk + 2];
          nvs[k] = snvs[sk];
          nvs[k + 1] = snvs[sk + 1];
          nvs[k + 2] = snvs[sk + 2];
          k += 3;
        }
      } else {
        for (let i = 0; i < sivsLen; ++i) {
          k = i * 3;
          sk = sivs[i];
          if (sk < 0) sk = sk * -1 - 1;
          sk *= 3;
          vs[k] = svs[sk];
          vs[k + 1] = svs[sk + 1];
          vs[k + 2] = svs[sk + 2];
          k += 3;
        }
      }
    }

    obj.vertex = vs;
    obj.normal = nvs;
    obj.indices = ivs;
  }

  createBufObject(geoInfo) {
    console.log("createBufObject(), geoInfo: ", geoInfo);
    let obj = new FBXBufferObject_1.FBXBufferObject();
    let puvs = null;
    let uvList = geoInfo.uv;

    if (uvList && uvList.length > 0) {
      puvs = uvList[0];
    }

    let uv_buffer = null;
    let uv_indices = null;

    if (puvs != null) {
      uv_buffer = puvs.buffer;
      uv_indices = puvs.indices;
    }

    if (geoInfo.normal != null) {
      this.buildBufs(obj, geoInfo.vertexIndices, geoInfo.vertexPositions, geoInfo.normal.buffer, uv_buffer, uv_indices);
    } else {
      this.buildBufs(obj, geoInfo.vertexIndices, geoInfo.vertexPositions, null, uv_buffer, uv_indices);
      console.error("Error: 当前FBX模型法线数据缺失!!!");
    }

    if (obj.uvs == null) {
      obj.uvs = [new Float32Array(2 * obj.indices.length / 3)];
      console.error("Error: uvs data is empty !!!");
      obj.errorStatus = 1;
    } // let uvsLen = 2 * obj.vertex.length / 3;
    // let uvs = new Float32Array(uvsLen);


    obj.isEntity = true; // obj.uvs = [uvs];

    return obj;
  }

}

exports.ElementGeomData = ElementGeomData;
;

/***/ }),

/***/ "5b39":
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

class HttpFileLoader {
  constructor() {
    this.crossOrigin = 'anonymous';
  }

  setCrossOrigin(crossOrigin) {
    this.crossOrigin = crossOrigin;
  }

  async load(url, onLoad,
  /**
   * @param progress its value is 0.0 -> 1.0
   */
  onProgress = null, onError = null, responseType = "blob", headRange = "") {
    // console.log("HttpFileLoader::load(), A url: ", url);
    // console.log("loadBinBuffer, headRange != '': ", headRange != "");
    if (onLoad == null) {
      throw Error("onload == null !!!");
    }

    const reader = new FileReader();

    reader.onload = e => {
      if (onLoad) onLoad(reader.result, url);
    };

    const request = new XMLHttpRequest();
    request.open("GET", url, true);

    if (headRange != "") {
      request.setRequestHeader("Range", headRange);
    }

    request.responseType = responseType;

    request.onload = e => {
      // console.log("loaded binary buffer request.status: ", request.status, e);
      // console.log("HttpFileLoader::load(), B url: ", url);
      if (request.status <= 206) {
        switch (responseType) {
          case "arraybuffer":
          case "blob":
            reader.readAsArrayBuffer(request.response);
            break;

          case "json":
            if (onLoad) onLoad(request.response, url);
            break;

          case "text":
            if (onLoad) onLoad(request.response, url);
            break;

          default:
            if (onLoad) onLoad(request.response, url);
            break;
        } // if(responseType == "blob" || responseType == "arraybuffer") {
        // 	reader.readAsArrayBuffer(request.response);
        // }else {
        // 	if(onLoad) onLoad(<string>request.response, url);
        // }

      } else if (onError) {
        onError(request.status, url);
      }
    };

    if (onProgress != null) {
      request.onprogress = evt => {
        // console.log("progress evt: ", evt);
        // console.log("progress total: ", evt.total, ", loaded: ", evt.loaded);
        let k = 0.0;

        if (evt.total > 0 || evt.lengthComputable) {
          k = Math.min(1.0, evt.loaded / evt.total);
        } else {
          let content_length = parseInt(request.getResponseHeader("content-length")); // var encoding = req.getResponseHeader("content-encoding");
          // if (total && encoding && encoding.indexOf("gzip") > -1) {

          if (content_length > 0) {
            // assuming average gzip compression ratio to be 25%
            content_length *= 4; // original size / compressed size

            k = Math.min(1.0, evt.loaded / content_length);
          } else {
            console.warn("lengthComputable failed");
          }
        } //let progressInfo = k + "%";
        //console.log("progress progressInfo: ", progressInfo);


        onProgress(k, url);
      };
    }

    if (onError != null) {
      request.onerror = e => {
        console.error("load error, request.status: ", request.status, ", url: ", url);
        onError(request.status, url);
      };
    }

    request.send(null);
  }

}

exports.HttpFileLoader = HttpFileLoader;

/***/ }),

/***/ "6e01":
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

class MathConst {
  static Clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }

  static IsPowerOf2(value) {
    return (value & value - 1) == 0;
  }

  static CalcCeilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
  }

  static CalcNearestCeilPow2(int_n) {
    return Math.pow(2, Math.round(Math.log(int_n) / Math.LN2));
  }

  static CalcFloorCeilPow2(int_n) {
    return Math.pow(2, Math.floor(Math.log(int_n) / Math.LN2));
  }

  static DegreeToRadian(degree) {
    return MathConst.MATH_PI_OVER_180 * degree;
  }

  static Log2(f) {
    return Math.log(f) / Math.LN2;
  }

  static GetMaxMipMapLevel(width, height) {
    return Math.round(MathConst.Log2(Math.max(width, height)) + 1);
  }

  static SafeACos(x) {
    if (x <= -1.0) {
      return MathConst.MATH_PI;
    }

    if (x >= 1.0) {
      return 0.0;
    }

    return Math.acos(x);
  }

  static GetNearestCeilPow2(int_n) {
    let x = 1;

    while (x < int_n) {
      x <<= 1;
    }

    return x;
  } // ccw is positive


  static GetMinRadian(a1, a0) {
    a0 %= MathConst.MATH_2PI;
    a1 %= MathConst.MATH_2PI;

    if (a0 < a1) {
      a0 = MathConst.MATH_2PI - a1 + a0;
      if (a0 > MathConst.MATH_PI) return a0 - MathConst.MATH_2PI;
      return a0;
    } else if (a0 > a1) {
      a1 = MathConst.MATH_2PI - a0 + a1;
      if (a1 > MathConst.MATH_PI) return MathConst.MATH_2PI - a1;
      return -a1;
    }

    return 0.0;
  }
  /**
   * get the directional angle offset degree value: dst_angle_degree = src_angle_degree + directional_angle_offset_degree_value
   * @param a0 src angle degree
   * @param a1 dst angle degree
   * @returns directional angle offset degree value
   */


  static GetMinDegree(a0, a1) {
    let angle = 0;

    if (a1 >= 270 && a0 < 90) {
      angle = (a1 - (a0 + 360)) % 180;
    } else if (a1 <= 90 && a0 >= 270) {
      angle = (a1 + 360 - a0) % 180;
    } else {
      angle = a1 - a0; //  if (Math.abs(angle) > 180) {
      //      angle -= 360;
      //  }

      if (angle > 180) {
        angle -= 360;
        angle %= 360;
      } else if (angle < -180) {
        angle += 360;
        angle %= 360;
      }
    }

    return angle;
  }

  static GetDegreeByXY(dx, dy) {
    if (Math.abs(dx) < 0.00001) {
      if (dy >= 0) return 270;else return 90;
    }

    let angle = Math.atan(dy / dx) * 180 / Math.PI;

    if (dx >= 0) {
      return angle;
    } else {
      return 180 + angle;
    } //  if (dy > 0 && dx > 0) {
    //      return angle
    //  } else if (dy < 0 && dx >= 0) {
    //      return 360 + angle;
    //  } else {
    //      return dx > 0 ? angle : 180 + angle;
    //  }

  }

  static GetRadianByXY(dx, dy) {
    if (Math.abs(dx) < MathConst.MATH_MIN_POSITIVE) {
      if (dy >= 0) return MathConst.MATH_1PER2PI;else return MathConst.MATH_3PER2PI;
    }

    let rad = Math.atan(dy / dx);

    if (dx >= 0) {
      return rad;
    } else {
      return MathConst.MATH_PI + rad;
    }
  }

  static GetRadianByCos(cosv, dx, dy) {
    var rad = Math.acos(cosv); //Math.atan(dy/dx);

    if (dx >= 0) {
      return rad;
    } else {
      return MathConst.MATH_PI + rad;
    }
  }

}

MathConst.MATH_MIN_POSITIVE = 1e-5;
MathConst.MATH_MAX_NEGATIVE = -1e-5;
MathConst.MATH_MAX_POSITIVE = 0xffffffe;
MathConst.MATH_MIN_NEGATIVE = -0xffffffe;
MathConst.MATH_1_OVER_255 = 1.0 / 255.0;
MathConst.MATH_PI = Math.PI;
MathConst.MATH_2PI = MathConst.MATH_PI * 2.0;
MathConst.MATH_3PER2PI = MathConst.MATH_PI * 1.5;
MathConst.MATH_1PER2PI = MathConst.MATH_PI * 0.5;
MathConst.MATH_1_OVER_PI = 1.0 / MathConst.MATH_PI;
MathConst.MATH_1_OVER_360 = 1.0 / 360.0;
MathConst.MATH_1_OVER_180 = 1.0 / 180.0;
MathConst.MATH_180_OVER_PI = 180.0 / MathConst.MATH_PI;
MathConst.MATH_PI_OVER_180 = MathConst.MATH_PI / 180.0;
MathConst.MATH_LN2 = 0.6931471805599453;
exports.default = MathConst;

/***/ }),

/***/ "8310":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class FBXBufferObject {
  constructor() {
    this.id = -1;
    this.ID = "";
    this.userData = {};
    this.parent = null;
    this.i3 = 0;
    this.i2 = 0;
    this.uvs = [];
    this.normal = null;
    this.vertex = null;
    this.indices = null;
    this.colors = null;
    this.materialIndex = [];
    this.vertexWeights = [];
    this.weightsIndices = [];
    this.isEntity = false;
    this.transform = null;
    this.errorStatus = 0;
  }

  toGeometryModel() {
    let indices = this.indices;

    if (indices == null) {
      let vtxTotal = this.vertex.length;
      let vtCount = vtxTotal / 3;
      indices = vtCount > 65535 ? new Uint32Array(vtCount) : new Uint16Array(vtCount);

      for (let i = 0; i < vtCount; ++i) {
        indices[i] = i;
      }
    }

    let model = {
      uvsList: this.uvs,
      vertices: this.vertex,
      normals: this.normal,
      indices: indices
    }; // console.log("model: ",model);

    return model;
  }

  destroy() {
    this.uvs = null;
    this.vertex = null;
    this.normal = null;
    this.colors = null;
    this.indices = null;
  }

}

exports.FBXBufferObject = FBXBufferObject;
;

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

/***/ "8b17":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const Utils_1 = __webpack_require__("f689");

const GeometryBufferParser_1 = __webpack_require__("1280");

class FBXTreeBufferParser {
  constructor() {}

  parse(fbxTree, reader) {
    this.m_connections = this.parseConnections(fbxTree.map);
    const deformers = this.parseDeformers(fbxTree.map, this.m_connections);
    let parser = new GeometryBufferParser_1.GeometryBufferParser();
    parser.setReader(reader);
    const geometryMap = parser.parseGeomBuf(deformers, fbxTree.map, this.m_connections);
    this.parseScene(deformers, geometryMap, this.m_connections, fbxTree.map);
    return geometryMap;
  }

  parseScene(deformers, geometryMap, connections, fbxTree) {
    const modelMap = this.parseModels(geometryMap, connections, fbxTree);
  }

  parseModels(geometryMap, connections, fbxTree) {
    const modelMap = new Map();
    const modelNodes = fbxTree.Objects.Model;

    for (const nodeID in modelNodes) {
      const id = parseInt(nodeID);
      const node = modelNodes[nodeID];
      const relationships = connections.get(id); // let model = this.buildSkeleton( relationships, skeletons, id, node.attrName );

      let model = null;

      if (true) {
        switch (node.attrType) {
          case 'Camera':
            // model = this.createCamera( relationships );
            break;

          case 'Light':
            // model = this.createLight( relationships );
            break;

          case 'Mesh':
            //model = this.createMesh( relationships, geometryMap, materialMap );
            break;

          case 'NurbsCurve':
            // model = this.createCurve( relationships, geometryMap );
            break;

          case 'LimbNode':
          case 'Root':
            // model = new Bone();
            break;

          case 'Null':
          default:
            // model = new Group();
            break;
        } //model.name = node.attrName ? PropertyBinding.sanitizeNodeName( node.attrName ) : '';


        model.ID = id;
      }

      this.getTransformData(model, node);
      modelMap.set(id, model);
    }

    return modelMap;
  }

  parseBufObjTransData(bufObj, modelID, connections, fbxTree) {
    // console.log("parseBufObjTransData(), modelID: ",modelID);
    const modelNodes = fbxTree.Objects.Model; // console.log("parseBufObjTransData(), modelNodes: ",modelNodes);

    const node = modelNodes[modelID];
    this.getTransformData(bufObj, node);

    if (bufObj.parent) {
      bufObj.userData.transformData.parentMatrix = node.parent.matrix;
      bufObj.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;
    }

    const transform = Utils_1.generateTransform(bufObj.userData.transformData);
    bufObj.transform = transform; // if(bufObj.isEntity) {
    // 	console.log("### ### bufObj.userData: ", bufObj.userData);
    // 	console.log("### ### bufObj apply transform, transform: ", transform);
    // }
  } // parse the model node for transform data


  getTransformData(model, modelNode) {
    const transformData = {};
    if ('InheritType' in modelNode) transformData.inheritType = parseInt(modelNode.InheritType.value);
    if ('RotationOrder' in modelNode) transformData.eulerOrder = Utils_1.getEulerOrder(modelNode.RotationOrder.value);else transformData.eulerOrder = 'ZYX';
    if ('Lcl_Translation' in modelNode) transformData.translation = modelNode.Lcl_Translation.value;
    if ('PreRotation' in modelNode) transformData.preRotation = modelNode.PreRotation.value;
    if ('Lcl_Rotation' in modelNode) transformData.rotation = modelNode.Lcl_Rotation.value;
    if ('PostRotation' in modelNode) transformData.postRotation = modelNode.PostRotation.value;
    if ('Lcl_Scaling' in modelNode) transformData.scale = modelNode.Lcl_Scaling.value;
    if ('ScalingOffset' in modelNode) transformData.scalingOffset = modelNode.ScalingOffset.value;
    if ('ScalingPivot' in modelNode) transformData.scalingPivot = modelNode.ScalingPivot.value;
    if ('RotationOffset' in modelNode) transformData.rotationOffset = modelNode.RotationOffset.value;
    if ('RotationPivot' in modelNode) transformData.rotationPivot = modelNode.RotationPivot.value; // console.log("XXXXXXXXXX getTransformData(),...");

    model.userData.transformData = transformData;
  }

  parseBegin(fbxTree, reader) {
    this.m_fbxTree = fbxTree;
    this.m_connections = this.parseConnections(fbxTree.map);
    const deformers = this.parseDeformers(fbxTree.map, this.m_connections);
    this.m_geomParser = new GeometryBufferParser_1.GeometryBufferParser();
    this.m_geomParser.setReader(reader);
    this.m_geomParser.parseGeomBufBegin(deformers, fbxTree.map, this.m_connections);
  }

  getGeomBufId() {
    if (this.m_geomParser != null) {
      return this.m_geomParser.getGeomBufId();
    }

    return -1;
  }

  parseGeomBufNext() {
    let obj;

    if (this.m_geomParser != null) {
      obj = this.m_geomParser.parseGeomBufNext();
      let ID = obj.ID; // console.log("this.m_fbxTree.map: ", this.m_fbxTree.map);
      // console.log("parseGeomBufNext(), ID, id: ", ID,obj.id);

      const relationships = this.m_connections.get(obj.id); // console.log("this.m_connections: ",this.m_connections);
      // console.log("relationships: ",relationships);

      let modelID = "";
      modelID = relationships.parents[0].ID + "";
      this.parseBufObjTransData(obj, modelID, this.m_connections, this.m_fbxTree.map);
    }

    return obj;
  }

  parseGeomBufAt(i) {
    let obj;

    if (this.m_geomParser != null) {
      obj = this.m_geomParser.parseGeomBufAt(i);
      const relationships = this.m_connections.get(obj.id);
      let modelID = "";
      modelID = relationships.parents[0].ID + "";
      this.parseBufObjTransData(obj, modelID, this.m_connections, this.m_fbxTree.map);
    }

    return obj;
  }

  isParsing() {
    if (this.m_geomParser != null) return this.m_geomParser.isParsing();
    return false;
  }

  getParseTotal() {
    if (this.m_geomParser != null) return this.m_geomParser.getParseTotal();
    return 0;
  } // Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
  // and details the connection type


  parseConnections(fbxTree) {
    const connectionMap = new Map();

    if ('Connections' in fbxTree) {
      const rawConnections = fbxTree.Connections.connections; // console.log("parseConnections(), begin...");

      rawConnections.forEach(function (rawConnection) {
        const fromID = rawConnection[0];
        const toID = rawConnection[1]; // console.log("parseConnections(), fromID, toID: ", fromID, toID);

        const relationship = rawConnection[2]; // let boo: boolean = false;

        if (!connectionMap.has(fromID)) {
          // if(fromID == 985892303) {
          // 	boo = true;
          // 	console.log("parseConnections(), ! connectionMap.has( 985892303 ), fromID: ", fromID);
          // }
          connectionMap.set(fromID, {
            parents: [],
            children: []
          });
        }

        const parentRelationship = {
          ID: toID,
          relationship: relationship
        };
        connectionMap.get(fromID).parents.push(parentRelationship); // if(fromID == 985892303) {
        // 	console.log("XXXXX ! connectionMap.has( toID ): ", ! connectionMap.has( toID ));
        // }

        if (!connectionMap.has(toID)) {
          // if(fromID == 985892303) {
          // 	console.log("XXXXX parseConnections(), build toID: ", toID);
          // }
          connectionMap.set(toID, {
            parents: [],
            children: []
          });
        }

        const childRelationship = {
          ID: fromID,
          relationship: relationship
        };
        connectionMap.get(toID).children.push(childRelationship);
      });
    }

    return connectionMap;
  } // Parse nodes in FBXTree.Objects.Deformer
  // Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
  // Generates map of Skeleton-like objects for use later when generating and binding skeletons.


  parseDeformers(fbxTree, connections) {
    const skeletons = {};
    const morphTargets = {};
    return {
      skeletons: skeletons,
      morphTargets: morphTargets
    };
  }

}

exports.FBXTreeBufferParser = FBXTreeBufferParser;

/***/ }),

/***/ "8e17":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const v_m_180pk = 180.0 / Math.PI;
const v_m_minp = 1e-7;

class Vector3D {
  constructor(px = 0.0, py = 0.0, pz = 0.0, pw = 1.0) {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.w = 0.0;
    this.x = px;
    this.y = py;
    this.z = pz;
    this.w = pw;
  }

  clone() {
    return new Vector3D(this.x, this.y, this.z, this.w);
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  }

  setTo(px, py, pz, pw = 1.0) {
    this.x = px;
    this.y = py;
    this.z = pz;
    this.w = pw;
    return this;
  }

  fromArray(arr, offset = 0) {
    this.x = arr[offset];
    this.y = arr[offset + 1];
    this.z = arr[offset + 2];
    return this;
  }

  toArray(arr, offset = 0) {
    arr[offset] = this.x;
    arr[offset + 1] = this.y;
    arr[offset + 2] = this.z;
    return this;
  }

  fromArray4(arr, offset = 0) {
    this.x = arr[offset];
    this.y = arr[offset + 1];
    this.z = arr[offset + 2];
    this.w = arr[offset + 3];
    return this;
  }

  toArray4(arr, offset = 0) {
    arr[offset] = this.x;
    arr[offset + 1] = this.y;
    arr[offset + 2] = this.z;
    arr[offset + 3] = this.w;
    return this;
  }

  setXYZ(px, py, pz) {
    this.x = px;
    this.y = py;
    this.z = pz;
    return this;
  }

  copyFrom(v3) {
    this.x = v3.x;
    this.y = v3.y;
    this.z = v3.z;
    return this;
  }

  dot(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  multBy(a) {
    this.x *= a.x;
    this.y *= a.y;
    this.z *= a.z;
    return this;
  }

  normalize() {
    let d = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (d > v_m_minp) {
      this.x /= d;
      this.y /= d;
      this.z /= d;
    }

    return this;
  }

  normalizeTo(a) {
    let d = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (d > v_m_minp) {
      a.x = this.x / d;
      a.y = this.y / d;
      a.z = this.z / d;
    } else {
      a.x = this.x;
      a.y = this.y;
      a.z = this.z;
    }
  }

  scaleVector(s) {
    this.x *= s.x;
    this.y *= s.y;
    this.z *= s.z;
    return this;
  }

  scaleBy(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  equalsXYZ(a) {
    return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp;
  }

  equalsAll(a) {
    return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp && Math.abs(this.w - a.w) < v_m_minp;
  }

  project() {
    let t = 1.0 / this.w;
    this.x *= t;
    this.y *= t;
    this.z *= t;
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  getLengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  addBy(a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }

  subtractBy(a) {
    this.x -= a.x;
    this.y -= a.y;
    this.z -= a.z;
    return this;
  }

  subtract(a) {
    return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
  }

  add(a) {
    return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z);
  }

  crossProduct(a) {
    return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
  }

  crossBy(a) {
    let px = this.y * a.z - this.z * a.y;
    let py = this.z * a.x - this.x * a.z;
    let pz = this.x * a.y - this.y * a.x;
    this.x = px;
    this.y = py;
    this.z = pz;
    return this;
  }

  reflectBy(nv) {
    let idotn2 = (this.x * nv.x + this.y * nv.y + this.z * nv.z) * 2.0;
    this.x = this.x - idotn2 * nv.x;
    this.y = this.y - idotn2 * nv.y;
    this.z = this.z - idotn2 * nv.z;
    return this;
  }

  scaleVecTo(va, scale) {
    this.x = va.x * scale;
    this.y = va.y * scale;
    this.z = va.z * scale;
    return this;
  }

  subVecsTo(va, vb) {
    this.x = va.x - vb.x;
    this.y = va.y - vb.y;
    this.z = va.z - vb.z;
    return this;
  }

  addVecsTo(va, vb) {
    this.x = va.x + vb.x;
    this.y = va.y + vb.y;
    this.z = va.z + vb.z;
    return this;
  }

  crossVecsTo(va, vb) {
    this.x = va.y * vb.z - va.z * vb.y;
    this.y = va.z * vb.x - va.x * vb.z;
    this.z = va.x * vb.y - va.y * vb.x;
    return this;
  }

  toString() {
    return "Vector3D(" + this.x + "" + this.y + "" + this.z + ")";
  }
  /**
   * 右手法则(为正)
   */


  static Cross(a, b, result) {
    result.x = a.y * b.z - a.z * b.y;
    result.y = a.z * b.x - a.x * b.z;
    result.z = a.x * b.y - a.y * b.x;
  } // (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)


  static CrossSubtract(va0, va1, vb0, vb1, result) {
    v_m_v0.x = va1.x - va0.x;
    v_m_v0.y = va1.y - va0.y;
    v_m_v0.z = va1.z - va0.z;
    v_m_v1.x = vb1.x - vb0.x;
    v_m_v1.y = vb1.y - vb0.y;
    v_m_v1.z = vb1.z - vb0.z;
    va0 = v_m_v0;
    vb0 = v_m_v1;
    result.x = va0.y * vb0.z - va0.z * vb0.y;
    result.y = va0.z * vb0.x - va0.x * vb0.z;
    result.z = va0.x * vb0.y - va0.y * vb0.x;
  }

  static Subtract(a, b, result) {
    result.x = a.x - b.x;
    result.y = a.y - b.y;
    result.z = a.z - b.z;
  }

  static DistanceSquared(a, b) {
    v_m_v0.x = a.x - b.x;
    v_m_v0.y = a.y - b.y;
    v_m_v0.z = a.z - b.z;
    return v_m_v0.getLengthSquared();
  }

  static DistanceXYZ(x0, y0, z0, x1, y1, z1) {
    v_m_v0.x = x0 - x1;
    v_m_v0.y = y0 - y1;
    v_m_v0.z = z0 - z1;
    return v_m_v0.getLength();
  }

  static Distance(v0, v1) {
    v_m_v0.x = v0.x - v1.x;
    v_m_v0.y = v0.y - v1.y;
    v_m_v0.z = v0.z - v1.z;
    return v_m_v0.getLength();
  }
  /**
   * get angle degree between two Vector3D objects
   * @param v0 src Vector3D object
   * @param v1 dst Vector3D object
   * @returns angle degree
   */


  static AngleBetween(v0, v1) {
    v0.normalizeTo(v_m_v0);
    v1.normalizeTo(v_m_v1);
    return Math.acos(v_m_v0.dot(v_m_v1)) * v_m_180pk;
  }
  /**
   * get angle radian between two Vector3D objects
   * @param v0 src Vector3D object
   * @param v1 dst Vector3D object
   * @returns angle radian
   */


  static RadianBetween(v0, v1) {
    v0.normalizeTo(v_m_v0);
    v1.normalizeTo(v_m_v1);
    return Math.acos(v_m_v0.dot(v_m_v1));
  }

  static RadianBetween2(v0, v1) {
    //  // c^2 = a^2 + b^2 - 2*a*b * cos(x)
    //  // cos(x) = (a^2 + b^2 - c^2) / 2*a*b
    let pa = v0.getLengthSquared();
    let pb = v1.getLengthSquared();
    v_m_v0.x = v0.x - v1.x;
    v_m_v0.y = v0.y - v1.y;
    v_m_v0.z = v0.z - v1.z;
    return Math.acos((pa + pb - v_m_v0.getLengthSquared()) / (2.0 * Math.sqrt(pa) * Math.sqrt(pb)));
  }

  static Reflect(iv, nv, rv) {
    let idotn2 = (iv.x * nv.x + iv.y * nv.y + iv.z * nv.z) * 2.0;
    rv.x = iv.x - idotn2 * nv.x;
    rv.y = iv.y - idotn2 * nv.y;
    rv.z = iv.z - idotn2 * nv.z;
  }
  /**
   * 逆时针转到垂直
   */


  static VerticalCCWOnXOY(v) {
    const x = v.x;
    v.x = -v.y;
    v.y = x;
  }
  /**
   * 顺时针转到垂直
   */


  static VerticalCWOnXOY(v) {
    const y = v.y;
    v.y = -v.x;
    v.x = y;
  }

}

Vector3D.X_AXIS = new Vector3D(1, 0, 0);
Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
Vector3D.ZERO = new Vector3D(0, 0, 0);
Vector3D.ONE = new Vector3D(1, 1, 1);
exports.default = Vector3D;
const v_m_v0 = new Vector3D();
const v_m_v1 = new Vector3D();

/***/ }),

/***/ "9259":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const FBXTree_1 = __webpack_require__("9a2d");

const Utils_1 = __webpack_require__("f689"); // parse an FBX file in ASCII format


class TextParser {
  constructor() {
    this.currentIndent = 0;
    this.allNodes = new FBXTree_1.FBXTree();
    this.nodeStack = [];
    this.currentProp = [];
    this.currentPropName = '';
  }

  getPrevNode() {
    return this.nodeStack[this.currentIndent - 2];
  }

  getCurrentNode() {
    return this.nodeStack[this.currentIndent - 1];
  }

  getCurrentProp() {
    return this.currentProp;
  }

  pushStack(node) {
    this.nodeStack.push(node);
    this.currentIndent += 1;
  }

  popStack() {
    this.nodeStack.pop();
    this.currentIndent -= 1;
  }

  setCurrentProp(val, name) {
    this.currentProp = val;
    this.currentPropName = name;
  }

  parse(text) {
    this.currentIndent = 0;
    this.allNodes = new FBXTree_1.FBXTree();
    this.nodeStack = [];
    this.currentProp = [];
    this.currentPropName = '';
    const scope = this;
    const split = text.split(/[\r\n]+/);
    split.forEach(function (line, i) {
      const matchComment = line.match(/^[\s\t]*;/);
      const matchEmpty = line.match(/^[\s\t]*$/);
      if (matchComment || matchEmpty) return; // const matchBeginning = line.match( '^\\t{' + scope.currentIndent + '}(\\w+):(.*){', '' );

      const matchBeginning = line.match('^\\t{' + scope.currentIndent + '}(\\w+):(.*){');
      const matchProperty = line.match('^\\t{' + scope.currentIndent + '}(\\w+):[\\s\\t\\r\\n](.*)');
      const matchEnd = line.match('^\\t{' + (scope.currentIndent - 1) + '}}');

      if (matchBeginning) {
        scope.parseNodeBegin(line, matchBeginning);
      } else if (matchProperty) {
        scope.parseNodeProperty(line, matchProperty, split[++i]);
      } else if (matchEnd) {
        scope.popStack();
      } else if (line.match(/^[^\s\t}]/)) {
        // large arrays are split over multiple lines terminated with a ',' character
        // if this is encountered the line needs to be joined to the previous line
        scope.parseNodePropertyContinued(line);
      }
    });
    return this.allNodes;
  }

  parseNodeBegin(line, property) {
    const nodeName = property[1].trim().replace(/^"/, '').replace(/"$/, '');
    const nodeAttrs = property[2].split(',').map(function (attr) {
      return attr.trim().replace(/^"/, '').replace(/"$/, '');
    });
    const node = {
      name: nodeName
    };
    const attrs = this.parseNodeAttr(nodeAttrs);
    const currentNode = this.getCurrentNode(); // a top node

    if (this.currentIndent === 0) {
      this.allNodes.add(nodeName, node);
    } else {
      // a subnode
      // if the subnode already exists, append it
      if (nodeName in currentNode) {
        // special case Pose needs PoseNodes as an array
        if (nodeName === 'PoseNode') {
          currentNode.PoseNode.push(node);
        } else if (currentNode[nodeName].id !== undefined) {
          currentNode[nodeName] = {};
          currentNode[nodeName][currentNode[nodeName].id] = currentNode[nodeName];
        }

        if (attrs.id !== '') currentNode[nodeName][attrs.id] = node;
      } else if (typeof attrs.id === 'number') {
        currentNode[nodeName] = {};
        currentNode[nodeName][attrs.id] = node;
      } else if (nodeName !== 'Properties70') {
        if (nodeName === 'PoseNode') currentNode[nodeName] = [node];else currentNode[nodeName] = node;
      }
    }

    if (typeof attrs.id === 'number') node.id = attrs.id;
    if (attrs.name !== '') node.attrName = attrs.name;
    if (attrs.type !== '') node.attrType = attrs.type;
    this.pushStack(node);
  }

  parseNodeAttr(attrs) {
    let id = attrs[0];

    if (attrs[0] !== '') {
      id = parseInt(attrs[0]);

      if (isNaN(id)) {
        id = attrs[0];
      }
    }

    let name = '',
        type = '';

    if (attrs.length > 1) {
      name = attrs[1].replace(/^(\w+)::/, '');
      type = attrs[2];
    }

    return {
      id: id,
      name: name,
      type: type
    };
  }

  parseNodeProperty(line, property, contentLine) {
    let propName = property[1].replace(/^"/, '').replace(/"$/, '').trim();
    let propValue = property[2].replace(/^"/, '').replace(/"$/, '').trim(); // for special case: base64 image data follows "Content: ," line
    //	Content: ,
    //	 "/9j/4RDaRXhpZgAATU0A..."

    if (propName === 'Content' && propValue === ',') {
      propValue = contentLine.replace(/"/g, '').replace(/,$/, '').trim();
    }

    const currentNode = this.getCurrentNode();
    const parentName = currentNode.name;

    if (parentName === 'Properties70') {
      this.parseNodeSpecialProperty(line, propName, propValue);
      return;
    } // Connections


    if (propName === 'C') {
      const connProps = propValue.split(',').slice(1);
      const from = parseInt(connProps[0]);
      const to = parseInt(connProps[1]);
      let rest = propValue.split(',').slice(3);
      rest = rest.map(function (elem) {
        return elem.trim().replace(/^"/, '');
      });
      propName = 'connections';
      propValue = [from, to];
      Utils_1.append(propValue, rest);

      if (currentNode[propName] === undefined) {
        currentNode[propName] = [];
      }
    } // Node


    if (propName === 'Node') currentNode.id = propValue; // connections

    if (propName in currentNode && Array.isArray(currentNode[propName])) {
      currentNode[propName].push(propValue);
    } else {
      if (propName !== 'a') currentNode[propName] = propValue;else currentNode.a = propValue;
    }

    this.setCurrentProp(currentNode, propName); // convert string to array, unless it ends in ',' in which case more will be added to it

    if (propName === 'a' && propValue.slice(-1) !== ',') {
      currentNode.a = Utils_1.parseNumberArray(propValue);
    }
  }

  parseNodePropertyContinued(line) {
    const currentNode = this.getCurrentNode();
    currentNode.a += line; // if the line doesn't end in ',' we have reached the end of the property value
    // so convert the string to an array

    if (line.slice(-1) !== ',') {
      currentNode.a = Utils_1.parseNumberArray(currentNode.a);
    }
  } // parse "Property70"


  parseNodeSpecialProperty(line, propName, propValue) {
    // split this
    // P: "Lcl Scaling", "Lcl Scaling", "", "A",1,1,1
    // into array like below
    // ["Lcl Scaling", "Lcl Scaling", "", "A", "1,1,1" ]
    const props = propValue.split('",').map(function (prop) {
      return prop.trim().replace(/^\"/, '').replace(/\s/, '_');
    });
    const innerPropName = props[0];
    const innerPropType1 = props[1];
    const innerPropType2 = props[2];
    const innerPropFlag = props[3];
    let innerPropValue = props[4]; // cast values where needed, otherwise leave as strings

    switch (innerPropType1) {
      case 'int':
      case 'enum':
      case 'bool':
      case 'ULongLong':
      case 'double':
      case 'Number':
      case 'FieldOfView':
        innerPropValue = parseFloat(innerPropValue);
        break;

      case 'Color':
      case 'ColorRGB':
      case 'Vector3D':
      case 'Lcl_Translation':
      case 'Lcl_Rotation':
      case 'Lcl_Scaling':
        innerPropValue = Utils_1.parseNumberArray(innerPropValue);
        break;
    } // CAUTION: these props must append to parent's parent


    this.getPrevNode()[innerPropName] = {
      'type': innerPropType1,
      'type2': innerPropType2,
      'flag': innerPropFlag,
      'value': innerPropValue
    };
    this.setCurrentProp(this.getPrevNode(), innerPropName);
  }

}

exports.TextParser = TextParser;

/***/ }),

/***/ "937b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const BinaryReader_1 = __webpack_require__("f7ee");

const FBXTree_1 = __webpack_require__("9a2d"); // import * as fflate from '../libs/fflate.module.js';


const BufPropertyParser_1 = __webpack_require__("c758"); // Parse an FBX file in Binary format


class BufferBinaryParser {
  constructor() {
    this.m_reader = null;
    this.m_allNodes = null;
    this.m_version = 0;
    this.m_parsing = false;
    this.m_parsingIndex = 0;
    this.subLossTime = 0;
    this.nodeParsingTotal = 0;
    this.totalBP = 0;
    this.totalBPTime = 0;
    this.m_isObjects = false;
    this.m_isGeometry = false; // private m_ppFlag: number = 0;

    this.m_debug = false;
    this.m_pptParser = new BufPropertyParser_1.BufPropertyParser();
  }

  parse(buffer) {
    const reader = new BinaryReader_1.BinaryReader(buffer);
    reader.skip(23); // skip magic 23 bytes

    const version = reader.getUint32();

    if (version < 6400) {
      alert('FBXLoader: FBX version not supported, FileVersion: ' + version);
      throw new Error('FBXLoader: FBX version not supported, FileVersion: ' + version);
    }

    const allNodes = new FBXTree_1.FBXTree();

    while (!this.endOfContent(reader)) {
      const node = this.parseNode(reader, version);
      if (node !== null) allNodes.add(node.name, node);
    }

    return allNodes;
  }

  getFBXTree() {
    return this.m_allNodes;
  }

  getReader() {
    return this.m_reader;
  }

  parseBegin(buffer) {
    let reader = new BinaryReader_1.BinaryReader(buffer);
    reader.skip(23); // skip magic 23 bytes

    const version = reader.getUint32();

    if (version < 6400) {
      alert('FBXLoader: FBX version not supported, FileVersion: ' + version);
      throw new Error('FBXLoader: FBX version not supported, FileVersion: ' + version);
    }

    this.m_reader = reader;
    this.m_version = version;
    this.m_parsingIndex = 0;
    let allNodes = new FBXTree_1.FBXTree();
    this.m_allNodes = allNodes;
    this.m_parsing = !this.endOfContent(reader);
    return allNodes;
  }

  parseNext() {
    const allNodes = this.m_allNodes;
    const reader = this.m_reader;
    this.m_parsing = !this.endOfContent(reader);
    this.subLossTime = 0;
    this.nodeParsingTotal = 0;

    if (this.m_parsing) {
      this.m_parsingIndex++;
      let time = Date.now();
      const node = this.parseNode(reader, this.m_version); //console.log("### c0 BufferBinaryParser::parseNext(), lossTime: ", (Date.now() - time), "sub lossTime: ",this.subLossTime);

      if (node != null) {
        let ns = node.name != undefined ? "-" + node.name : "";
        console.log("### parse(" + this.m_parsingIndex + ns + ") BufferBinaryParser::parseNext(), lossTime: ", Date.now() - time + " ms", "nodeParsingTotal: ", this.nodeParsingTotal);
      }

      if (node !== null) allNodes.add(node.name, node);
    }
  }

  isParsing() {
    return this.m_parsing;
  } // Check if reader has reached the end of content.


  endOfContent(reader) {
    // footer size: 160bytes + 16-byte alignment padding
    // - 16bytes: magic
    // - padding til 16-byte alignment (at least 1byte?)
    //	(seems like some exporters embed fixed 15 or 16bytes?)
    // - 4bytes: magic
    // - 4bytes: version
    // - 120bytes: zero
    // - 16bytes: magic
    if (reader.size() % 16 === 0) {
      return (reader.getOffset() + 160 + 16 & ~0xf) >= reader.size();
    } else {
      return reader.getOffset() + 160 + 16 >= reader.size();
    }
  } // recursively parse nodes until the end of the file is reached


  parseNode(reader, version) {
    this.nodeParsingTotal++;
    const node = {}; // The first three data sizes depends on version.

    const endOffset = version >= 7500 ? reader.getUint64() : reader.getUint32();
    const numProperties = version >= 7500 ? reader.getUint64() : reader.getUint32();
    version >= 7500 ? reader.getUint64() : reader.getUint32(); // the returned propertyListLen is not used

    const nameLen = reader.getUint8();
    const name = reader.getString(nameLen);

    if (this.m_debug) {
      if (name == "Objects") {
        console.log("node have Objects A");
        this.m_isObjects = true;
      }

      if (this.m_isObjects && name == "Geometry") {
        this.m_isGeometry = true;
        console.log("node have Geometry A");
      }

      if (this.m_isGeometry && name != "") {
        console.log("parseNode(), name: ", name);
      }
    } // if(name == "Vertices") {
    // 	console.log("Vertices begin A.");
    // }
    // Regards this node as NULL-record if endOffset is zero


    if (endOffset === 0) return null;
    const propertyList = new Array(numProperties);
    this.m_pptParser.ppFlag = 0; // if(name == "PolygonVertexIndex"){
    // 	this.m_ppFlag = 12;
    // }

    switch (name) {
      case "Vertices":
      case "Normals":
      case "PolygonVertexIndex":
      case "UV":
      case "NormalsIndex":
        this.m_pptParser.ppFlag = 12;
        break;

      case "Edges":
      case "NormalsW":
      case "Materials":
        this.m_pptParser.ppFlag = 131;
        break;

      default:
        break;
    }

    for (let i = 0; i < numProperties; i++) {
      propertyList[i] = this.m_pptParser.parseProperty(reader);
    }
    /*
    if(name == "Vertices") {
        console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
        // console.log("Vertices begin m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
        console.log("Vertices begin propertyList: ", propertyList);
          // let u8Arr = reader.getArrayU8BufferByOffset( this.m_ppParams[0], this.m_ppParams[1] );
        // const data = fflate.unzlibSync( u8Arr, null );
        // const r2 = new BinaryReader( data.buffer );
        // let datafs = r2.getFloat64Array( this.m_ppParams[2] );
        // console.log("this.m_ppParams[1]: ",this.m_ppParams[1]);
        // console.log("pptlfs: ",propertyList[0]);
        // console.log("datafs: ",datafs);
      } else if(name == "Normals"){
        console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
        console.log("Normals begin propertyList: ", propertyList);
    } else if(name == "UV"){
        console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
        console.log("UV begin propertyList: ", propertyList);
    }
    //*/
    // if(name == "PolygonVertexIndex"){
    // 	console.log("parseNode name", name, " encoding: ", this.m_pptParser.encoding, ",ppType: ",this.m_pptParser.ppType);
    // 	console.log("PolygonVertexIndex begin propertyList: ", propertyList);
    // }
    // if(name == "PolygonVertexIndex"){
    // 	console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
    // 	console.log("PolygonVertexIndex begin propertyList: ", propertyList);
    // }
    // if(name == "NormalsIndex"){
    // 	console.log("parseNode name", name, " m_encoding: ", this.m_pptParser.encoding, ",m_ppType: ",this.m_pptParser.ppType);
    // 	console.log("NormalsIndex begin propertyList: ", propertyList);
    // }
    //
    // else if(name == "LayerElementUV"){
    // 	console.log("LayerElementUV begin propertyList: ", propertyList);
    // }
    //
    // Regards the first three elements in propertyList as id, attrName, and attrType


    const id = propertyList.length > 0 ? propertyList[0] : '';
    const attrName = propertyList.length > 1 ? propertyList[1] : '';
    const attrType = propertyList.length > 2 ? propertyList[2] : ''; // check if this node represents just a single property
    // like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}

    node.singleProperty = numProperties === 1 && reader.getOffset() === endOffset ? true : false; // console.log("endOffset: ",endOffset, ", reader.getOffset(): ", reader.getOffset());
    // let ps = reader.getOffset();
    // while ( endOffset > ps ) {

    while (endOffset > reader.getOffset()) {
      const subNode = this.parseNode(reader, version);
      if (subNode !== null) this.parseSubNode(name, node, subNode);
    }

    node.propertyList = propertyList; // raw property list used by parent

    if (typeof id === 'number') node.id = id;
    if (attrName !== '') node.attrName = attrName;
    if (attrType !== '') node.attrType = attrType;
    if (name !== '') node.name = name;
    /*
    if(name == "Vertices") {
        console.log("Vertices begin B.");
    }
    if(this.m_debug) {
        if(name == "Geometry") {
            console.log("node have Geometry B");
        }
        if(name == "Objects") {
            console.log("node have Objects B");
        }
    }
    //*/

    return node;
  }

  parseSubNode(name, node, subNode) {
    // special case: child node is single property
    if (subNode.singleProperty === true) {
      const value = subNode.propertyList[0];

      if (value.buffer != undefined) {
        console.log("parseSubNode(), value.buffer.byteLength: ", value.buffer.byteLength);
      } //if ( Array.isArray( value ) ) {


      if (value instanceof Array) {
        node[subNode.name] = subNode;
        subNode.a = value;
      } else {
        //console.log("value: ",value, typeof value);
        node[subNode.name] = value;
      }
    } else if (name === 'Connections' && subNode.name === 'C') {
      let ls = subNode.propertyList; // console.log("BinaryParser::parseSubNode(), ls: ",ls);

      let len = ls.length - 1;
      if (len < 0) len = 0;
      const array = new Array(len);

      for (let i = 1, j = 0; i < ls.length; ++i) {
        array[j] = ls[i];
        j++;
      }

      if (node.connections === undefined) {
        node.connections = [];
      } // console.log("BinaryParser::parseSubNode(), node.connections.push( array ): ",array);


      node.connections.push(array);
    } else if (subNode.name === 'Properties70') {
      const keys = Object.keys(subNode);
      keys.forEach(function (key) {
        node[key] = subNode[key];
      });
    } else if (name === 'Properties70' && subNode.name === 'P') {
      let innerPropName = subNode.propertyList[0];
      let innerPropType1 = subNode.propertyList[1];
      const innerPropType2 = subNode.propertyList[2];
      const innerPropFlag = subNode.propertyList[3];
      let innerPropValue;
      if (innerPropName.indexOf('Lcl ') === 0) innerPropName = innerPropName.replace('Lcl ', 'Lcl_');
      if (innerPropType1.indexOf('Lcl ') === 0) innerPropType1 = innerPropType1.replace('Lcl ', 'Lcl_');

      if (innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf('Lcl_') === 0) {
        innerPropValue = [subNode.propertyList[4], subNode.propertyList[5], subNode.propertyList[6]];
      } else {
        innerPropValue = subNode.propertyList[4];
      } // this will be copied to parent, see above


      node[innerPropName] = {
        'type': innerPropType1,
        'type2': innerPropType2,
        'flag': innerPropFlag,
        'value': innerPropValue
      };
    } else if (node[subNode.name] === undefined) {
      if (typeof subNode.id === 'number') {
        node[subNode.name] = {};
        node[subNode.name][subNode.id] = subNode;
      } else {
        node[subNode.name] = subNode;
      }
    } else {
      if (subNode.name === 'PoseNode') {
        if (!Array.isArray(node[subNode.name])) {
          node[subNode.name] = [node[subNode.name]];
        }

        node[subNode.name].push(subNode);
      } else if (node[subNode.name][subNode.id] === undefined) {
        node[subNode.name][subNode.id] = subNode;
      }
    }
  }

}

exports.BufferBinaryParser = BufferBinaryParser;

/***/ }),

/***/ "9a2d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class FBXTree {
  constructor() {
    this.map = {};
  }

  add(key, val) {
    // console.log("FBXTree::add(), key: ", key);
    // if(key == "Objects") {
    // 	console.log("FBXTree::add(), find Objects, val: ",val);
    // }
    this.map[key] = val;
  }

}

exports.FBXTree = FBXTree;

/***/ }),

/***/ "9cb6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Deflate", function() { return Deflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncDeflate", function() { return AsyncDeflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deflate", function() { return deflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deflateSync", function() { return deflateSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Inflate", function() { return Inflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncInflate", function() { return AsyncInflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inflate", function() { return inflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inflateSync", function() { return inflateSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gzip", function() { return Gzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncGzip", function() { return AsyncGzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gzip", function() { return gzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gzipSync", function() { return gzipSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gunzip", function() { return Gunzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncGunzip", function() { return AsyncGunzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gunzip", function() { return gunzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gunzipSync", function() { return gunzipSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Zlib", function() { return Zlib; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncZlib", function() { return AsyncZlib; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zlib", function() { return zlib; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zlibSync", function() { return zlibSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Unzlib", function() { return Unzlib; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncUnzlib", function() { return AsyncUnzlib; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unzlib", function() { return unzlib; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unzlibSync", function() { return unzlibSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compress", function() { return gzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncCompress", function() { return AsyncGzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compressSync", function() { return gzipSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Compress", function() { return Gzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Decompress", function() { return Decompress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncDecompress", function() { return AsyncDecompress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decompress", function() { return decompress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decompressSync", function() { return decompressSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DecodeUTF8", function() { return DecodeUTF8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EncodeUTF8", function() { return EncodeUTF8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "strToU8", function() { return strToU8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "strFromU8", function() { return strFromU8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZipPassThrough", function() { return ZipPassThrough; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZipDeflate", function() { return ZipDeflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncZipDeflate", function() { return AsyncZipDeflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Zip", function() { return Zip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return zip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zipSync", function() { return zipSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnzipPassThrough", function() { return UnzipPassThrough; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnzipInflate", function() { return UnzipInflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsyncUnzipInflate", function() { return AsyncUnzipInflate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Unzip", function() { return Unzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unzip", function() { return unzip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unzipSync", function() { return unzipSync; });
/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/
// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).
// var ch2 = {};
// var durl = function (c) { return URL.createObjectURL(new Blob([c], { type: 'text/javascript' })); };
// var cwk = function (u) { return new Worker(u); };
// try {
//     URL.revokeObjectURL(durl(''));
// }
// catch (e) {
//     // We're in Deno or a very old browser
//     durl = function (c) { return 'data:application/javascript;charset=UTF-8,' + encodeURI(c); };
//     // If Deno, this is necessary; if not, this changes nothing
//     cwk = function (u) { return new Worker(u, { type: 'module' }); };
// }
// var wk = (function (c, id, msg, transfer, cb) {
//     var w = cwk(ch2[id] || (ch2[id] = durl(c)));
//     w.onerror = function (e) { return cb(e.error, null); };
//     w.onmessage = function (e) { return cb(null, e.data); };
//     w.postMessage(msg, transfer);
//     return w;
// });
// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array,
    u16 = Uint16Array,
    u32 = Uint32Array; // fixed length extra bits

var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0,
/* unused */
0, 0,
/* impossible */
0]); // fixed distance extra bits
// see fleb note

var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13,
/* unused */
0, 0]); // code length index map

var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]); // get base, reverse index map from extra bits

var freb = function (eb, start) {
  var b = new u16(31);

  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  } // numbers here are at max 18 bits


  var r = new u32(b[30]);

  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }

  return [b, r];
};

var _a = freb(fleb, 2),
    fl = _a[0],
    revfl = _a[1]; // we can ignore the fact that the other numbers are wrong; they never happen anyway


fl[28] = 258, revfl[258] = 28;

var _b = freb(fdeb, 0),
    fd = _b[0],
    revfd = _b[1]; // map of value to reverse (assuming 16 bits)


var rev = new u16(32768);

for (var i = 0; i < 32768; ++i) {
  // reverse table algorithm from SO
  var x = (i & 0xAAAA) >>> 1 | (i & 0x5555) << 1;
  x = (x & 0xCCCC) >>> 2 | (x & 0x3333) << 2;
  x = (x & 0xF0F0) >>> 4 | (x & 0x0F0F) << 4;
  rev[i] = ((x & 0xFF00) >>> 8 | (x & 0x00FF) << 8) >>> 1;
} // create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?


var flt_u8_288 = new u8(288);

var hMap = function (cd, mb, r) {
  var s = cd.length; // index

  var i = 0; // u16 "map": index -> # of codes with bit length = index

  var l = new u16(mb); // length of cd must be 288 (total # of codes)

  for (; i < s; ++i) ++l[cd[i] - 1]; // u16 "map": index -> minimum code for bit length = index


  var le = new u16(mb);

  for (i = 0; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }

  var co;

  if (r) {
    // u16 "map": index -> number of actual bits, symbol for code
    co = new u16(1 << mb); // bits to remove for reverser

    var rvb = 15 - mb;

    for (i = 0; i < s; ++i) {
      // ignore 0 lengths
      if (cd[i]) {
        // num encoding both symbol and bits read
        var sv = i << 4 | cd[i]; // free bits

        var r_1 = mb - cd[i]; // start value

        var v = le[cd[i] - 1]++ << r_1; // m is end value

        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          // every 16 bit value starting with the code yields the same result
          co[rev[v] >>> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);

    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >>> 15 - cd[i];
      }
    }
  }

  return co;
}; // fixed length tree
// var flt = new u8(288);


var flt = flt_u8_288;

for (var i = 0; i < 144; ++i) flt[i] = 8;

for (var i = 144; i < 256; ++i) flt[i] = 9;

for (var i = 256; i < 280; ++i) flt[i] = 7;

for (var i = 280; i < 288; ++i) flt[i] = 8; // fixed distance tree


var fdt = new u8(32);

for (var i = 0; i < 32; ++i) fdt[i] = 5; // fixed length map


var flm = /*#__PURE__*/hMap(flt, 9, 0),
    flrm = /*#__PURE__*/hMap(flt, 9, 1); // fixed distance map

var fdm = /*#__PURE__*/hMap(fdt, 5, 0),
    fdrm = /*#__PURE__*/hMap(fdt, 5, 1); // find max of array

var max = function (a) {
  var m = a[0];

  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m) m = a[i];
  }

  return m;
}; // read d, starting at bit p and mask with m


var bits = function (d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
}; // read d, starting at bit p continuing for at least 16 bits


var bits16 = function (d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
}; // get end of byte


var shft = function (p) {
  return (p / 8 | 0) + (p & 7 && 1);
}; // typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice


var slc = function (v, s, e) {
  if (s == null || s < 0) s = 0;
  if (e == null || e > v.length) e = v.length; // can't use .constructor in case user-supplied

  var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
  n.set(v.subarray(s, e));
  return n;
};

var slc2 = function (v, s, e) {
  // if (s == null || s < 0)
  //     s = 0;
  // if (e == null || e > v.length)
  //     e = v.length;
  // can't use .constructor in case user-supplied
  //var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
  //n.set(v.subarray(s, e));
  return v;
};

var clt_u8_19 = new u8(19);
let ldt_u8_1024 = new u8(1024);

function calcCeilPowerOfTwo(value) {
  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

let bufPool = new Array(128);
bufPool.fill(null);
let bufCurrSize = 0; // expands raw DEFLATE data

var inflt = function (dat, buf, st) {
  // console.log("$$$$$$ create inflt src buf size: ",dat.length);
  // source length
  var sl = dat.length;
  if (!sl || st && !st.l && sl < 5) return buf || new u8(0); // have to estimate size

  var noBuf = !buf || st; // no state

  var noSt = !st || st.i;
  if (!st) st = {}; // Assumes roughly 33% compression ratio average

  if (!buf) {
    //buf = new u8(sl * 3);
    bufCurrSize = sl; //sl * 3;

    let size = calcCeilPowerOfTwo(bufCurrSize);
    let i = Math.log2(size);
    buf = bufPool[i];

    if (buf == null) {
      // console.log("###### create inflt buf sizeA: ",size);
      buf = new u8(size);
      bufPool[i] = buf;
    }
  } // ensure buffer can fit at least l elements


  var cbuf = function (l) {
    var bl = buf.length; // need to increase size to fit

    if (l > bl) {
      // Double or set to necessary, whichever is greater
      // var nbuf = new u8(Math.max(bl * 2, l));
      bufCurrSize = l; //Math.max(bl * 2, l);

      let size = calcCeilPowerOfTwo(bufCurrSize);
      let i = Math.log2(size);
      var nbuf = bufPool[i];

      if (nbuf == null) {
        // 大于五亿的长度则要重新使用新的内存规则, 如果 536870912 乘以2, 则会让内存直接崩溃
        // 这里的内存管理机制需要深入研究
        if (bufCurrSize <= 536870912) {
          // console.log("###### create inflt buf sizeB: ",size,"(",bufCurrSize,")", ",srcLen: ",dat.length);
          nbuf = new u8(size);
          bufPool[i] = nbuf;
        } else {
          size = bufCurrSize + 131072 * 2;
          nbuf = new u8(size); // console.log("###### create inflt buf sizeC: ",size+"("+bufCurrSize+"), srcLen: "+dat.length);
        }
      } //console.log("Math.max(bl * 2, l): ", Math.max(bl * 2, l));


      nbuf.set(buf);
      buf = nbuf;
    }
  }; //  last chunk         bitpos           bytes


  var final = st.f || 0,
      pos = st.p || 0,
      bt = st.b || 0,
      lm = st.l,
      dm = st.d,
      lbt = st.m,
      dbt = st.n; // total bits

  let tbts = sl * 8; // console.log("$$$$$$++ inflt tbts size, sl: ",tbts, sl);

  do {
    if (!lm) {
      // BFINAL - this is only 1 when last chunk is next
      st.f = final = bits(dat, pos, 1); // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman

      var type = bits(dat, pos + 1, 3);
      pos += 3;

      if (!type) {
        // go to end of byte boundary
        var s = shft(pos) + 4,
            l = dat[s - 4] | dat[s - 3] << 8,
            t = s + l;

        if (t > sl) {
          if (noSt) throw 'unexpected EOF';
          break;
        } // ensure size


        if (noBuf) {
          cbuf(bt + l);
        } // Copy over uncompressed data


        buf.set(dat.subarray(s, t), bt); // Get new bitpos, update byte count

        st.b = bt += l, st.p = pos = t * 8;
        continue;
      } else if (type == 1) lm = flrm, dm = fdrm, lbt = 9, dbt = 5;else if (type == 2) {
        //  literal                            lengths
        var hLit = bits(dat, pos, 31) + 257,
            hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14; // length+distance tree
        // var ldt = new u8(tl);

        let ldt = ldt_u8_1024.subarray(0, tl);

        for (let i = 0; i < tl; ++i) ldt[i] = 0; // code length tree
        //var clt = new u8(19);


        let clt = clt_u8_19;

        for (let i = 0; i < 19; ++i) clt[i] = 0;

        for (var i = 0; i < hcLen; ++i) {
          // use index map to get real code
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }

        pos += hcLen * 3; // code lengths bits

        var clb = max(clt),
            clbmsk = (1 << clb) - 1; // code lengths map

        var clm = hMap(clt, clb, 1);

        for (var i = 0; i < tl;) {
          var r = clm[bits(dat, pos, clbmsk)]; // bits read

          pos += r & 15; // symbol

          var s = r >>> 4; // code length to copy

          if (s < 16) {
            ldt[i++] = s;
          } else {
            //  copy   count
            var c = 0,
                n = 0;
            if (s == 16) n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];else if (s == 17) n = 3 + bits(dat, pos, 7), pos += 3;else if (s == 18) n = 11 + bits(dat, pos, 127), pos += 7;

            while (n--) ldt[i++] = c;
          }
        } //    length tree                 distance tree


        var lt = ldt.subarray(0, hLit),
            dt = ldt.subarray(hLit); // max length bits

        lbt = max(lt); // max dist bits

        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else throw 'invalid block type';

      if (pos > tbts) {
        if (noSt) throw 'unexpected EOF';
        break;
      }
    } // Make sure the buffer can hold this + the largest possible addition
    // Maximum chunk size (practically, theoretically infinite) is 2^17;


    if (noBuf) {
      // console.log("bt01: ",bt, ", pos: ", pos);
      cbuf(bt + 131072);
    }

    var lms = (1 << lbt) - 1,
        dms = (1 << dbt) - 1;
    var lpos = pos;

    for (;; lpos = pos) {
      // bits read, code
      var c = lm[bits16(dat, pos) & lms],
          sym = c >>> 4;
      pos += c & 15;

      if (pos > tbts) {
        if (noSt) throw 'unexpected EOF';
        break;
      }

      if (!c) throw 'invalid length/literal';
      if (sym < 256) buf[bt++] = sym;else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254; // no extra bits needed if less

        if (sym > 264) {
          // index
          var i = sym - 257,
              b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        } // dist


        var d = dm[bits16(dat, pos) & dms],
            dsym = d >>> 4;
        if (!d) throw 'invalid distance';
        pos += d & 15;
        var dt = fd[dsym];

        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }

        if (pos > tbts) {
          if (noSt) throw 'unexpected EOF';
          break;
        }

        if (noBuf) {
          // console.log("bt02: ",bt, ", pos: ", pos);
          cbuf(bt + 131072);
        }

        var end = bt + add;

        for (; bt < end; bt += 4) {
          buf[bt] = buf[bt - dt];
          buf[bt + 1] = buf[bt + 1 - dt];
          buf[bt + 2] = buf[bt + 2 - dt];
          buf[bt + 3] = buf[bt + 3 - dt];
        }

        bt = end;
      }
    }

    st.l = lm, st.p = lpos, st.b = bt;
    if (lm) final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);

  return bt == buf.length ? buf : slc2(buf, 0, bt);
}; // starting at p, write the minimum number of bits that can hold v to d


var wbits = function (d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >>> 8;
}; // starting at p, write the minimum number of bits (>8) that can hold v to d


var wbits16 = function (d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >>> 8;
  d[o + 2] |= v >>> 16;
}; // creates code lengths from a frequency table


var hTree = function (d, mb) {
  // Need extra info to make a tree
  var t = [];

  for (var i = 0; i < d.length; ++i) {
    if (d[i]) t.push({
      s: i,
      f: d[i]
    });
  }

  var s = t.length;
  var t2 = t.slice();
  if (!s) return [et, 0];

  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return [v, 1];
  }

  t.sort(function (a, b) {
    return a.f - b.f;
  }); // after i2 reaches last ind, will be stopped
  // freq must be greater than largest possible number of symbols

  t.push({
    s: -1,
    f: 25001
  });
  var l = t[0],
      r = t[1],
      i0 = 0,
      i1 = 1,
      i2 = 2;
  t[0] = {
    s: -1,
    f: l.f + r.f,
    l: l,
    r: r
  }; // efficient algorithm from UZIP.js
  // i0 is lookbehind, i2 is lookahead - after processing two low-freq
  // symbols that combined have high freq, will start processing i2 (high-freq,
  // non-composite) symbols instead
  // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/

  while (i1 != s - 1) {
    l = t[t[i0].f < t[i2].f ? i0++ : i2++];
    r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
    t[i1++] = {
      s: -1,
      f: l.f + r.f,
      l: l,
      r: r
    };
  }

  var maxSym = t2[0].s;

  for (var i = 1; i < s; ++i) {
    if (t2[i].s > maxSym) maxSym = t2[i].s;
  } // code lengths


  var tr = new u16(maxSym + 1); // max bits in tree

  var mbt = ln(t[i1 - 1], tr, 0);

  if (mbt > mb) {
    // more algorithms from UZIP.js
    // TODO: find out how this code works (debt)
    //  ind    debt
    var i = 0,
        dt = 0; //    left            cost

    var lft = mbt - mb,
        cst = 1 << lft;
    t2.sort(function (a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });

    for (; i < s; ++i) {
      var i2_1 = t2[i].s;

      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else break;
    }

    dt >>>= lft;

    while (dt > 0) {
      var i2_2 = t2[i].s;
      if (tr[i2_2] < mb) dt -= 1 << mb - tr[i2_2]++ - 1;else ++i;
    }

    for (; i >= 0 && dt; --i) {
      var i2_3 = t2[i].s;

      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }

    mbt = mb;
  }

  return [new u8(tr), mbt];
}; // get the max length and assign length codes


var ln = function (n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
}; // length codes generation


var lc = function (c) {
  var s = c.length; // Note that the semicolon was intentional

  while (s && !c[--s]);

  var cl = new u16(++s); //  ind      num         streak

  var cli = 0,
      cln = c[0],
      cls = 1;

  var w = function (v) {
    cl[cli++] = v;
  };

  for (var i = 1; i <= s; ++i) {
    if (c[i] == cln && i != s) ++cls;else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138) w(32754);

        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;

        for (; cls > 6; cls -= 6) w(8304);

        if (cls > 2) w(cls - 3 << 5 | 8208), cls = 0;
      }

      while (cls--) w(cln);

      cls = 1;
      cln = c[i];
    }
  }

  return [cl.subarray(0, cli), s];
}; // calculate the length of output from tree, code lengths


var clen = function (cf, cl) {
  var l = 0;

  for (var i = 0; i < cl.length; ++i) l += cf[i] * cl[i];

  return l;
}; // writes a fixed block
// returns the new bit pos


var wfblk = function (out, pos, dat) {
  // no need to write 00 as type: TypedArray defaults to 0
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >>> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;

  for (var i = 0; i < s; ++i) out[o + i + 4] = dat[i];

  return (o + 4 + s) * 8;
};

let lcfreq_u16_19_init = new u16(19);
let lcfreq_u16_19 = new u16(19); // writes a block

var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];

  var _a = hTree(lf, 15),
      dlt = _a[0],
      mlb = _a[1];

  var _b = hTree(df, 15),
      ddt = _b[0],
      mdb = _b[1];

  var _c = lc(dlt),
      lclt = _c[0],
      nlc = _c[1];

  var _d = lc(ddt),
      lcdt = _d[0],
      ndc = _d[1]; // var lcfreq = new u16(19);


  let lcfreq = lcfreq_u16_19;
  lcfreq.set(lcfreq_u16_19_init);

  for (var i = 0; i < lclt.length; ++i) lcfreq[lclt[i] & 31]++;

  for (var i = 0; i < lcdt.length; ++i) lcfreq[lcdt[i] & 31]++;

  var _e = hTree(lcfreq, 7),
      lct = _e[0],
      mlcb = _e[1];

  var nlcc = 19;

  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc);

  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
  if (flen <= ftlen && flen <= dtlen) return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;

  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;

    for (var i = 0; i < nlcc; ++i) wbits(out, p + 3 * i, lct[clim[i]]);

    p += 3 * nlcc;
    var lcts = [lclt, lcdt];

    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];

      for (var i = 0; i < clct.length; ++i) {
        var len = clct[i] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15) wbits(out, p, clct[i] >>> 5 & 127), p += clct[i] >>> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }

  for (var i = 0; i < li; ++i) {
    if (syms[i] > 255) {
      var len = syms[i] >>> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7) wbits(out, p, syms[i] >>> 23 & 31), p += fleb[len];
      var dst = syms[i] & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3) wbits16(out, p, syms[i] >>> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
    }
  }

  wbits16(out, p, lm[256]);
  return p + ll[256];
}; // deflate options (nice << 13) | chain


var deo = /*#__PURE__*/new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]); // empty

var et = /*#__PURE__*/new u8(0);
let syms_u32_25000_init = new u32(25000);
let syms_u32_25000 = new u32(25000);
let lf_u16_288_init = new u16(288);
let df_u16_32_init = new u16(32);
let lf_u16_288 = new u16(288);
let df_u16_32 = new u16(32); // compresses data into a raw DEFLATE buffer

var dflt = function (dat, lvl, plvl, pre, post, lst) {
  var s = dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post); // writing to this writes to the output buffer

  var w = o.subarray(pre, o.length - post);
  var pos = 0;

  if (!lvl || s < 8) {
    for (var i = 0; i <= s; i += 65535) {
      // end
      var e = i + 65535;

      if (e < s) {
        // write full block
        pos = wfblk(w, pos, dat.subarray(i, e));
      } else {
        // write final block
        w[i] = lst;
        pos = wfblk(w, pos, dat.subarray(i, s));
      }
    }
  } else {
    var opt = deo[lvl - 1];
    var n = opt >>> 13,
        c = opt & 8191;
    var msk_1 = (1 << plvl) - 1; //    prev 2-byte val map    curr 2-byte val map

    var prev = new u16(32768),
        head = new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3),
        bs2_1 = 2 * bs1_1;

    var hsh = function (i) {
      return (dat[i] ^ dat[i + 1] << bs1_1 ^ dat[i + 2] << bs2_1) & msk_1;
    }; // 24576 is an arbitrary number of maximum symbols per block
    // 424 buffer for last block
    // var syms = new u32(25000);


    let syms = syms_u32_25000;
    syms.set(syms_u32_25000_init); // length/literal freq   distance freq
    // let lf = new u16(288);
    // let df = new u16(32);

    let lf = lf_u16_288;
    lf.set(lf_u16_288_init);
    let df = df_u16_32;
    df.set(df_u16_32_init); //  l/lcnt  exbits  index  l/lind  waitdx  bitpos

    let lc_1 = 0,
        eb = 0,
        i = 0,
        li = 0,
        wi = 0,
        bs = 0;

    for (; i < s; ++i) {
      // hash value
      // deopt when i > s - 3 - at end, deopt acceptable
      var hv = hsh(i); // index mod 32768    previous index mod

      var imod = i & 32767,
          pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod; // We always should modify head and prev, but only add symbols if
      // this data is not yet processed ("wait" for wait index)

      if (wi <= i) {
        // bytes remaining
        var rem = s - i;

        if ((lc_1 > 7000 || li > 24576) && rem > 423) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
          li = lc_1 = eb = 0, bs = i;

          for (var j = 0; j < 286; ++j) lf[j] = 0;

          for (var j = 0; j < 30; ++j) df[j] = 0;
        } //  len    dist   chain


        var l = 2,
            d = 0,
            ch_1 = c,
            dif = imod - pimod & 32767;

        if (rem > 2 && hv == hsh(i - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i); // max possible length
          // not capped at dif because decompressors implement "rolling" index population

          var ml = Math.min(258, rem);

          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i + l] == dat[i + l - dif]) {
              var nl = 0;

              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl);

              if (nl > l) {
                l = nl, d = dif; // break out early when we reach "nice" (we are satisfied enough)

                if (nl > maxn) break; // now, find the rarest 2-byte sequence within this
                // length of literals and search for that instead.
                // Much faster than just using the start

                var mmd = Math.min(dif, nl - 2);
                var md = 0;

                for (var j = 0; j < mmd; ++j) {
                  var ti = i - dif + j + 32768 & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti + 32768 & 32767;
                  if (cd > md) md = cd, pimod = ti;
                }
              }
            } // check the previous match


            imod = pimod, pimod = prev[imod];
            dif += imod - pimod + 32768 & 32767;
          }
        } // d will be nonzero only when a match was found


        if (d) {
          // store both dist and len data in one Uint32
          // Make sure this is recognized as a len/dist with 28th bit (2^28)
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31,
              din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
      }
    }

    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos); // this is the easiest way to avoid needing to maintain state

    if (!lst && pos & 7) pos = wfblk(w, pos + 1, et);
  }

  return slc(o, 0, pre + shft(pos) + post);
}; // CRC32 table


var crct = /*#__PURE__*/function () {
  var t = new u32(256);

  for (var i = 0; i < 256; ++i) {
    var c = i,
        k = 9;

    while (--k) c = (c & 1 && 0xEDB88320) ^ c >>> 1;

    t[i] = c;
  }

  return t;
}(); // CRC32


var crc = function () {
  var c = -1;
  return {
    p: function (d) {
      // closures have awful performance
      var cr = c;

      for (var i = 0; i < d.length; ++i) cr = crct[cr & 255 ^ d[i]] ^ cr >>> 8;

      c = cr;
    },
    d: function () {
      return ~c;
    }
  };
}; // Alder32


var adler = function () {
  var a = 1,
      b = 0;
  return {
    p: function (d) {
      // closures have awful performance
      var n = a,
          m = b;
      var l = d.length;

      for (var i = 0; i != l;) {
        var e = Math.min(i + 2655, l);

        for (; i < e; ++i) m += n += d[i];

        n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
      }

      a = n, b = m;
    },
    d: function () {
      a %= 65521, b %= 65521;
      return (a & 255) << 24 | a >>> 8 << 16 | (b & 255) << 8 | b >>> 8;
    }
  };
};

; // deflate with opts

var dopt = function (dat, opt, pre, post, st) {
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 12 + opt.mem, pre, post, !st);
}; // Walmart object spread


var mrg = function (a, b) {
  var o = {};

  for (var k in a) o[k] = a[k];

  for (var k in b) o[k] = b[k];

  return o;
}; // worker clone
// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.
// This took me three weeks to figure out how to do.


var wcln = function (fn, fnStr, td) {
  var dt = fn();
  var st = fn.toString();
  var ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/ /g, '').split(',');

  for (var i = 0; i < dt.length; ++i) {
    var v = dt[i],
        k = ks[i];

    if (typeof v == 'function') {
      fnStr += ';' + k + '=';
      var st_1 = v.toString();

      if (v.prototype) {
        // for global objects
        if (st_1.indexOf('[native code]') != -1) {
          var spInd = st_1.indexOf(' ', 8) + 1;
          fnStr += st_1.slice(spInd, st_1.indexOf('(', spInd));
        } else {
          fnStr += st_1;

          for (var t in v.prototype) fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
        }
      } else fnStr += st_1;
    } else td[k] = v;
  }

  return [fnStr, td];
};

var ch = []; // clone bufs

var cbfs = function (v) {
  var tl = [];

  for (var k in v) {
    if (v[k] instanceof u8 || v[k] instanceof u16 || v[k] instanceof u32) tl.push((v[k] = new v[k].constructor(v[k])).buffer);
  }

  return tl;
}; // use a worker to execute code


var wrkr = function (fns, init, id, cb) {
  var _a;

  if (!ch[id]) {
    var fnStr = '',
        td_1 = {},
        m = fns.length - 1;

    for (var i = 0; i < m; ++i) _a = wcln(fns[i], fnStr, td_1), fnStr = _a[0], td_1 = _a[1];

    ch[id] = wcln(fns[m], fnStr, td_1);
  }

  var td = mrg({}, ch[id][1]);
  return wk(ch[id][0] + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
}; // base async inflate fn


var bInflt = function () {
  return [u8, u16, u32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, hMap, max, bits, bits16, shft, slc, inflt, inflateSync, pbf, gu8];
};

var bDflt = function () {
  return [u8, u16, u32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
}; // gzip extra


var gze = function () {
  return [gzh, gzhl, wbytes, crc, crct];
}; // gunzip extra


var guze = function () {
  return [gzs, gzl];
}; // zlib extra


var zle = function () {
  return [zlh, wbytes, adler];
}; // unzlib extra


var zule = function () {
  return [zlv];
}; // post buf


var pbf = function (msg) {
  return postMessage(msg, [msg.buffer]);
}; // get u8


var gu8 = function (o) {
  return o && o.size && new u8(o.size);
}; // async helper


var cbify = function (dat, opts, fns, init, id, cb) {
  var w = wrkr(fns, init, id, function (err, dat) {
    w.terminate();
    cb(err, dat);
  });
  w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
  return function () {
    w.terminate();
  };
}; // auto stream


var astrm = function (strm) {
  strm.ondata = function (dat, final) {
    return postMessage([dat, final], [dat.buffer]);
  };

  return function (ev) {
    return strm.push(ev.data[0], ev.data[1]);
  };
}; // async stream attach


var astrmify = function (fns, strm, opts, init, id) {
  var t;
  var w = wrkr(fns, init, id, function (err, dat) {
    if (err) w.terminate(), strm.ondata.call(strm, err);else {
      if (dat[1]) w.terminate();
      strm.ondata.call(strm, err, dat[0], dat[1]);
    }
  });
  w.postMessage(opts);

  strm.push = function (d, f) {
    if (t) throw 'stream finished';
    if (!strm.ondata) throw 'no stream handler';
    w.postMessage([d, t = f], [d.buffer]);
  };

  strm.terminate = function () {
    w.terminate();
  };
}; // read 2 bytes


var b2 = function (d, b) {
  return d[b] | d[b + 1] << 8;
}; // read 4 bytes


var b4 = function (d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};

var b8 = function (d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
}; // write bytes


var wbytes = function (d, b, v) {
  for (; v; ++b) d[b] = v, v >>>= 8;
}; // gzip header


var gzh = function (c, o) {
  var fn = o.filename;
  c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix

  if (o.mtime != 0) wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));

  if (fn) {
    c[3] = 8;

    for (var i = 0; i <= fn.length; ++i) c[i + 10] = fn.charCodeAt(i);
  }
}; // gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start


var gzs = function (d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8) throw 'invalid gzip data';
  var flg = d[3];
  var st = 10;
  if (flg & 4) st += d[10] | (d[11] << 8) + 2;

  for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++]);

  return st + (flg & 2);
}; // gzip length


var gzl = function (d) {
  var l = d.length;
  return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
}; // gzip header length


var gzhl = function (o) {
  return 10 + (o.filename && o.filename.length + 1 || 0);
}; // zlib header


var zlh = function (c, o) {
  var lv = o.level,
      fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  c[0] = 120, c[1] = fl << 6 | (fl ? 32 - 2 * fl : 1);
}; // zlib valid


var zlv = function (d) {
  if ((d[0] & 15) != 8 || d[0] >>> 4 > 7 || (d[0] << 8 | d[1]) % 31) throw 'invalid zlib data';
  if (d[1] & 32) throw 'invalid zlib data: preset dictionaries not supported';
};

function AsyncCmpStrm(opts, cb) {
  if (!cb && typeof opts == 'function') cb = opts, opts = {};
  this.ondata = cb;
  return opts;
} // zlib footer: -4 to -0 is Adler32

/**
 * Streaming DEFLATE compression
 */


var Deflate = /*#__PURE__*/function () {
  function Deflate(opts, cb) {
    if (!cb && typeof opts == 'function') cb = opts, opts = {};
    this.ondata = cb;
    this.o = opts || {};
  }

  Deflate.prototype.p = function (c, f) {
    this.ondata(dopt(c, this.o, 0, 0, !f), f);
  };
  /**
   * Pushes a chunk to be deflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Deflate.prototype.push = function (chunk, final) {
    if (this.d) throw 'stream finished';
    if (!this.ondata) throw 'no stream handler';
    this.d = final;
    this.p(chunk, final || false);
  };

  return Deflate;
}();


/**
 * Asynchronous streaming DEFLATE compression
 */

var AsyncDeflate = /*#__PURE__*/function () {
  function AsyncDeflate(opts, cb) {
    astrmify([bDflt, function () {
      return [astrm, Deflate];
    }], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
      var strm = new Deflate(ev.data);
      onmessage = astrm(strm);
    }, 6);
  }

  return AsyncDeflate;
}();


function deflate(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts, [bDflt], function (ev) {
    return pbf(deflateSync(ev.data[0], ev.data[1]));
  }, 0, cb);
}
/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */

function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
/**
 * Streaming DEFLATE decompression
 */

var Inflate = /*#__PURE__*/function () {
  /**
   * Creates an inflation stream
   * @param cb The callback to call whenever data is inflated
   */
  function Inflate(cb) {
    this.s = {};
    this.p = new u8(0);
    this.ondata = cb;
  }

  Inflate.prototype.e = function (c) {
    if (this.d) throw 'stream finished';
    if (!this.ondata) throw 'no stream handler';
    var l = this.p.length;
    var n = new u8(l + c.length);
    n.set(this.p), n.set(c, l), this.p = n;
  };

  Inflate.prototype.c = function (final) {
    this.d = this.s.i = final || false;
    var bts = this.s.b;
    var dt = inflt(this.p, this.o, this.s);
    this.ondata(slc(dt, bts, this.s.b), this.d);
    this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
    this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
  };
  /**
   * Pushes a chunk to be inflated
   * @param chunk The chunk to push
   * @param final Whether this is the final chunk
   */


  Inflate.prototype.push = function (chunk, final) {
    this.e(chunk), this.c(final);
  };

  return Inflate;
}();


/**
 * Asynchronous streaming DEFLATE decompression
 */

var AsyncInflate = /*#__PURE__*/function () {
  /**
   * Creates an asynchronous inflation stream
   * @param cb The callback to call whenever data is deflated
   */
  function AsyncInflate(cb) {
    this.ondata = cb;
    astrmify([bInflt, function () {
      return [astrm, Inflate];
    }], this, 0, function () {
      var strm = new Inflate();
      onmessage = astrm(strm);
    }, 7);
  }

  return AsyncInflate;
}();


function inflate(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts, [bInflt], function (ev) {
    return pbf(inflateSync(ev.data[0], gu8(ev.data[1])));
  }, 1, cb);
}
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */

function inflateSync(data, out) {
  return inflt(data, out);
} // before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.

/**
 * Streaming GZIP compression
 */

var Gzip = /*#__PURE__*/function () {
  function Gzip(opts, cb) {
    this.c = crc();
    this.l = 0;
    this.v = 1;
    Deflate.call(this, opts, cb);
  }
  /**
   * Pushes a chunk to be GZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Gzip.prototype.push = function (chunk, final) {
    Deflate.prototype.push.call(this, chunk, final);
  };

  Gzip.prototype.p = function (c, f) {
    this.c.p(c);
    this.l += c.length;
    var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, !f);
    if (this.v) gzh(raw, this.o), this.v = 0;
    if (f) wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
    this.ondata(raw, f);
  };

  return Gzip;
}();


/**
 * Asynchronous streaming GZIP compression
 */

var AsyncGzip = /*#__PURE__*/function () {
  function AsyncGzip(opts, cb) {
    astrmify([bDflt, gze, function () {
      return [astrm, Deflate, Gzip];
    }], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
      var strm = new Gzip(ev.data);
      onmessage = astrm(strm);
    }, 8);
  }

  return AsyncGzip;
}();


function gzip(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts, [bDflt, gze, function () {
    return [gzipSync];
  }], function (ev) {
    return pbf(gzipSync(ev.data[0], ev.data[1]));
  }, 2, cb);
}
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */

function gzipSync(data, opts) {
  if (!opts) opts = {};
  var c = crc(),
      l = data.length;
  c.p(data);
  var d = dopt(data, opts, gzhl(opts), 8),
      s = d.length;
  return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
/**
 * Streaming GZIP decompression
 */

var Gunzip = /*#__PURE__*/function () {
  /**
   * Creates a GUNZIP stream
   * @param cb The callback to call whenever data is inflated
   */
  function Gunzip(cb) {
    this.v = 1;
    Inflate.call(this, cb);
  }
  /**
   * Pushes a chunk to be GUNZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Gunzip.prototype.push = function (chunk, final) {
    Inflate.prototype.e.call(this, chunk);

    if (this.v) {
      var s = this.p.length > 3 ? gzs(this.p) : 4;
      if (s >= this.p.length && !final) return;
      this.p = this.p.subarray(s), this.v = 0;
    }

    if (final) {
      if (this.p.length < 8) throw 'invalid gzip stream';
      this.p = this.p.subarray(0, -8);
    } // necessary to prevent TS from using the closure value
    // This allows for workerization to function correctly


    Inflate.prototype.c.call(this, final);
  };

  return Gunzip;
}();


/**
 * Asynchronous streaming GZIP decompression
 */

var AsyncGunzip = /*#__PURE__*/function () {
  /**
   * Creates an asynchronous GUNZIP stream
   * @param cb The callback to call whenever data is deflated
   */
  function AsyncGunzip(cb) {
    this.ondata = cb;
    astrmify([bInflt, guze, function () {
      return [astrm, Inflate, Gunzip];
    }], this, 0, function () {
      var strm = new Gunzip();
      onmessage = astrm(strm);
    }, 9);
  }

  return AsyncGunzip;
}();


function gunzip(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts, [bInflt, guze, function () {
    return [gunzipSync];
  }], function (ev) {
    return pbf(gunzipSync(ev.data[0]));
  }, 3, cb);
}
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */

function gunzipSync(data, out) {
  return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}
/**
 * Streaming Zlib compression
 */

var Zlib = /*#__PURE__*/function () {
  function Zlib(opts, cb) {
    this.c = adler();
    this.v = 1;
    Deflate.call(this, opts, cb);
  }
  /**
   * Pushes a chunk to be zlibbed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Zlib.prototype.push = function (chunk, final) {
    Deflate.prototype.push.call(this, chunk, final);
  };

  Zlib.prototype.p = function (c, f) {
    this.c.p(c);
    var raw = dopt(c, this.o, this.v && 2, f && 4, !f);
    if (this.v) zlh(raw, this.o), this.v = 0;
    if (f) wbytes(raw, raw.length - 4, this.c.d());
    this.ondata(raw, f);
  };

  return Zlib;
}();


/**
 * Asynchronous streaming Zlib compression
 */

var AsyncZlib = /*#__PURE__*/function () {
  function AsyncZlib(opts, cb) {
    astrmify([bDflt, zle, function () {
      return [astrm, Deflate, Zlib];
    }], this, AsyncCmpStrm.call(this, opts, cb), function (ev) {
      var strm = new Zlib(ev.data);
      onmessage = astrm(strm);
    }, 10);
  }

  return AsyncZlib;
}();


function zlib(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts, [bDflt, zle, function () {
    return [zlibSync];
  }], function (ev) {
    return pbf(zlibSync(ev.data[0], ev.data[1]));
  }, 4, cb);
}
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */

function zlibSync(data, opts) {
  if (!opts) opts = {};
  var a = adler();
  a.p(data);
  var d = dopt(data, opts, 2, 4);
  return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
/**
 * Streaming Zlib decompression
 */

var Unzlib = /*#__PURE__*/function () {
  /**
   * Creates a Zlib decompression stream
   * @param cb The callback to call whenever data is inflated
   */
  function Unzlib(cb) {
    this.v = 1;
    Inflate.call(this, cb);
  }
  /**
   * Pushes a chunk to be unzlibbed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Unzlib.prototype.push = function (chunk, final) {
    Inflate.prototype.e.call(this, chunk);

    if (this.v) {
      if (this.p.length < 2 && !final) return;
      this.p = this.p.subarray(2), this.v = 0;
    }

    if (final) {
      if (this.p.length < 4) throw 'invalid zlib stream';
      this.p = this.p.subarray(0, -4);
    } // necessary to prevent TS from using the closure value
    // This allows for workerization to function correctly


    Inflate.prototype.c.call(this, final);
  };

  return Unzlib;
}();


/**
 * Asynchronous streaming Zlib decompression
 */

var AsyncUnzlib = /*#__PURE__*/function () {
  /**
   * Creates an asynchronous Zlib decompression stream
   * @param cb The callback to call whenever data is deflated
   */
  function AsyncUnzlib(cb) {
    this.ondata = cb;
    astrmify([bInflt, zule, function () {
      return [astrm, Inflate, Unzlib];
    }], this, 0, function () {
      var strm = new Unzlib();
      onmessage = astrm(strm);
    }, 11);
  }

  return AsyncUnzlib;
}();


function unzlib(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts, [bInflt, zule, function () {
    return [unzlibSync];
  }], function (ev) {
    return pbf(unzlibSync(ev.data[0], gu8(ev.data[1])));
  }, 5, cb);
}
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */

function unzlibSync(data, out) {
  let zlibValue = (zlv(data), data.subarray(2, -4)); // console.log("zlibValue: ", zlibValue);

  return inflt(zlibValue, out);
} // Default algorithm for compression (used because having a known output size allows faster decompression)

 // Default algorithm for compression (used because having a known output size allows faster decompression)


/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */

var Decompress = /*#__PURE__*/function () {
  /**
   * Creates a decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
  function Decompress(cb) {
    this.G = Gunzip;
    this.I = Inflate;
    this.Z = Unzlib;
    this.ondata = cb;
  }
  /**
   * Pushes a chunk to be decompressed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Decompress.prototype.push = function (chunk, final) {
    if (!this.ondata) throw 'no stream handler';

    if (!this.s) {
      if (this.p && this.p.length) {
        var n = new u8(this.p.length + chunk.length);
        n.set(this.p), n.set(chunk, this.p.length);
      } else this.p = chunk;

      if (this.p.length > 2) {
        var _this_1 = this;

        var cb = function () {
          _this_1.ondata.apply(_this_1, arguments);
        };

        this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(cb) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(cb) : new this.Z(cb);
        this.s.push(this.p, final);
        this.p = null;
      }
    } else this.s.push(chunk, final);
  };

  return Decompress;
}();


/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */

var AsyncDecompress = /*#__PURE__*/function () {
  /**
  * Creates an asynchronous decompression stream
  * @param cb The callback to call whenever data is decompressed
  */
  function AsyncDecompress(cb) {
    this.G = AsyncGunzip;
    this.I = AsyncInflate;
    this.Z = AsyncUnzlib;
    this.ondata = cb;
  }
  /**
   * Pushes a chunk to be decompressed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  AsyncDecompress.prototype.push = function (chunk, final) {
    Decompress.prototype.push.call(this, chunk, final);
  };

  return AsyncDecompress;
}();


function decompress(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzip(data, opts, cb) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflate(data, opts, cb) : unzlib(data, opts, cb);
}
/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */

function decompressSync(data, out) {
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, out) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, out) : unzlibSync(data, out);
} // flatten a directory structure

var fltn = function (d, p, t, o) {
  for (var k in d) {
    var val = d[k],
        n = p + k;
    if (val instanceof u8) t[n] = [val, o];else if (Array.isArray(val)) t[n] = [val[0], mrg(o, val[1])];else fltn(val, n + '/', t, o);
  }
}; // text encoder


var te = typeof TextEncoder != 'undefined' && /*#__PURE__*/new TextEncoder(); // text decoder

var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/new TextDecoder(); // text decoder stream

var tds = 0;

try {
  td.decode(et, {
    stream: true
  });
  tds = 1;
} catch (e) {} // decode UTF8


var dutf8 = function (d) {
  for (var r = '', i = 0;;) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length) return [r, slc(d, i - 1)];
    if (!eb) r += String.fromCharCode(c);else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1) r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);else r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
/**
 * Streaming UTF-8 decoding
 */


var DecodeUTF8 = /*#__PURE__*/function () {
  /**
   * Creates a UTF-8 decoding stream
   * @param cb The callback to call whenever data is decoded
   */
  function DecodeUTF8(cb) {
    this.ondata = cb;
    if (tds) this.t = new TextDecoder();else this.p = et;
  }
  /**
   * Pushes a chunk to be decoded from UTF-8 binary
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  DecodeUTF8.prototype.push = function (chunk, final) {
    if (!this.ondata) throw 'no callback';
    final = !!final;

    if (this.t) {
      this.ondata(this.t.decode(chunk, {
        stream: true
      }), final);

      if (final) {
        if (this.t.decode().length) throw 'invalid utf-8 data';
        this.t = null;
      }

      return;
    }

    if (!this.p) throw 'stream finished';
    var dat = new u8(this.p.length + chunk.length);
    dat.set(this.p);
    dat.set(chunk, this.p.length);

    var _a = dutf8(dat),
        ch = _a[0],
        np = _a[1];

    if (final) {
      if (np.length) throw 'invalid utf-8 data';
      this.p = null;
    } else this.p = np;

    this.ondata(ch, final);
  };

  return DecodeUTF8;
}();


/**
 * Streaming UTF-8 encoding
 */

var EncodeUTF8 = /*#__PURE__*/function () {
  /**
   * Creates a UTF-8 decoding stream
   * @param cb The callback to call whenever data is encoded
   */
  function EncodeUTF8(cb) {
    this.ondata = cb;
  }
  /**
   * Pushes a chunk to be encoded to UTF-8
   * @param chunk The string data to push
   * @param final Whether this is the last chunk
   */


  EncodeUTF8.prototype.push = function (chunk, final) {
    if (!this.ondata) throw 'no callback';
    if (this.d) throw 'stream finished';
    this.ondata(strToU8(chunk), this.d = final || false);
  };

  return EncodeUTF8;
}();


/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */

function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);

    for (var i = 0; i < str.length; ++i) ar_1[i] = str.charCodeAt(i);

    return ar_1;
  }

  if (te) return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;

  var w = function (v) {
    ar[ai++] = v;
  };

  for (var i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i << 1));
      n.set(ar);
      ar = n;
    }

    var c = str.charCodeAt(i);
    if (c < 128 || latin1) w(c);else if (c < 2048) w(192 | c >> 6), w(128 | c & 63);else if (c > 55295 && c < 57344) c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);else w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }

  return slc(ar, 0, ai);
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */

function strFromU8(dat, latin1) {
  if (latin1) {
    var r = '';

    for (var i = 0; i < dat.length; i += 16384) r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));

    return r;
  } else if (td) return td.decode(dat);else {
    var _a = dutf8(dat),
        out = _a[0],
        ext = _a[1];

    if (ext.length) throw 'invalid utf-8 data';
    return out;
  }
}
; // deflate bit flag

var dbf = function (l) {
  return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0;
}; // skip local zip header


var slzh = function (d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
}; // read zip header


var zh = function (d, b, z) {
  var fnl = b2(d, b + 28),
      fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)),
      es = b + 46 + fnl,
      bs = b4(d, b + 20);

  var _a = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)],
      sc = _a[0],
      su = _a[1],
      off = _a[2];

  return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
}; // read zip64 extra field


var z64e = function (d, b) {
  for (; b2(d, b) != 1; b += 4 + b2(d, b + 2));

  return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
}; // extra field length


var exfl = function (ex) {
  var le = 0;

  if (ex) {
    for (var k in ex) {
      var l = ex[k].length;
      if (l > 65535) throw 'extra field too long';
      le += l + 4;
    }
  }

  return le;
}; // write zip header


var wzh = function (d, b, f, fn, u, c, ce, co) {
  var fl = fn.length,
      ex = f.extra,
      col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
  if (ce != null) d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2; // spec compliance? what's that?

  d[b++] = f.flag << 1 | (c == null && 8), d[b++] = u && 8;
  d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime),
      y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119) throw 'date not in range 1980-2099';
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >>> 1), b += 4;

  if (c != null) {
    wbytes(d, b, f.crc);
    wbytes(d, b + 4, c);
    wbytes(d, b + 8, f.size);
  }

  wbytes(d, b + 12, fl);
  wbytes(d, b + 14, exl), b += 16;

  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }

  d.set(fn, b);
  b += fl;

  if (exl) {
    for (var k in ex) {
      var exf = ex[k],
          l = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l);
      d.set(exf, b + 4), b += 4 + l;
    }
  }

  if (col) d.set(co, b), b += col;
  return b;
}; // write zip footer (end of central directory)


var wzf = function (o, b, c, d, e) {
  wbytes(o, b, 0x6054B50); // skip disk

  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
};
/**
 * A pass-through stream to keep data uncompressed in a ZIP archive.
 */


var ZipPassThrough = /*#__PURE__*/function () {
  /**
   * Creates a pass-through stream that can be added to ZIP archives
   * @param filename The filename to associate with this data stream
   */
  function ZipPassThrough(filename) {
    this.filename = filename;
    this.c = crc();
    this.size = 0;
    this.compression = 0;
  }
  /**
   * Processes a chunk and pushes to the output stream. You can override this
   * method in a subclass for custom behavior, but by default this passes
   * the data through. You must call this.ondata(err, chunk, final) at some
   * point in this method.
   * @param chunk The chunk to process
   * @param final Whether this is the last chunk
   */


  ZipPassThrough.prototype.process = function (chunk, final) {
    this.ondata(null, chunk, final);
  };
  /**
   * Pushes a chunk to be added. If you are subclassing this with a custom
   * compression algorithm, note that you must push data from the source
   * file only, pre-compression.
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  ZipPassThrough.prototype.push = function (chunk, final) {
    if (!this.ondata) throw 'no callback - add to ZIP archive before pushing';
    this.c.p(chunk);
    this.size += chunk.length;
    if (final) this.crc = this.c.d();
    this.process(chunk, final || false);
  };

  return ZipPassThrough;
}();

 // I don't extend because TypeScript extension adds 1kB of runtime bloat

/**
 * Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
 * for better performance
 */

var ZipDeflate = /*#__PURE__*/function () {
  /**
   * Creates a DEFLATE stream that can be added to ZIP archives
   * @param filename The filename to associate with this data stream
   * @param opts The compression options
   */
  function ZipDeflate(filename, opts) {
    var _this_1 = this;

    if (!opts) opts = {};
    ZipPassThrough.call(this, filename);
    this.d = new Deflate(opts, function (dat, final) {
      _this_1.ondata(null, dat, final);
    });
    this.compression = 8;
    this.flag = dbf(opts.level);
  }

  ZipDeflate.prototype.process = function (chunk, final) {
    try {
      this.d.push(chunk, final);
    } catch (e) {
      this.ondata(e, null, final);
    }
  };
  /**
   * Pushes a chunk to be deflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  ZipDeflate.prototype.push = function (chunk, final) {
    ZipPassThrough.prototype.push.call(this, chunk, final);
  };

  return ZipDeflate;
}();


/**
 * Asynchronous streaming DEFLATE compression for ZIP archives
 */

var AsyncZipDeflate = /*#__PURE__*/function () {
  /**
   * Creates a DEFLATE stream that can be added to ZIP archives
   * @param filename The filename to associate with this data stream
   * @param opts The compression options
   */
  function AsyncZipDeflate(filename, opts) {
    var _this_1 = this;

    if (!opts) opts = {};
    ZipPassThrough.call(this, filename);
    this.d = new AsyncDeflate(opts, function (err, dat, final) {
      _this_1.ondata(err, dat, final);
    });
    this.compression = 8;
    this.flag = dbf(opts.level);
    this.terminate = this.d.terminate;
  }

  AsyncZipDeflate.prototype.process = function (chunk, final) {
    this.d.push(chunk, final);
  };
  /**
   * Pushes a chunk to be deflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  AsyncZipDeflate.prototype.push = function (chunk, final) {
    ZipPassThrough.prototype.push.call(this, chunk, final);
  };

  return AsyncZipDeflate;
}();

 // TODO: Better tree shaking

/**
 * A zippable archive to which files can incrementally be added
 */

var Zip = /*#__PURE__*/function () {
  /**
   * Creates an empty ZIP archive to which files can be added
   * @param cb The callback to call whenever data for the generated ZIP archive
   *           is available
   */
  function Zip(cb) {
    this.ondata = cb;
    this.u = [];
    this.d = 1;
  }
  /**
   * Adds a file to the ZIP archive
   * @param file The file stream to add
   */


  Zip.prototype.add = function (file) {
    var _this_1 = this;

    if (this.d & 2) throw 'stream finished';
    var f = strToU8(file.filename),
        fl = f.length;
    var com = file.comment,
        o = com && strToU8(com);
    var u = fl != file.filename.length || o && com.length != o.length;
    var hl = fl + exfl(file.extra) + 30;
    if (fl > 65535) throw 'filename too long';
    var header = new u8(hl);
    wzh(header, 0, file, f, u);
    var chks = [header];

    var pAll = function () {
      for (var _i = 0, chks_1 = chks; _i < chks_1.length; _i++) {
        var chk = chks_1[_i];

        _this_1.ondata(null, chk, false);
      }

      chks = [];
    };

    var tr = this.d;
    this.d = 0;
    var ind = this.u.length;
    var uf = mrg(file, {
      f: f,
      u: u,
      o: o,
      t: function () {
        if (file.terminate) file.terminate();
      },
      r: function () {
        pAll();

        if (tr) {
          var nxt = _this_1.u[ind + 1];
          if (nxt) nxt.r();else _this_1.d = 1;
        }

        tr = 1;
      }
    });
    var cl = 0;

    file.ondata = function (err, dat, final) {
      if (err) {
        _this_1.ondata(err, dat, final);

        _this_1.terminate();
      } else {
        cl += dat.length;
        chks.push(dat);

        if (final) {
          var dd = new u8(16);
          wbytes(dd, 0, 0x8074B50);
          wbytes(dd, 4, file.crc);
          wbytes(dd, 8, cl);
          wbytes(dd, 12, file.size);
          chks.push(dd);
          uf.c = cl, uf.b = hl + cl + 16, uf.crc = file.crc, uf.size = file.size;
          if (tr) uf.r();
          tr = 1;
        } else if (tr) pAll();
      }
    };

    this.u.push(uf);
  };
  /**
   * Ends the process of adding files and prepares to emit the final chunks.
   * This *must* be called after adding all desired files for the resulting
   * ZIP file to work properly.
   */


  Zip.prototype.end = function () {
    var _this_1 = this;

    if (this.d & 2) {
      if (this.d & 1) throw 'stream finishing';
      throw 'stream finished';
    }

    if (this.d) this.e();else this.u.push({
      r: function () {
        if (!(_this_1.d & 1)) return;

        _this_1.u.splice(-1, 1);

        _this_1.e();
      },
      t: function () {}
    });
    this.d = 3;
  };

  Zip.prototype.e = function () {
    var bt = 0,
        l = 0,
        tl = 0;

    for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
      var f = _a[_i];
      tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
    }

    var out = new u8(tl + 22);

    for (var _b = 0, _c = this.u; _b < _c.length; _b++) {
      var f = _c[_b];
      wzh(out, bt, f, f.f, f.u, f.c, l, f.o);
      bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
    }

    wzf(out, bt, this.u.length, tl, l);
    this.ondata(null, out, true);
    this.d = 2;
  };
  /**
   * A method to terminate any internal workers used by the stream. Subsequent
   * calls to add() will fail.
   */


  Zip.prototype.terminate = function () {
    for (var _i = 0, _a = this.u; _i < _a.length; _i++) {
      var f = _a[_i];
      f.t();
    }

    this.d = 2;
  };

  return Zip;
}();


function zip(data, opts, cb) {
  if (!cb) cb = opts, opts = {};
  if (typeof cb != 'function') throw 'no callback';
  var r = {};
  fltn(data, '', r, opts);
  var k = Object.keys(r);
  var lft = k.length,
      o = 0,
      tot = 0;
  var slft = lft,
      files = new Array(lft);
  var term = [];

  var tAll = function () {
    for (var i = 0; i < term.length; ++i) term[i]();
  };

  var cbf = function () {
    var out = new u8(tot + 22),
        oe = o,
        cdl = tot - o;
    tot = 0;

    for (var i = 0; i < slft; ++i) {
      var f = files[i];

      try {
        var l = f.c.length;
        wzh(out, tot, f, f.f, f.u, l);
        var badd = 30 + f.f.length + exfl(f.extra);
        var loc = tot + badd;
        out.set(f.c, loc);
        wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
      } catch (e) {
        return cb(e, null);
      }
    }

    wzf(out, o, files.length, cdl, oe);
    cb(null, out);
  };

  if (!lft) cbf();

  var _loop_1 = function (i) {
    var fn = k[i];
    var _a = r[fn],
        file = _a[0],
        p = _a[1];
    var c = crc(),
        size = file.length;
    c.p(file);
    var f = strToU8(fn),
        s = f.length;
    var com = p.comment,
        m = com && strToU8(com),
        ms = m && m.length;
    var exl = exfl(p.extra);
    var compression = p.level == 0 ? 0 : 8;

    var cbl = function (e, d) {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        var l = d.length;
        files[i] = mrg(p, {
          size: size,
          crc: c.d(),
          c: d,
          f: f,
          m: m,
          u: s != fn.length || m && com.length != ms,
          compression: compression
        });
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
        if (! --lft) cbf();
      }
    };

    if (s > 65535) cbl('filename too long', null);
    if (!compression) cbl(null, file);else if (size < 160000) {
      try {
        cbl(null, deflateSync(file, p));
      } catch (e) {
        cbl(e, null);
      }
    } else term.push(deflate(file, p, cbl));
  }; // Cannot use lft because it can decrease


  for (var i = 0; i < slft; ++i) {
    _loop_1(i);
  }

  return tAll;
}
/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */

function zipSync(data, opts) {
  if (!opts) opts = {};
  var r = {};
  var files = [];
  fltn(data, '', r, opts);
  var o = 0;
  var tot = 0;

  for (var fn in r) {
    var _a = r[fn],
        file = _a[0],
        p = _a[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn),
        s = f.length;
    var com = p.comment,
        m = com && strToU8(com),
        ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535) throw 'filename too long';
    var d = compression ? deflateSync(file, p) : file,
        l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f: f,
      m: m,
      u: s != fn.length || m && com.length != ms,
      o: o,
      compression: compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }

  var out = new u8(tot + 22),
      oe = o,
      cdl = tot - o;

  for (var i = 0; i < files.length; ++i) {
    var f = files[i];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }

  wzf(out, o, files.length, cdl, oe);
  return out;
}
/**
 * Streaming pass-through decompression for ZIP archives
 */

var UnzipPassThrough = /*#__PURE__*/function () {
  function UnzipPassThrough() {}

  UnzipPassThrough.prototype.push = function (data, final) {
    this.ondata(null, data, final);
  };

  UnzipPassThrough.compression = 0;
  return UnzipPassThrough;
}();


/**
 * Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
 * better performance.
 */

var UnzipInflate = /*#__PURE__*/function () {
  /**
   * Creates a DEFLATE decompression that can be used in ZIP archives
   */
  function UnzipInflate() {
    var _this_1 = this;

    this.i = new Inflate(function (dat, final) {
      _this_1.ondata(null, dat, final);
    });
  }

  UnzipInflate.prototype.push = function (data, final) {
    try {
      this.i.push(data, final);
    } catch (e) {
      this.ondata(e, data, final);
    }
  };

  UnzipInflate.compression = 8;
  return UnzipInflate;
}();


/**
 * Asynchronous streaming DEFLATE decompression for ZIP archives
 */

var AsyncUnzipInflate = /*#__PURE__*/function () {
  /**
   * Creates a DEFLATE decompression that can be used in ZIP archives
   */
  function AsyncUnzipInflate(_, sz) {
    var _this_1 = this;

    if (sz < 320000) {
      this.i = new Inflate(function (dat, final) {
        _this_1.ondata(null, dat, final);
      });
    } else {
      this.i = new AsyncInflate(function (err, dat, final) {
        _this_1.ondata(err, dat, final);
      });
      this.terminate = this.i.terminate;
    }
  }

  AsyncUnzipInflate.prototype.push = function (data, final) {
    if (this.i.terminate) data = slc(data, 0);
    this.i.push(data, final);
  };

  AsyncUnzipInflate.compression = 8;
  return AsyncUnzipInflate;
}();


/**
 * A ZIP archive decompression stream that emits files as they are discovered
 */

var Unzip = /*#__PURE__*/function () {
  /**
   * Creates a ZIP decompression stream
   * @param cb The callback to call whenever a file in the ZIP archive is found
   */
  function Unzip(cb) {
    this.onfile = cb;
    this.k = [];
    this.o = {
      0: UnzipPassThrough
    };
    this.p = et;
  }
  /**
   * Pushes a chunk to be unzipped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */


  Unzip.prototype.push = function (chunk, final) {
    var _this_1 = this;

    if (!this.onfile) throw 'no callback';
    if (!this.p) throw 'stream finished';

    if (this.c > 0) {
      var len = Math.min(this.c, chunk.length);
      var toAdd = chunk.subarray(0, len);
      this.c -= len;
      if (this.d) this.d.push(toAdd, !this.c);else this.k[0].push(toAdd);
      chunk = chunk.subarray(len);
      if (chunk.length) return this.push(chunk, final);
    } else {
      var f = 0,
          i = 0,
          is = void 0,
          buf = void 0;
      if (!this.p.length) buf = chunk;else if (!chunk.length) buf = this.p;else {
        buf = new u8(this.p.length + chunk.length);
        buf.set(this.p), buf.set(chunk, this.p.length);
      }
      var l = buf.length,
          oc = this.c,
          add = oc && this.d;

      var _loop_2 = function () {
        var _a;

        var sig = b4(buf, i);

        if (sig == 0x4034B50) {
          f = 1, is = i;
          this_1.d = null;
          this_1.c = 0;
          var bf = b2(buf, i + 6),
              cmp_1 = b2(buf, i + 8),
              u = bf & 2048,
              dd = bf & 8,
              fnl = b2(buf, i + 26),
              es = b2(buf, i + 28);

          if (l > i + 30 + fnl + es) {
            var chks_2 = [];
            this_1.k.unshift(chks_2);
            f = 2;
            var sc_1 = b4(buf, i + 18),
                su_1 = b4(buf, i + 22);
            var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);

            if (sc_1 == 4294967295) {
              _a = dd ? [-2] : z64e(buf, i), sc_1 = _a[0], su_1 = _a[1];
            } else if (dd) sc_1 = -1;

            i += es;
            this_1.c = sc_1;
            var d_1;
            var file_1 = {
              name: fn_1,
              compression: cmp_1,
              start: function () {
                if (!file_1.ondata) throw 'no callback';
                if (!sc_1) file_1.ondata(null, et, true);else {
                  var ctr = _this_1.o[cmp_1];
                  if (!ctr) throw 'unknown compression type ' + cmp_1;
                  d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);

                  d_1.ondata = function (err, dat, final) {
                    file_1.ondata(err, dat, final);
                  };

                  for (var _i = 0, chks_3 = chks_2; _i < chks_3.length; _i++) {
                    var dat = chks_3[_i];
                    d_1.push(dat, false);
                  }

                  if (_this_1.k[0] == chks_2 && _this_1.c) _this_1.d = d_1;else d_1.push(et, true);
                }
              },
              terminate: function () {
                if (d_1 && d_1.terminate) d_1.terminate();
              }
            };
            if (sc_1 >= 0) file_1.size = sc_1, file_1.originalSize = su_1;
            this_1.onfile(file_1);
          }

          return "break";
        } else if (oc) {
          if (sig == 0x8074B50) {
            is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
            return "break";
          } else if (sig == 0x2014B50) {
            is = i -= 4, f = 3, this_1.c = 0;
            return "break";
          }
        }
      };

      var this_1 = this;

      for (; i < l - 4; ++i) {
        var state_1 = _loop_2();

        if (state_1 === "break") break;
      }

      this.p = et;

      if (oc < 0) {
        var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 0x8074B50 && 4)) : buf.subarray(0, i);
        if (add) add.push(dat, !!f);else this.k[+(f == 2)].push(dat);
      }

      if (f & 2) return this.push(buf.subarray(i), final);
      this.p = buf.subarray(i);
    }

    if (final) {
      if (this.c) throw 'invalid zip file';
      this.p = null;
    }
  };
  /**
   * Registers a decoder with the stream, allowing for files compressed with
   * the compression type provided to be expanded correctly
   * @param decoder The decoder constructor
   */


  Unzip.prototype.register = function (decoder) {
    this.o[decoder.compression] = decoder;
  };

  return Unzip;
}();


/**
 * Asynchronously decompresses a ZIP archive
 * @param data The raw compressed ZIP file
 * @param cb The callback to call with the decompressed files
 * @returns A function that can be used to immediately terminate the unzipping
 */

function unzip(data, cb) {
  if (typeof cb != 'function') throw 'no callback';
  var term = [];

  var tAll = function () {
    for (var i = 0; i < term.length; ++i) term[i]();
  };

  var files = {};
  var e = data.length - 22;

  for (; b4(data, e) != 0x6054B50; --e) {
    if (!e || data.length - e > 65558) {
      cb('invalid zip file', null);
      return;
    }
  }

  ;
  var lft = b2(data, e + 8);
  if (!lft) cb(null, {});
  var c = lft;
  var o = b4(data, e + 16);
  var z = o == 4294967295;

  if (z) {
    e = b4(data, e - 12);

    if (b4(data, e) != 0x6064B50) {
      cb('invalid zip file', null);
      return;
    }

    c = lft = b4(data, e + 32);
    o = b4(data, e + 48);
  }

  var _loop_3 = function (i) {
    var _a = zh(data, o, z),
        c_1 = _a[0],
        sc = _a[1],
        su = _a[2],
        fn = _a[3],
        no = _a[4],
        off = _a[5],
        b = slzh(data, off);

    o = no;

    var cbl = function (e, d) {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        files[fn] = d;
        if (! --lft) cb(null, files);
      }
    };

    if (!c_1) cbl(null, slc(data, b, b + sc));else if (c_1 == 8) {
      var infl = data.subarray(b, b + sc);

      if (sc < 320000) {
        try {
          cbl(null, inflateSync(infl, new u8(su)));
        } catch (e) {
          cbl(e, null);
        }
      } else term.push(inflate(infl, {
        size: su
      }, cbl));
    } else cbl('unknown compression type ' + c_1, null);
  };

  for (var i = 0; i < c; ++i) {
    _loop_3(i);
  }

  return tAll;
}
/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @returns The decompressed files
 */

function unzipSync(data) {
  var files = {};
  var e = data.length - 22;

  for (; b4(data, e) != 0x6054B50; --e) {
    if (!e || data.length - e > 65558) throw 'invalid zip file';
  }

  ;
  var c = b2(data, e + 8);
  if (!c) return {};
  var o = b4(data, e + 16);
  var z = o == 4294967295;

  if (z) {
    e = b4(data, e - 12);
    if (b4(data, e) != 0x6064B50) throw 'invalid zip file';
    c = b4(data, e + 32);
    o = b4(data, e + 48);
  }

  for (var i = 0; i < c; ++i) {
    var _a = zh(data, o, z),
        c_2 = _a[0],
        sc = _a[1],
        su = _a[2],
        fn = _a[3],
        no = _a[4],
        off = _a[5],
        b = slzh(data, off);

    o = no;
    if (!c_2) files[fn] = slc(data, b, b + sc);else if (c_2 == 8) files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));else throw 'unknown compression type ' + c_2;
  }

  return files;
}

/***/ }),

/***/ "9d01":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 任务数据在执行过程中的状态(work flow status): 将32位分为4个8位, 分别表示任务执行过程中的四种类别的状态(未知 | 未知 | 未知 | 流转状态)，默认是0x0
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 流转状态
 */

var TransST;

(function (TransST) {
  /**
   * 默认值，标识所有操作结束
   */
  TransST[TransST["None"] = 0] = "None";
  /**
   * 任务正在运行
   */

  TransST[TransST["Running"] = 20] = "Running";
  /**
   * 任务结束
   */

  TransST[TransST["Finish"] = 21] = "Finish";
})(TransST || (TransST = {}));

exports.TransST = TransST;

class ThreadWFST {
  static Build(s0, s1, s2, transStatus) {
    return (s0 << 24) + (s1 << 16) + (s2 << 8) + transStatus;
  }

  static ModifyTransStatus(srcWSFT, transStatus) {
    srcWSFT &= 0xffffff00;
    return srcWSFT + transStatus;
  }

  static GetTransStatus(srcWSFT) {
    srcWSFT &= 0xFF;
    return srcWSFT;
  }

}

exports.ThreadWFST = ThreadWFST;

/***/ }),

/***/ "9e66":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const BaseTaskInThread_1 = __webpack_require__("3a68");

const FBXBufferLoader_1 = __webpack_require__("026b");

const ThreadWFST_1 = __webpack_require__("9d01");
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */


class ModuleFBXGeomFastParser extends BaseTaskInThread_1.BaseTaskInThread {
  constructor() {
    super();
    this.m_parser = {};
    console.log("ModuleFBXGeomFastParser::constructor()...");
  }

  receiveData(rdata) {
    let fbxBufLoader = new FBXBufferLoader_1.FBXBufferLoader();
    fbxBufLoader.parseBufBySteps(rdata.streams[0], rdata.descriptor.url, (model, bufObj, index, total, url) => {
      let wfst = index + 1 < total ? ThreadWFST_1.TransST.Running : ThreadWFST_1.TransST.Finish;
      rdata.wfst = ThreadWFST_1.ThreadWFST.ModifyTransStatus(rdata.wfst, wfst);
      let transfers = [];

      if (model.indices != null) {
        transfers.push(model.indices.buffer);
      }

      if (model.vertices != null) {
        transfers.push(model.vertices.buffer);
      }

      if (model.uvsList != null) {
        transfers.push(model.uvsList[0].buffer);
      }

      if (model.normals != null) {
        transfers.push(model.normals.buffer);
      }

      let modelData = {
        models: [model],
        transform: bufObj.transform.getLocalFS32(),
        index: index,
        total: total
      };
      transfers.push(modelData.transform.buffer);
      rdata.data = modelData;

      if (transfers.length > 0) {
        this.postMessageToThread(rdata, transfers);
      } else {
        this.postMessageToThread(rdata);
      }
    });
  }

}

exports.ModuleFBXGeomFastParser = ModuleFBXGeomFastParser; // 这一句代码是必须有的

let ins = new ModuleFBXGeomFastParser();

/***/ }),

/***/ "a053":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const EulerOrder_1 = __webpack_require__("cc7a");

const Matrix4_1 = __importDefault(__webpack_require__("18c7"));

const Quaternion_1 = __webpack_require__("ac89");

const _matrix = new Matrix4_1.default();

const _quaternion = new Quaternion_1.Quaternion();

class Euler {
  constructor(x = 0, y = 0, z = 0, order = Euler.DefaultOrder) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  set(x, y, z, order = this.order) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  }

  clone() {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  copy(euler) {
    this.x = euler.x;
    this.y = euler.y;
    this.z = euler.z;
    this.order = euler.order;
    return this;
  }

  setFromRotationMatrix(m, order = this.order, update = true) {
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    const te = m.getLocalFS32();
    const m11 = te[0],
          m12 = te[4],
          m13 = te[8];
    const m21 = te[1],
          m22 = te[5],
          m23 = te[9];
    const m31 = te[2],
          m32 = te[6],
          m33 = te[10];
    let clamp = MathConst_1.default.Clamp;

    switch (order) {
      case EulerOrder_1.EulerOrder.XYZ:
        this.y = Math.asin(clamp(m13, -1, 1));

        if (Math.abs(m13) < 0.9999999) {
          this.x = Math.atan2(-m23, m33);
          this.z = Math.atan2(-m12, m11);
        } else {
          this.x = Math.atan2(m32, m22);
          this.z = 0;
        }

        break;

      case EulerOrder_1.EulerOrder.YXZ:
        this.x = Math.asin(-clamp(m23, -1, 1));

        if (Math.abs(m23) < 0.9999999) {
          this.y = Math.atan2(m13, m33);
          this.z = Math.atan2(m21, m22);
        } else {
          this.y = Math.atan2(-m31, m11);
          this.z = 0;
        }

        break;

      case EulerOrder_1.EulerOrder.ZXY:
        this.x = Math.asin(clamp(m32, -1, 1));

        if (Math.abs(m32) < 0.9999999) {
          this.y = Math.atan2(-m31, m33);
          this.z = Math.atan2(-m12, m22);
        } else {
          this.y = 0;
          this.z = Math.atan2(m21, m11);
        }

        break;

      case EulerOrder_1.EulerOrder.ZYX:
        this.y = Math.asin(-clamp(m31, -1, 1));

        if (Math.abs(m31) < 0.9999999) {
          this.x = Math.atan2(m32, m33);
          this.z = Math.atan2(m21, m11);
        } else {
          this.x = 0;
          this.z = Math.atan2(-m12, m22);
        }

        break;

      case EulerOrder_1.EulerOrder.YZX:
        this.z = Math.asin(clamp(m21, -1, 1));

        if (Math.abs(m21) < 0.9999999) {
          this.x = Math.atan2(-m23, m22);
          this.y = Math.atan2(-m31, m11);
        } else {
          this.x = 0;
          this.y = Math.atan2(m13, m33);
        }

        break;

      case EulerOrder_1.EulerOrder.XZY:
        this.z = Math.asin(-clamp(m12, -1, 1));

        if (Math.abs(m12) < 0.9999999) {
          this.x = Math.atan2(m32, m22);
          this.y = Math.atan2(m13, m11);
        } else {
          this.x = Math.atan2(-m23, m33);
          this.y = 0;
        }

        break;

      default:
        console.warn('Euler::setFromRotationMatrix() encountered an unknown order: ', order);
    }

    this.order = order;
    return this;
  }

  setFromQuaternion(q, order, update = true) {
    _matrix.makeRotationFromQuaternion(q);

    return this.setFromRotationMatrix(_matrix, order, update);
  }

  setFromVector3(v, order = this.order) {
    return this.set(v.x, v.y, v.z, order);
  }

  reorder(newOrder) {
    // WARNING: this discards revolution information -bhouston
    _quaternion.setFromEuler(this);

    return this.setFromQuaternion(_quaternion, newOrder);
  }

  equals(euler) {
    return euler.x === this.x && euler.y === this.y && euler.z === this.z && euler.order === this.order;
  }

  fromArray(array) {
    this.x = array[0];
    this.y = array[1];
    this.z = array[2];
    if (array[3] !== undefined) this.order = array[3];
    return this;
  }

  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.order;
    return array;
  }

}

Euler.DefaultOrder = EulerOrder_1.EulerOrder.XYZ;
exports.Euler = Euler;

/***/ }),

/***/ "abdb":
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

class OrientationType {}

OrientationType.AXIS_ANGLE = 0;
OrientationType.QUATERNION = 1;
OrientationType.EULER_ANGLES = 2;
exports.default = OrientationType;

/***/ }),

/***/ "ac89":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const EulerOrder_1 = __webpack_require__("cc7a");

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.isQuaternion = true;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static Slerp(qa, qb, qm, t) {
    console.warn('Quaternion::Slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead.');
    return qm.slerpQuaternions(qa, qb, t);
  }

  static SlerpFlat(dst, src0, src1, t) {
    // fuzz-free, array-based Quaternion SLERP operation
    let x0 = src0.x,
        y0 = src0.y,
        z0 = src0.z,
        w0 = src0.w;
    const x1 = src1.x,
          y1 = src1.y,
          z1 = src1.z,
          w1 = src1.w;

    if (t === 0) {
      dst.x = x0;
      dst.y = y0;
      dst.z = z0;
      dst.w = w0;
      return;
    }

    if (t === 1) {
      dst.x = x1;
      dst.y = y1;
      dst.z = z1;
      dst.w = w1;
      return;
    }

    if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
      let s = 1 - t;
      const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
            dir = cos >= 0 ? 1 : -1,
            sqrSin = 1 - cos * cos; // Skip the Slerp for tiny steps to avoid numeric problems:

      if (sqrSin > Number.EPSILON) {
        const sin = Math.sqrt(sqrSin),
              len = Math.atan2(sin, cos * dir);
        s = Math.sin(s * len) / sin;
        t = Math.sin(t * len) / sin;
      }

      const tDir = t * dir;
      x0 = x0 * s + x1 * tDir;
      y0 = y0 * s + y1 * tDir;
      z0 = z0 * s + z1 * tDir;
      w0 = w0 * s + w1 * tDir; // Normalize in case we just did a lerp:

      if (s === 1 - t) {
        const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
        x0 *= f;
        y0 *= f;
        z0 *= f;
        w0 *= f;
      }
    }

    dst.x = x0;
    dst.y = y0;
    dst.z = z0;
    dst.w = w0;
  } // static multiplyQuaternionsFlat( dst: Quaternion, dstOffset, src0, srcOffset0, src1, srcOffset1 ) {
  // 	const x0 = src0[ srcOffset0 ];
  // 	const y0 = src0[ srcOffset0 + 1 ];
  // 	const z0 = src0[ srcOffset0 + 2 ];
  // 	const w0 = src0[ srcOffset0 + 3 ];
  // 	const x1 = src1[ srcOffset1 ];
  // 	const y1 = src1[ srcOffset1 + 1 ];
  // 	const z1 = src1[ srcOffset1 + 2 ];
  // 	const w1 = src1[ srcOffset1 + 3 ];
  // 	dst[ dstOffset ] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
  // 	dst[ dstOffset + 1 ] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
  // 	dst[ dstOffset + 2 ] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
  // 	dst[ dstOffset + 3 ] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
  // 	return dst;
  // }


  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone() {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  copy(q) {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  }

  setFromEuler(euler, update = true) {
    if (euler == null) {
      throw new Error('Quaternion::setFromEuler() now expects an Euler rotation rather than a Vector3 and order.');
    }

    const x = euler.x,
          y = euler.y,
          z = euler.z,
          order = euler.order; // http://www.mathworks.com/matlabcentral/fileexchange/
    // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
    //	content/SpinCalc.m

    const cos = Math.cos;
    const sin = Math.sin;
    const c1 = cos(x / 2);
    const c2 = cos(y / 2);
    const c3 = cos(z / 2);
    const s1 = sin(x / 2);
    const s2 = sin(y / 2);
    const s3 = sin(z / 2);

    switch (order) {
      case EulerOrder_1.EulerOrder.XYZ:
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;

      case EulerOrder_1.EulerOrder.YXZ:
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;

      case EulerOrder_1.EulerOrder.ZXY:
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;

      case EulerOrder_1.EulerOrder.ZYX:
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;

      case EulerOrder_1.EulerOrder.YZX:
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;

      case EulerOrder_1.EulerOrder.XZY:
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;

      default:
        console.warn('Quaternion::setFromEuler() encountered an unknown order: ' + order);
    }

    return this;
  }

  setFromAxisAngle(axis, angle) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    // assumes axis is normalized
    const halfAngle = angle / 2,
          s = Math.sin(halfAngle);
    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);
    return this;
  }

  setFromRotationMatrix(m) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    const te = m.getLocalFS32(),
          m11 = te[0],
          m12 = te[4],
          m13 = te[8],
          m21 = te[1],
          m22 = te[5],
          m23 = te[9],
          m31 = te[2],
          m32 = te[6],
          m33 = te[10],
          trace = m11 + m22 + m33;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);
      this.w = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
      this.w = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
      this.w = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
      this.w = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
    }

    return this;
  }

  setFromUnitVectors(vFrom, vTo) {
    // assumes direction vectors vFrom and vTo are normalized
    let r = vFrom.dot(vTo) + 1;

    if (r < Number.EPSILON) {
      // vFrom and vTo point in opposite directions
      r = 0;

      if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
        this.x = -vFrom.y;
        this.y = vFrom.x;
        this.z = 0;
        this.w = r;
      } else {
        this.x = 0;
        this.y = -vFrom.z;
        this.z = vFrom.y;
        this.w = r;
      }
    } else {
      // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
      this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
      this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
      this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
      this.w = r;
    }

    return this.normalize();
  }

  angleTo(q) {
    return 2 * Math.acos(Math.abs(MathConst_1.default.Clamp(this.dot(q), -1, 1)));
  }

  rotateTowards(q, step) {
    const angle = this.angleTo(q);
    if (angle === 0) return this;
    const t = Math.min(1, step / angle);
    this.slerp(q, t);
    return this;
  }

  identity() {
    return this.set(0, 0, 0, 1);
  }

  invert() {
    // quaternion is assumed to have unit length
    return this.conjugate();
  }

  conjugate() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }

  dot(q) {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  normalize() {
    let l = this.length();

    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      l = 1 / l;
      this.x = this.x * l;
      this.y = this.y * l;
      this.z = this.z * l;
      this.w = this.w * l;
    }

    return this;
  }

  multiply(q, p) {
    if (p !== undefined) {
      console.warn('Quaternion::multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.');
      return this.multiplyQuaternions(q, p);
    }

    return this.multiplyQuaternions(this, q);
  }

  premultiply(q) {
    return this.multiplyQuaternions(q, this);
  }

  multiplyQuaternions(a, b) {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
    const qax = a.x,
          qay = a.y,
          qaz = a.z,
          qaw = a.w;
    const qbx = b.x,
          qby = b.y,
          qbz = b.z,
          qbw = b.w;
    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return this;
  }

  slerp(qb, t) {
    if (t === 0) return this;
    if (t === 1) return this.copy(qb);
    const x = this.x,
          y = this.y,
          z = this.z,
          w = this.w; // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

    if (cosHalfTheta < 0) {
      this.w = -qb.w;
      this.x = -qb.x;
      this.y = -qb.y;
      this.z = -qb.z;
      cosHalfTheta = -cosHalfTheta;
    } else {
      this.copy(qb);
    }

    if (cosHalfTheta >= 1.0) {
      this.w = w;
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }

    const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      this.w = s * w + t * this.w;
      this.x = s * x + t * this.x;
      this.y = s * y + t * this.y;
      this.z = s * z + t * this.z;
      this.normalize();
      return this;
    }

    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
          ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    this.w = w * ratioA + this.w * ratioB;
    this.x = x * ratioA + this.x * ratioB;
    this.y = y * ratioA + this.y * ratioB;
    this.z = z * ratioA + this.z * ratioB;
    return this;
  }

  slerpQuaternions(qa, qb, t) {
    return this.copy(qa).slerp(qb, t);
  }

  random() {
    // Derived from http://planning.cs.uiuc.edu/node198.html
    // Note, this source uses w, x, y, z ordering,
    // so we swap the order below.
    const u1 = Math.random();
    const sqrt1u1 = Math.sqrt(1 - u1);
    const sqrtu1 = Math.sqrt(u1);
    const u2 = 2 * Math.PI * Math.random();
    const u3 = 2 * Math.PI * Math.random();
    return this.set(sqrt1u1 * Math.cos(u2), sqrtu1 * Math.sin(u3), sqrtu1 * Math.cos(u3), sqrt1u1 * Math.sin(u2));
  }

  equals(quaternion) {
    return quaternion.x === this.x && quaternion.y === this.y && quaternion.z === this.z && quaternion.w === this.w;
  }

  fromArray(array, offset = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.w = array[offset + 3];
    return this;
  }

  toArray(array = [], offset = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.w;
    return array;
  }

  fromBufferAttribute(attribute, index = 0) {
    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);
    this.w = attribute.getW(index);
    return this;
  }

}

exports.Quaternion = Quaternion; // /**
//  * vox.math.Quaternion
//  * 
//  * 用于表示基本的四元数对象
//  * 
//  * @author Vily
//  */
// class Quaternion
// {
// 	w:number = 0.0;
// 	x:number = 0.0;
// 	y:number = 0.0;
// 	z:number = 0.0;
// 	private m_sin:number = 0.0;
// 	private m_cos:number = 0.0;
// 	private m_rad:number = 0.0;
// 	constructor(w:number = 0.0, x:number = 0.0, y:number = 0.0, z:number = 0.0)
// 	{
// 		this.w = w;
// 		this.x = x;
// 		this.y = y;
// 		this.z = z;
// 	}
// 	initState(w:number = 0, x:number = 0, y:number = 0, z:number = 0):void
// 	{
// 		this.w = w;
// 		this.x = x;
// 		this.y = y;
// 		this.z = z;
// 	}
// 	setAngRadAndNV(pang:number, nv:Vector3D):void
// 	{
// 		this.m_rad =  pang * MathConst.MATH_PI_OVER_180;
// 		this.m_cos = Math.cos(0.5 * this.m_rad);
// 		this.m_sin = Math.sin(0.5 * this.m_rad);			
// 		this.w = this.m_cos;
// 		this.x = nv.x * this.m_sin;
// 		this.y = nv.y * this.m_sin;
// 		this.z = nv.z * this.m_sin;
// 	}
// 	setRotRadAndNV(prad:number, nv:Vector3D):void
// 	{
// 		this.m_rad = prad;
// 		this.m_cos = Math.cos(0.5 * this.m_rad);
// 		this.m_sin = Math.sin(0.5 * this.m_rad);
// 		this.w = this.m_cos;
// 		this.x = nv.x * this.m_sin;
// 		this.y = nv.y * this.m_sin;
// 		this.z = nv.z * this.m_sin;
// 	}		
// 	setRad(r:number):void
// 	{
// 		this.m_rad = r;
// 		this.m_cos = Math.cos(0.5 * this.m_rad);
// 		this.m_sin = Math.sin(0.5 * this.m_rad);
// 	}
// 	getRad():number
// 	{
// 		return this.m_rad;
// 	}
// 	updateRot():void
// 	{
// 		this.w = this.m_cos;
// 		this.x *= this.m_sin;
// 		this.y *= this.m_sin;
// 		this.z *= this.m_sin;
// 	}
// 	setXYZ(px:number, py:number, pz:number):void
// 	{
// 		this.x = px;
// 		this.y = py;
// 		this.z = pz;
// 	}
// 	add(q:Quaternion):void
// 	{
// 		this.w += q.w;
// 		this.x += q.x;
// 		this.y += q.y;
// 		this.z += q.z;
// 	}
// 	sub(q:Quaternion):void
// 	{
// 		this.w -= q.w;
// 		this.x -= q.x;
// 		this.y -= q.y;
// 		this.z -= q.z;
// 	}
// 	scale(s:number):void
// 	{
// 		this.w *= s;
// 		this.x *= s;
// 		this.y *= s;
// 		this.z *= s;
// 	}		
// 	mulToThis(q1:Quaternion, q2:Quaternion):void
// 	{
// 		let pw:number = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;
// 		let px:number = q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y;
// 		let py:number = q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x;
// 		let pz:number = q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w;
// 		this.w = pw;
// 		this.x = px;
// 		this.y = py;
// 		this.z = pz;
// 	}		
// 	mul(q:Quaternion):void
// 	{
// 		let pw:number = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
// 		let px:number = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
// 		let py:number = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
// 		let pz:number = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
// 		this.w = pw;
// 		this.x = px;
// 		this.y = py;
// 		this.z = pz;
// 	}
// 	mulNew(q2:Quaternion):Quaternion
// 	{
// 		let q:Quaternion = new Quaternion();
// 		q.w = this.w * q2.w - this.x * q2.x - this.y * q2.y - this.z * q2.z;
// 		q.x = this.w * q2.x + this.x * q2.w + this.y * q2.z - this.z * q2.y;
// 		q.y = this.w * q2.y - this.x * q2.z + this.y * q2.w + this.z * q2.x;
// 		q.z = this.w * q2.z + this.x * q2.y - this.y * q2.x + this.z * q2.w;
// 		return q;
// 	}
// 	/**
// 	 * 四元数乘以3D矢量 Vector3D,实现四元数对一个顶点的旋转
// 	 * @param				q		一个四元数对象
// 	 * @param				v		一个 3D矢量 Vector3D
// 	 * @param				outV	计算结果存放于一个 Vector3D 中
// 	 * */
// 	static quatMulV3(q:Quaternion, v:Vector3D, outV:Vector3D ):void
// 	{
// 		let xx:number = q.x * q.x;
// 		let yy:number = q.y * q.y;
// 		let zz:number = q.z * q.z;
// 		let xy:number = q.x * q.y;
// 		let yz:number = q.y * q.z;
// 		let xz:number = q.x * q.z;
// 		let sx:number = q.w * q.x;
// 		let sy:number = q.w * q.y;
// 		let sz:number = q.w * q.z;
// 		let tx:number = v.x * (0.5 - yy - zz) + v.y * (xy - sz) + v.z * (xz + sy);
// 		let ty:number = v.x * (xy + sz) + v.y * (0.5 - xx - zz) + v.z * (yz - sx);
// 		let tz:number = v.x * (xz - sy) + v.y * (yz + sx) + v.z * (0.5 - xx - yy);
// 		outV.x = tx * 2.0;
// 		outV.y = ty * 2.0;
// 		outV.z = tz * 2.0;
// 	}
// 	rotate(q:Quaternion, v:Vector3D):void
// 	{
// 		let pw:number = -q.x * v.x - q.y * v.y - q.z * v.z;
// 		let px:number = q.w * v.x + q.y * v.z - q.z * v.y;
// 		let py:number = q.w * v.y - q.x * v.z + q.z * v.x;
// 		let pz:number = q.w * v.z + q.x * v.y - q.y * v.x;
// 		this.w = q.w + pw * 0.5;
// 		this.x = q.x + px * 0.5;
// 		this.y = q.y + py * 0.5;
// 		this.z = q.z + pz * 0.5;
// 	}
// 	normalizeFrom(q:Quaternion):void
// 	{
// 		let len:number = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
// 		if (len > MathConst.MATH_MIN_POSITIVE) len = 1.0 / len;
// 		this.w = q.w * len;
// 		this.x = q.x * len;
// 		this.y = q.y * len;
// 		this.z = q.z * len;
// 	}
// 	normalize():void
// 	{
// 		let len:number = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
// 		if (len > MathConst.MATH_MIN_POSITIVE) len = 1 / len;
// 		this.w *= len;
// 		this.x *= len;
// 		this.y *= len;
// 		this.z *= len;
// 	}
// 	/*
// 	// 取反
// 	negate():void
// 	{
// 		w *= -1;
// 		x *= -1;
// 		y *= -1;
// 		z *= -1;
// 	}
// 	*/
// 	/**
// 	 * 得到当前 四元数的 逆
// 	 * */
// 	invert():void
// 	{
// 		this.adjoint();
// 		this.normalize();
// 	}
// 	/**
// 	 * 共轭
// 	 * */
// 	adjoint():void
// 	{
// 		this.x *= -1.0;
// 		this.y *= -1.0;
// 		this.z *= -1.0;
// 	}
// 	/**
// 	 * 共轭
// 	 * */
// 	adjointNew():Quaternion
// 	{			
// 		return new Quaternion(this.w,-1 * this.x, -1 * this.y,-1 * this.z);
// 	}
// 	getLength():number
// 	{
// 		return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
// 	}
// 	copyFrom(q:Quaternion):void
// 	{
// 		this.w = q.w;
// 		this.x = q.x;
// 		this.y = q.y;
// 		this.z = q.z;
// 	}
// 	clone():Quaternion
// 	{
// 		return new Quaternion(this.w, this.x, this.y, this.z);
// 	}
// 	toString():String
// 	{
// 		return "Quaternion(" + this.w + ", " + this.x + ", " + this.y+ ", " + this.z + ")";
// 	}
// }

/***/ }),

/***/ "c758":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const BinaryReader_1 = __webpack_require__("f7ee");

const fflate = __importStar(__webpack_require__("9cb6")); // Parse an FBX file in Binary format


class BufPropertyParser {
  constructor() {
    this.ppFlag = 0;
    this.encoding = 0;
    this.ppType = "";
  }

  parseDirec(reader, params) {
    if (params.length < 1) {
      return [];
    } // let offset: number, type: string, arrayLength: number, encoding: number, compressedLength: number
    //[bufOffset, compressedLength, arrayLength, encoding, type];
    // console.log("BufPropertyParser::parseDirec(), params: ",params);


    let offset = params[0];
    let compressedLength = params[1];
    let arrayLength = params[2];
    let encoding = params[3];
    let type = params[4]; // let type: string = , arrayLength: number, encoding: number, compressedLength: number

    reader.setOffset(offset); // let length;
    // console.log("parseProperty(), type: ",type);

    switch (type) {
      case 'b':
      case 'c':
      case 'd':
      case 'f':
      case 'i':
      case 'l':
        if (encoding === 0) {
          switch (type) {
            case 'b':
            case 'c':
              return reader.getBooleanArray(arrayLength);

            case 'd':
              return reader.getFloat64Array(arrayLength);

            case 'f':
              return reader.getFloat32Array(arrayLength);

            case 'i':
              return reader.getInt32Array(arrayLength);

            case 'l':
              return reader.getInt64Array(arrayLength);
          }
        }

        if (typeof fflate === 'undefined') {
          console.error('BufPropertyParser::parseDirec() External library fflate.min.js required.');
        }

        let u8Arr = reader.getArrayU8Buffer(compressedLength); // let t = Date.now();
        // console.log("parseProperty reader2...u8Arr.length: ", u8Arr.length);

        const data = fflate.unzlibSync(u8Arr, null);
        let reader2 = new BinaryReader_1.BinaryReader(data.buffer); // console.log(type,"parseProperty reader2...data.length: ", MathConst.CalcCeilPowerOfTwo(data.length), data.length);
        // console.log("unzlibSync loss time: ", (Date.now() - t));
        // this.subLossTime += (Date.now() - t);
        // console.log("XXXX is Geometry data.length: ",data.length,", compressedLength: ",compressedLength);

        switch (type) {
          case 'b':
          case 'c':
            return reader2.getBooleanArray(arrayLength);

          case 'd':
            //return [bufOffset, bufSize, arrayLength];
            //this.m_ppParams = [bufOffset, bufSize, arrayLength];
            // TODO(vily): 为了测试千万级三角面的的数据读取
            // try{
            return reader2.getFloat64Array(arrayLength);
          // }catch(e) {
          // 	console.log("errrrro arrayLength: ",arrayLength);
          // 	throw Error(e);
          // }

          case 'f':
            return reader2.getFloat32Array(arrayLength);

          case 'i':
            return reader2.getInt32Array(arrayLength);

          case 'l':
            return reader2.getInt64Array(arrayLength);
        }

      default:
        throw new Error('BufPropertyParser::parseDirec() Unknown property type ' + type);
    }
  }

  getArrayByteLength(type, arrayLength) {
    switch (type) {
      case 'd':
      case 'l':
        return arrayLength * 8;

      case 'f':
      case 'i':
        return arrayLength * 4;

      default:
        break;
    }

    return arrayLength;
  }

  parseProperty(reader) {
    const type = reader.getString(1);
    let length;
    this.encoding = 0;
    this.ppType = type; // console.log("parseProperty(), type: ",type);

    switch (type) {
      case 'C':
        return reader.getBoolean();

      case 'D':
        return reader.getFloat64();

      case 'F':
        return reader.getFloat32();

      case 'I':
        return reader.getInt32();

      case 'L':
        return reader.getInt64();

      case 'R':
        length = reader.getUint32();
        return reader.getArrayBuffer(length);

      case 'S':
        length = reader.getUint32();
        return reader.getString(length);

      case 'Y':
        return reader.getInt16();

      case 'b':
      case 'c':
      case 'd':
      case 'f':
      case 'i':
      case 'l':
        const arrayLength = reader.getUint32();
        const encoding = reader.getUint32(); // 0: non-compressed, 1: compressed

        const compressedLength = reader.getUint32();
        this.encoding = encoding;
        let bufOffset = reader.getOffset();
        let skipLen = encoding === 0 ? this.getArrayByteLength(type, arrayLength) : compressedLength;

        if (this.ppFlag == 12) {
          // console.log("%%%%% skipLen: ",skipLen, type, encoding);
          reader.skip(skipLen);
          return [bufOffset, compressedLength, arrayLength, encoding, type];
        } else if (this.ppFlag == 131) {
          // console.log("%%%%% skipLen: ",skipLen, type, encoding);
          reader.skip(skipLen);
          return [];
        }

        if (encoding === 0) {
          switch (type) {
            case 'b':
            case 'c':
              return reader.getBooleanArray(arrayLength);

            case 'd':
              return reader.getFloat64Array(arrayLength);

            case 'f':
              return reader.getFloat32Array(arrayLength);

            case 'i':
              return reader.getInt32Array(arrayLength);

            case 'l':
              return reader.getInt64Array(arrayLength);
          }
        }

        if (typeof fflate === 'undefined') {
          console.error('BufPropertyParser::parseProperty() External library fflate.min.js required.');
        } // let u8Arr = new Uint8Array( reader.getArrayBuffer( compressedLength ) );
        // // console.log("parseProperty reader2...u8Arr.length: ", u8Arr.length);
        // const data = fflate.unzlibSync( u8Arr, null );
        // const reader2 = new BinaryReader( data.buffer );


        let u8Arr = reader.getArrayU8Buffer(compressedLength); // let t = Date.now();

        const data = fflate.unzlibSync(u8Arr, null);
        let reader2 = new BinaryReader_1.BinaryReader(data.buffer); // console.log(type,"parseProperty reader2...data.length: ", MathConst.CalcCeilPowerOfTwo(data.length), data.length);
        // console.log("unzlibSync loss time: ", (Date.now() - t));
        // this.subLossTime += (Date.now() - t);
        // console.log("XXXX is Geometry data.length: ",data.length,", compressedLength: ",compressedLength);

        switch (type) {
          case 'b':
          case 'c':
            return reader2.getBooleanArray(arrayLength);

          case 'd':
            //this.m_ppParams = [bufOffset, bufSize, arrayLength];
            // TODO(vily): 为了测试单个几何模型千万级三角面的的数据读取
            // try{
            return reader2.getFloat64Array(arrayLength);
          // }catch(e) {
          // 	console.log("errrrro arrayLength: ",arrayLength);
          // 	throw Error(e);
          // }

          case 'f':
            return reader2.getFloat32Array(arrayLength);

          case 'i':
            return reader2.getInt32Array(arrayLength);

          case 'l':
            return reader2.getInt64Array(arrayLength);
        }

      default:
        throw new Error('BufPropertyParser::parseProperty() Unknown property type ' + type);
    }
  }

}

exports.BufPropertyParser = BufPropertyParser;

/***/ }),

/***/ "cc7a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EulerOrder;

(function (EulerOrder) {
  EulerOrder[EulerOrder["XYZ"] = 0] = "XYZ";
  EulerOrder[EulerOrder["YZX"] = 1] = "YZX";
  EulerOrder[EulerOrder["ZXY"] = 2] = "ZXY";
  EulerOrder[EulerOrder["XZY"] = 3] = "XZY";
  EulerOrder[EulerOrder["YXZ"] = 4] = "YXZ";
  EulerOrder[EulerOrder["ZYX"] = 5] = "ZYX";
})(EulerOrder || (EulerOrder = {}));

exports.EulerOrder = EulerOrder;

/***/ }),

/***/ "f689":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Euler_1 = __webpack_require__("a053");

const Matrix4_1 = __importDefault(__webpack_require__("18c7"));

const LoaderUtils_1 = __webpack_require__("0063");

function convertArrayBufferToString(buffer, from, to) {
  if (from === undefined) from = 0;
  if (to === undefined) to = buffer.byteLength;
  return LoaderUtils_1.LoaderUtils.decodeText(new Uint8Array(buffer, from, to));
}

exports.convertArrayBufferToString = convertArrayBufferToString;

function isFbxFormatASCII(text) {
  const CORRECT = ['K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\'];
  let cursor = 0;

  function read(offset) {
    const result = text[offset - 1];
    text = text.slice(cursor + offset);
    cursor++;
    return result;
  }

  for (let i = 0; i < CORRECT.length; ++i) {
    const num = read(1);

    if (num === CORRECT[i]) {
      return false;
    }
  }

  return true;
}

exports.isFbxFormatASCII = isFbxFormatASCII;

function getFbxVersion(text) {
  const versionRegExp = /FBXVersion: (\d+)/;
  const match = text.match(versionRegExp);

  if (match) {
    const version = parseInt(match[1]);
    return version;
  }

  throw new Error('FBXLoader: Cannot find the version number for the file given.');
}

exports.getFbxVersion = getFbxVersion;
let tempVec3 = new Vector3D_1.default();
let tempEuler = new Euler_1.Euler(); // generate transformation from FBX transform data
// ref: https://help.autodesk.com/view/FBX/2017/ENU/?guid=__files_GUID_10CDD63C_79C1_4F2D_BB28_AD2BE65A02ED_htm
// ref: http://docs.autodesk.com/FBX/2014/ENU/FBX-SDK-Documentation/index.html?url=cpp_ref/_transformations_2main_8cxx-example.html,topicNumber=cpp_ref__transformations_2main_8cxx_example_htmlfc10a1e1-b18d-4e72-9dc0-70d0f1959f5e

function generateTransform(transformData) {
  // let lTransform: Matrix4 = new Matrix4();
  // return lTransform;
  const lTranslationM = new Matrix4_1.default();
  const lPreRotationM = new Matrix4_1.default();
  const lRotationM = new Matrix4_1.default();
  const lPostRotationM = new Matrix4_1.default();
  const lScalingM = new Matrix4_1.default();
  const lScalingPivotM = new Matrix4_1.default();
  const lScalingOffsetM = new Matrix4_1.default();
  const lRotationOffsetM = new Matrix4_1.default();
  const lRotationPivotM = new Matrix4_1.default();
  const lParentGX = new Matrix4_1.default();
  const lParentLX = new Matrix4_1.default();
  const lGlobalT = new Matrix4_1.default();
  let degToRad = MathConst_1.default.DegreeToRadian;
  const inheritType = transformData.inheritType ? transformData.inheritType : 0;
  if (transformData.translation) lTranslationM.setTranslation(tempVec3.fromArray(transformData.translation));

  if (transformData.preRotation) {
    const array = transformData.preRotation.map(degToRad);
    array.push(transformData.eulerOrder);
    lPreRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
  }

  if (transformData.rotation) {
    const array = transformData.rotation.map(degToRad);
    array.push(transformData.eulerOrder);
    lRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
  }

  if (transformData.postRotation) {
    const array = transformData.postRotation.map(degToRad);
    array.push(transformData.eulerOrder);
    lPostRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
    lPostRotationM.invert();
  }

  if (transformData.scale) lScalingM.setScale(tempVec3.fromArray(transformData.scale)); // Pivots and offsets

  if (transformData.scalingOffset) lScalingOffsetM.setTranslation(tempVec3.fromArray(transformData.scalingOffset));
  if (transformData.scalingPivot) lScalingPivotM.setTranslation(tempVec3.fromArray(transformData.scalingPivot));
  if (transformData.rotationOffset) lRotationOffsetM.setTranslation(tempVec3.fromArray(transformData.rotationOffset));
  if (transformData.rotationPivot) lRotationPivotM.setTranslation(tempVec3.fromArray(transformData.rotationPivot)); // parent transform

  if (transformData.parentMatrixWorld) {
    lParentLX.copy(transformData.parentMatrix);
    lParentGX.copy(transformData.parentMatrixWorld);
  }

  const lLRM = lPreRotationM.clone().multiply(lRotationM).multiply(lPostRotationM); // Global Rotation

  const lParentGRM = new Matrix4_1.default();
  lParentGRM.extractRotation(lParentGX); // Global Shear*Scaling

  const lParentTM = new Matrix4_1.default();
  lParentTM.copyTranslation(lParentGX);
  const lParentGRSM = lParentTM.clone().invertThis().multiply(lParentGX);
  const lParentGSM = lParentGRM.clone().invertThis().multiply(lParentGRSM);
  const lLSM = lScalingM;
  const lGlobalRS = new Matrix4_1.default();

  if (inheritType === 0) {
    lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM).multiply(lLSM);
  } else if (inheritType === 1) {
    lGlobalRS.copy(lParentGRM).multiply(lParentGSM).multiply(lLRM).multiply(lLSM); // console.log("XXXX MF 5, lGlobalRS: ",lGlobalRS);
  } else {
    let v3 = new Vector3D_1.default();
    lParentLX.getScale(v3);
    const lParentLSM = new Matrix4_1.default().setScale(v3);
    const lParentLSM_inv = lParentLSM.clone().invertThis();
    const lParentGSM_noLocal = lParentGSM.clone().multiply(lParentLSM_inv);
    lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM_noLocal).multiply(lLSM);
  }

  const lRotationPivotM_inv = lRotationPivotM.clone().invertThis();
  const lScalingPivotM_inv = lScalingPivotM.clone().invertThis(); // Calculate the local transform matrix

  let lTransform = lTranslationM.clone().multiply(lRotationOffsetM).multiply(lRotationPivotM).multiply(lPreRotationM).multiply(lRotationM).multiply(lPostRotationM).multiply(lRotationPivotM_inv).multiply(lScalingOffsetM).multiply(lScalingPivotM).multiply(lScalingM).multiply(lScalingPivotM_inv);
  const lLocalTWithAllPivotAndOffsetInfo = new Matrix4_1.default().copyTranslation(lTransform);
  const lGlobalTranslation = lParentGX.clone().multiply(lLocalTWithAllPivotAndOffsetInfo);
  lGlobalT.copyTranslation(lGlobalTranslation);
  lTransform = lGlobalT.clone().multiply(lGlobalRS); // from global to local

  lTransform.premultiply(lParentGX.invertThis());
  return lTransform;
}

exports.generateTransform = generateTransform; // Returns the three.js intrinsic Euler order corresponding to FBX extrinsic Euler order
// ref: http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_euler_html

const enumsEuler = ['ZYX', 'YZX', 'XZY', 'ZXY', 'YXZ', 'XYZ'];

function getEulerOrder(order) {
  order = order || 0;

  if (order === 6) {
    console.warn('FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.');
    return enumsEuler[0];
  }

  return enumsEuler[order];
}

exports.getEulerOrder = getEulerOrder;

function isFbxFormatBinary(buffer) {
  const CORRECT = 'Kaydara\u0020FBX\u0020Binary\u0020\u0020\0';
  return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString(buffer, 0, CORRECT.length);
}

exports.isFbxFormatBinary = isFbxFormatBinary; // Converts FBX ticks into real time seconds.

function convertFBXTimeToSeconds(time) {
  return time / 46186158000;
}

exports.convertFBXTimeToSeconds = convertFBXTimeToSeconds; // Parses comma separated list of numbers and returns them an array.
// Used internally by the TextParser

function parseNumberArray(value) {
  const array = value.split(',').map(function (val) {
    return parseFloat(val);
  });
  return array;
}

exports.parseNumberArray = parseNumberArray;

function append(a, b) {
  for (let i = 0, j = a.length, l = b.length; i < l; i++, j++) {
    a[j] = b[i];
  }
}

exports.append = append;
const dataArray = new Array(1024);

function slice(a, b, from, to) {
  for (let i = from, j = 0; i < to; i++, j++) {
    a[j] = b[i];
  }

  return a;
}

exports.slice = slice; // extracts the data from the correct position in the FBX array based on indexing type

function getData(polygonVertexIndex, polygonIndex, vertexIndex, infoObject) {
  let index;

  switch (infoObject.mappingType) {
    case 'ByPolygonVertex':
      index = polygonVertexIndex;
      break;

    case 'ByPolygon':
      index = polygonIndex;
      break;

    case 'ByVertice':
      index = vertexIndex;
      break;

    case 'AllSame':
      index = infoObject.indices[0];
      break;

    default:
      console.warn('FBXLoader: unknown attribute mapping type ' + infoObject.mappingType);
  }

  if (infoObject.referenceType === 'IndexToDirect') index = infoObject.indices[index];
  const from = index * infoObject.dataSize;
  const to = from + infoObject.dataSize;
  return slice(dataArray, infoObject.buffer, from, to);
}

exports.getData = getData;

/***/ }),

/***/ "f7ee":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const LoaderUtils_1 = __webpack_require__("0063");

class BinaryReader {
  constructor(buffer, littleEndian) {
    this.dv = new DataView(buffer);
    this.offset = 0;
    this.littleEndian = littleEndian !== undefined ? littleEndian : true;
  }

  getOffset() {
    return this.offset;
  }

  size() {
    return this.dv.buffer.byteLength;
  }

  skip(length) {
    this.offset += length;
  }

  setOffset(offset) {
    this.offset = offset;
  } // seems like true/false representation depends on exporter.
  // true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
  // then sees LSB.


  getBoolean() {
    return (this.getUint8() & 1) === 1;
  }

  getBooleanArray(size) {
    // const a = [];
    // for ( let i = 0; i < size; i ++ ) {
    // 	a.push( this.getBoolean() );
    // }
    // return a;
    const a = new Array(size);

    for (let i = 0; i < size; i++) {
      a[i] = this.getBoolean();
    }

    return a;
  }

  getUint8() {
    const value = this.dv.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  getInt16() {
    const value = this.dv.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }

  getInt32() {
    const value = this.dv.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  getInt32Array(size) {
    // const a: number[] = [];
    // for ( let i = 0; i < size; i ++ ) {
    // 	a.push( this.getInt32() );
    // }
    // return a;
    const a = new Array(size);

    for (let i = 0; i < size; i++) {
      a[i] = this.getInt32();
    }

    return a;
  }

  getUint32() {
    const value = this.dv.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  } // JavaScript doesn't support 64-bit integer so calculate this here
  // 1 << 32 will return 1 so using multiply operation instead here.
  // There's a possibility that this method returns wrong value if the value
  // is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
  // TODO: safely handle 64-bit integer


  getInt64() {
    let low, high;

    if (this.littleEndian) {
      low = this.getUint32();
      high = this.getUint32();
    } else {
      high = this.getUint32();
      low = this.getUint32();
    } // calculate negative value


    if (high & 0x80000000) {
      high = ~high & 0xFFFFFFFF;
      low = ~low & 0xFFFFFFFF;
      if (low === 0xFFFFFFFF) high = high + 1 & 0xFFFFFFFF;
      low = low + 1 & 0xFFFFFFFF;
      return -(high * 0x100000000 + low);
    }

    return high * 0x100000000 + low;
  }

  getInt64Array(size) {
    // const a: number[] = [];
    // for ( let i = 0; i < size; i ++ ) {
    // 	a.push( this.getInt64() );
    // }
    // return a;
    const a = new Array(size);

    for (let i = 0; i < size; i++) {
      a[i] = this.getInt64();
    }

    return a;
  } // Note: see getInt64() comment


  getUint64() {
    let low, high;

    if (this.littleEndian) {
      low = this.getUint32();
      high = this.getUint32();
    } else {
      high = this.getUint32();
      low = this.getUint32();
    }

    return high * 0x100000000 + low;
  }

  getFloat32() {
    const value = this.dv.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }

  getFloat32Array(size) {
    // const a = [];
    // for ( let i = 0; i < size; i ++ ) {
    // 	a.push( this.getFloat32() );
    // }
    // return a;
    const a = new Array(size);

    for (let i = 0; i < size; i++) {
      a[i] = this.getFloat32();
    }

    return a;
  }

  getFloat64() {
    const value = this.dv.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value; // try{
    // const value = this.dv.getFloat64( this.offset, this.littleEndian );
    // this.offset += 8;
    // return value;
    // }catch(e) {
    // 	console.log("EEEEEerror this.offset: ",this.offset);
    // 	throw Error(e);
    // }
    // return 0;
  }

  getFloat64Array(size) {
    // const a: number[] = [];
    // for ( let i = 0; i < size; i ++ ) {
    // 	a.push( this.getFloat64() );
    // }
    // return a;
    const a = new Array(size);

    for (let i = 0; i < size; i++) {
      a[i] = this.getFloat64(); // try{
      // 	a[i] = this.getFloat64();
      // }catch(e) {
      // 	console.log("EEEEEerror size: ",size);
      // 	throw Error(e);
      // }
    }

    return a;
  }

  getArrayBuffer(size) {
    const value = this.dv.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return value; // let u8Arr = new Uint8Array( this.dv.buffer );
    // const value = u8Arr.subarray( this.offset, this.offset + size );
    // this.offset += size;
    // // console.log("getArrayBuffer() use size: ", size);
    // return value.buffer;
    // console.log("aaa",value.length);
    // return (value.slice()).buffer;
  }

  getArrayU8Buffer(size) {
    let u8Arr = new Uint8Array(this.dv.buffer);
    const value = u8Arr.subarray(this.offset, this.offset + size);
    this.offset += size; // console.log("getArrayU8Buffer() use size: ", size);

    return value;
  }

  getArrayU8BufferByOffset(offset, size) {
    let u8Arr = new Uint8Array(this.dv.buffer);
    return u8Arr.subarray(offset, offset + size);
  }

  getString(size) {
    // note: safari 9 doesn't support Uint8Array.indexOf; create intermediate array instead
    // let a: number[] = [];
    // for ( let i = 0; i < size; i ++ ) {
    // 	a[ i ] = this.getUint8();
    // }
    let a = new Array(size);

    for (let i = 0; i < size; i++) {
      a[i] = this.getUint8();
    }

    const nullByte = a.indexOf(0);
    if (nullByte >= 0) a = a.slice(0, nullByte);
    return LoaderUtils_1.LoaderUtils.decodeText(new Uint8Array(a));
  }

}

exports.BinaryReader = BinaryReader;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9e66");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });