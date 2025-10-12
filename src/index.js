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
  initialize() {}
  compile() {}
  emit() {}
}

module.exports = MiniWebpack;