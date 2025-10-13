// 工具函数模块
export function greet(name) {
  return `Hello, ${name}! 欢迎使用 Mini Webpack！`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN');
}

export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
