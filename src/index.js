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
  }
  /**
   * 执行构建流程
   */
  async run() {
    console.log('🎯 开始 Mini Webpack 构建流程\n');
    try {
      // 阶段一：初始化
      this.initialize();
      // 阶段二：编译
      await this.compile();
      // 阶段三：输出
      this.emit();
      console.log('🎉 构建成功完成！');
    } catch (error) {
      console.error('❌ 构建失败:', error.message);
      console.error(error.stack);
    }
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

    console.log('📊 依赖图构建完成:');
    this.graph.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.id} -> [${module.dependencies.join(', ')}]`);
    });

    console.log('✅ 编译阶段完成\n');
  }
  /**
   * 解析单个模块
   */
  async parseModule(filePath) {
    const absolutePath = path.resolve(filePath);
    
    if (this.modules.has(absolutePath)) {
      return this.modules.get(absolutePath);
    }

    console.log(`  🔍 解析模块: ${absolutePath}`);

    // 读取文件内容
    const source = fs.readFileSync(absolutePath, 'utf-8');

    // 检查文件类型
    const ext = path.extname(absolutePath);
    let dependencies = [];
    let transformedCode = source;

    // 只对 JavaScript 文件进行 AST 解析
    const isJavaScriptFile = ['.js', '.jsx', '.ts', '.tsx'].includes(ext);
    if (!isJavaScriptFile) {
      dependencies = this.extractDependenciesSimple(source);
      
      // 对于 CSS 文件，生成动态插入样式的代码
      if (ext === '.css') {
        transformedCode = `
// CSS 文件处理
const style = document.createElement('style');
style.textContent = ${JSON.stringify(source)};
document.head.appendChild(style);
`;
      }
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
      id: absolutePath, // 使用绝对路径作为模块 ID
      filePath: absolutePath, // 使用绝对路径
      source: transformedCode,
      dependencies: dependencies.map(dep => this.resolveModulePath(absolutePath, dep))
    };

    this.modules.set(absolutePath, module);
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

  /**
   * 阶段三：输出阶段
   */
  emit() {
    console.log('📦 阶段三：输出阶段');

    // 生成 bundle 代码
    const bundle = this.generateBundle();

    // 确保输出目录存在
    const outputDir = this.config.output.path;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入文件
    const outputPath = path.join(outputDir, this.config.output.filename);
    fs.writeFileSync(outputPath, bundle);

    console.log('📁 输出文件:', outputPath);
    console.log('📏 文件大小:', (bundle.length / 1024).toFixed(2) + ' KB');
    console.log('✅ 构建完成！\n');
  }

  /**
   * 生成最终的 bundle 代码
   */
  generateBundle() {
    let modules = '';

    // 生成模块映射，直接使用文件路径作为 key
    this.modules.forEach((module) => {
      // 将模块源码中的相对路径替换为绝对路径
      let processedSource = module.source;
      
      // 替换 require 调用中的相对路径为绝对路径
      module.dependencies.forEach(dep => {
        const relativePath = path.relative(path.dirname(module.filePath), dep);
        const patterns = [
          `require("./${relativePath}")`,
          `require('./${relativePath}')`,
          `require("./${relativePath.replace(/\.js$/, '')}")`,
          `require('./${relativePath.replace(/\.js$/, '')}')`
        ];
        
        patterns.forEach(pattern => {
          processedSource = processedSource.replace(pattern, `require("${dep}")`);
        });
      });
      
      modules += `"${module.id}": function(module, exports, require) {\n${processedSource}\n},\n`;
    });

    return `
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
  return __webpack_require__("${path.resolve(this.config.entry)}");
})({
${modules}
})`;
  }

}

module.exports = MiniWebpack;