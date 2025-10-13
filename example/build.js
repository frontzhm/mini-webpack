const MiniWebpack = require('../src/index');
const config = require('./webpack.config');

// 创建 MiniWebpack 实例并运行
const miniWebpack = new MiniWebpack(config);
miniWebpack.run();
