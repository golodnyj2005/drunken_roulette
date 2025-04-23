document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');

  if (!wheel || !spinBtn) {
    console.error('Необходимые элементы не найдены!');
    return;
  }

  // Создаем 12 секторов
  for (let i = 0; i < 12; i++) {
    const sector = document.createElement('div');
    sector.className = 'sector';
    sector.style.transform = `rotate(${(i * 30 + 90)}deg)`;
    const correctedNumber = ((i + 9) % 12) + 1;
    sector.setAttribute('data-number', correctedNumber);
    wheel.appendChild(sector);
  }

  // Добавляем центральный круг
  const centerCircle = document.createElement('div');
  centerCircle.className = 'center-circle';
  centerCircle.innerHTML = '<span>★</span>';
  wheel.appendChild(centerCircle);

  // Анимация вращения
  spinBtn.addEventListener('click', () => {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;
    spinBtn.setAttribute('aria-disabled', 'true');

    // Сброс предыдущей анимации
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetWidth;

    // Эффект искр
    createSparks();

    // Случайный угол (5-9 оборотов)
    const spinAngle = (Math.floor(Math.random() * 5) + 5) * 360 + Math.floor(Math.random() * 360);

    // Запуск анимации
    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(${spinAngle}deg)`;

    // Определение результата
    setTimeout(() => {
      const resultAngle = spinAngle % 360;
      let rawSectorIndex = Math.floor((resultAngle - 90) / 30);
      rawSectorIndex = rawSectorIndex < 0 ? rawSectorIndex + 12 : rawSectorIndex;
      const winningNumber = ((rawSectorIndex + 9) % 12) + 1;

      setTimeout(() => {
        alert(`Выпал сектор: ${winningNumber}`);
        spinBtn.disabled = false;
        spinBtn.setAttribute('aria-disabled', 'false');
      }, 500);
    }, 4000);
  });

  // Создание эффекта искр
  function createSparks() {
    const colors = ['#FF3E9D', '#00E0FF', '#7B2BFF', '#FFD600'];
    const sparks = document.createElement('div');
    sparks.className = 'sparks';

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
});
