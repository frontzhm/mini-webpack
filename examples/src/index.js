// 入口文件
import { greet } from './utils/helpers';
import { createButton } from './utils/ui';
import './styles/main.css';

console.log('🚀 Mini Webpack 示例项目启动！');

// 使用工具函数
const message = greet('Mini Webpack');
console.log(message);

// 创建按钮
const button = createButton('点击我！');
document.body.appendChild(button);

// 动态导入示例
import('./components/ComponentA').then(module => {
  console.log('动态导入成功:', module.default);
});
