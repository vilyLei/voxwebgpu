(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CoSpaceApp"] = factory();
	else
		root["CoSpaceApp"] = factory();
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

/***/ "1173":
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
 * (引擎)数据/资源协同空间系统模块
 */

class CoSystem {
  constructor() {}
  /**
   */


  initialize() {}

  destroy() {}

}

exports.CoSystem = CoSystem;

/***/ }),

/***/ "1e86":
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
 * 这些定义都是内部使用的，实现任务功能的使用者不必关心，当然也不能修改
 */

class ThreadCMD {}
/**
 * 单个数据处理任务
 */


ThreadCMD.DATA_PARSE = 3501;
/**
 * (3502)多个数据处理任务组成的队列
 */

ThreadCMD.DATA_QUEUE_PARSE = 3502;
/**
 * (3601)
 */

ThreadCMD.THREAD_INIT = 3601;
/**
 * (3621)
 */

ThreadCMD.INIT_COMMON_MODULE = 3621;
/**
 * (3631)线程中的任务程序初始化的时候主动从任务对象获取需要的数据
 */

ThreadCMD.THREAD_ACQUIRE_DATA = 3631;
/**
 * (3632)
 */

ThreadCMD.THREAD_TRANSMIT_DATA = 3632;
/**
 * (3701)
 */

ThreadCMD.INIT_TASK = 3701;
/**
 * (3801)
 */

ThreadCMD.INIT_PARAM = 3801;
exports.ThreadCMD = ThreadCMD;

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

/***/ "1f9e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class CTMTaskCMD {}
/**
 * 处理数据
 */


CTMTaskCMD.PARSE = "CTM_PARSE";
/**
 * 加载和处理数据
 */

CTMTaskCMD.LOAD_AND_PARSE = "CTM_LOAD_AND_PARSE";
exports.CTMTaskCMD = CTMTaskCMD;

/***/ }),

/***/ "2033":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataPhaseFlag_1 = __webpack_require__("698b");
/**
 * 实现 DataUnitReceiver 行为的 基类
 */


class DataReceiverBase {
  constructor() {
    // 表示 none/net/cpu/gpu 三个阶段的信息, 初始值必须是DataPhaseFlag.PHASE_NONE, 外部用户不能操作
    this.dataPhaseFlag = DataPhaseFlag_1.DataPhaseFlag.PHASE_NONE; // 初始值必须是0, 外部用户不能操作

    this.dataUnitUUID = 0; // 初始值必须是0, 外部用户不能操作

    this.listUUID = 0;
  }

  receiveDataUnit(unit, status) {
    console.log("DataReceiverBase::receiveDataUnit(), unit: ", unit);
  }

}

exports.DataReceiverBase = DataReceiverBase;

/***/ }),

/***/ "2356":
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

class ThreadSendData {
  constructor() {
    // 多线程任务分类id
    this.taskclass = -1; // 多线程任务实例id

    this.srcuid = -1; // IThreadSendData 数据对象的唯一标识, 不能随便更改

    this.dataIndex = -1;
    /**
     * 直接传递内存句柄所有权的数据流对象数组
     */

    this.streams = null;
    /**
     * sendStatus   值为 -1 表示没有加入数据池等待处理
     *              值为 0 表示已经加入数据池正等待处理
     *              值为 1 表示已经发送给worker
     */

    this.sendStatus = -1;
    /**
     * build vaule from ThreadWFST.ts
     * 任务数据在执行过程中的状态(work flow status): 将32位分为4个8位, 分别表示任务执行过程中的四种类别的状态(未知 | 未知 | 未知 | 流转状态)，默认是0x0
     */

    this.wfst = 0;
  } // 按照实际需求构建自己的数据(sendData和transfers等)


  buildThis(transferEnabled) {}

  reset() {}

  static GetFreeId() {
    if (ThreadSendData.m_freeIdList.length > 0) {
      return ThreadSendData.m_freeIdList.pop();
    }

    return -1;
  }

  static Create() {
    let sd = null;
    let index = ThreadSendData.GetFreeId(); //console.log("index: "+index);
    //console.log("ThreadSendData::Create(), ThreadSendData.m_unitList.length: "+ThreadSendData.m_unitList.length);

    if (index >= 0) {
      sd = ThreadSendData.m_unitList[index];
      sd.dataIndex = index;
      ThreadSendData.m_unitFlagList[index] = ThreadSendData.s_FLAG_BUSY;
    } else {
      sd = new ThreadSendData();
      ThreadSendData.m_unitList.push(sd);
      ThreadSendData.m_unitFlagList.push(ThreadSendData.s_FLAG_BUSY);
      sd.dataIndex = ThreadSendData.m_unitListLen;
      ThreadSendData.m_unitListLen++;
    }

    return sd;
  }

  static Contains(psd) {
    if (psd != null) {
      let uid = psd.dataIndex;

      if (uid >= 0 && uid < ThreadSendData.m_unitListLen) {
        return ThreadSendData.m_unitList[uid] == psd;
      }
    }

    return false;
  }

  static Restore(psd) {
    if (ThreadSendData.Contains(psd)) {
      let uid = psd.dataIndex;

      if (ThreadSendData.m_unitFlagList[uid] == ThreadSendData.s_FLAG_BUSY) {
        ThreadSendData.m_freeIdList.push(uid);
        ThreadSendData.m_unitFlagList[uid] = ThreadSendData.s_FLAG_FREE;
        psd.sendStatus = -1;
        psd.reset();
      }
    }
  }

  static RestoreByUid(uid) {
    if (uid >= 0 && ThreadSendData.m_unitFlagList[uid] == ThreadSendData.s_FLAG_BUSY) {
      ThreadSendData.m_freeIdList.push(uid);
      ThreadSendData.m_unitFlagList[uid] = ThreadSendData.s_FLAG_FREE;
      ThreadSendData.m_unitList[uid].reset();
    }
  }

}

ThreadSendData.s_FLAG_BUSY = 1;
ThreadSendData.s_FLAG_FREE = 0;
ThreadSendData.m_unitFlagList = [];
ThreadSendData.m_unitListLen = 0;
ThreadSendData.m_unitList = [];
ThreadSendData.m_freeIdList = [];
exports.ThreadSendData = ThreadSendData;

/***/ }),

/***/ "2931":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ListPool_1 = __webpack_require__("9cc2");

class UnitReceiverNode {
  constructor() {
    this.m_receivers = [];
    this.m_flag = true;
  }

  testReset() {
    this.m_flag = true; // console.log("AAAYYYT02 02 testReset() ...");
  }

  addReceiver(r) {
    this.m_receivers.push(r);
  }

  removeReceiver(r) {
    // console.log("AAAYYT remove an UnitReceiverNode instance.");
    let list = this.m_receivers;

    for (let i = 0, len = list.length; i < len; ++i) {
      if (r == list[i]) {
        list.splice(i, 1);
        break;
      }
    }
  }

  testUnitForce(flag) {
    if (this.m_flag) {
      if (this.unit.isCpuPhase()) {
        // console.log("a data unit is enabled in the cpu phase.");
        let list = this.m_receivers;

        for (let i = 0, len = list.length; i < len; ++i) {
          const r = list[i];

          if (r.dataUnitUUID > 0 && r.listUUID > 0) {
            // console.log("AAAYYYT02 03 testUnitForce() ...");
            r.receiveDataUnit(this.unit, 1);
          }
        }

        this.m_flag = false;
        return true;
      }

      return false;
    }

    return true;
  }

  testUnit() {
    if (this.m_flag) {
      if (this.unit.isCpuPhase()) {
        // console.log("a data unit is enabled in the cpu phase.");
        let list = this.m_receivers;

        for (let i = 0, len = list.length; i < len; ++i) {
          const r = list[i];

          if (r.dataUnitUUID > 0 && r.listUUID > 0) {
            r.receiveDataUnit(this.unit, 1);
          }
        }

        this.m_flag = false;
        return true;
      }

      return false;
    }

    return true;
  }

  destroy(receiverPool, nodeMap) {
    // console.log("AAAYYYT destroy an UnitReceiverNode instance.");
    let list = this.m_receivers;

    for (let i = 0, len = list.length; i < len; ++i) {
      const r = list[i];
      receiverPool.removeItem(r);
    }

    nodeMap.delete(this.uuid);
    this.uuid = 0;
    this.m_receivers = null;
  }

}

class ReceiverSchedule {
  constructor() {
    this.m_nodeMap = new Map();
    this.m_nodes = [];
    this.m_receiverPool = new ListPool_1.ListPool();
    this.m_receiversTotal = 0;
  }

  testUnitForce(unit, flag) {
    if (unit != null) {
      let node = this.m_nodeMap.get(unit.getUUID()); // console.log("AAAYYYT02 01 testUnitForce(), node != null: ", node != null);

      if (node != null) {
        node.testUnitForce(flag);
        return node.testUnit();
      }
    }

    return false;
  }

  testUnit(unit) {
    if (unit != null) {
      let node = this.m_nodeMap.get(unit.getUUID());

      if (node != null) {
        return node.testUnit();
      }
    }

    return false;
  }

  addReceiver(receiver, unit) {
    if (unit != null) {
      if (this.m_receiverPool.hasnotItem(receiver)) {
        let node;

        if (this.m_nodeMap.has(unit.getUUID())) {
          node = this.m_nodeMap.get(unit.getUUID());
        } else {
          node = new UnitReceiverNode();
          node.unit = unit;
          node.uuid = unit.getUUID();
          this.m_nodes.push(node);
          this.m_nodeMap.set(unit.getUUID(), node);
        }

        receiver.dataUnitUUID = unit.getUUID();
        let listUUID = receiver.listUUID; // console.log("this.m_receiverPool.addItem(receiver).................");

        this.m_receiverPool.addItem(receiver);

        if (listUUID == receiver.listUUID) {
          throw "ReceiverSchedule::addReceiver() is the illegal operation !!!(listUUID(" + listUUID + "), receiver.listUUID(" + receiver.listUUID + "))";
        }

        node.addReceiver(receiver);
        this.m_receiversTotal++;
      }
    }
  }

  removeReceiver(receiver) {
    // console.log("AAAYYYT02 01 -a receiver.dataUnitUUID: ", receiver.dataUnitUUID);
    if (receiver.dataUnitUUID > 0 && receiver.listUUID > 0) {
      // console.log("AAAYYYT02 01 -b removeReceiver testUnitForce(), this.m_receiverPool.hasItem(receiver): ", this.m_receiverPool.hasItem(receiver));
      if (this.m_receiverPool.hasItem(receiver)) {
        let node = this.m_nodeMap.get(receiver.dataUnitUUID);
        node.removeReceiver(receiver);
        this.m_receiverPool.removeItem(receiver);
        this.m_receiversTotal--;
      }
    } // 去除掉依赖


    receiver.dataUnitUUID = 0;
    receiver.listUUID = 0;
  }

  getReceiversTotal() {
    return this.m_receiversTotal;
  }

  run() {
    if (this.m_receiversTotal > 0) {
      let list = this.m_nodes;
      let flag;
      let node;

      for (let i = 0, len = list.length; i < len; ++i) {
        node = list[i];
        flag = node.testUnit();

        if (flag) {
          this.m_receiversTotal--;
          list.splice(i, 1); // console.log("AAAYYYT02 01 -c");

          node.destroy(this.m_receiverPool, this.m_nodeMap);
          i--;
          len--;
        }
      }
    }
  }

  destroy() {}

}

exports.ReceiverSchedule = ReceiverSchedule;

/***/ }),

/***/ "2a59":
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

const DataUnit_1 = __webpack_require__("74ee");

const ResourceSchedule_1 = __webpack_require__("7de1");

const ModuleNS_1 = __webpack_require__("8eb0");

const GeometryDataUnit_1 = __webpack_require__("aeff");

const CTMParserListerner_1 = __webpack_require__("73f9");

const DracoParserListerner_1 = __webpack_require__("eed9");

const OBJParserListerner_1 = __webpack_require__("31e1");

const FBXParserListerner_1 = __webpack_require__("8f7d");
/**
 * 数据资源调度器基类
 */


class GeometryResourceSchedule extends ResourceSchedule_1.ResourceSchedule {
  constructor() {
    super();
    this.m_waitingUnits = [];
  }

  addUrlToTask(unit) {
    console.log("GeometryResourceSchedule::createDataUnit(), unit.data.dataFormat: ", unit.data.dataFormat);
    let url = unit.url;

    switch (unit.data.dataFormat) {
      case DataUnit_1.DataFormat.CTM:
        this.m_ctmListener.addUrlToTask(url);
        break;

      case DataUnit_1.DataFormat.Draco:
        this.m_dracoListener.addUrlToTask(url);
        break;

      case DataUnit_1.DataFormat.OBJ:
        this.m_objListener.addUrlToTask(url);
        break;

      case DataUnit_1.DataFormat.FBX:
        this.m_fbxListener.addUrlToTask(url);
        break;

      default:
        console.error("GeometryResourceSchedule::createDataUnit(), illegal data format:", unit.data.dataFormat, ", its url: ", url);
        break;
    }
  }
  /**
   * 覆盖父类函数，实现具体功能
   */


  createDataUnit(url, dataFormat, immediate = false) {
    GeometryDataUnit_1.DataUnitLock.lockStatus = 207;
    let unit = new GeometryDataUnit_1.GeometryDataUnit();
    unit.lossTime = Date.now();
    unit.immediate = immediate;
    unit.data = new GeometryDataUnit_1.GeometryDataContainer();
    unit.data.dataFormat = dataFormat;
    unit.url = url;

    if (this.isInitialized()) {
      this.addUrlToTask(unit);
    } else {
      this.m_waitingUnits.push(unit);
    }

    return unit;
  }
  /**
   * 被子类覆盖，以便实现具体功能
   */


  initTask(unitPool, threadSchedule, receiverSchedule, taskModules) {
    for (let i = 0; i < taskModules.length; ++i) {
      const module = taskModules[i]; // console.log("GeometryResourceSchedule::initTask(), module.name:", module.name);

      switch (module.name) {
        case ModuleNS_1.ModuleNS.ctmParser:
          this.m_ctmListener = new CTMParserListerner_1.CTMParserListerner(unitPool, threadSchedule, module, receiverSchedule);
          break;

        case ModuleNS_1.ModuleNS.dracoParser:
          this.m_dracoListener = new DracoParserListerner_1.DracoParserListerner(unitPool, threadSchedule, module, receiverSchedule);
          break;

        case ModuleNS_1.ModuleNS.objParser:
          this.m_objListener = new OBJParserListerner_1.OBJParserListerner(unitPool, threadSchedule, module, receiverSchedule);
          break;

        case ModuleNS_1.ModuleNS.fbxFastParser:
          this.m_fbxListener = new FBXParserListerner_1.FBXParserListerner(unitPool, threadSchedule, module, receiverSchedule);
          break;

        default:
          break;
      }
    }

    let units = this.m_waitingUnits;

    for (let i = 0; i < units.length; i++) {
      // console.log("XXXXXX geometry deferred units["+i+"]: ", units[i]);
      this.addUrlToTask(units[i]);
    }

    this.m_waitingUnits = [];
  }
  /**
   * 销毁当前实例
   */


  destroy() {
    super.destroy();
    this.m_waitingUnits = [];

    if (this.m_ctmListener != null) {
      this.m_ctmListener.destroy();
      this.m_ctmListener = null;
    }

    if (this.m_objListener != null) {
      this.m_objListener.destroy();
      this.m_objListener = null;
    }

    if (this.m_fbxListener != null) {
      this.m_fbxListener.destroy();
      this.m_fbxListener = null;
    }

    if (this.m_dracoListener != null) {
      this.m_dracoListener.destroy();
      this.m_dracoListener = null;
    }
  }

}

exports.GeometryResourceSchedule = GeometryResourceSchedule;

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

/***/ "31e1":
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

const HttpFileLoader_1 = __webpack_require__("5b39");

const GeometryDataUnit_1 = __webpack_require__("aeff");

const OBJParseTask_1 = __webpack_require__("ceac");

const DivLog_1 = __importDefault(__webpack_require__("3bda"));

class OBJParserListerner {
  constructor(unitPool, threadSchedule, module, receiverSchedule) {
    this.m_parseTask = null;
    this.m_moduleUrl = module.url;
    this.m_unitPool = unitPool;
    this.m_threadSchedule = threadSchedule;
    this.m_receiverSchedule = receiverSchedule;
  }

  addUrlToTask(url) {
    if (!this.m_unitPool.hasUnitByUrl(url)) {
      if (this.m_parseTask == null) {
        // 创建ctm 加载解析任务
        let parseTask = new OBJParseTask_1.OBJParseTask(this.m_moduleUrl); // 绑定当前任务到多线程调度器

        this.m_threadSchedule.bindTask(parseTask);
        parseTask.setListener(this);
        this.m_parseTask = parseTask;
      }

      new HttpFileLoader_1.HttpFileLoader().load(url, (buf, url) => {
        DivLog_1.default.ShowLogOnce("正在解析OBJ数据...");
        this.m_parseTask.addBinaryData(buf, url);
      }, (progress, url) => {
        let k = Math.round(100 * progress);
        DivLog_1.default.ShowLogOnce("obj file loading " + k + "%");
      }, (status, url) => {
        console.error("load obj mesh data error, url: ", url);
        this.objParseFinish([{
          vertices: null,
          uvsList: null,
          normals: null,
          indices: null
        }], url);
      });
    }
  } // 一个任务数据处理完成后的侦听器回调函数


  objParseFinish(models, url) {
    // console.log("ObjParserListerner::ctmParseFinish(), models: ", models, ", url: ", url);
    if (this.m_unitPool.hasUnitByUrl(url)) {
      let unit = this.m_unitPool.getUnitByUrl(url);

      if (unit != null) {
        unit.lossTime = Date.now() - unit.lossTime;
        unit.data.dataFormat = GeometryDataUnit_1.DataFormat.OBJ;
        unit.data.models = models;
        GeometryDataUnit_1.DataUnitLock.lockStatus = 209;
        unit.toCpuPhase();

        if (unit.immediate) {
          // console.log("geom data receive at once.");
          this.m_receiverSchedule.testUnit(unit);
        }
      }
    }
  }

  destroy() {
    if (this.m_parseTask != null) {
      this.m_parseTask.destroy();
      this.m_parseTask = null;
    }

    this.m_unitPool = null;
    this.m_threadSchedule = null;
    this.m_receiverSchedule = null;
  }

}

exports.OBJParserListerner = OBJParserListerner;

/***/ }),

/***/ "3844":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "3964":
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
 * 处理子线程和主线程之、子线程和子线程 这些线程间的数据传输路由
 */

class TaskDataRouter {
  constructor(taskclass) {
    // 这个变量的值将由实现者视具体情况而定，因为这个值为true则表示数据已经准备好了处于可用状态
    this.m_dataEnabled = false;
    this.param = null;
    this.m_taskclass = taskclass;
  }

  getTaskClass() {
    return this.m_taskclass;
  }

  isDataEnabled() {
    return this.m_dataEnabled;
  }
  /**
   * @returns 返回是否处在传输状态中，如果是，则返回true
   */


  isTransmission() {
    return this.m_dataEnabled && this.param != null;
  }

  disable() {
    this.m_dataEnabled = false;
  }

  setData(data) {// 这里不一定是直接赋值，可能要经过处理和转化
  }
  /**
   * 由线程对象调用，以便启动数据处理的相应， 子类覆盖此函数以便实现具体的功能
   */


  acquireTrigger() {}
  /**
   * 这个过程默认支持异步机制，如果有数据则使用，如果没数据，则进入到等待队列, 需要被子类覆盖之后再使用
   * 这个数据的获取过程分为两类:
   * 纯值访问的方式: 内存操作无影响的可复制数据，则可以保持源数据直接使用。
   * 内存转移的方式: 这个情况下数据要以内存转移的形式传递出去，传递出去之后而没有传回来之前是不能再使用了
   * 具体实现则由子类的具体逻辑来决定
   * @returns 由线程相关过程获取数据对象
   */


  getData() {
    // 如果有，就直接返回，如果没有，则将自己加入到等等队列
    throw Error("illegal operation !!!");
    return null;
  }
  /**
   * 具体实现逻辑由子类覆盖
   * @returns 由线程相关过程获取数据对象的transfer对象数组
   */


  getTransfers() {
    return null;
  }

}

exports.TaskDataRouter = TaskDataRouter;

/***/ }),

/***/ "3a1d":
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

const ThreadConfigure_1 = __webpack_require__("fce7");

const ThrDataPool_1 = __webpack_require__("7566");

const ThreadSendData_1 = __webpack_require__("2356");

const ThreadBase_1 = __webpack_require__("7ebf");

const TaskDescriptor_1 = __webpack_require__("c917");

const ThreadCodeSrcType_1 = __webpack_require__("d2d9");

const ThreadTaskPool_1 = __webpack_require__("42a2");

const TDRManager_1 = __webpack_require__("85f5");

const TaskRegister_1 = __webpack_require__("63fb");
/**
 * 多线程任务调度器, 之所以用实例，是因为不同的实例实际上就能对线程集合做分类管理
 */


class ThreadSchedule {
  // private m_autoTerminate: boolean = true;
  constructor() {
    // allow ThreadSchedule initialize yes or no
    this.m_initBoo = true; // 延迟销毁子线程的毫秒数

    this.m_teDelay = 3000;
    this.m_teTime = 0;
    this.m_maxThreadsTotal = 0;
    this.m_thrSupportFlag = -1;
    this.m_codeBlob = null;
    this.m_commonModuleUrls = [];
    this.m_threads = [];
    this.m_threadsTotal = 0;
    this.m_threadEnabled = true; // TODO(lyl): 下面两行暂时这么写

    this.m_thrIdexSDList = [];
    this.m_thrIndexList = [];
    this.m_codeStrList = [];
    this.m_dataPool = new ThrDataPool_1.ThrDataPool();
    /**
     * 线程中子模块间依赖关系的json描述
     */

    this.m_graphJsonStr = "";
    this.m_autoSendData = false;
    this.m_currNewThr = null;
    let tot = ThreadConfigure_1.ThreadConfigure.MAX_TASKS_TOTAL;
    this.m_taskPool = new ThreadTaskPool_1.ThreadTaskPool(tot);
    this.m_descList = new Array(tot);
    this.m_descList.fill(null);
    this.m_tdrManager = new TDRManager_1.TDRManager(tot);
    this.m_taskReg = new TaskRegister_1.TaskRegister();
    this.m_teTime = Date.now();
  }

  setParams(autoSendData, terminateDelayMS = 3000) {
    this.m_autoSendData = autoSendData;
    this.m_teDelay = terminateDelayMS;
  }

  hasRouterByTaskClass(taskclass) {
    return this.m_tdrManager.hasRouterByTaskClass(taskclass);
  }

  setTaskDataRouter(taskDataRouter) {
    this.m_tdrManager.setRouter(taskDataRouter);
  }
  /**
   * 任务实例和当前线程系统建立关联
   * @param task 任务实例
   * @param taskDataRouter 用户为线程中数据路由
   * @param threadIndex 指定线程序号, 默认值为1表示未指定
   */


  bindTask(task, threadIndex = -1) {
    if (task != null) {
      let success = task.attach(this.m_taskPool);

      if (success) {
        let localPool = null;

        if (threadIndex >= 0 && threadIndex < this.m_maxThreadsTotal) {
          for (;;) {
            if (threadIndex >= this.m_threadsTotal) {
              this.createThread();
            } else {
              break;
            }
          }

          localPool = this.m_threads[threadIndex].localDataPool;
        }

        let d = task.dependency;
        let info = null;

        if (d != null) {
          if (d.isJSFile()) {
            info = this.initTaskByURL(d.threadCodeFileURL, -1);
          } else if (d.isDependency()) {
            info = this.initTaskByDependency(d.dependencyUniqueName, d.moduleName);
          } else if (d.isCodeString()) {
            info = this.initTaskByCodeStr(d.threadCodeString, d.moduleName);
          }
        }

        task.setDataPool(this.m_dataPool, localPool);
        task.setTaskInfo(info);
      }
    }
  }

  sendDataToThreadAt(i, sendData) {
    if (i >= 0 && i < this.m_maxThreadsTotal) {
      if (i >= this.m_threadsTotal) {
        for (;;) {
          if (i >= this.m_threadsTotal) {
            this.createThread();
          } else {
            break;
          }
        }
      }

      if (sendData != null && sendData.sendStatus < 0) {
        if (this.m_threads[i].isFree()) {
          sendData.sendStatus = 0;
          this.m_threads[i].sendDataTo(sendData);
        } else {
          this.m_threads[i].localDataPool.addData(sendData);
        }
      }
    } else {
      this.m_thrIdexSDList.push(sendData);
      this.m_thrIndexList.push(i);
    }
  }
  /**
   * @returns 返回是否在队列中还有待处理的数据
   */


  hasTaskData() {
    return this.m_dataPool.isEnabled();
  }

  getThrDataPool() {
    return this.m_dataPool;
  }
  /**
   * 间隔一定的时间，循环执行
   */


  run() {
    let terminate = false;

    if (this.getThreadEnabled()) {
      this.m_tdrManager.run(); //console.log("this.m_dataPool.isEnabled(): ",this.m_dataPool.isEnabled());

      let needTotal = 0;

      if (this.m_dataPool.isEnabled()) {
        for (let i = 0; i < this.m_threadsTotal; ++i) {
          // console.log("this.m_threads["+i+"].isFree(): ",this.m_threads[i].isFree(),", enabled: ",this.m_threads[i].isEnabled());
          if (this.m_threads[i].isFree()) {
            this.m_dataPool.sendDataTo(this.m_threads[i]);
          } else {
            if (this.m_dataPool.isEnabled()) needTotal++;
          }
        }
      } else {
        for (let i = 0; i < this.m_threadsTotal; ++i) {
          if (!this.m_threads[i].sendPoolDataToThread()) {
            if (this.m_threads[i].hasDataToThread()) needTotal++;
          }
        }
      }

      needTotal += this.m_dataPool.isEnabled() ? 1 : 0;

      if (needTotal > 0) {
        this.createThread();
      } else {
        needTotal = 0;

        for (let i = 0; i < this.m_threadsTotal; ++i) {
          if (this.m_threads[i].isFree()) {
            needTotal++;
          }
        }

        if (this.m_teDelay > 0) {
          terminate = needTotal >= this.m_threadsTotal;
          if (!terminate) this.m_teTime = Date.now();
        }
      }
    } // console.log("terminate: ",terminate,this.m_threadsTotal);


    if (terminate && this.m_threadsTotal > 0) {
      let dt = Date.now() - this.m_teTime;

      if (dt > this.m_teDelay) {
        this.m_teTime = Date.now();
        let thr = this.m_threads[this.m_threadsTotal - 1];

        if (thr.isFree()) {
          this.m_threads.pop();
          this.m_threadsTotal--;
          thr.destroy();
          console.log("ThreadSchedule::run(), terminate and destroy a thread instance, threadsTotal: ", this.m_threadsTotal);
        }
      }
    }
  }

  createThread() {
    if (this.m_currNewThr != null && (this.m_currNewThr.isEnabled() || this.m_currNewThr.isDestroyed())) {
      this.m_currNewThr = null;
    }

    if (this.m_currNewThr == null && this.m_threadsTotal < this.m_maxThreadsTotal) {
      let thread = new ThreadBase_1.ThreadBase(this.m_tdrManager, this.m_taskPool, this.m_graphJsonStr);
      this.m_currNewThr = thread;
      thread.autoSendData = this.m_autoSendData;
      thread.globalDataPool = this.m_dataPool;
      thread.initialize(this.m_codeBlob);
      this.m_threads.push(thread);
      console.log("create Thread(" + this.m_threadsTotal + "), dataTotal: ", this.m_dataPool.getDataTotal());
      this.m_threadsTotal++;
      this.m_tdrManager.setThreads(this.m_threads);

      for (let i = 0, len = this.m_descList.length; i < len; ++i) {
        thread.initModuleByTaskDescriptor(this.m_descList[i]);
      }

      thread.initModules(this.m_commonModuleUrls);

      for (let i = 0; i < this.m_codeStrList.length; ++i) {
        thread.initModuleByCodeString(this.m_codeStrList[i]);
      }

      if (this.m_threadsTotal >= this.m_maxThreadsTotal) {
        this.m_commonModuleUrls = [];
        this.m_codeStrList = [];
      }

      let sdList = this.m_thrIdexSDList.slice(0);
      let indexList = this.m_thrIndexList.slice(0);
      this.m_thrIdexSDList = [];
      this.m_thrIndexList = [];

      for (let i = 0; i < sdList.length; ++i) {
        this.sendDataToThreadAt(indexList[i], sdList[i]);
      }
    }
  }
  /**
   * 通过参数, 添加发送给子线程的数据
   * @param taskCmd 处理当前数据的任务命令名字符串
   * @param streams 用于内存所有权转换的数据流数组, 例如 Float32Array 数组, 默认值是null
   * @param descriptor 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 默认值是 null
   */


  addDataWithParam(taskCmd, streams = null, descriptor = null) {
    let sd = ThreadSendData_1.ThreadSendData.Create();
    sd.taskCmd = taskCmd;
    sd.streams = streams;
    sd.descriptor = descriptor;
    this.addData(sd);
  }
  /**
   * 将任务实例重点额数据对象添加到线程系统任务池子中
   * @param thrData
   */


  addData(thrData) {
    if (thrData != null && thrData.srcuid >= 0) {
      this.m_dataPool.addData(thrData);
    }
  }

  getAFreeThread() {
    for (let i = 0; i < this.m_threadsTotal; ++i) {
      if (this.m_threads[i].isFree()) {
        return this.m_threads[i];
      }
    }

    return null;
  }

  getThreadsTotal() {
    return this.m_threadsTotal;
  }

  getMaxThreadsTotal() {
    return this.m_maxThreadsTotal;
  } // 当前系统是否开启 worker multi threads


  setThreadEnabled(boo) {
    if (this.m_thrSupportFlag > 0) this.m_thrSupportFlag = boo ? 2 : 1;
    this.m_threadEnabled = boo;
  }

  getThreadEnabled() {
    return this.m_threadEnabled;
  } // runtime support worker multi thrads yes or no


  isSupported() {
    if (this.m_thrSupportFlag > 0) {
      return this.m_thrSupportFlag == 2;
    }

    let boo = typeof Worker !== "undefined" && typeof Blob !== "undefined";
    this.m_thrSupportFlag = boo ? 2 : 1;
    this.m_threadEnabled = boo;
    return boo;
  }
  /**
   * 通过外部js文件源码初始化在线程中处理指定任务的程序代码
   * @param jsFileUrl 子线程中执行的源码的js文件的相对url
   * @param taskclass 子线程中执行的源码中的对象类名
   */


  initTaskByURL(jsFileUrl, taskclass, moduleName = "") {
    if (jsFileUrl != "") {
      let id = this.m_taskReg.getTaskClassByKeyuns(jsFileUrl);
      let task = id >= 0 ? this.m_descList[id] : null;

      if (task == null) {
        task = new TaskDescriptor_1.TaskDescriptor(ThreadCodeSrcType_1.ThreadCodeSrcType.JS_FILE_CODE, jsFileUrl, moduleName);
        this.m_taskReg.buildTaskInfo(task);
        id = task.info.taskClass;
        this.m_descList[id] = task;
        this.initModuleByTaskDescriptor(task);
      }

      return task.info;
    }

    return null;
  }
  /**
   * 通过唯一依赖名初始化在线程中处理指定任务的程序代码
   * @param jsFileUrl 子线程中执行的源码的js文件的相对url
   * @param taskclass 子线程中执行的源码中的对象类名
   */


  initTaskByDependency(dependencyUniqueName, moduleName = "") {
    if (dependencyUniqueName != "") {
      let id = this.m_taskReg.getTaskClassByKeyuns(dependencyUniqueName);
      let task = id >= 0 ? this.m_descList[id] : null;

      if (task == null) {
        task = new TaskDescriptor_1.TaskDescriptor(ThreadCodeSrcType_1.ThreadCodeSrcType.DEPENDENCY, dependencyUniqueName, moduleName);
        this.m_taskReg.buildTaskInfo(task);
        id = task.info.taskClass;
        this.m_descList[id] = task;
        this.initModuleByTaskDescriptor(task);
      }

      return task.info;
    }

    return null;
  }
  /**
   * 通过字符串源码初始化在线程中处理指定任务的程序代码
   * @param codestr 子线程中执行的源码字符串
   * @param moduleName 子线程中执行的源码中的对象类名
   */


  initTaskByCodeStr(codestr, moduleName) {
    if (codestr != "") {
      let id = this.m_taskReg.getTaskClassByKeyuns(moduleName);
      let task = id >= 0 ? this.m_descList[id] : null;

      if (task == null) {
        task = new TaskDescriptor_1.TaskDescriptor(ThreadCodeSrcType_1.ThreadCodeSrcType.STRING_CODE, codestr, moduleName);
        this.m_taskReg.buildTaskInfo(task);
        id = task.info.taskClass;
        this.m_descList[id] = task;
        this.initModuleByTaskDescriptor(task);
      }

      return task.info;
    }

    return null;
  }

  initModuleByTaskDescriptor(task) {
    for (let i = 0; i < this.m_threadsTotal; ++i) {
      this.m_threads[i].initModuleByTaskDescriptor(task);
    }
  }
  /**
   * 通过js文件url数组来初始化子线程中的若干共有基础功能模块
   * @param moduleUrls 模块的js代码url数组
   */


  initModules(moduleUrls) {
    if (moduleUrls != null && moduleUrls.length > 0) {
      for (let i = 0; i < moduleUrls.length; ++i) {
        if (moduleUrls[i] == "") throw Error("moduleUrls[" + i + '] == ""');
        this.m_commonModuleUrls.push(moduleUrls[i]);
      }

      for (let i = 0; i < this.m_threadsTotal; ++i) {
        this.m_threads[i].initModules(moduleUrls);
      }
    }
  }
  /**
   * 通过代码字符串形式来初始化子线程中的共有基础功能模块
   * @param codeStr js代码的字符串形式
   */


  initModuleByCodeString(codeStr) {
    if (codeStr.length > 8) {
      if (this.m_threadsTotal < this.m_maxThreadsTotal) {
        this.m_codeStrList.push(codeStr);
      }

      for (let i = 0; i < this.m_threadsTotal; ++i) {
        this.m_threads[i].initModuleByCodeString(codeStr);
      }
    }
  }

  destroy() {
    if (this.m_tdrManager != null) {
      for (let i = 0; i < this.m_threadsTotal; ++i) {
        this.m_threads[i].destroy();
      }

      this.m_threads = [];
      this.m_tdrManager.destroy();
      this.m_tdrManager = null;
      this.m_threadsTotal = 0;
    }
  }
  /**
   * 设置线程中子模块间依赖关系的json描述字符串
   * @param graphJsonStr json描述字符串
   */


  setDependencyGraphJsonString(graphJsonStr) {
    this.m_graphJsonStr = graphJsonStr;
  }
  /**
   * 初始化线程系统的子线程
   * @param maxThreadsTotal 最大子线程数量
   * @param coreCodeUrl 线程初始核心代码文件url
   */


  initialize(maxThreadsTotal, coreCodeUrl, baseCodeStr = "") {
    if (this.m_initBoo) {
      if (this.getThreadEnabled() && this.isSupported()) {
        if (coreCodeUrl == "") {
          throw Error('coreCodeUrl == "" !!!');
        }

        coreCodeUrl = this.getUrl(coreCodeUrl);
        let request = new XMLHttpRequest();
        request.open("GET", coreCodeUrl, true);

        request.onload = () => {
          if (request.status <= 206) {
            let bolb = baseCodeStr == "" ? new Blob([request.responseText]) : new Blob([baseCodeStr + request.responseText]);
            this.initThread(maxThreadsTotal, bolb);
          } else {
            console.error("load thread core code file url error: ", coreCodeUrl);
          }
        };

        request.onerror = e => {
          console.error("load thread core code file url error: ", coreCodeUrl);
        };

        request.send(null);
      }

      this.m_initBoo = false;
    }
  }

  initThread(maxThreadsTotal, bolb) {
    if (maxThreadsTotal < 1) maxThreadsTotal = 1;
    this.m_codeBlob = bolb;
    this.m_maxThreadsTotal = maxThreadsTotal; // this.createThread();
  }

  getUrl(url) {
    let k = url.indexOf("http://");
    if (k < 0) k = url.indexOf("https://");
    if (k >= 0) return url;
    let scriptDir = window.location.href;
    let baseUrl = scriptDir.slice(0, scriptDir.lastIndexOf("/") + 1);
    url = baseUrl + url;
    return url;
  }

}

exports.ThreadSchedule = ThreadSchedule;

/***/ }),

/***/ "3b80":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ThreadCodeSrcType_1 = __webpack_require__("d2d9");
/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系
 */


class TaskDependency {
  constructor() {
    this.moduleName = "";
    this.threadCodeString = "";
    this.threadCodeFileURL = "";
    this.dependencyUniqueName = "";
    this.threadCodeSrcType = ThreadCodeSrcType_1.ThreadCodeSrcType.JS_FILE_CODE;
  } // toJSFile(): void {
  //     this.threadCodeFileURL = "";
  //     this.threadCodeSrcType = ThreadCodeSrcType.JS_FILE_CODE;
  // }
  // toDependency(): void {
  //     this.dependencyUniqueName = "";
  //     this.threadCodeSrcType = ThreadCodeSrcType.DEPENDENCY;
  // }
  // toCodeString(): void {
  //     this.threadCodeString = "";
  //     this.threadCodeSrcType = ThreadCodeSrcType.STRING_CODE;
  // }

  /**
   * @returns 如果是基于代码字符串初始化，则返回true
   */


  isCodeString() {
    return this.threadCodeSrcType == ThreadCodeSrcType_1.ThreadCodeSrcType.STRING_CODE;
  }
  /**
   * @returns 如果是基于外部js文件url初始化，则返回true
   */


  isJSFile() {
    return this.threadCodeSrcType == ThreadCodeSrcType_1.ThreadCodeSrcType.JS_FILE_CODE;
  }
  /**
   * @returns 如果是基于唯一依赖名初始化，则返回true
   */


  isDependency() {
    return this.threadCodeSrcType == ThreadCodeSrcType_1.ThreadCodeSrcType.DEPENDENCY;
  }

  isCodeBlob() {
    return this.threadCodeSrcType == ThreadCodeSrcType_1.ThreadCodeSrcType.BLOB_CODE;
  }

  clone() {
    let td = new TaskDependency();
    if (this.isCodeString()) td.threadCodeString = this.threadCodeString;
    if (this.isJSFile()) td.threadCodeFileURL = this.threadCodeFileURL;
    if (this.isDependency()) td.dependencyUniqueName = this.dependencyUniqueName; // if(this.isCodeBlob()) 

    td.threadCodeSrcType = this.threadCodeSrcType;
    return td;
  }

}

exports.TaskDependency = TaskDependency;
/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系: js 文件依赖形式
 */

class TaskJSFileDependency extends TaskDependency {
  constructor(codeFileURL) {
    super();
    this.threadCodeFileURL = codeFileURL;
    this.threadCodeSrcType = ThreadCodeSrcType_1.ThreadCodeSrcType.JS_FILE_CODE;
  }

}

exports.TaskJSFileDependency = TaskJSFileDependency;
/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系: 依赖的唯一名称依赖形式
 */

class TaskUniqueNameDependency extends TaskDependency {
  constructor(dependencyUniqueName) {
    super();
    this.dependencyUniqueName = dependencyUniqueName;
    this.threadCodeSrcType = ThreadCodeSrcType_1.ThreadCodeSrcType.DEPENDENCY;
  }

}

exports.TaskUniqueNameDependency = TaskUniqueNameDependency;
/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系: 代码字符串依赖形式
 */

class TaskCodeStringDependency extends TaskDependency {
  constructor(codeString, moduleName) {
    super();
    this.threadCodeString = codeString;
    this.moduleName = moduleName;
    this.threadCodeSrcType = ThreadCodeSrcType_1.ThreadCodeSrcType.STRING_CODE;
  }

}

exports.TaskCodeStringDependency = TaskCodeStringDependency;

/***/ }),

/***/ "3bda":
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

const ColorUtils_1 = __webpack_require__("a567");

class DivLog {
  static SetDebugEnabled(boo) {
    DivLog.s_debugEanbled = boo;
  }

  static SetXY(px, py) {
    DivLog.s_leftX = px;
    DivLog.s_topY = py;
  }
  /**
   * @param uintRGB24, uint 24bit rgb color, example: 0xff003a
   */


  static SetTextBgColor(uintRGB24) {
    DivLog.s_textBGColor = ColorUtils_1.RGBColorUtil.uint24RGBToCSSHeXRGBColor(uintRGB24);

    if (DivLog.s_infoDiv != null) {
      DivLog.s_infoDiv.style.backgroundColor = this.s_textBGColor;
    }
  }
  /**
   * @param uintRGB24, uint 24bit rgb color, example: 0xff003a
   */


  static SetTextColor(uintRGB24) {
    DivLog.s_textColor = ColorUtils_1.RGBColorUtil.uint24RGBToCSSHeXRGBColor(uintRGB24);

    if (DivLog.s_infoDiv != null) {
      DivLog.s_infoDiv.style.color = this.s_textColor;
    }
  }

  static SetTextBgEnabled(boo) {
    this.s_textBgEnabled = boo;

    if (DivLog.s_infoDiv != null) {
      let pdiv = DivLog.s_infoDiv;

      if (DivLog.s_textBgEnabled) {
        pdiv.style.backgroundColor = this.s_textBGColor;
      } else {
        pdiv.style.backgroundColor = "";
      }
    }
  }

  static ShowLog(logStr) {
    if (DivLog.s_debugEanbled) {
      if (DivLog.s_logStr.length > 0) {
        DivLog.s_logStr += "<br/>" + logStr;
      } else {
        DivLog.s_logStr = logStr;
      }

      DivLog.UpdateDivText();
    }
  }

  static GetLog() {
    return DivLog.s_logStr;
  }

  static ShowLogOnce(logStr) {
    if (DivLog.s_debugEanbled) {
      DivLog.s_logStr = logStr;
      DivLog.UpdateDivText();
    }
  }

  static ClearLog(logStr = "") {
    if (DivLog.s_debugEanbled) {
      DivLog.s_logStr = logStr;
      DivLog.UpdateDivText();
    }
  }

  static UpdateDivText() {
    if (DivLog.s_debugEanbled) {
      if (DivLog.s_infoDiv != null) {
        DivLog.s_infoDiv.innerHTML = DivLog.s_logStr;
      } else {
        let div = document.createElement('div');
        div.style.color = "";
        let pdiv = div;
        pdiv.width = 128;
        pdiv.height = 64;

        if (DivLog.s_textBgEnabled) {
          pdiv.style.backgroundColor = this.s_textBGColor;
        } else {
          pdiv.style.backgroundColor = "";
        }

        pdiv.style.color = this.s_textColor;
        pdiv.style.left = DivLog.s_leftX + 'px';
        pdiv.style.top = DivLog.s_topY + 'px';
        pdiv.style.zIndex = "9999";
        pdiv.style.position = 'absolute';
        document.body.appendChild(pdiv);
        DivLog.s_infoDiv = pdiv;
        pdiv.innerHTML = DivLog.s_logStr;
      }
    }
  }

  static ShowAtTop() {
    if (DivLog.s_infoDiv != null) {
      DivLog.s_infoDiv.parentElement.removeChild(DivLog.s_infoDiv);
      document.body.appendChild(DivLog.s_infoDiv);
    }
  }

}

DivLog.s_logStr = "";
DivLog.s_infoDiv = null;
DivLog.s_debugEanbled = false;
DivLog.s_textBGColor = "#aa0033";
DivLog.s_textColor = "#000000";
DivLog.s_textBgEnabled = true;
DivLog.s_leftX = 0;
DivLog.s_topY = 128;
exports.default = DivLog;

/***/ }),

/***/ "42a2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 记录绑定在当前线程控制模块的任务对象
 */

class ThreadTaskPool {
  constructor(total) {
    this.m_total = 0;
    this.m_total = total;
    this.m_taskList = new Array(total);
    this.m_taskList[0] = null;
    this.m_freeList = new Array(total);

    for (let i = 1, len = total; i < len; ++i) {
      this.m_freeList[i] = i;
    }
  }

  getTaskByUid(uid) {
    if (uid < this.m_total && uid > 0) {
      return this.m_taskList[uid];
    }

    return null;
  } // 重新关联一个 DetachTask 操作之后的 task


  attachTask(task) {
    // console.log("ThreadTaskPool::AttachTask()...");
    if (task.getUid() < 1) {
      if (this.m_freeList.length > 0) {
        let uid = this.m_freeList.pop();
        this.m_taskList[uid] = task;
        return uid;
      }
    }

    return -1;
  } // detach a task, 使之不会再被多任务系统调用


  detachTask(task) {
    // console.log("ThreadTaskPool::detachTask()...");
    if (task.getUid() > 0 && this.m_taskList[task.getUid()] != null) {
      this.m_taskList[task.getUid()] = null;
      this.m_freeList.push(task.getUid());
    }
  }

}

exports.ThreadTaskPool = ThreadTaskPool;

/***/ }),

/***/ "58fc":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // interface GeometryModelDataType {
//   uvsList: Float32Array[];
//   vertices: Float32Array;
//   normals: Float32Array;
//   indices: Uint16Array | Uint32Array;
//   status? : number;
// }

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

/***/ "60cd":
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
 * TaskDataRouter 参数对象
 */

class TDRParam {
  constructor(ptaskclass, pcmd, ptaskCmd, pthreadIndex) {
    this.status = 0;
    this.taskclass = ptaskclass;
    this.cmd = pcmd;
    this.taskCmd = ptaskCmd;
    this.threadIndex = pthreadIndex;
  }

}

exports.TDRParam = TDRParam;

/***/ }),

/***/ "63fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ThreadCodeSrcType_1 = __webpack_require__("d2d9");

class TaskRegister {
  constructor() {
    this.m_taskTotal = 0;
    this.m_map = new Map();
  }

  getTaskClassByKeyuns(keyuns) {
    if (this.m_map.has(keyuns)) {
      return this.m_map.get(keyuns);
    }

    return -1;
  }

  hasKeyuns(keyuns) {
    return this.m_map.has(keyuns);
  }

  buildTaskInfo(des) {
    let keyuns = des.moduleName;

    switch (des.type) {
      case ThreadCodeSrcType_1.ThreadCodeSrcType.JS_FILE_CODE:
        keyuns = des.src;
        break;

      case ThreadCodeSrcType_1.ThreadCodeSrcType.DEPENDENCY:
        keyuns = des.src;
        break;

      default:
        break;
    }

    let i = -1;

    if (keyuns != "") {
      if (this.m_map.has(keyuns)) {
        i = this.m_map.get(keyuns);
      } else {
        i = this.m_taskTotal++;
        this.m_map.set(keyuns, i);
      }
    } else {
      console.error("keyuns's value is empty!!!");
    }

    des.info = {
      taskClass: i,
      keyuns: keyuns
    };
  }

}

exports.TaskRegister = TaskRegister;

/***/ }),

/***/ "698b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 表示数据所处的阶段, 当数据由网路载入到 gpu 则 其phase = PHASE_NET | PHASE_CPU | PHASE_GPU
 */

class DataPhaseFlag {
  static clearAllPhase(phaseFlag = 0) {
    return DataPhaseFlag.PHASE_NONE;
  }

  static addNetPhase(phaseFlag) {
    return DataPhaseFlag.PHASE_NET | phaseFlag;
  }

  static addCpuPhase(phaseFlag) {
    return DataPhaseFlag.PHASE_CPU | phaseFlag;
  }

  static addGpuPhase(phaseFlag) {
    return DataPhaseFlag.PHASE_GPU | phaseFlag;
  }

  static removeNetPhase(phaseFlag) {
    return ~DataPhaseFlag.PHASE_NET & phaseFlag;
  }

  static removeCpuPhase(phaseFlag) {
    return ~DataPhaseFlag.PHASE_CPU & phaseFlag;
  }

  static removeGpuPhase(phaseFlag) {
    return ~DataPhaseFlag.PHASE_GPU & phaseFlag;
  }

  static isNonePhase(phaseFlag) {
    return DataPhaseFlag.PHASE_NONE == phaseFlag;
  }

  static isNetPhase(phaseFlag) {
    return (DataPhaseFlag.PHASE_NET & phaseFlag) == DataPhaseFlag.PHASE_NET;
  }

  static isCpuPhase(phaseFlag) {
    return (DataPhaseFlag.PHASE_CPU & phaseFlag) == DataPhaseFlag.PHASE_CPU;
  }

  static isGpuPhase(phaseFlag) {
    return (DataPhaseFlag.PHASE_GPU & phaseFlag) == DataPhaseFlag.PHASE_GPU;
  }

}
/**
 * 表示处于未定义的情况
 */


DataPhaseFlag.PHASE_NONE = 0;
/**
 * 表示数据处于网路请求的阶段
 */

DataPhaseFlag.PHASE_NET = 1 << 2;
/**
 * 表示数据处于cpu阶段
 */

DataPhaseFlag.PHASE_CPU = 1 << 3;
/**
 * 表示数据处于gpu阶段
 */

DataPhaseFlag.PHASE_GPU = 1 << 4;
exports.DataPhaseFlag = DataPhaseFlag;

/***/ }),

/***/ "73f9":
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

const HttpFileLoader_1 = __webpack_require__("5b39");

const GeometryDataUnit_1 = __webpack_require__("aeff");

const CTMParseTask_1 = __webpack_require__("7dbf");

const DivLog_1 = __importDefault(__webpack_require__("3bda"));

class CTMParserListerner {
  constructor(unitPool, threadSchedule, module, receiverSchedule) {
    this.m_parseTask = null;
    this.m_moduleUrl = module.url;
    this.m_unitPool = unitPool;
    this.m_threadSchedule = threadSchedule;
    this.m_receiverSchedule = receiverSchedule;
  }

  addUrlToTask(url) {
    if (!this.m_unitPool.hasUnitByUrl(url)) {
      if (this.m_parseTask == null) {
        let parseTask = new CTMParseTask_1.CTMParseTask(this.m_moduleUrl); // 绑定当前任务到多线程调度器

        this.m_threadSchedule.bindTask(parseTask);
        parseTask.setListener(this);
        this.m_parseTask = parseTask;
      }

      new HttpFileLoader_1.HttpFileLoader().load(url, (buf, url) => {
        DivLog_1.default.ShowLogOnce("正在解析CTM数据...");
        this.m_parseTask.addBinaryData(new Uint8Array(buf), url);
      }, (progress, url) => {
        let k = Math.round(100 * progress);
        DivLog_1.default.ShowLogOnce("ctm file loading " + k + "%");
      }, (status, url) => {
        console.error("load ctm mesh data error, url: ", url);
        this.ctmParseFinish({
          vertices: null,
          uvsList: null,
          normals: null,
          indices: null,
          uuid: url
        }, url);
      });
    }
  } // 一个任务数据处理完成后的侦听器回调函数


  ctmParseFinish(model, url) {
    // console.log("CTMParserListerner::ctmParseFinish(), model: ", model, ", url: ", url);
    if (this.m_unitPool.hasUnitByUrl(url)) {
      let unit = this.m_unitPool.getUnitByUrl(url);

      if (unit != null) {
        unit.lossTime = Date.now() - unit.lossTime;
        unit.data.models = [model];
        GeometryDataUnit_1.DataUnitLock.lockStatus = 209;
        unit.toCpuPhase();

        if (unit.immediate) {
          // console.log("geom data receive at once.");
          this.m_receiverSchedule.testUnit(unit);
        }
      }
    }
  }

  destroy() {
    if (this.m_parseTask != null) {
      this.m_parseTask.destroy();
      this.m_parseTask = null;
    }

    this.m_unitPool = null;
    this.m_threadSchedule = null;
    this.m_receiverSchedule = null;
  }

}

exports.CTMParserListerner = CTMParserListerner;

/***/ }),

/***/ "74ee":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataPhaseFlag_1 = __webpack_require__("698b");

const DataFormat_1 = __webpack_require__("7a08");

exports.DataFormat = DataFormat_1.DataFormat;
var DataClass;

(function (DataClass) {
  DataClass[DataClass["Geometry"] = 0] = "Geometry";
  DataClass[DataClass["Texture"] = 1] = "Texture";
  DataClass[DataClass["Undefined"] = 2] = "Undefined";
})(DataClass || (DataClass = {}));

exports.DataClass = DataClass;

class DataUnitLock {}
/**
 * f防止误操作故意为之
 */


DataUnitLock.lockStatus = 0;
exports.DataUnitLock = DataUnitLock;

class DataUnit {
  constructor() {
    // 表示 none/net/cpu/gpu 三个阶段的信息, 初始值必须是DataPhaseFlag.PHASE_NONE, 外部用户不能操作
    this.m_dataPhaseFlag = DataPhaseFlag_1.DataPhaseFlag.PHASE_NONE;
    /**
     * 当数据结果生成之后，是否立即向接收者发送数据结果
     */

    this.immediate = false;
    /**
     * 数据生成过程耗时
     */

    this.lossTime = 0; // 故意写成这样，防止误操作

    if (DataUnitLock.lockStatus !== 207) {
      throw Error("illegal operation !!!");
    }

    this.m_uuid = DataUnit.s_uuid++;
    DataUnitLock.lockStatus = 0;
  }

  getUUID() {
    return this.m_uuid;
  }

  clone() {
    return null;
  }

  test() {}
  /**
   * @returns 返回CPU端数据是否可用
   */


  isNetPhase() {
    return DataPhaseFlag_1.DataPhaseFlag.isCpuPhase(this.m_dataPhaseFlag);
  }
  /**
   * @returns 返回CPU端数据是否可用
   */


  isCpuPhase() {
    return DataPhaseFlag_1.DataPhaseFlag.isCpuPhase(this.m_dataPhaseFlag);
  }
  /**
   * @returns 返回GPU端数据是否可用
   */


  isGpuPhase() {
    return DataPhaseFlag_1.DataPhaseFlag.isGpuPhase(this.m_dataPhaseFlag);
  }

  clearAllPhase() {
    this.m_dataPhaseFlag = DataPhaseFlag_1.DataPhaseFlag.clearAllPhase(this.m_dataPhaseFlag);
  }

  toNetPhase() {
    if (DataUnitLock.lockStatus !== 208) {
      throw Error('illegal operation !!!');
    }

    this.m_dataPhaseFlag = DataPhaseFlag_1.DataPhaseFlag.addNetPhase(this.m_dataPhaseFlag);
  }

  toCpuPhase() {
    if (DataUnitLock.lockStatus !== 209) {
      throw Error("illegal operation !!!");
    }

    this.m_dataPhaseFlag = DataPhaseFlag_1.DataPhaseFlag.addCpuPhase(this.m_dataPhaseFlag);
  }

  toGpuPhase() {
    if (DataUnitLock.lockStatus !== 210) {
      throw Error('illegal operation !!!');
    }

    this.m_dataPhaseFlag = DataPhaseFlag_1.DataPhaseFlag.addGpuPhase(this.m_dataPhaseFlag);
  }

}

DataUnit.s_uuid = 0;
exports.DataUnit = DataUnit;

/***/ }),

/***/ "7566":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class ThrDataPool {
  constructor() {
    this.m_dataList = []; // wait calc data queue

    this.m_waitingDataList = [];
    this.m_dataTotal = 0;
    this.m_dataHaveTotal = 0;
    this.m_startupFlag = 0;
  }

  sendDataTo(thread) {
    if (this.m_dataTotal > 0) {
      let data = null; // 等待队列有数据，就优先发送这个队列里面的数据

      let len = this.m_waitingDataList.length;

      if (len > 0) {
        data = this.m_waitingDataList[0];
        thread.sendDataTo(data);

        if (data.sendStatus == 1) {
          this.m_dataTotal--;
          len--;
          this.m_waitingDataList.shift();
          return true;
        }
      }

      len = this.m_dataTotal - len;

      if (len > 0) {
        data = this.m_dataList.shift();
        thread.sendDataTo(data);

        if (data.sendStatus == 1) {
          this.m_dataTotal--;
          return true;
        } else {
          // 因为相关计算模块还没准备好,需先加入等待队列
          this.m_waitingDataList.push(data);
        }
      }
    }

    return false;
  }

  addData(thrData) {
    if (thrData.sendStatus < 0) {
      thrData.sendStatus = 0;
      this.m_dataTotal++;
      this.m_dataHaveTotal++;
      this.m_startupFlag = 1;
      this.m_dataList.push(thrData);
    } else {
      console.error("thrData.sendStatus value is " + thrData.sendStatus);
    }
  }

  getDataTotal() {
    return this.m_dataTotal;
  }

  isEnabled() {
    // console.log(this.m_dataHaveTotal,this.m_dataTotal,this.m_startupFlag);
    return this.m_dataTotal * this.m_startupFlag > 0;
  }

  isStartup() {
    return this.m_startupFlag > 0;
  }

}

exports.ThrDataPool = ThrDataPool;

/***/ }),

/***/ "7a08":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 数据文件类型，例如 ctm, draco
 */

var DataFormat;

(function (DataFormat) {
  DataFormat["CTM"] = "ctm";
  DataFormat["Draco"] = "draco";
  DataFormat["OBJ"] = "obj";
  DataFormat["FBX"] = "fbx";
  DataFormat["GLB"] = "glb";
  DataFormat["Jpg"] = "jpg";
  DataFormat["Png"] = "png";
  DataFormat["Gif"] = "gif";
})(DataFormat || (DataFormat = {}));

exports.DataFormat = DataFormat;

/***/ }),

/***/ "7c58":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const TaskDataRouter_1 = __webpack_require__("3964");
/**
 * 处理子线程和主线程之间任务模块之间相互依赖的数据交互
 */


class DracoGeomParseTaskDataRouter extends TaskDataRouter_1.TaskDataRouter {
  constructor(taskclass, wasmUrl) {
    super(taskclass);
    this.m_triggerFlag = true;
    this.m_wasmUrl = wasmUrl;
  }

  setData(data) {
    // 这里不一定是直接赋值，可能要经过处理和转化
    this.m_wasmBinBuf = data.streams[0];
    this.m_dataEnabled = true;
  }
  /**
   * 由线程对象调用，以便启动数据处理的相应， 子类覆盖此函数以便实现具体的功能
   */


  acquireTrigger() {
    if (!this.isTransmission()) {
      if (this.m_triggerFlag) {
        // load wasm bin file
        let wasmXHR = new XMLHttpRequest();
        wasmXHR.open("GET", this.m_wasmUrl, true);
        wasmXHR.responseType = "arraybuffer";

        wasmXHR.onload = () => {
          console.log("loaded wasm binary.");
          this.m_wasmBinBuf = wasmXHR.response;
          this.m_dataEnabled = true;
        };

        wasmXHR.send(null);
        this.m_triggerFlag = false;
      }
    }
  }
  /**
   * 这个过程默认支持异步机制，如果有数据则使用，如果没数据，则进入到等待队列
   * @returns 线程初始化需要的数据。数据可内存共享的方式使用或者复制的方式使用
   */


  getData() {
    // 一旦获取数据就认为这个数据不可用了，直到重新得到数据为止
    this.m_dataEnabled = false; // 如果有，就直接返回，如果没有，则将自己加入到等等队列

    return {
      info: "draco wasm code file",
      streams: [this.m_wasmBinBuf]
    };
  }

  getTransfers() {
    return [this.m_wasmBinBuf];
  }

}

exports.DracoGeomParseTaskDataRouter = DracoGeomParseTaskDataRouter;

/***/ }),

/***/ "7dbf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ThreadTask_1 = __webpack_require__("83a3");

const TaskDependency_1 = __webpack_require__("3b80");

const CTMTaskCMD_1 = __webpack_require__("1f9e");
/**
 * ctm 几何模型数据加载/解析任务对象
 */


class CTMParseTask extends ThreadTask_1.ThreadTask {
  /**
   * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
   */
  constructor(src) {
    super();
    this.m_listener = null;

    if (src.indexOf("/") > 0) {
      this.dependency = new TaskDependency_1.TaskJSFileDependency(src);
    } else {
      this.dependency = new TaskDependency_1.TaskUniqueNameDependency(src);
    }
  }

  setListener(l) {
    this.m_listener = l;
  }

  addBinaryData(buffer, url) {
    if (buffer != null) {
      this.addDataWithParam(CTMTaskCMD_1.CTMTaskCMD.PARSE, [buffer], {
        url: url
      });
    }
  }

  addURL(url) {
    if (url != "") {
      this.addDataWithParam(CTMTaskCMD_1.CTMTaskCMD.LOAD_AND_PARSE, null, {
        url: url
      });
    }
  } // return true, task finish; return false, task continue...


  parseDone(data, flag) {
    // console.log("CTMParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);
    if (this.m_listener != null) {
      let model = data.data;
      if (model.normals == undefined) model.normals = null;
      if (model.uvsList == undefined) model.uvsList = null;
      this.m_listener.ctmParseFinish(model, data.descriptor.url);
    }

    return true;
  }

  destroy() {
    super.destroy();
    this.m_listener = null;
  }

}

exports.CTMParseTask = CTMParseTask;

/***/ }),

/***/ "7de1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataUnitPool_1 = __webpack_require__("a092");

const DataReceiverBase_1 = __webpack_require__("2033");
/**
 * 内置的资源接收器
 */


class ResourceReceiver extends DataReceiverBase_1.DataReceiverBase {
  constructor() {
    super();
    ResourceReceiver.s_total++; // console.log("### ResourceReceiver.s_total: ",ResourceReceiver.s_total);
  }

  receiveDataUnit(unit, status) {
    // console.log("ResourceReceiver::receiveDataUnit(), unit: ", unit);
    let callback = this.callback;
    this.callback = null;

    if (callback != null) {
      callback(unit, status);
    }
  }

}

ResourceReceiver.s_total = 0;

class ReqNode {
  constructor() {}

  reset() {
    this.receiver = null;
    this.unit = null;
  }

}
/**
 * 数据资源调度器基类
 */


class ResourceSchedule {
  constructor() {
    this.m_receiverSchedule = null;
    this.m_unitPool = new DataUnitPool_1.DataUnitPool(); // private m_taskModuleUrls: string[] = null;

    this.m_taskModules = null;
    this.m_reqNodes = [];
  }
  /**
   * 被子类覆盖，以便实现具体功能
   */


  createDataUnit(url, dataFormat, immediate = false) {
    return null;
  }
  /**
   * 被子类覆盖，以便实现具体功能
   */


  initTask(unitPool, threadSchedule, receiverSchedule, taskModules) {}

  setTaskModuleParams(taskModules) {
    if (taskModules != null) {
      // this.m_taskModuleUrls = taskModuleUrls.slice(0);
      this.m_taskModules = taskModules.slice(0);
    }
  }

  isInitialized() {
    return this.m_receiverSchedule != null;
  }

  initialize(receiverSchedule, threadSchedule, taskModules = null) {
    if (this.m_receiverSchedule == null && this.m_threadSchedule == null) {
      this.m_receiverSchedule = receiverSchedule;
      this.m_threadSchedule = threadSchedule; // this.initTask( this.m_unitPool, threadSchedule, receiverSchedule, this.m_taskModuleUrls != null ? this.m_taskModuleUrls: taskModuleUrls);

      this.initTask(this.m_unitPool, threadSchedule, receiverSchedule, this.m_taskModules != null ? this.m_taskModules : taskModules);
      let ls = this.m_reqNodes;

      for (let i = 0; i < ls.length; i++) {
        const node = ls[i]; // console.log("XXXXXXXX UUUUU --- YYYYY, ResourceSchedule::initialize(), unit:", node.unit);

        this.m_unitPool.addUnit(node.unit.url, node.unit);
        this.m_receiverSchedule.addReceiver(node.receiver, node.unit);
      }
    }
  }

  hasDataUnit(url) {
    return this.m_unitPool.hasUnitByUrl(url);
  }
  /**
   * 注意: 不建议过多使用这个函数,因为回调函数不安全如果是lambda表达式则由性能问题。
   * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
   * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
   * @param url 数据资源url
   * @param dataFormat 数据资源类型
   * @param callback 数据资源接收回调函数, 其值建议为lambda函数表达式
   * @param immediate 是否立即返回数据, 默认是false
   * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
   */


  getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate = false) {
    let unit = this.m_unitPool.getUnitByUrl(url);

    if (unit != null) {
      if (callback != null) {
        if (unit.isCpuPhase()) {
          console.log("getCPUDataUnitByUrlAndCallback(), the data unit is already available.");
          unit.lossTime = 0;
          callback(unit, 1);
          return unit;
        }
      }
    }

    if (unit == null) {
      let r = new ResourceReceiver();
      r.callback = callback;
      unit = this.getCPUDataByUrl(url, dataFormat, r, immediate);
    }

    return unit;
  }
  /**
   * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
   * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
   * @param url 数据资源url
   * @param dataFormat 数据资源类型
   * @param receiver 数据资源接收者,默认值是 null
   * @param immediate 是否立即返回数据, 默认是false
   * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
   */


  getCPUDataByUrl(url, dataFormat, receiver = null, immediate = false) {
    let unit = this.m_unitPool.getUnitByUrl(url);

    if (unit != null) {
      if (receiver != null) {
        if (unit.isCpuPhase()) {
          console.log("getCPUDataUnitByUrl(), the data unit is already available.");
          unit.lossTime = 0;
          receiver.receiveDataUnit(unit, 1);
          return unit;
        }
      }
    }

    if (unit == null) {
      unit = this.createDataUnit(url, dataFormat, immediate);
      unit.lossTime = Date.now();
      unit.url = url;
      console.log("           unitPool.addUnit: ", url, unit);

      if (this.m_receiverSchedule != null) {
        this.m_unitPool.addUnit(url, unit);
      }
    }

    if (this.m_receiverSchedule != null) {
      this.m_receiverSchedule.addReceiver(receiver, unit);
    } else {
      let node = new ReqNode();
      node.receiver = receiver;
      node.unit = unit;
      this.m_reqNodes.push(node);
    }

    return unit;
  }

  getGPUDataByUrlAndCallback(url, dataFormat, callback, immediate = false) {
    return null;
  }

  getGPUDataByUrl(url, dataFormat, receiver = null, immediate = false) {
    return null;
  }

  getGPUDataByUUIDAndCallback(uuid, callback) {
    return null;
  }

  getGPUDataByUUID(uuid, receiver = null) {
    return null;
  }
  /**
   * 销毁当前实例
   */


  destroy() {
    if (this.m_receiverSchedule != null) {
      this.m_receiverSchedule = null;
      this.m_threadSchedule = null;
    }
  }

}

exports.ResourceSchedule = ResourceSchedule;

/***/ }),

/***/ "7ebf":
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

const ThreadCMD_1 = __webpack_require__("1e86");

const ThreadSendData_1 = __webpack_require__("2356");

const ThrDataPool_1 = __webpack_require__("7566");

const ThreadCodeSrcType_1 = __webpack_require__("d2d9");

const ThreadConfigure_1 = __webpack_require__("fce7");

const TDRParam_1 = __webpack_require__("60cd");

const ThreadWFST_1 = __webpack_require__("9d01");

class ThreadBase {
  constructor(tdrManager, taskPool, graphJsonStr = "") {
    this.m_uid = -1;
    this.m_worker = null;
    this.m_taskItems = [];
    this.m_free = false;
    this.m_enabled = false;
    this.m_initBoo = true;
    this.m_thrData = null;
    this.m_commonModuleMap = new Map();
    this.autoSendData = false;
    this.localDataPool = new ThrDataPool_1.ThrDataPool();
    this.globalDataPool = null;
    this.unlock = true;
    this.m_tdrManager = tdrManager;
    this.m_taskPool = taskPool; // this.m_taskReg = taskReg;

    this.m_graphJsonStr = graphJsonStr;
    this.m_uid = ThreadBase.s_uid++;
    this.m_taskfs = new Array(ThreadConfigure_1.ThreadConfigure.MAX_TASKS_TOTAL);
    this.m_taskfs.fill(-1);
  }

  getUid() {
    return this.m_uid;
  }

  isEnabled() {
    return this.m_enabled;
  }

  isFree() {
    return this.m_free && this.unlock;
  }

  hasDataToThread() {
    return this.localDataPool.isEnabled() || this.globalDataPool.isEnabled();
  }

  sendPoolDataToThread() {
    if (this.m_free) {
      let boo = this.localDataPool.isEnabled();

      if (boo) {
        boo = this.localDataPool.sendDataTo(this);
      }

      if (!boo) {
        boo = this.globalDataPool.sendDataTo(this);
      }

      return boo;
    }

    return false;
  } // send parse data to thread


  sendDataTo(thrData) {
    if (this.m_free && this.m_taskfs[thrData.taskclass] > 0) {
      // console.log("ThreadBase::sendDataTo(),this.m_free: "+this.m_free,thrData+",uid: "+this.getUid());
      thrData.buildThis(true);
      let sendData = {
        streams: null
      };
      sendData.descriptor = thrData.descriptor;
      sendData.taskCmd = thrData.taskCmd;
      sendData.taskclass = thrData.taskclass;
      sendData.srcuid = thrData.srcuid;
      sendData.dataIndex = thrData.dataIndex;
      sendData.wfst = thrData.wfst;
      sendData.streams = thrData.streams;
      sendData.cmd = ThreadCMD_1.ThreadCMD.DATA_PARSE;
      sendData.threadIndex = this.m_uid; // this.m_time = Date.now();

      if (thrData.streams != null) {
        let ls = thrData.streams;
        let transfers = new Array(ls.length);

        for (let i = 0; i < ls.length; ++i) {
          if (ls[i] instanceof ArrayBuffer) {
            transfers[i] = ls[i];
          } else {
            transfers[i] = ls[i].buffer;
          }
        }

        this.m_worker.postMessage(sendData, transfers);
      } else {
        this.m_worker.postMessage(sendData);
      }

      thrData.sendStatus = 1;
      thrData.streams = null;
      sendData.descriptor = null;
      sendData.streams = null;
      this.m_thrData = thrData;
      this.m_free = false;
    } else {
      let flag = this.m_taskfs[thrData.taskclass];

      if (flag == 0 && this.isFree()) {
        let len = this.m_taskItems.length;

        for (let i = 0; i < len; ++i) {
          const task = this.m_taskItems[i];

          if (task.info.taskClass == thrData.taskclass) {
            this.initThreadTask(task);
            this.m_taskItems.splice(i, 1);
            break;
          }
        }
      } else if (flag < 0) {
        console.error("task class(" + thrData.taskclass + ") module is undeifned in the Thread(" + this.m_uid + ")");
      }
    }
  }

  initModuleByTaskDescriptor(task) {
    // console.log("ThreadBase::initModuleByTaskDescriptor(), A, task: ", task);
    if (task != null) {
      let taskclass = task.info.taskClass;
      console.log("ThreadBase::initModuleByTaskDescriptor(), task.info: ", task.info, "in the Thread(" + this.m_uid + ")");

      if (taskclass >= 0 && taskclass < this.m_taskfs.length) {
        if (this.m_taskfs[taskclass] < 0) {
          this.m_taskfs[taskclass] = 0;
          this.m_taskItems.push(task);
        }
      }
    }
  }

  initModules(moduleUrls) {
    let urls = [];

    for (let i = 0; i < moduleUrls.length; ++i) {
      if (!this.m_commonModuleMap.has(moduleUrls[i])) {
        this.m_commonModuleMap.set(moduleUrls[i], 1);
        urls.push(moduleUrls[i]);
      }
    } // console.log("XXXX thread initModules urls.length: ",urls.length);


    if (urls.length > 0) {
      this.m_worker.postMessage({
        cmd: ThreadCMD_1.ThreadCMD.INIT_COMMON_MODULE,
        threadIndex: this.getUid(),
        modules: urls,
        type: ThreadCodeSrcType_1.ThreadCodeSrcType.JS_FILE_CODE
      });
    }
  }

  initModuleByCodeString(codeStr) {
    this.m_worker.postMessage({
      cmd: ThreadCMD_1.ThreadCMD.INIT_COMMON_MODULE,
      threadIndex: this.getUid(),
      src: codeStr,
      type: ThreadCodeSrcType_1.ThreadCodeSrcType.STRING_CODE
    });
  }

  initThreadTask(task) {
    this.m_free = false;
    this.m_enabled = false; // let task = this.m_taskItems.pop();
    // type 为0 表示task js 文件是外部加载的, 如果为 1 则表示是由运行时字符串构建的任务可执行代码

    console.log("Main worker(" + this.getUid() + ") updateInitTask(), task: ", task); // let info: {taskClass:number, keyuns: string} = this.m_taskReg.getTaskInfo(task);
    // console.log("task info: ", info);

    this.m_worker.postMessage({
      cmd: ThreadCMD_1.ThreadCMD.INIT_TASK,
      threadIndex: this.getUid(),
      param: task,
      info: task.info
    });
  }

  updateInitTask() {
    console.log("Main worker(" + this.getUid() + ") updateInitTask() this.m_taskItems.length: ", this.m_taskItems.length);

    if (this.m_taskItems.length > 0) {
      let task = this.m_taskItems.pop();
      this.initThreadTask(task); // this.m_free = false;
      // this.m_enabled = false;
      // let task = this.m_taskItems.pop();
      // // type 为0 表示task js 文件是外部加载的, 如果为 1 则表示是由运行时字符串构建的任务可执行代码
      // console.log("Main worker("+this.getUid()+") updateInitTask(), task: ",task);
      // // let info: {taskClass:number, keyuns: string} = this.m_taskReg.getTaskInfo(task);
      // // console.log("task info: ", info);
      // this.m_worker.postMessage({ cmd: ThreadCMD.INIT_TASK, threadIndex: this.getUid(), param: task, info: task.info });
    }
  }

  receiveData(data) {
    let wfst = data.wfst;
    let transST = ThreadWFST_1.ThreadWFST.GetTransStatus(wfst);
    this.m_free = transST == ThreadWFST_1.TransST.None || transST == ThreadWFST_1.TransST.Finish;
    console.log("Main worker(" + this.getUid() + ") recieve data, transST: ", transST, ", free: ", this.m_free, ", autoSendData: ", this.autoSendData); // 下面这个逻辑要慎用，用了可能会对时间同步(例如帧同步)造成影响

    if (this.autoSendData) {
      this.sendPoolDataToThread();
    } // let task: ThreadTask = ThreadTask.GetTaskByUid(data.srcuid);


    let task = this.m_taskPool.getTaskByUid(data.srcuid); // console.log("task != null: ",(task != null),", data.srcuid: ",data.srcuid,", thread uid: ",this.m_uid);
    // console.log("data: ",data);

    let finished = true;

    if (task != null) {
      finished = task.parseDone(data, 0);
    }

    this.updateInitTask();
  }

  sendRouterDataTo(router) {
    let param = router.param; // console.log("#### A thread("+this.m_uid+"), sendRouterDataTo(), param: ", param);

    if (router != null && router.isTransmission() && param.threadIndex == this.m_uid) {
      router.param = null; // console.log("#### B thread("+this.m_uid+"), sendRouterDataTo(), param: ", param);

      this.m_worker.postMessage({
        cmd: param.cmd,
        taskCmd: param.taskCmd,
        threadIndex: this.getUid(),
        taskclass: param.taskclass,
        data: router.getData()
      }, router.getTransfers());
    }
  }

  terminate() {
    if (this.m_worker != null) {
      this.m_worker.terminate();
      this.m_worker = null;
      this.m_free = false;
      this.m_enabled = false;
    }
  }

  destroy() {
    if (this.m_worker != null) {
      this.terminate();
      this.m_taskPool = null;
      this.m_tdrManager = null;
      this.m_graphJsonStr = "";
      this.localDataPool = null;
      this.globalDataPool = null;
    }
  }

  isDestroyed() {
    return this.m_taskPool == null;
  }

  initialize(blob) {
    if (this.m_initBoo && blob != null && this.m_worker == null) {
      this.m_initBoo = false;
      let worker = new Worker(URL.createObjectURL(blob));
      this.m_worker = worker;

      this.m_worker.onmessage = evt => {
        if (this.m_thrData != null) {
          ThreadSendData_1.ThreadSendData.Restore(this.m_thrData);
          this.m_thrData.sendStatus = -1;
          this.m_thrData = null;
        } // console.log("Main worker("+this.getUid()+") recieve data, event.data: ",evt.data,",uid: "+this.m_uid);


        let data = evt.data; // console.log("Main Worker received worker cmd: ",data.cmd);

        switch (data.cmd) {
          case ThreadCMD_1.ThreadCMD.DATA_PARSE:
            this.receiveData(data);
            break;

          case ThreadCMD_1.ThreadCMD.THREAD_INIT:
            worker.postMessage({
              cmd: ThreadCMD_1.ThreadCMD.INIT_PARAM,
              threadIndex: this.getUid(),
              graphJsonStr: this.m_graphJsonStr,
              total: ThreadConfigure_1.ThreadConfigure.MAX_TASKS_TOTAL
            });
            break;

          case ThreadCMD_1.ThreadCMD.INIT_TASK:
            if (this.m_taskfs[data.taskclass] < 0) {
              throw Error("sub worker taskclass and main worker logic taskClass are not equal !!!");
            }

            this.m_taskfs[data.taskclass] = 1;
            this.m_free = true;
            this.m_enabled = true; // console.log("Main Worker("+this.getUid()+") INIT_TASK data.taskclass: ", data.taskclass);

            this.updateInitTask();
            break;

          case ThreadCMD_1.ThreadCMD.INIT_PARAM:
            this.m_free = true;
            this.m_enabled = true; //console.log("Main worker INIT_PARAM.");

            this.updateInitTask();
            break;

          case ThreadCMD_1.ThreadCMD.THREAD_ACQUIRE_DATA:
            console.log("ThreadCMD.THREAD_ACQUIRE_DATA, data.taskclass: ", data.taskclass);
            let tdrParam = new TDRParam_1.TDRParam(data.taskclass, data.cmd, data.taskCmd, this.getUid());
            let router1 = this.m_tdrManager.getRouterByTaskClass(data.taskclass);

            if (router1 != null) {
              router1.acquireTrigger(); // console.log("#####$$$ Main worker("+this.getUid()+") ThreadCMD.THREAD_ACQUIRE_DATA, router: ", router1.isDataEnabled() && !router1.isTransmission(), router1);

              if (router1.isDataEnabled() && !router1.isTransmission()) {
                router1.param = tdrParam;
                this.sendRouterDataTo(router1);
              } else {
                router1 = null;
              }
            }

            if (router1 == null) {
              this.m_tdrManager.waitRouterByParam(tdrParam);
            }

            break;

          case ThreadCMD_1.ThreadCMD.THREAD_TRANSMIT_DATA:
            let router2 = this.m_tdrManager.getRouterByTaskClass(data.taskclass); // console.log("#### ThreadCMD.THREAD_TRANSMIT_DATA, router2: ", router2.isDataEnabled() && !router2.isTransmission(), router2);

            if (router2 != null) {
              if (router2.isDataEnabled()) {
                console.error("router have old data, can not reset new data.");
              }

              router2.setData(data.data);
            }

            break;

          case ThreadCMD_1.ThreadCMD.INIT_COMMON_MODULE:
            break;

          default:
            break;
        }
      };
    }
  }

}

ThreadBase.s_uid = 0;
exports.ThreadBase = ThreadBase;

/***/ }),

/***/ "80fa":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ThreadTask_1 = __webpack_require__("83a3");

const TaskDependency_1 = __webpack_require__("3b80");

const PNGDescriptorType_1 = __webpack_require__("8df7");

exports.PNGDescriptorType = PNGDescriptorType_1.PNGDescriptorType;
/**
 * png 解析任务对象
 */

class PNGParseTask extends ThreadTask_1.ThreadTask {
  /**
   * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
   */
  constructor(src) {
    super();
    this.m_listener = null;

    if (src.indexOf("/") > 0) {
      this.dependency = new TaskDependency_1.TaskJSFileDependency(src);
    } else {
      this.dependency = new TaskDependency_1.TaskUniqueNameDependency(src);
    }
  }

  setListener(l) {
    this.m_listener = l;
  }

  addBinaryData(buffer, url) {
    if (buffer != null) {
      this.addDataWithParam("", [buffer], {
        url: url,
        width: 0,
        height: 0,
        filterType: 4
      });
    }
  } // return true, task finish; return false, task continue...


  parseDone(data, flag) {
    // console.log("CTMParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);
    if (this.m_listener != null) {
      this.m_listener.pngParseFinish(data.data, data.descriptor);
    }

    return true;
  }

  destroy() {
    super.destroy();
    this.m_listener = null;
  }

}

exports.PNGParseTask = PNGParseTask;

/***/ }),

/***/ "83a3":
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

const ThreadSendData_1 = __webpack_require__("2356");

class ThreadTask {
  constructor() {
    this.m_uid = -1;
    this.m_globalDataPool = null;
    this.m_localDataPool = null;
    this.m_taskPool = null;
    this.m_info = null;
    this.m_parseIndex = 0;
    this.m_parseTotal = 0;
    /**
     * 当前任务对于线程中相关代码模块的依赖关系
     */

    this.dependency = null;
    console.log("XXXX ThreadTask::constructor() ...");
  }

  attach(taskPool) {
    if (this.m_uid < 0 && this.m_taskPool == null && taskPool != null) {
      this.m_taskPool = taskPool;
      let uid = taskPool.attachTask(this);

      if (uid > 0) {
        this.m_uid = uid;
        return true;
      } else {
        throw Error("illegal operation!!!");
      }
    }

    return false;
  }

  detach() {
    if (this.m_uid > 0 && this.m_taskPool != null) {
      this.m_taskPool.detachTask(this);
      this.m_uid = -1;
    }
  }

  setTaskInfo(info) {
    console.log("XXXX ThreadTask::setTaskInfo() info: ", info);
    this.m_info = info;
  }

  setDataPool(globalDataPool, localDataPool = null) {
    this.m_globalDataPool = globalDataPool;
    this.m_localDataPool = localDataPool;
  } // 被子类覆盖后便能实现更细节的相关功能


  reset() {
    this.m_parseIndex = 0;
  }

  setParseTotal(total) {
    this.m_parseTotal = total;
  }

  isFinished() {
    return this.m_parseIndex >= this.m_parseTotal;
  }

  getParsedTotal() {
    return this.m_parseIndex >= this.m_parseTotal ? this.m_parseTotal : this.m_parseIndex + 1;
  }

  getParseTotal() {
    return this.m_parseTotal;
  }

  getParsedIndex() {
    return this.m_parseIndex;
  }

  getUid() {
    return this.m_uid;
  }
  /**
   * 必须被覆盖, return true, task finish; return false, task continue...
   * @param data 存放处理结果的数据对象
   * @param flag 表示多线程任务的处理状态, 这里的flag是一个uint型。用4个8位来表示4种标识分类, 最低8位用来表示任务的处理阶段相关的状态
   * @returns 返回这个函数的处理状态，默认返回false
   */


  parseDone(data, flag) {
    throw Error("ThreadTask::parseDone(), Need Override it!");
    return true;
  }
  /**
   * 创建发所给子线程的数据对象
   * @returns 默认返回 ThreadSendData 实例, 这个实例由系统自行管理
   */


  createSendData() {
    let sd = ThreadSendData_1.ThreadSendData.Create();
    sd.srcuid = this.getUid();
    sd.taskclass = this.m_info.taskClass;
    sd.wfst = 0;
    return sd;
  }
  /**
   * 通过参数, 創建发送给子线程的数据
   * @param taskCmd 处理当前数据的任务命令名字符串
   * @param streams 用于内存所有权转换的数据流数组, 例如 Float32Array 数组, 默认值是null
   * @param descriptor 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 默认值是 null
   */


  createSendDataWithParam(taskCmd, streams = null, descriptor = null) {
    let sd = ThreadSendData_1.ThreadSendData.Create();
    sd.srcuid = this.getUid();
    sd.taskclass = this.m_info.taskClass;
    sd.taskCmd = taskCmd;
    sd.streams = streams;
    sd.descriptor = null;
    return sd;
  }
  /**
   * 通过参数, 添加发送给子线程的数据
   * @param taskCmd 处理当前数据的任务命令名字符串
   * @param streams 用于内存所有权转换的数据流数组, 例如 Float32Array 数组, 默认值是null
   * @param descriptor 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 默认值是 null
   * @param threadBindingData 是否是线程直接绑定的数据，默认是false
   */


  addDataWithParam(taskCmd, streams = null, descriptor = null, threadBindingData = false) {
    let sd = this.createSendData();
    sd.taskCmd = taskCmd;
    sd.streams = streams;
    sd.descriptor = descriptor;
    this.addData(sd, threadBindingData);
  }
  /**
   * 通过参数, 添加发送给子线程的数据
   * @param data 符合IThreadSendData行为规范的数据对象
   * @param threadBindingData 是否是线程直接绑定的数据，默认是false
   */


  addData(data, threadBindingData = false) {
    if (this.m_uid >= 0) {
      data.srcuid = this.m_uid;
      data.taskclass = this.m_info.taskClass; // console.log("task addData, ",threadBindingData, this.m_localDataPool != null, this.m_globalDataPool != null);

      if (threadBindingData) {
        if (this.m_localDataPool != null) {
          this.m_localDataPool.addData(data);
        }
      } else {
        if (this.m_globalDataPool != null) {
          this.m_globalDataPool.addData(data);
        }
      }
    } else {
      throw Error("Need attach this task !");
    }
  }

  getWorkerSendDataAt(i) {
    throw Error("ThreadTask::getWorkerSendDataAt(), Need Override !");
    return null;
  }
  /**
   * 获得自身动态分配到的 task class 值，不可被子类覆盖
   * @returns task class value
   */


  getTaskClass() {
    return this.m_info.taskClass;
  }

  destroy() {
    this.detach();
    this.m_info = null;
    this.m_globalDataPool = null;
    this.m_localDataPool = null;
    this.dependency = null; // ThreadTask.DetachTask(this);
  }

}

exports.ThreadTask = ThreadTask;

/***/ }),

/***/ "85f5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * TaskDataRouter 管理器
 */

class TDRManager {
  constructor(taskClassTotal) {
    this.m_waitParams = [];
    this.m_enabledParams = [];
    this.m_threads = null;
    this.m_taskClassTotal = taskClassTotal > 1024 ? taskClassTotal : 1024;
    this.m_routers = new Array(taskClassTotal);
    this.m_routers.fill(null);
    this.m_rfs = new Array(taskClassTotal);
    this.m_rfs.fill(0);
  }

  setThreads(threads) {
    this.m_threads = threads;
  }

  hasRouterByTaskClass(taskclass) {
    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      return this.m_routers[taskclass] != null;
    }

    return false;
  }

  getRouterByTaskClass(taskclass) {
    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      return this.m_routers[taskclass];
    } else {
      console.log("illegal taskclass value: " + taskclass + " !!!");
    }
  }

  setRouter(router) {
    let taskclass = router.getTaskClass();

    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      if (this.m_routers[taskclass] == null) {
        this.m_routers[taskclass] = router;
      }
    } else {
      throw Error("illegal object !!!");
    }
  }

  waitRouterByParam(param) {
    if (param.status != 0) {
      throw Error("illegal param !!!");
    }

    let taskclass = param.taskclass;

    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      this.m_waitParams.push(param);
      param.status = 1;
    } else {
      throw Error("illegal object !!!");
    }
  }

  run() {
    let len = this.m_waitParams.length;

    if (len > 0) {
      let params = this.m_waitParams;
      let router = null;
      let param = null;

      for (let i = 0; i < len; ++i) {
        param = params[i];
        router = this.m_routers[param.taskclass];

        if (router != null && router.isDataEnabled() && !router.isTransmission()) {
          router.acquireTrigger();
          router.param = param;
          this.m_enabledParams.push(param);
          param.status = 2;
          params.splice(i, 1);
          --i;
          --len;
        }
      }

      len = this.m_enabledParams.length;

      if (len > 0) {
        params = this.m_enabledParams;
        let ths = this.m_threads;
        let tn = ths.length;

        for (let i = 0; i < len; ++i) {
          const pm = params[i];

          for (let j = 0; j < tn; ++j) {
            const th = ths[j];

            if (th.getUid() == pm.threadIndex) {
              th.sendRouterDataTo(this.getRouterByTaskClass(pm.taskclass));
            }
          }
        }

        this.m_enabledParams = [];
      }
    }
  }

  getEnabledParams() {
    if (this.m_enabledParams.length > 0) {
      let list = this.m_enabledParams;
      this.m_enabledParams = [];
      return list;
    }

    return null;
  }

  destroy() {
    this.m_taskClassTotal = 0;
    this.m_routers.length = 0;
  }

}

exports.TDRManager = TDRManager;

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

/***/ "8df7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "8eb0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ModuleNS;

(function (ModuleNS) {
  ModuleNS["ctmParser"] = "ctmGeomParser";
  ModuleNS["objParser"] = "objGeomParser";
  ModuleNS["dracoParser"] = "dracoGeomParser";
  ModuleNS["pngParser"] = "pngParser";
  ModuleNS["fbxFastParser"] = "fbxFastParser";
  ModuleNS["threadCore"] = "threadCore";
  ModuleNS["coSpaceApp"] = "coSpaceApp";
})(ModuleNS || (ModuleNS = {}));

exports.ModuleNS = ModuleNS;

/***/ }),

/***/ "8f7d":
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

const HttpFileLoader_1 = __webpack_require__("5b39");

const GeometryDataUnit_1 = __webpack_require__("aeff");

const FBXParseTask_1 = __webpack_require__("e12d");

const DivLog_1 = __importDefault(__webpack_require__("3bda"));

class ModelNode {
  constructor() {
    this.models = null;
    this.transforms = null;
  }

  destroy() {
    this.models = null;
    this.transforms = null;
  }

}

class FBXParserListerner {
  constructor(unitPool, threadSchedule, module, receiverSchedule) {
    this.m_parseTask = null;
    this.m_nodeMap = new Map();
    this.m_moduleUrl = module.url;
    this.m_unitPool = unitPool;
    this.m_threadSchedule = threadSchedule;
    this.m_receiverSchedule = receiverSchedule; // console.log("XXXXX >>>> FBXParserListerner::constructor(), this.m_moduleUrl: ",this.m_moduleUrl);
  }

  addUrlToTask(url) {
    // console.log("XXXXX >>>> FBXParserListerner::addUrlToTask(), url: ", url, !this.m_unitPool.hasUnitByUrl(url));
    if (!this.m_unitPool.hasUnitByUrl(url)) {
      if (this.m_parseTask == null) {
        // 创建ctm 加载解析任务
        let parseTask = new FBXParseTask_1.FBXParseTask(this.m_moduleUrl); // 绑定当前任务到多线程调度器

        this.m_threadSchedule.bindTask(parseTask);
        parseTask.setListener(this);
        this.m_parseTask = parseTask;
      }

      new HttpFileLoader_1.HttpFileLoader().load(url, (buf, url) => {
        console.log("正在解析fbx数据...");
        DivLog_1.default.ShowLogOnce("正在解析fbx数据...");
        this.m_parseTask.addBinaryData(buf, url);
      }, (progress, url) => {
        let k = Math.round(100 * progress);
        DivLog_1.default.ShowLogOnce("fbx file loading " + k + "%");
      }, (status, url) => {
        console.error("load fbx mesh data error, url: ", url);
        this.fbxParseFinish([{
          vertices: null,
          uvsList: null,
          normals: null,
          indices: null
        }], null, url, 0, 0);
      });
    }
  } // 一个任务数据处理完成后的侦听器回调函数


  fbxParseFinish(models, transform, url, index, total) {
    // console.log("### FbxParserListerner::fbxParseFinish(), models: ", models, ", url: ", url);
    // console.log("AAAYYYT01 this.m_unitPool.hasUnitByUrl(url): ", this.m_unitPool.hasUnitByUrl(url));
    // let unit = this.m_unitPool.hasUnitByUrl(url);
    if (this.m_unitPool.hasUnitByUrl(url)) {
      let unit = this.m_unitPool.getUnitByUrl(url);
      let m = this.m_nodeMap;

      if (m.has(url)) {
        let node = m.get(url); //ls = ls.concat(models);

        for (let i = 0; i < models.length; ++i) {
          node.models.push(models[i]);
          node.transforms.push(transform);
        }
      } else {
        let node = new ModelNode();
        node.models = models;
        node.transforms = [transform];
        m.set(url, node);
      }

      if (unit.data.modelReceiver != null) {
        unit.data.modelReceiver(models, [transform], index, total);
      }

      if (index + 1 < total) {
        return;
      } // console.log("AAAYYYT02 unit != null: ", unit != null, index, total);


      if (unit != null) {
        let node = m.get(url);
        unit.lossTime = Date.now() - unit.lossTime;
        unit.data.dataFormat = GeometryDataUnit_1.DataFormat.FBX;
        unit.data.models = node.models;
        unit.data.transforms = node.transforms;
        node.destroy();
        m.delete(url); //if (transform != null) unit.data.transforms = [transform];

        GeometryDataUnit_1.DataUnitLock.lockStatus = 209;
        unit.toCpuPhase();

        if (unit.immediate) {
          // console.log("geom data receive at once.");
          this.m_receiverSchedule.testUnit(unit); // this.m_receiverSchedule.testUnitForce(unit);
        }
      }
    }
  }

  destroy() {
    if (this.m_parseTask != null) {
      this.m_parseTask.destroy();
      this.m_parseTask = null;
    }

    this.m_unitPool = null;
    this.m_threadSchedule = null;
    this.m_receiverSchedule = null;
  }

}

exports.FBXParserListerner = FBXParserListerner;

/***/ }),

/***/ "9cc2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ListPoolItem_1 = __webpack_require__("3844");

exports.ListPoolItem = ListPoolItem_1.ListPoolItem;

class ListPool {
  constructor() {
    this.m_list = [null];
    this.m_total = 1;
    this.m_freeUUIDs = [];
  }

  hasItemByUUID(listUUID) {
    if (listUUID > 0 && listUUID < this.m_total) {
      this.m_list[listUUID] != null;
    }

    return false;
  }

  hasItem(item) {
    if (item != null && item.listUUID > 0 && item.listUUID < this.m_total) {
      this.m_list[item.listUUID] == item;
    }

    return false;
  }

  hasnotItem(item) {
    if (item != null && item.listUUID > 0 && item.listUUID < this.m_total) {
      this.m_list[item.listUUID] != item;
    }

    return true;
  }

  getItemByUUID(listUUID) {
    if (listUUID > 0 && listUUID < this.m_total) {
      this.m_list[listUUID];
    }

    return null;
  }

  addItem(item) {
    if (item != null) {
      if (item.listUUID == 0) {
        if (this.m_freeUUIDs.length > 0) {
          item.listUUID = this.m_freeUUIDs.pop();

          if (this.m_list[item.listUUID] != null) {
            throw Error("ListPool::addItem() is the illegal operation !!!");
          }

          this.m_list[item.listUUID] = item;
        } else {
          item.listUUID = this.m_total;
          this.m_total++;
          this.m_list.push(item);
        }
      } else {
        throw Error("ListPool::addItem() is the illegal operation !!!");
      }
    } else {
      console.error("ListPool::addItem() item is null !!!");
    }
  }

  removeItem(item) {
    if (item != null && item.listUUID > 0 && item.listUUID < this.m_total && this.m_list[item.listUUID] != null) {
      if (this.m_list[item.listUUID] != item) {
        throw "ListPool::removeItem() is the illegal operation !!!";
      }

      this.m_freeUUIDs.push(item.listUUID);
      this.m_list[item.listUUID] = null;
      item.listUUID = 0;
    }
  }

}

exports.ListPool = ListPool;

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

/***/ "a00a":
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

const CoSpace_1 = __webpack_require__("cbd5");

const DataFormat_1 = __webpack_require__("7a08");

class ReqNode {
  constructor() {
    this.m_uid = ReqNode.s_uid++;
    this.dataFormat = DataFormat_1.DataFormat.CTM;
    this.callback = null;
    this.url = "";
  }

  getUid() {
    return this.m_uid;
  }

  reset() {
    this.callback = null;
  }

}

ReqNode.s_uid = 0;

class Instance {
  constructor() {
    this.m_withCredentials = false;
    this.m_loadingTotal = 0;
    this.m_cpuReqNodes = [];
    /**
     * (引擎)数据协同中心实例
     */

    this.cospace = new CoSpace_1.CoSpace();
    /**
     * the default value is 8
     */

    this.netLoadingMaxCount = 8;
    this.m_timeoutId = -1;
    this.m_updating = false;
  }
  /**
   * 设置线程中子模块间依赖关系的json描述字符串
   * @param graphJsonStr json描述字符串
   */


  setThreadDependencyGraphJsonString(jsonStr) {
    this.cospace.setThreadDependencyGraphJsonString(jsonStr);
  }

  setTaskModuleParams(params) {
    this.cospace.setTaskModuleParams(params);
  }

  initialize(threadsTotal, coreCodeUrl, autoSendData = true) {
    this.cospace.initialize(threadsTotal, coreCodeUrl, autoSendData);
  }

  testCPUReqNode() {
    let len = this.m_cpuReqNodes.length;

    if (len > 0) {
      if (this.netLoadingMaxCount < len) len = this.netLoadingMaxCount;

      for (let i = 0; i < len; ++i) {
        if (this.m_loadingTotal <= this.netLoadingMaxCount) {
          const node = this.m_cpuReqNodes.shift();
          const url = node.url;
          const dataFormat = node.dataFormat;
          const callback = node.callback;
          node.reset();
          console.log("NNNNNNN deferred call getCPUDataByUrlAndCallback()......");
          this.getCPUDataByUrlAndCallback(url, dataFormat, callback);
        } else {
          console.log("MMMMMMM 正在加载的总数量已达上限: ", this.netLoadingMaxCount);
          break;
        }
      }
    }
  }

  cpuLoadTest() {
    if (this.m_timeoutId < 0) {
      console.log("启动 cpuLoadTest timer !!!");
    }

    if (this.m_timeoutId > -1) {
      clearTimeout(this.m_timeoutId);
      this.m_timeoutId = -1;
    }

    if (this.m_cpuReqNodes.length > 0) {
      this.testCPUReqNode();
      this.m_timeoutId = setTimeout(this.cpuLoadTest.bind(this), 25); // 40 fps
    } else {
      this.m_updating = false;
      console.log("关闭 cpuLoadTest timer !!!");
    }
  }
  /**
   * 注意: 不建议过多使用这个函数,因为回调函数不安全如果是lambda表达式则由性能问题。
   * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
   * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
   * @param url 数据资源url
   * @param dataFormat 数据资源类型
   * @param callback 数据资源接收回调函数, 其值建议为lambda函数表达式
   * @param immediate 是否立即返回数据, 默认是false
   * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
   */


  getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate = false) {
    let reqCall = callback;

    if (this.m_loadingTotal > this.netLoadingMaxCount) {
      const node = new ReqNode();
      node.url = url;
      node.dataFormat = dataFormat;
      node.callback = callback;
      this.m_cpuReqNodes.push(node);

      if (!this.m_updating) {
        this.m_updating = true;
        this.cpuLoadTest();
      }

      return null;
    } else {
      reqCall = (unit, status) => {
        this.m_loadingTotal--;
        console.log("*** *** loaded a req this.m_loadingTotal: ", this.m_loadingTotal);
        callback(unit, status); // this.testCPUReqNode();
      };

      this.m_loadingTotal++;
      return this.getCPUDataByUrlAndCallback2(url, dataFormat, reqCall, immediate);
    } // let resShd: ResourceSchedule<DataUnit> = null;
    // switch (dataFormat) {
    //     case DataFormat.CTM:
    //     case DataFormat.OBJ:
    //     case DataFormat.Draco:
    //     case DataFormat.FBX:
    //     case DataFormat.GLB:
    // 		resShd = this.cospace.geometry;
    //         // return this.cospace.geometry.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
    //         break;
    //     case DataFormat.Jpg:
    //     case DataFormat.Png:
    //     case DataFormat.Gif:
    // 		resShd = this.cospace.texture;
    //         // return this.cospace.texture.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
    //         break;
    //     default:
    //         break;
    // }
    // if(resShd != null) {
    // 	// resShd.setWithCredentials(this.m_withCredentials);
    // 	return resShd.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
    // }
    // return null;

  }

  getCPUDataByUrlAndCallback2(url, dataFormat, callback, immediate = false) {
    let resShd = null;

    switch (dataFormat) {
      case DataFormat_1.DataFormat.CTM:
      case DataFormat_1.DataFormat.OBJ:
      case DataFormat_1.DataFormat.Draco:
      case DataFormat_1.DataFormat.FBX:
      case DataFormat_1.DataFormat.GLB:
        resShd = this.cospace.geometry; // return this.cospace.geometry.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);

        break;

      case DataFormat_1.DataFormat.Jpg:
      case DataFormat_1.DataFormat.Png:
      case DataFormat_1.DataFormat.Gif:
        resShd = this.cospace.texture; // return this.cospace.texture.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);

        break;

      default:
        break;
    }

    if (resShd != null) {
      // resShd.setWithCredentials(this.m_withCredentials);
      return resShd.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
    }

    return null;
  }

  destroy() {}

}

exports.Instance = Instance;

function createInstance() {
  return new Instance();
}

exports.createInstance = createInstance;

/***/ }),

/***/ "a054":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const GeometryModelDataType_1 = __webpack_require__("58fc");

exports.GeometryModelDataType = GeometryModelDataType_1.GeometryModelDataType;

/***/ }),

/***/ "a092":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataUnit_1 = __webpack_require__("74ee");

const GeometryDataUnit_1 = __webpack_require__("aeff");

class DataUnitWrapper {
  constructor() {}

}

class DataUnitPool {
  constructor() {
    // 因为不是高频操作，所以可以用map
    this.m_urlPool = new Map();
    this.m_idPool = new Map();

    if (DataUnitPool.s_inited) {
      DataUnitPool.s_inited = false; // 这样做的目的是为了让有效uuid从1开始

      this.createUnit();
    }
  }

  createUnit() {
    DataUnit_1.DataUnitLock.lockStatus = 207;
    let unit = new DataUnit_1.DataUnit();
    return unit;
  }

  createGeometryUnit() {
    DataUnit_1.DataUnitLock.lockStatus = 207;
    let unit = new GeometryDataUnit_1.GeometryDataUnit();
    return unit;
  }

  hasUnitByUrl(url) {
    return this.m_urlPool.has(url);
  }

  hasUnitByUUID(uuid) {
    return this.m_idPool.has(uuid);
  }

  addUnit(url, unit) {
    if (url != "" && unit != null && !this.m_urlPool.has(url)) {
      let wrapper = new DataUnitWrapper();
      wrapper.uuid = unit.getUUID();
      wrapper.url = url;
      wrapper.unit = unit;
      this.m_urlPool.set(url, wrapper);
      this.m_idPool.set(unit.getUUID(), wrapper);
    }
  }

  removeUnit(unit) {
    if (unit != null && this.m_idPool.has(unit.getUUID())) {
      let wrapper = this.m_idPool.get(unit.getUUID());
      this.m_idPool.delete(wrapper.uuid);
      this.m_urlPool.delete(wrapper.url); // TODO(lyl): 暂时这样写

      wrapper.unit = null;
    }
  }

  removeUnitByUUID(uuid) {
    if (this.m_idPool.has(uuid)) {
      let wrapper = this.m_idPool.get(uuid);
      this.m_idPool.delete(wrapper.uuid);
      this.m_urlPool.delete(wrapper.url); // TODO(lyl): 暂时这样写

      wrapper.unit = null;
    }
  }

  removeUnitByUrl(url) {
    if (this.m_urlPool.has(url)) {
      let wrapper = this.m_urlPool.get(url);
      this.m_idPool.delete(wrapper.uuid);
      this.m_urlPool.delete(wrapper.url); // TODO(lyl): 暂时这样写

      wrapper.unit = null;
    }
  }

  getUnitByUrl(url) {
    let wrapper = this.m_urlPool.get(url);

    if (wrapper != null) {
      return wrapper.unit;
    }

    return null;
  }

  getUnitByUUID(uuid) {
    let wrapper = this.m_idPool.get(uuid);

    if (wrapper != null) {
      return wrapper.unit;
    }

    return null;
  }

}

DataUnitPool.s_inited = true;
exports.DataUnitPool = DataUnitPool;

/***/ }),

/***/ "a567":
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

class RGBColorUtil {
  /**
   * @param uintRGB24, uint 24bit rgb color, example: 0xff003a
   */
  static uint24RGBToCSSHeXRGBColor(uintRGB24) {
    let str = Math.round(uintRGB24).toString(16);

    if (str.length > 6) {
      str = str.slice(-6);
    } else if (str.length < 6) {
      let len = 6 - str.length;
      const s0 = "000000";
      str = s0.slice(0, len) + str;
    }

    return "#" + str;
  }

}

exports.RGBColorUtil = RGBColorUtil;

/***/ }),

/***/ "aeff":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataUnit_1 = __webpack_require__("74ee");

exports.DataFormat = DataUnit_1.DataFormat;
exports.DataUnitLock = DataUnit_1.DataUnitLock;
exports.DataUnit = DataUnit_1.DataUnit;

const GeometryModelDataType_1 = __webpack_require__("58fc");

exports.GeometryModelDataType = GeometryModelDataType_1.GeometryModelDataType;

class GeometryDataContainer {
  constructor() {
    this.dataFormat = DataUnit_1.DataFormat.CTM;
    /**
     * 存放所有的model
     */

    this.models = null;
    /**
     * 存放所有的transform
     */

    this.transforms = null;
    /**
     * 每一次新的model的加入都会调用此函数
     */

    this.modelReceiver = null;
  }

  setFormatBUrl(url) {// if(url != "") {
    //   let k = url.lastIndexOf(".");
    //   if(k <= 0) {
    //     throw Error("illegal geometry data url: "+url);
    //   }
    //   switch(url.slice(k+1)) {
    //     case DataFormat.CTM:
    //       this.dataFormat = DataFormat.CTM;
    //       break;
    //     case DataFormat.Draco:
    //       this.dataFormat = DataFormat.Draco;
    //       break;
    //     default:
    //       throw Error("illegal geometry data url: "+url);
    //       break;
    //   }
    // }
  }

  destroy() {
    // this.model = null;
    this.modelReceiver = null;
    this.models = null;
  }

}

exports.GeometryDataContainer = GeometryDataContainer;

class GeometryDataUnit extends DataUnit_1.DataUnit {
  constructor() {
    super();
    this.data = null;
    this.dataClass = DataUnit_1.DataClass.Geometry;
  }

}

exports.GeometryDataUnit = GeometryDataUnit;

/***/ }),

/***/ "b2a0":
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

const HttpFileLoader_1 = __webpack_require__("5b39");

const TextureDataUnit_1 = __webpack_require__("bd49");

const DivLog_1 = __importDefault(__webpack_require__("3bda"));

const PNGParseTask_1 = __webpack_require__("80fa");

class PNGParserListerner {
  constructor(unitPool, threadSchedule, module, receiverSchedule) {
    this.m_parseTask = null;
    this.m_moduleUrl = module.url;
    this.m_unitPool = unitPool;
    this.m_threadSchedule = threadSchedule;
    this.m_receiverSchedule = receiverSchedule;
  }

  addUrlToTask(url) {
    if (!this.m_unitPool.hasUnitByUrl(url)) {
      if (this.m_parseTask == null) {
        // 创建ctm 加载解析任务
        let parseTask = new PNGParseTask_1.PNGParseTask(this.m_moduleUrl); // 绑定当前任务到多线程调度器

        this.m_threadSchedule.bindTask(parseTask);
        parseTask.setListener(this);
        this.m_parseTask = parseTask;
      }

      new HttpFileLoader_1.HttpFileLoader().load(url, (buf, url) => {
        DivLog_1.default.ShowLogOnce("正在解析png数据...");
        this.m_parseTask.addBinaryData(new Uint8Array(buf), url);
      }, (progress, url) => {
        let k = Math.round(100 * progress);
        DivLog_1.default.ShowLogOnce("obj file loading " + k + "%");
      }, (status, url) => {
        console.error("load png img data error, url: ", url);
        this.pngParseFinish(null, {
          url: url,
          width: 0,
          height: 0,
          filterType: 0
        });
      });
    }
  } // 一个任务数据处理完成后的侦听器回调函数


  pngParseFinish(pngData, des) {
    // console.log("ObjParserListerner::ctmParseFinish(), models: ", models, ", url: ", url);
    if (this.m_unitPool.hasUnitByUrl(des.url)) {
      let unit = this.m_unitPool.getUnitByUrl(des.url);

      if (unit != null) {
        unit.lossTime = Date.now() - unit.lossTime;
        unit.data.dataFormat = TextureDataUnit_1.DataFormat.Png;
        unit.data.desList = [des];
        unit.data.imageDatas = [pngData];
        TextureDataUnit_1.DataUnitLock.lockStatus = 209;
        unit.toCpuPhase();

        if (unit.immediate) {
          // console.log("geom data receive at once.");
          this.m_receiverSchedule.testUnit(unit);
        }
      }
    }
  }

  destroy() {
    if (this.m_parseTask != null) {
      this.m_parseTask.destroy();
      this.m_parseTask = null;
    }

    this.m_unitPool = null;
    this.m_threadSchedule = null;
    this.m_receiverSchedule = null;
  }

}

exports.PNGParserListerner = PNGParserListerner;

/***/ }),

/***/ "b406":
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
 * (引擎)数据/资源协同空间运行时，用以管理运行时的相关程序或功能
 */

class CoRuntime {
  constructor() {}
  /**
   */


  initialize() {}
  /**
   * 通过唯一标识名添加一个动态模块, 依赖关系管理器会自动加载添加其他被依赖的模块
   * @param uniqueName 主线程功能模块唯一标识名
   */


  addModuleByUniqueName(uniqueName) {}
  /**
   * 通过唯一标识名启动一个动态模块
   * @param uniqueName 主线程功能模块唯一标识名
   */


  startupModuleByUniqueName(uniqueName) {}

  destroy() {}

}

exports.CoRuntime = CoRuntime;

/***/ }),

/***/ "bd49":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataUnit_1 = __webpack_require__("74ee");

exports.DataFormat = DataUnit_1.DataFormat;
exports.DataUnitLock = DataUnit_1.DataUnitLock;
exports.DataUnit = DataUnit_1.DataUnit;

class TextureDataContainer {
  constructor() {
    this.dataFormat = DataUnit_1.DataFormat.Png;
    this.desList = null;
    this.images = null;
    this.imageDatas = null;
  }

  setFormatBUrl(url) {}

}

exports.TextureDataContainer = TextureDataContainer;

class TextureDataUnit extends DataUnit_1.DataUnit {
  constructor() {
    super();
    this.data = null;
    this.dataClass = DataUnit_1.DataClass.Texture;
  }

}

exports.TextureDataUnit = TextureDataUnit;

/***/ }),

/***/ "c917":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class TaskDescriptor {
  constructor(type, src, moduleName) {
    this.info = null;
    this.inited = false;
    this.type = type;
    this.src = src;
    this.moduleName = moduleName;
  }

}

exports.TaskDescriptor = TaskDescriptor;

/***/ }),

/***/ "cbd5":
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

const ThreadSchedule_1 = __webpack_require__("3a1d");

const GeometryResourceSchedule_1 = __webpack_require__("2a59");

const ReceiverSchedule_1 = __webpack_require__("2931");

const TextureResourceSchedule_1 = __webpack_require__("eda7");

const CoSystem_1 = __webpack_require__("1173");

const CoRuntime_1 = __webpack_require__("b406");
/**
 * (引擎)数据/资源协同空间, 让一个应用程序的功能像种子一样，随着用户的使用而生根发芽枝叶茂盛，功能越加载越多，越使用越丰富
 * 使得基于算力&数据驱动的系统架构更趋于完善
 * 从cospace的角度看，每一个功能，都是可以动态载入并启动的模块集合。这些模块可能位于主线程也可能位于子线程，他们之间的协作情况由各自的依赖关系决定
 * cospace用以实现基于算力&数据驱动的能渐进生长方式的引擎/功能应用
 */


class CoSpace {
  constructor() {
    this.m_initing = true;
    this.m_receiver = new ReceiverSchedule_1.ReceiverSchedule();
    this.system = new CoSystem_1.CoSystem();
    this.runtime = new CoRuntime_1.CoRuntime();
    this.thread = new ThreadSchedule_1.ThreadSchedule(); // 静态模块

    this.geometry = new GeometryResourceSchedule_1.GeometryResourceSchedule(); // 静态模块

    this.texture = new TextureResourceSchedule_1.TextureResourceSchedule();
    this.m_timeoutId = -1;
  }
  /**
   * 设置线程中子模块间依赖关系的json描述字符串
   * @param graphJsonStr json描述字符串
   */


  setThreadDependencyGraphJsonString(jsonStr) {
    this.thread.setDependencyGraphJsonString(jsonStr);
  }

  setTaskModuleParams(taskModules) {
    if (taskModules != null) {
      this.geometry.setTaskModuleParams(taskModules);
      this.texture.setTaskModuleParams(taskModules);
    }
  }

  isInitialized() {
    return !this.m_initing;
  }
  /**
   * 初始化引擎数据资源协同空间实例
   * @param maxThreadsTotal 最大线程数量
   * @param threadCoreCodeUrl 线程源码字符串url
   * @param autoSendData 是否自动从任务池里取出并发送任务数据到子线程, 默认值是false
   */


  initialize(maxThreadsTotal, threadCoreCodeUrl, autoSendData = false, terminateDelayMS = 3000) {
    if (this.m_initing) {
      this.m_initing = false; // let dependencyGraphObj: object = {
      //     nodes: [
      //         { uniqueName: "dracoGeomParser", path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js" },
      //         { uniqueName: "dracoWasmWrapper", path: "static/cospace/modules/dracoLib/w2.js" },
      //         { uniqueName: "ctmGeomParser", path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js" }
      //     ],
      //     maps: [
      //         { uniqueName: "dracoGeomParser", includes: [1] } // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
      //     ]
      // };
      // let jsonStr: string = JSON.stringify(dependencyGraphObj);
      // this.thread.setDependencyGraphJsonString(jsonStr);
      // 初始化多线程调度器

      this.thread.setParams(autoSendData, terminateDelayMS); // 初始化多线程调度器(多线程系统)

      this.thread.initialize(maxThreadsTotal, threadCoreCodeUrl);
      this.geometry.initialize(this.m_receiver, this.thread, null);
      this.texture.initialize(this.m_receiver, this.thread, null); // 启动循环定时调度

      this.update();
    }
  }
  /**
   * 定时调度
   */


  update() {
    let delay = 40; // 25 fps
    //console.log("this.thread.hasTaskData(): ",this.thread.hasTaskData());

    if (this.thread.isSupported() && (this.thread.hasTaskData() || this.m_receiver.getReceiversTotal() > 0)) {
      //console.log("mini time.",this.thread.hasTaskData(), this.m_receiver.getReceiversTotal());
      delay = 20; // 50 fps
    }

    this.thread.run();
    this.m_receiver.run();

    if (this.m_timeoutId > -1) {
      clearTimeout(this.m_timeoutId);
    }

    this.m_timeoutId = setTimeout(this.update.bind(this), delay);
  }

  destroy() {}

}

exports.CoSpace = CoSpace;

/***/ }),

/***/ "ceac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const OBJDescriptorType_1 = __webpack_require__("a054");

exports.OBJModelDataType = OBJDescriptorType_1.OBJModelDataType;

const ThreadTask_1 = __webpack_require__("83a3");

const TaskDependency_1 = __webpack_require__("3b80");
/**
 * obj 几何模型数据加载/解析任务对象
 */


class OBJParseTask extends ThreadTask_1.ThreadTask {
  /**
   * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
   */
  constructor(src) {
    super();
    this.m_listener = null;

    if (src.indexOf("/") > 0) {
      this.dependency = new TaskDependency_1.TaskJSFileDependency(src);
    } else {
      this.dependency = new TaskDependency_1.TaskUniqueNameDependency(src);
    }
  }

  setListener(l) {
    this.m_listener = l;
  }

  addBinaryData(buffer, url) {
    if (buffer != null) {
      this.addDataWithParam("", [buffer], {
        url: url
      });
    }
  }

  addURL(url) {
    if (url != "") {
      throw Error("illegal operation!!!");
    }
  } // return true, task finish; return false, task continue...


  parseDone(data, flag) {
    // console.log("OBJParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);
    if (this.m_listener != null) {
      let modelData = data.data;
      this.m_listener.objParseFinish(modelData.models, data.descriptor.url);
    }

    return true;
  }

  destroy() {
    super.destroy();
    this.m_listener = null;
  }

}

exports.OBJParseTask = OBJParseTask;

/***/ }),

/***/ "d2d9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var ThreadCodeSrcType;

(function (ThreadCodeSrcType) {
  /**
   * 线程中的js代码模块通过代码字符串构建
   */
  ThreadCodeSrcType[ThreadCodeSrcType["STRING_CODE"] = 0] = "STRING_CODE";
  /**
   * 线程中的js代码模块通过代码blob构建
   */

  ThreadCodeSrcType[ThreadCodeSrcType["BLOB_CODE"] = 1] = "BLOB_CODE";
  /**
   * 线程中的js代码模块通过外部js文件构建
   */

  ThreadCodeSrcType[ThreadCodeSrcType["JS_FILE_CODE"] = 2] = "JS_FILE_CODE";
  /**
   * 线程中的js代码模块通过代码模块唯一依赖名构建
   */

  ThreadCodeSrcType[ThreadCodeSrcType["DEPENDENCY"] = 3] = "DEPENDENCY";
})(ThreadCodeSrcType || (ThreadCodeSrcType = {}));

exports.ThreadCodeSrcType = ThreadCodeSrcType;

/***/ }),

/***/ "d9d1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DracoGeomParseTask_1 = __webpack_require__("dba0");

const DracoGeomParseTaskDataRouter_1 = __webpack_require__("7c58");
/**
 * draco 几何模型数据加载和解析
 */


class DracoGeomBuilder {
  constructor(taskModuleUrl, dracoWasmVersion = 2) {
    this.m_inited = true;
    this.m_thrSchedule = null;
    this.m_meshBuf = null;
    this.m_listener = null;
    this.m_dracoTask = null;
    this.m_wasmUrl = "";
    this.m_segRangeList = null;
    this.m_taskModuleUrl = taskModuleUrl;
    this.m_dracoWasmVersion = dracoWasmVersion;
  }

  setListener(l) {
    this.m_listener = l;

    if (this.m_dracoTask != null) {
      this.m_dracoTask.setListener(l);
    }
  }

  initialize(threadSchedule, urlDir = "static/cospace/modules/dracoLib/") {
    if (this.m_inited) {
      this.m_inited = false;
      this.m_thrSchedule = threadSchedule;
      let wasmUrl = "d2.md";
      let wapperUrl = "w2.js";

      switch (this.m_dracoWasmVersion) {
        case 1:
          wasmUrl = "d1.md";
          wapperUrl = "w1.js";
          break;

        case 3:
          wasmUrl = "d3.md";
          wapperUrl = "w3.js";
          break;

        default:
          break;
      }

      this.buildTask(urlDir + wapperUrl, urlDir + wasmUrl);
    }
  }

  parseBinaryData(bufData, segRangeList = null) {
    if (bufData != null) {
      if (segRangeList == null || segRangeList.length < 2) {
        this.m_segRangeList = [-1, -1];
      } else {
        this.m_segRangeList = segRangeList.slice(0);
      }

      this.m_meshBuf = bufData;

      if (this.m_dracoTask != null) {
        if (!this.m_dracoTask.isFinished()) {
          console.error("the draco mesh parseing do not finish, can not load other draco data.");
        }

        this.m_dracoTask.reset();
        this.m_dracoTask.setParseSrcData(this.m_meshBuf, this.m_segRangeList);
      }
    }
  }

  parseSingleSegData(bufData, url, index = 0) {
    if (bufData != null) {
      console.log("parseSingleSegData() A, this.m_dracoTask.getTaskClass(): ", this.m_dracoTask.getTaskClass());
      this.m_dracoTask.setSingleSegData(bufData, url, index);
    }
  }
  /**
   * 加载未加密的draco模型文件
   * @param dracoDataUrl draco模型文件url
   * @param segRangeList draco模型文件字节分段信息
   */


  load(dracoDataUrl, segRangeList = null) {
    if (segRangeList == null || segRangeList.length < 2) {
      this.m_segRangeList = [-1, -1];
    } else {
      this.m_segRangeList = segRangeList.slice(0);
    }

    if (this.m_dracoTask != null) {
      if (!this.m_dracoTask.isFinished()) {
        console.error("the draco mesh parseing do not finish, can not load other draco data.");
      }

      this.m_dracoTask.reset();
    }

    this.loadDracoFile(dracoDataUrl);
  }

  loadDracoFile(dracoDataUrl) {
    const reader = new FileReader();

    reader.onload = e => {
      this.m_meshBuf = reader.result;
      this.m_dracoTask.setParseSrcData(this.m_meshBuf, this.m_segRangeList);
    };

    const request = new XMLHttpRequest();
    request.open("GET", dracoDataUrl, true);
    request.responseType = "blob";

    request.onload = () => {
      reader.readAsArrayBuffer(request.response);
    };

    request.send(null);
  }

  buildTask(wapperUrl, wasmUrl) {
    this.m_wasmUrl = wasmUrl;
    let threadSchedule = this.m_thrSchedule;

    if (threadSchedule != null) {
      // 创建和多线程关联的任务, 通过外部js文件url的形式创建任务实例
      // this.m_dracoTask = new DracoGeomParseTask( this.m_taskModuleUrl, threadSchedule );
      // 创建和多线程关联的任务, 通过外部js文件的依赖唯一名称的形式创建任务实例
      this.m_dracoTask = new DracoGeomParseTask_1.DracoGeomParseTask("dracoGeomParser", threadSchedule);
      this.m_dracoTask.setListener(this.m_listener); // 初始化draco解析所需的基本库, 因为有依赖管理器，这一句代码可以不用(依赖关系机制会完成对应的功能)
      //threadSchedule.initModules([wapperUrl]);
      // 多线程任务调度器绑定当前的 draco task

      threadSchedule.bindTask(this.m_dracoTask);

      if (!threadSchedule.hasRouterByTaskClass(this.m_dracoTask.getTaskClass())) {
        // 设置draco解析任务功能所需的数据路由
        let router = new DracoGeomParseTaskDataRouter_1.DracoGeomParseTaskDataRouter(this.m_dracoTask.getTaskClass(), wasmUrl);
        threadSchedule.setTaskDataRouter(router);
      }
    }
  }
  /**
   * 销毁当前实例
   */


  destroy() {
    if (this.m_dracoTask != null) {
      this.m_dracoTask.destroy();
      this.m_dracoTask = null;
    }

    this.m_meshBuf = null;
    this.m_listener = null;
    this.m_thrSchedule = null;
  }

}

exports.DracoGeomBuilder = DracoGeomBuilder;

/***/ }),

/***/ "dba0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const TaskDependency_1 = __webpack_require__("3b80");

const ThreadTask_1 = __webpack_require__("83a3");

const DracoTaskCMD_1 = __webpack_require__("2e55");
/**
 * draco 几何模型数据解析任务对象
 */


class DracoGeomParseTask extends ThreadTask_1.ThreadTask {
  /**
   * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
   * @param thrScheDule 多线程调度器
   */
  constructor(src, thrScheDule) {
    super();
    this.m_enabled = true;
    this.m_listener = null;
    this.m_models = [];
    this.m_srcBuf = null;
    this.m_segs = null;
    this.m_segIndex = 0;
    this.m_single = false;

    if (src.indexOf("/") > 0) {
      this.dependency = new TaskDependency_1.TaskJSFileDependency(src);
    } else {
      this.dependency = new TaskDependency_1.TaskUniqueNameDependency(src);
    }

    this.m_thrScheDule = thrScheDule;
  }

  setListener(l) {
    this.m_listener = l;
  }

  reset() {
    super.reset();
    this.m_models = [];
    this.m_segIndex = 0;
    this.m_segs = null;
    this.m_enabled = true;
  }

  setSingleSegData(bufData, url, index = 0) {
    if (bufData != null) {
      this.m_single = true;
      this.addDataWithParam(DracoTaskCMD_1.DracoTaskCMD.PARSE, [new Uint8Array(bufData)], {
        beginI: 0,
        endI: bufData.byteLength,
        status: 0,
        url: url,
        index: index
      });
    }
  }

  parseData(bufData, beginI, endI) {
    if (bufData != null) {
      this.m_enabled = false;
      this.addDataWithParam(DracoTaskCMD_1.DracoTaskCMD.PARSE, [new Uint8Array(bufData)], {
        beginI: beginI,
        endI: endI,
        status: 0
      });
    }
  }

  parseNextSeg() {
    if (this.m_enabled && this.m_segs != null && this.m_segIndex < this.m_segs.length) {
      let tot = this.m_thrScheDule.getMaxThreadsTotal() > 0 ? this.m_thrScheDule.getMaxThreadsTotal() : 1;

      for (let i = 0; i < tot; i++) {
        if (this.m_segIndex < this.m_segs.length) {
          let begin = this.m_segs[this.m_segIndex];
          let end = this.m_segs[this.m_segIndex + 1];

          if (begin < 0) {
            begin = 0;
          }

          if (end < 8 || end > this.m_srcBuf.byteLength) {
            end = this.m_srcBuf.byteLength;
          }

          let buf = this.m_srcBuf.slice(begin, end);
          this.parseData(buf, 0, buf.byteLength);
          this.m_segIndex += 2;
        } else {
          break;
        }
      }
    }
  }

  setParseSrcData(bufData, segs) {
    if (bufData != null && segs != null && this.m_segs == null) {
      this.m_single = false;
      this.m_segIndex = 0;
      this.m_srcBuf = bufData;
      this.m_segs = segs;
      this.setParseTotal(segs.length / 2);
      this.parseNextSeg();
    }
  } // return true, task finish; return false, task continue...


  parseDone(data, flag) {
    console.log("XXXX DracoGeomParseTask::parseDone(), data: ", data);

    switch (data.taskCmd) {
      case DracoTaskCMD_1.DracoTaskCMD.PARSE:
        this.m_enabled = true;
        let model = data.data.model;
        if (model.normals == undefined) model.normals = null;
        if (model.uvsList == undefined) model.uvsList = null;

        if (this.m_single) {
          let desc = data.descriptor;
          this.m_listener.dracoParseSingle(model, desc.url, desc.index);
        } else {
          this.m_parseIndex++;
          this.m_models.push(model);

          if (this.m_listener != null) {
            if (this.isFinished()) {
              this.m_listener.dracoParseFinish(this.m_models, this.getParseTotal());
            } else {
              this.parseNextSeg();
              this.m_listener.dracoParse(model, this.getParsedIndex(), this.getParseTotal());
            }
          }
        }

        break;

      default:
        break;
    }

    return true;
  }

  destroy() {
    super.destroy();
    this.m_listener = null;
    this.m_srcBuf = null;
    this.m_models = [];
    this.m_segIndex = 0;
    this.m_segs = null;
  }

}

exports.DracoGeomParseTask = DracoGeomParseTask;

/***/ }),

/***/ "e12d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const GeometryModelDataType_1 = __webpack_require__("58fc");

exports.GeometryModelDataType = GeometryModelDataType_1.GeometryModelDataType;

const ThreadTask_1 = __webpack_require__("83a3");

const TaskDependency_1 = __webpack_require__("3b80");
/**
 * fbx 几何模型数据加载/解析任务对象
 */


class FBXParseTask extends ThreadTask_1.ThreadTask {
  /**
   * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
   */
  constructor(src) {
    super();
    this.m_listener = null;

    if (src.indexOf("/") > 0) {
      this.dependency = new TaskDependency_1.TaskJSFileDependency(src);
    } else {
      this.dependency = new TaskDependency_1.TaskUniqueNameDependency(src);
    }
  }

  setListener(l) {
    this.m_listener = l;
  }

  addBinaryData(buffer, url) {
    if (buffer != null) {
      this.addDataWithParam("", [buffer], {
        url: url
      });
    }
  }

  addURL(url) {
    if (url != "") {
      throw Error("illegal operation!!!");
    }
  } // return true, task finish; return false, task continue...


  parseDone(data, flag) {
    console.log("FBXParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);

    if (this.m_listener != null) {
      let modelData = data.data;
      this.m_listener.fbxParseFinish(modelData.models, modelData.transform, data.descriptor.url, modelData.index, modelData.total);
    }

    return true;
  }

  destroy() {
    super.destroy();
    this.m_listener = null;
  }

}

exports.FBXParseTask = FBXParseTask;

/***/ }),

/***/ "eda7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataUnit_1 = __webpack_require__("74ee");

const ResourceSchedule_1 = __webpack_require__("7de1");

const TextureDataUnit_1 = __webpack_require__("bd49");

const PNGParserListerner_1 = __webpack_require__("b2a0");

const ModuleNS_1 = __webpack_require__("8eb0");

class TextureResourceSchedule extends ResourceSchedule_1.ResourceSchedule {
  constructor() {
    super();
    this.m_waitingUnits = [];
  }

  addUrlToTask(unit) {
    let url = unit.url;

    switch (unit.data.dataFormat) {
      case DataUnit_1.DataFormat.Jpg:
        break;

      case DataUnit_1.DataFormat.Png:
        this.m_pngListener.addUrlToTask(url);
        break;

      default:
        console.error("TextureResourceSchedule::createDataUnit(), illegal data format:", unit.data.dataFormat, ", its url: ", url);
        break;
    }
  }
  /**
   * 被子类覆盖，以便实现具体功能
   */


  createDataUnit(url, dataFormat, immediate = false) {
    TextureDataUnit_1.DataUnitLock.lockStatus = 207;
    let unit = new TextureDataUnit_1.TextureDataUnit();
    unit.lossTime = Date.now();
    unit.immediate = immediate;
    unit.data = new TextureDataUnit_1.TextureDataContainer();
    unit.data.dataFormat = dataFormat;
    unit.url = url;

    if (this.isInitialized()) {
      this.addUrlToTask(unit);
    } else {
      this.m_waitingUnits.push(unit);
    } // switch (unit.data.dataFormat) {
    // 	case DataFormat.Jpg:
    // 		break;
    // 	case DataFormat.Png:
    // 		this.m_pngListener.addUrlToTask(url);
    // 		break;
    // 	default:
    // 		console.error("TextureResourceSchedule::createDataUnit(), illegal data format:",unit.data.dataFormat,", its url: ", url);
    // 		break;
    // }


    return unit;
  }
  /**
   * 被子类覆盖，以便实现具体功能
   */


  initTask(unitPool, threadSchedule, receiverSchedule, taskModules) {
    for (let i = 0; i < taskModules.length; ++i) {
      const module = taskModules[i];
      console.log("TextureResourceSchedule::initTask(), module.name ", module.name);

      switch (module.name) {
        case ModuleNS_1.ModuleNS.pngParser:
          this.m_pngListener = new PNGParserListerner_1.PNGParserListerner(unitPool, threadSchedule, module, receiverSchedule);
          break;

        default:
          break;
      }
    }

    let units = this.m_waitingUnits;

    for (let i = 0; i < units.length; i++) {
      // console.log("XXXXXX texture deferred units["+i+"]: ", units[i]);
      this.addUrlToTask(units[i]);
    }

    this.m_waitingUnits = [];
  }
  /**
   * 销毁当前实例
   */


  destroy() {
    super.destroy();
    this.m_waitingUnits = [];

    if (this.m_pngListener != null) {
      this.m_pngListener.destroy();
      this.m_pngListener = null;
    }
  }

}

exports.TextureResourceSchedule = TextureResourceSchedule;

/***/ }),

/***/ "eed9":
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

const HttpFileLoader_1 = __webpack_require__("5b39");

const GeometryDataUnit_1 = __webpack_require__("aeff");

const DivLog_1 = __importDefault(__webpack_require__("3bda"));

const DracoGeomBuilder_1 = __webpack_require__("d9d1");

class DracoParserListerner {
  constructor(unitPool, threadSchedule, module, receiverSchedule) {
    this.m_parseTask = null;
    this.m_moduleUrl = module.url;
    this.m_dirUrl = module.params[0];
    this.m_unitPool = unitPool;
    this.m_threadSchedule = threadSchedule;
    this.m_receiverSchedule = receiverSchedule;
  }

  addUrlToTask(url) {
    console.log("### DracoParserListerner()::addUrlToTask(), url: ", url);

    if (!this.m_unitPool.hasUnitByUrl(url)) {
      if (this.m_parseTask == null) {
        console.log("### DracoParserListerner()::addUrlToTask(), build task..., this.m_dirUrl: ", this.m_dirUrl); // 建立 draco 模型数据builder(包含加载和解析)

        let task = new DracoGeomBuilder_1.DracoGeomBuilder(this.m_moduleUrl);
        task.initialize(this.m_threadSchedule, this.m_dirUrl);
        task.setListener(this);
        this.m_parseTask = task;
      }

      console.log("### DracoParserListerner()::addUrlToTask(), start load url: ", url);
      new HttpFileLoader_1.HttpFileLoader().load(url, (buf, url) => {
        DivLog_1.default.ShowLogOnce("正在解析Draco数据...");
        this.m_parseTask.parseSingleSegData(buf, url);
      }, (progress, url) => {
        let k = Math.round(100 * progress);
        DivLog_1.default.ShowLogOnce("draco file loading " + k + "%");
      }, (status, url) => {
        console.error("load draco mesh data error, url: ", url);
        this.dracoParseSingle({
          vertices: null,
          uvsList: null,
          normals: null,
          indices: null
        }, url, 0);
      });
    }
  }

  dracoParseSingle(model, url, index) {
    if (this.m_unitPool.hasUnitByUrl(url)) {
      let unit = this.m_unitPool.getUnitByUrl(url);

      if (unit != null) {
        unit.lossTime = Date.now() - unit.lossTime;
        unit.data.models = [model];
        GeometryDataUnit_1.DataUnitLock.lockStatus = 209;
        unit.toCpuPhase();

        if (unit.immediate) {
          // console.log("geom data receive at once.");
          this.m_receiverSchedule.testUnit(unit);
        }
      }
    }
  } // 单个draco segment 几何数据解析结束之后的回调


  dracoParse(model, index, total) {} // 所有 draco segment 几何数据解析结束之后的回调，表示本次加载解析任务结束


  dracoParseFinish(models, total) {}

  destroy() {
    if (this.m_parseTask != null) {
      this.m_parseTask.destroy();
      this.m_parseTask = null;
    }

    this.m_unitPool = null;
    this.m_threadSchedule = null;
    this.m_receiverSchedule = null;
  }

}

exports.DracoParserListerner = DracoParserListerner;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("a00a");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ }),

/***/ "fce7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class ThreadConfigure {}
/**
 * 当前线程调度中同时存在的任务最大数量
 */


ThreadConfigure.MAX_TASKS_TOTAL = 1024;
exports.ThreadConfigure = ThreadConfigure;

/***/ })

/******/ });
});