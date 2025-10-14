
(function(modules) {
  // 模块缓存
  var installedModules = {};
  
  // require 函数实现
  function __webpack_require__(moduleId) {
    // 检查缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    
    // 创建新模块
    var module = installedModules[moduleId] = {
      id: moduleId,
      loaded: false,
      exports: {}
    };
    
    // 执行模块
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    
    // 标记为已加载
    module.loaded = true;
    
    // 返回模块导出
    return module.exports;
  }
  
  // 入口模块执行
  return __webpack_require__("/home/runner/work/mini-webpack/mini-webpack/example/src/index.js");
})({
"/home/runner/work/mini-webpack/mini-webpack/example/src/index.js": function(module, exports, require) {
var _helpers = require("/home/runner/work/mini-webpack/mini-webpack/example/src/utils/helpers.js");
var _ui = require("/home/runner/work/mini-webpack/mini-webpack/example/src/utils/ui.js");
require("/home/runner/work/mini-webpack/mini-webpack/example/src/styles/main.css");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); } // 入口文件
console.log('🚀 Mini Webpack 示例项目启动！');

// 使用工具函数
var message = (0, _helpers.greet)('Mini Webpack');
console.log(message);

// 创建按钮
var button = (0, _ui.createButton)('点击我！');
document.body.appendChild(button);

// 动态导入示例
Promise.resolve().then(function () {
  return _interopRequireWildcard(require("/home/runner/work/mini-webpack/mini-webpack/example/src/components/ComponentA.js"));
}).then(function (module) {
  console.log('动态导入成功:', module["default"]);
});
},
"/home/runner/work/mini-webpack/mini-webpack/example/src/utils/helpers.js": function(module, exports, require) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;
exports.formatDate = formatDate;
exports.greet = greet;
// 工具函数模块
function greet(name) {
  return "Hello, ".concat(name, "! \u6B22\u8FCE\u4F7F\u7528 Mini Webpack\uFF01");
}
function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN');
}
function debounce(func, delay) {
  var timeoutId;
  return function () {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      return func.apply(_this, args);
    }, delay);
  };
}
},
"/home/runner/work/mini-webpack/mini-webpack/example/src/utils/ui.js": function(module, exports, require) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createButton = createButton;
exports.createCard = createCard;
// UI 工具模块
function createButton(text) {
  var button = document.createElement('button');
  button.textContent = text;
  button.style.cssText = "\n    padding: 10px 20px;\n    background: #007bff;\n    color: white;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 16px;\n  ";
  button.addEventListener('click', function () {
    alert('按钮被点击了！');
  });
  return button;
}
function createCard(title, content) {
  var card = document.createElement('div');
  card.style.cssText = "\n    border: 1px solid #ddd;\n    border-radius: 8px;\n    padding: 20px;\n    margin: 10px 0;\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  ";
  card.innerHTML = "\n    <h3>".concat(title, "</h3>\n    <p>").concat(content, "</p>\n  ");
  return card;
}
},
"/home/runner/work/mini-webpack/mini-webpack/example/src/styles/main.css": function(module, exports, require) {

// CSS 文件处理
const style = document.createElement('style');
style.textContent = "/* 主样式文件 */\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  background: white;\n  border-radius: 10px;\n  padding: 30px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n  margin-bottom: 30px;\n}\n\nbutton {\n  transition: all 0.3s ease;\n}\n\nbutton:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.2);\n}\n\n.card {\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  padding: 20px;\n  margin: 10px 0;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n";
document.head.appendChild(style);

},
"/home/runner/work/mini-webpack/mini-webpack/example/src/components/ComponentA.js": function(module, exports, require) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 组件 A
var ComponentA = exports["default"] = /*#__PURE__*/function () {
  function ComponentA(name) {
    _classCallCheck(this, ComponentA);
    this.name = name;
    this.element = null;
  }
  return _createClass(ComponentA, [{
    key: "render",
    value: function render() {
      this.element = document.createElement('div');
      this.element.innerHTML = "\n      <h2>\u7EC4\u4EF6 A: ".concat(this.name, "</h2>\n      <p>\u8FD9\u662F\u4E00\u4E2A\u52A8\u6001\u5BFC\u5165\u7684\u7EC4\u4EF6</p>\n      <button id=\"component-btn\">\u7EC4\u4EF6\u6309\u94AE</button>\n    ");

      // 添加事件监听器
      this.element.querySelector('#component-btn').addEventListener('click', function () {
        console.log('组件按钮被点击了！');
      });
      return this.element;
    }
  }, {
    key: "mount",
    value: function mount(container) {
      if (this.element) {
        container.appendChild(this.element);
      }
    }
  }]);
}();
},

})