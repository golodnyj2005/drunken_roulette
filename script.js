document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');
  const buttonText = spinBtn.querySelector('.button-text');
  const buttonLoader = spinBtn.querySelector('.button-loader');
  
  // Создаем сектора рулетки
  const createWheel = () => {
    const centerX = 160;
    const centerY = 160;
    const radius = 150;
    const sectors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const sectorAngle = 360 / sectors.length;
    
    sectors.forEach((num, i) => {
      const startAngle = (i * sectorAngle - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * sectorAngle - 90) * (Math.PI / 180);
      
      // Создаем сектор
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `
        M ${centerX},${centerY}
        L ${centerX + radius * Math.cos(startAngle)},${centerY + radius * Math.sin(startAngle)}
        A ${radius},${radius} 0 0,1 ${centerX + radius * Math.cos(endAngle)},${centerY + radius * Math.sin(endAngle)}
        Z
      `);
      path.setAttribute('fill', i % 2 === 0 ? '#960018' : '#080808');
      path.setAttribute('stroke', '#FFD700');
      path.setAttribute('stroke-width', '2');
      
      // Добавляем номер
      const textAngle = (i * sectorAngle - 90 + sectorAngle/2) * (Math.PI / 180);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', centerX + radius * 0.7 * Math.cos(textAngle));
      text.setAttribute('y', centerY + radius * 0.7 * Math.sin(textAngle));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '14');
      text.textContent = num;
      
      wheel.appendChild(path);
      wheel.appendChild(text);
    });
    
    // Центральный круг
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', centerX);
    centerCircle.setAttribute('cy', centerY);
    centerCircle.setAttribute('r', radius * 0.2);
    centerCircle.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
    wheel.appendChild(centerCircle);
  };
  
  // Функция вращения
  const spinWheel = () => {
    if (spinBtn.disabled) return;
    
    // Блокируем кнопку
    spinBtn.disabled = true;
    buttonText.textContent = '';
    buttonLoader.style.display = 'block';
    
    // Сбрасываем анимацию
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetWidth;
    
    // Выбираем случайный сектор (0-11)
    const winnerIndex = Math.floor(Math.random() * 12);
    const sectorDegrees = 360 / 12;
    
    // 5-10 полных оборотов + смещение до выбранного сектора
    const spinDegrees = 1800 + (360 * Math.random()) + (360 - winnerIndex * sectorDegrees);
    
    // Запускаем анимацию
    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(-${spinDegrees}deg)`;
    
    // По завершении анимации
    setTimeout(() => {
      // Показываем результат
      alert(`Выпал сектор: ${winnerIndex + 1}`);
      
      // Восстанавливаем кнопку
      spinBtn.disabled = false;
      buttonText.textContent = 'Крутить';
      buttonLoader.style.display = 'none';
    }, 4000);
  };
  
  // Инициализация
  createWheel();
  
  // Обработчики событий
  spinBtn.addEventListener('click', spinWheel);
  spinBtn.addEventListener('touchend', spinWheel); // Для мобильных устройств
});
