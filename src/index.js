class MiniWebpack {
  constructor(config) {
    this.config = config; // 配置文件
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
  compile() { }
  emit() { }
}

module.exports = MiniWebpack;