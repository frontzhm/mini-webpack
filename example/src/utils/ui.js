// UI 工具模块
export function createButton(text) {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.cssText = `
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  `;
  
  button.addEventListener('click', () => {
    alert('按钮被点击了！');
  });
  
  return button;
}

export function createCard(title, content) {
  const card = document.createElement('div');
  card.style.cssText = `
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 10px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;
  
  card.innerHTML = `
    <h3>${title}</h3>
    <p>${content}</p>
  `;
  
  return card;
}
