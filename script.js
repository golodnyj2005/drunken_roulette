document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');
  
  // Создаем 12 секторов
  for (let i = 0; i < 12; i++) {
    const sector = document.createElement('div');
    sector.className = 'sector';
    sector.style.transform = `rotate(${(i * 30 + 90)}deg)`; // Смещаем на +90°
    sector.style.setProperty('--sector-angle', `${(i * 30 + 90)}deg`);
    sector.setAttribute('data-number', i + 1); // Устанавливаем атрибут data-number
    wheel.appendChild(sector);
  }

  // Добавляем центральный круг
  const centerCircle = document.createElement('div');
  centerCircle.className = 'center-circle';
  centerCircle.innerHTML = '<span>★</span>'; // Можно заменить на любой символ
  wheel.appendChild(centerCircle);
  
  // Анимация вращения
  spinBtn.addEventListener('click', () => {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;
    
    // Сброс предыдущей анимации
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetWidth; // Принудительный reflow
    
    // Эффект искр
    createSparks();
    
    // Случайный угол (5-7 оборотов)
    const spinAngle = 1800 + Math.floor(Math.random() * 360);
    
    // Запуск анимации
    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(${spinAngle}deg)`;
    
    // Определение результата
    setTimeout(() => {
      const resultAngle = spinAngle % 360; // Угол, на котором остановилось колесо
      const winningNumber = Math.floor((resultAngle - 90) / 30) % 12 + 1; // Вычисляем правильный номер
      
      // Обработка отрицательных значений
      if (winningNumber <= 0) {
        winningNumber += 12;
      }
      
      // Эффект победы
      setTimeout(() => {
        alert(`Выпал сектор: ${winningNumber}`);
        spinBtn.disabled = false;
      }, 500);
    }, 4000);
  });
  
  // Создание эффекта искр
  function createSparks() {
    const colors = ['#FF3E9D', '#00E0FF', '#7B2BFF', '#FFD600'];
    const sparks = document.createElement('div');
    sparks.className = 'sparks';
    
    // Создаем 8 искр
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      spark.style.background = colors[Math.floor(Math.random() * colors.length)];
      spark.style.setProperty('--tx', (Math.random() - 0.5) * 2);
      spark.style.setProperty('--ty', -Math.random() * 1.5 - 0.5);
      sparks.appendChild(spark);
    }
    
    document.body.appendChild(sparks);
    setTimeout(() => sparks.remove(), 1000);
  }
  
  // Анимация градиента кнопки
  spinBtn.style.animation = 'gradientBG 8s ease infinite';
});
