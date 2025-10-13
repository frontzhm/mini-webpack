const path = require('path');
const fs = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');
class MiniWebpack {
  constructor(config) {
    this.config = config; // 配置文件
    this.modules = new Map(); // 存储所有模块，key是文件路径，value是模块对象
    this.graph = []; // 依赖图，存储所有模块的依赖关系，数组中存储的是模块对象
    this.moduleId = 0; // 模块 ID 计数器，用于生成模块的唯一 ID
  }
  /**
   * 执行构建流程
   */
  run() {
    console.log('🎯 开始 Mini Webpack 构建流程\n');
    // 阶段一：初始化
    this.initialize();
    // 阶段二：编译
    this.compile();
    // 阶段三：输出
    this.emit();
    console.log('🎉 构建成功完成！');
  }
  // 阶段一：初始化阶段
  initialize() {
    console.log('🚀 阶段一：初始化阶段');
    console.log('📖 读取配置文件:', this.config); // 其实就是拿到this.config,实际的时候应该是需要和命令行参数结合的
    console.log('🔧 创建 Compiler 实例');
    console.log('📝 解析 Entry 入口:', this.config.entry); // 其实就是拿到this.config.entry
    console.log('✅ 初始化完成\n');
  }
  // 阶段二：编译阶段
  async compile() {
    console.log('🔄 阶段二：编译阶段');

    // 从入口开始解析
    const entryPath = path.resolve(this.config.entry);
    console.log('📂 开始解析入口文件:', entryPath);

    // 递归解析所有依赖
    await this.parseModule(entryPath);

    console.log('✅ 编译阶段完成\n');
  }
  /**
   * 解析单个模块
   */
  async parseModule(filePath) {
    if (this.modules.has(filePath)) {
      return this.modules.get(filePath);
    }

    console.log(`  🔍 解析模块: ${filePath}`);

    // 读取文件内容
    const source = fs.readFileSync(filePath, 'utf-8');

    // 检查文件类型
    const ext = path.extname(filePath);
    let dependencies = [];
    let transformedCode = source;

    // 只对 JavaScript 文件进行 AST 解析
    const isJavaScriptFile = ['.js', '.jsx', '.ts', '.tsx'].includes(ext);
    if (!isJavaScriptFile) {
      dependencies = this.extractDependenciesSimple(source);
    } else {
      // 使用 Babel 解析 AST
      const ast = parse(source, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript', 'decorators-legacy', 'classProperties', 'objectRestSpread']
      });

      // 提取依赖
      dependencies = this.extractDependenciesFromAST(ast);

      // 使用 Babel 转换代码
      const { code } = transformFromAst(ast, source, {
        presets: ['@babel/preset-env'],
        plugins: [
          // 将 ES6 模块转换为 CommonJS
          ['@babel/plugin-transform-modules-commonjs', {
            strictMode: false
          }]
        ]
      });

      transformedCode = code;
    }


    const module = {
      id: this.moduleId++,
      filePath: filePath,
      source: transformedCode,
      dependencies: dependencies.map(dep => this.resolveModulePath(filePath, dep))
    };

    this.modules.set(filePath, module);
    this.graph.push(module);

    // 递归解析依赖
    for (const dep of module.dependencies) {
      if (fs.existsSync(dep)) {
        await this.parseModule(dep);
      }
    }

    return module;
  }

  /**
   * 从 AST 中提取依赖
   */
  extractDependenciesFromAST(ast) {
    const dependencies = [];

    traverse(ast, {
      // 处理 import 语句
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      },

      // 处理 require 语句
      CallExpression: ({ node }) => {
        if (node.callee.name === 'require' && node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (arg.type === 'StringLiteral') {
            dependencies.push(arg.value);
          }
        }
      },

      // 处理动态 import
      CallExpression: ({ node }) => {
        if (node.callee.type === 'Import' && node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (arg.type === 'StringLiteral') {
            dependencies.push(arg.value);
          }
        }
      }
    });

    return dependencies;
  }

  /**
   * 简单的依赖提取（使用正则表达式）
   */
  extractDependenciesSimple(source) {
    const dependencies = [];

    // 匹配 import 语句
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(source)) !== null) {
      dependencies.push(match[1]);
    }

    // 匹配 require 语句
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    while ((match = requireRegex.exec(source)) !== null) {
      dependencies.push(match[1]);
    }

    return dependencies;
  }

  /**
   * 解析模块路径
   */
  resolveModulePath(currentPath, modulePath) {
    // 如果是相对路径
    if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
      const possiblePaths = [
        path.resolve(path.dirname(currentPath), modulePath),
        path.resolve(path.dirname(currentPath), modulePath + '.js'),
        path.resolve(path.dirname(currentPath), modulePath + '.ts'),
        path.resolve(path.dirname(currentPath), modulePath + '.jsx'),
        path.resolve(path.dirname(currentPath), modulePath + '.tsx')
      ];

      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          return possiblePath;
        }
      }
    }

    // 如果是绝对路径或 node_modules
    if (path.isAbsolute(modulePath) || !modulePath.startsWith('.')) {
      return modulePath;
    }

    return path.resolve(path.dirname(currentPath), modulePath);
  }
  emit() { }
}

module.exports = MiniWebpack;