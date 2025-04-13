document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');
  
  // Создаем 12 секторов
  for (let i = 0; i < 12; i++) {
  const sector = document.createElement('div');
  sector.className = 'sector';
  sector.style.transform = `rotate(${i * 30}deg)`;
  sector.setAttribute('data-number', i + 1);
  sector.innerHTML = `<span>${i + 1}</span>`;
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
      const resultAngle = spinAngle % 360;
      const sector = Math.floor(resultAngle / 30);
      const winningNumber = 12 - sector;
      
      // Эффект победы
      setTimeout(() => {
        alert(`Выпал сектор: ${winningNumber === 0 ? 12 : winningNumber}`);
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
