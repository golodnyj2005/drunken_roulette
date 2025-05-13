document.addEventListener('DOMContentLoaded', () => {
  // Получаем элементы DOM
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');
  const buttonText = spinBtn.querySelector('.button-text');
  const buttonLoader = spinBtn.querySelector('.button-loader');
  const wheelContainer = document.querySelector('.roulette-wheel-container');
  const numberInput = document.getElementById('number-input');
  const numberDecrease = document.getElementById('number-decrease');
  const numberIncrease = document.getElementById('number-increase');
  const numberOptions = document.querySelectorAll('.number-option');

  // Проверка наличия необходимых элементов
  if (!wheel || !spinBtn || !numberInput) {
    console.error('Необходимые элементы не найдены!');
    return;
  }

  // Устанавливаем размеры контейнера
  const setContainerSize = () => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    wheelContainer.style.width = `${Math.min(size, 320)}px`;
    wheelContainer.style.height = `${Math.min(size, 320)}px`;
  };

  // Инициализация размеров
  setContainerSize();
  window.addEventListener('resize', setContainerSize);

  // Создание SVG элемента
  const createSVGElement = (tag, attributes) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    return element;
  };

  // Параметры колеса
  const centerX = 160;
  const centerY = 160;
  const radius = 150;
  const sectorNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Очистка колеса перед созданием секторов
  while (wheel.firstChild) {
    wheel.removeChild(wheel.firstChild);
  }

  // Создание секторов рулетки
  sectorNumbers.forEach((number, i) => {
    const startAngle = (i * 30 - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);

    // Создание пути сектора
    const path = createSVGElement('path', {
      d: `
        M ${centerX},${centerY}
        L ${centerX + radius * Math.cos(startAngle)},${centerY + radius * Math.sin(startAngle)}
        A ${radius},${radius} 0 0,1 ${centerX + radius * Math.cos(endAngle)},${centerY + radius * Math.sin(endAngle)}
        Z
      `,
      fill: i % 2 === 0 ? '#960018' : '#080808',
      stroke: '#FFD700',
      'stroke-width': '2',
      'aria-hidden': 'true'
    });

    // Текст в секторе
    const textAngle = (i * 30 - 90 + 15) * (Math.PI / 180);
    const text = createSVGElement('text', {
      x: centerX + radius * 0.7 * Math.cos(textAngle),
      y: centerY + radius * 0.7 * Math.sin(textAngle),
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      fill: '#fff',
      'font-size': '14px',
      'font-weight': 'bold',
      'aria-hidden': 'true',
      'data-sector-number': number
    });
    text.textContent = number;

    wheel.appendChild(path);
    wheel.appendChild(text);
  });

  // Центральный круг
  const centerCircle = createSVGElement('circle', {
    cx: centerX,
    cy: centerY,
    r: radius * 0.2,
    fill: 'rgba(0, 0, 0, 0.8)',
    stroke: 'rgba(255, 255, 255, 0.2)',
    'stroke-width': '3',
    'aria-hidden': 'true'
  });
  wheel.appendChild(centerCircle);

  // Декоративная звезда в центре
  const star = createSVGElement('text', {
    x: centerX,
    y: centerY + 5,
    'text-anchor': 'middle',
    'font-size': '24px',
    'font-weight': 'bold',
    fill: '#fff',
    'text-shadow': '0 0 10px rgba(255, 255, 255, 0.7)',
    'aria-hidden': 'true'
  });
  star.textContent = '🌟';
  wheel.appendChild(star);

  // Определение текущего сектора под стрелкой
  const getCurrentSector = () => {
    const wheelStyle = window.getComputedStyle(wheel);
    const matrix = new DOMMatrix(wheelStyle.transform);
    const angle = (Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)) % 360;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;
    
    const sectorIndex = Math.floor(normalizedAngle / 30);
    const correctedIndex = (12 - sectorIndex - 1) % 12;
    
    const texts = wheel.querySelectorAll('text');
    const sectorText = texts[correctedIndex].textContent;
    
    return sectorText;
  };

  // Обновление визуального выделения выбранного номера
  const updateNumberSelection = () => {
    numberOptions.forEach(option => {
      option.classList.toggle(
        'selected', 
        parseInt(option.dataset.number) === parseInt(numberInput.value)
      );
    });
  };

  // Обработчики для кнопок +/-
  numberDecrease.addEventListener('click', () => {
    let value = parseInt(numberInput.value) - 1;
    if (value < 1) value = 12;
    numberInput.value = value;
    updateNumberSelection();
  });

  numberIncrease.addEventListener('click', () => {
    let value = parseInt(numberInput.value) + 1;
    if (value > 12) value = 1;
    numberInput.value = value;
    updateNumberSelection();
  });

  // Обработчики для выбора номера из сетки
  numberOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Вибрация на мобильных устройствах (если поддерживается)
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      numberInput.value = option.dataset.number;
      updateNumberSelection();
      
      // Анимация выбора
      option.classList.add('selected-pulse');
      setTimeout(() => {
        option.classList.remove('selected-pulse');
      }, 300);
    });
  });

  // Вращение колеса
  const spinWheel = (e) => {
    if (e) e.preventDefault();
    if (spinBtn.disabled) return;
    
    const selectedNumber = parseInt(numberInput.value);
    if (isNaN(selectedNumber)) {
      showResult(null, "Пожалуйста, выберите номер от 1 до 12");
      return;
    }
    
    if (selectedNumber < 1 || selectedNumber > 12) {
      showResult(null, "Пожалуйста, выберите номер от 1 до 12");
      return;
    }
    
    spinBtn.disabled = true;
    numberInput.disabled = true;
    numberDecrease.disabled = true;
    numberIncrease.disabled = true;
    buttonText.textContent = 'Вращается...';
    buttonLoader.style.display = 'block';
    
    // Сбрасываем анимацию
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetWidth;

    // Вычисляем конечный угол
    const fullRotations = Math.floor(Math.random() * 5) + 5;
    const winningIndex = Math.floor(Math.random() * 12);
    const sectorAngle = 30;
    const spinAngle = fullRotations * 360 + (360 - (winningIndex * sectorAngle + sectorAngle/2));
    
    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(-${spinAngle}deg)`;

    setTimeout(() => {
      const sectorNumber = getCurrentSector();
      spinBtn.disabled = false;
      numberInput.disabled = false;
      numberDecrease.disabled = false;
      numberIncrease.disabled = false;
      buttonText.textContent = 'Крутить';
      buttonLoader.style.display = 'none';
      
      if (parseInt(sectorNumber) === selectedNumber) {
        showResult(sectorNumber, `Поздравляем! Вы выиграли! Выпал номер ${sectorNumber}`);
      } else {
        showResult(sectorNumber, `Выпал номер ${sectorNumber}. Попробуйте еще раз!`);
      }
    }, 4000);
  };

  // Показ результата
  const showResult = (sectorNumber, message) => {
    const resultElement = document.createElement('div');
    resultElement.className = 'result-notification';
    
    if (sectorNumber) {
      const selectedNumber = parseInt(numberInput.value);
      if (parseInt(sectorNumber) === selectedNumber) {
        resultElement.classList.add('win-message');
      } else {
        resultElement.classList.add('lose-message');
      }
    }
    
    resultElement.textContent = message;
    resultElement.setAttribute('role', 'alert');
    
    document.body.appendChild(resultElement);
    
    setTimeout(() => {
      resultElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      resultElement.classList.remove('show');
      setTimeout(() => {
        if (resultElement.parentNode) {
          document.body.removeChild(resultElement);
        }
      }, 300);
    }, 3000);
  };

  // Обработчики событий для кнопки вращения
  spinBtn.addEventListener('click', spinWheel);
  spinBtn.addEventListener('touchend', spinWheel);
  
  spinBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    spinBtn.classList.add('touched');
  });
  
  spinBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    spinBtn.classList.remove('touched');
  });

  // Инициализация при загрузке
  updateNumberSelection();
});
