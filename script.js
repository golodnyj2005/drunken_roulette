document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');

  if (!wheel || !spinBtn) {
    console.error('Необходимые элементы не найдены!');
    return;
  }

  // Получаем текущие размеры SVG
  const svgWidth = wheel.clientWidth;
  const svgHeight = wheel.clientHeight;
  const centerX = svgWidth / 2; // Центр колеса по X
  const centerY = svgHeight / 2; // Центр колеса по Y
  const radius = Math.min(svgWidth, svgHeight) / 2 - 10; // Радиус колеса

  // Массив номеров для каждого сектора (в порядке их расположения)
  const sectorNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Создаем 12 секторов
  for (let i = 0; i < 12; i++) {
    const startAngle = (i * 30 - 90) * (Math.PI / 180); // Начальный угол в радианах
    const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180); // Конечный угол в радианах

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `
      M ${centerX},${centerY}
      L ${x1},${y1}
      A ${radius},${radius} 0 0,1 ${x2},${y2}
      Z
    `);

    path.setAttribute('fill', i % 2 === 0 ? '#960018' : '#080808');
    path.setAttribute('stroke', '#FFD700'); // Золотая окантовка
    path.setAttribute('stroke-width', '2');

    // Добавляем номер сектора
    const number = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const textRadius = radius * 0.7; // Радиус для текста
    const textAngle = (i * 30 - 90 + 15) * (Math.PI / 180); // Угол для текста
    const textX = centerX + textRadius * Math.cos(textAngle);
    const textY = centerY + textRadius * Math.sin(textAngle);

    number.setAttribute('x', textX);
    number.setAttribute('y', textY);
    number.setAttribute('text-anchor', 'middle');
    number.setAttribute('alignment-baseline', 'middle');
    number.setAttribute('fill', '#fff');
    number.setAttribute('font-size', `${svgWidth * 0.04}px`); // Адаптивный размер шрифта
    number.setAttribute('font-weight', 'bold');
    number.textContent = sectorNumbers[i]; // Устанавливаем номер из массива

    wheel.appendChild(path);
    wheel.appendChild(number);
  }

  // Добавляем центральный круг
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', centerX);
  centerCircle.setAttribute('cy', centerY);
  centerCircle.setAttribute('r', radius * 0.2); // Относительный размер
  centerCircle.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
  centerCircle.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
  centerCircle.setAttribute('stroke-width', '3');
  wheel.appendChild(centerCircle);

  // Добавляем звёздочку
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  star.setAttribute('x', centerX);
  star.setAttribute('y', centerY + 5); // Смещаем на 5px вниз для лучшего центрирования
  star.setAttribute('text-anchor', 'middle');
  star.setAttribute('font-size', `${svgWidth * 0.08}px`); // Адаптивный размер шрифта
  star.setAttribute('font-weight', 'bold');
  star.setAttribute('fill', '#fff');
  star.setAttribute('text-shadow', '0 0 10px rgba(255, 255, 255, 0.7)');
  star.textContent = '🌟';
  wheel.appendChild(star);

  // Анимация вращения
  spinBtn.addEventListener('click', () => {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;
    spinBtn.setAttribute('aria-disabled', 'true');

    // Сброс предыдущей анимации
    wheel.style.transition = 'none'; // Отключаем анимацию
    wheel.style.transform = 'rotate(0deg)'; // Сбрасываем угол вращения
    void wheel.offsetWidth; // Триггер перерисовки для применения изменений

    // Генерируем случайный индекс для выпавшего номера
    const randomIndex = Math.floor(Math.random() * 12); // Случайный индекс от 0 до 11
    const winningNumber = sectorNumbers[randomIndex]; // Выпавший номер

    // Случайный угол (5-9 оборотов + смещение для выбранного сектора)
    const spinAngle = (Math.floor(Math.random() * 5) + 5) * 360 + randomIndex * 30;

    // Включаем анимацию и задаем новое значение угла
    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(${spinAngle}deg)`;

    // Определение результата
    setTimeout(() => {
      // Отладочная информация
      console.log(`Индекс сектора: ${randomIndex}, Выпавший номер: ${winningNumber}`);

      // Отображение результата
      alert(`Выпал сектор: ${winningNumber}`);
      spinBtn.disabled = false;
      spinBtn.setAttribute('aria-disabled', 'false');
    }, 4000);
  });
});
