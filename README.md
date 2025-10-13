# Mini Webpack

一个简化版的 Webpack 实现，用于学习和理解 Webpack 的核心工作原理。

## 🎯 项目目标

通过实现一个简化版的 Webpack，深入理解现代前端构建工具的核心机制：
- 模块依赖解析
- AST 语法树分析
- 代码转换和打包
- 模块加载机制

## 🏗️ 核心实现

### 三大核心阶段

1. **初始化阶段 (Initialization)**
   - 读取配置文件
   - 创建 Compiler 实例
   - 设置入口点

2. **编译阶段 (Compilation)**
   - 解析入口模块
   - 构建依赖图
   - 处理不同类型的文件（JS、CSS）
   - 使用 Babel 进行代码转换

3. **输出阶段 (Emission)**
   - 生成最终的 bundle 代码
   - 实现 `__webpack_require__` 运行时
   - 写入输出文件

### 技术栈

- **Node.js** - 运行环境
- **Babel** - AST 解析和代码转换
  - `@babel/parser` - 解析 JavaScript 代码为 AST
  - `@babel/traverse` - 遍历 AST 提取依赖
  - `@babel/core` - 代码转换
- **Path** - 路径处理
- **FS** - 文件系统操作

## 📁 项目结构

```
mini-webpack/
├── src/
│   └── index.js              # Mini Webpack 核心实现
├── example/                  # 示例项目
│   ├── src/
│   │   ├── index.js          # 入口文件
│   │   ├── utils/
│   │   │   ├── helpers.js     # 工具函数
│   │   │   └── ui.js         # UI 工具
│   │   ├── styles/
│   │   │   └── main.css      # 样式文件
│   │   └── components/
│   │       └── ComponentA.js # 组件模块
│   ├── dist/
│   │   └── bundle.js         # 构建输出
│   ├── index.html            # HTML 模板
│   ├── build.js              # 构建脚本
│   └── package.json          # 项目配置
├── package.json              # 主项目配置
└── README.md                 # 项目说明
```

## 🚀 快速开始

### 安装依赖

```bash
# 安装主项目依赖
pnpm install

# 进入示例项目
cd example
npm run build
# 这里打开example/index.html查看效果


```

## 📖 使用说明

### 基本用法

```javascript
const MiniWebpack = require('./src/index.js');

const config = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'bundle.js'
  }
};

const compiler = new MiniWebpack(config);
compiler.run();
```

### 支持的语法

- ✅ ES6 模块 (`import`/`export`)
- ✅ CommonJS (`require`/`module.exports`)
- ✅ CSS 文件导入
- ✅ 动态导入 (`import()`)
- ✅ 相对路径和绝对路径

### 构建过程

1. **依赖解析**：从入口文件开始，递归解析所有依赖
2. **代码转换**：使用 Babel 将 ES6+ 代码转换为 ES5
3. **模块打包**：将所有模块打包成一个文件
4. **运行时注入**：注入 `__webpack_require__` 运行时

## 🔧 核心特性

### 模块系统

- **模块缓存**：避免重复加载
- **循环依赖处理**：支持模块间的循环引用
- **路径解析**：支持相对路径和绝对路径

### 代码转换

- **ES6 → ES5**：使用 Babel 进行语法转换
- **模块转换**：ES6 模块转换为 CommonJS
- **CSS 处理**：将 CSS 转换为 JavaScript 代码

### 运行时机制

```javascript
// 生成的运行时代码
(function(modules) {
  var installedModules = {};
  
  function __webpack_require__(moduleId) {
    // 模块加载逻辑
  }
  
  return __webpack_require__("入口模块ID");
})({
  "模块ID": function(module, exports, require) {
    // 模块代码
  }
});
```

## 📊 示例项目

示例项目包含以下功能：

- **工具函数模块**：提供常用的工具函数
- **UI 组件模块**：创建交互式 UI 元素
- **样式文件**：现代化的 CSS 样式
- **动态导入**：演示代码分割功能

### 运行效果

- 🎨 渐变背景设计
- 🎯 交互式按钮
- 📱 响应式布局
- ⚡ 动态组件加载

## 🎓 学习价值

通过这个项目，你可以学习到：

1. **Webpack 工作原理**：理解现代构建工具的核心机制
2. **AST 操作**：学习如何解析和操作抽象语法树
3. **模块系统**：深入理解 JavaScript 模块加载机制
4. **代码转换**：掌握代码转换和优化的技术
5. **构建工具设计**：学习如何设计自己的构建工具

## 🔍 技术细节

### 依赖提取策略

```javascript
// 使用 Babel 解析 AST
const ast = parse(source, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript', 'decorators-legacy']
});

// 提取 import 声明
traverse(ast, {
  ImportDeclaration: ({ node }) => {
    dependencies.push(node.source.value);
  }
});
```

### 路径解析机制

```javascript
// 支持多种文件扩展名
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.css'];

// 相对路径解析
const resolveModulePath = (from, to) => {
  const ext = path.extname(to);
  if (ext) return path.resolve(path.dirname(from), to);
  
  for (const ext of extensions) {
    const fullPath = path.resolve(path.dirname(from), to + ext);
    if (fs.existsSync(fullPath)) return fullPath;
  }
};
```

## 📝 开发日志

- ✅ 实现基本的模块解析
- ✅ 集成 Babel 进行代码转换
- ✅ 支持 CSS 文件处理
- ✅ 实现模块缓存机制
- ✅ 优化路径解析逻辑
- ✅ 完善错误处理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License

---

**相关资源**：
- [Webpack 官方文档](https://webpack.js.org/)
- [Babel 官方文档](https://babeljs.io/)
- [AST Explorer](https://astexplorer.net/)