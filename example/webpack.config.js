const path = require('path');

module.exports = {
  // 入口文件
  entry: './src/index.js',
  
  // 输出配置
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
};
