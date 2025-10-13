// 组件 A
export default class ComponentA {
  constructor(name) {
    this.name = name;
    this.element = null;
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = `
      <h2>组件 A: ${this.name}</h2>
      <p>这是一个动态导入的组件</p>
      <button id="component-btn">组件按钮</button>
    `;
    
    // 添加事件监听器
    this.element.querySelector('#component-btn').addEventListener('click', () => {
      console.log('组件按钮被点击了！');
    });
    
    return this.element;
  }

  mount(container) {
    if (this.element) {
      container.appendChild(this.element);
    }
  }
}
