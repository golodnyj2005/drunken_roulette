document.addEventListener('DOMContentLoaded', () => {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spin-btn');
  const buttonText = spinBtn.querySelector('.button-text');
  const buttonLoader = spinBtn.querySelector('.button-loader');
  const wheelContainer = document.querySelector('.roulette-wheel-container');

  if (!wheel || !spinBtn) {
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

  const createSVGElement = (tag, attributes) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    return element;
  };

  const centerX = 160;
  const centerY = 160;
  const radius = 150;
  const sectorNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  sectorNumbers.forEach((number, i) => {
    const startAngle = (i * 30 - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);

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

    const textAngle = (i * 30 - 90 + 15) * (Math.PI / 180);
    const text = createSVGElement('text', {
      x: centerX + radius * 0.7 * Math.cos(textAngle),
      y: centerY + radius * 0.7 * Math.sin(textAngle),
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      fill: '#fff',
      'font-size': '14px',
      'font-weight': 'bold',
      'aria-hidden': 'true'
    });
    text.textContent = number;

    wheel.appendChild(path);
    wheel.appendChild(text);
  });

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

  const spinWheel = () => {
    if (spinBtn.disabled) return;
    
    spinBtn.disabled = true;
    buttonText.textContent = 'Вращается...';
    buttonLoader.style.display = 'block';
    
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    void wheel.offsetWidth;

    // Вычисляем точный конечный угол
    const fullRotations = Math.floor(Math.random() * 5) + 5; // 5-9 полных оборотов
    const winningIndex = Math.floor(Math.random() * 12);
    const sectorAngle = 30; // градусов
    const spinAngle = fullRotations * 360 + (360 - (winningIndex * sectorAngle + sectorAngle/2));
    
    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(-${spinAngle}deg)`; // Отрицательное значение для правильного направления

    setTimeout(() => {
      spinBtn.disabled = false;
      buttonText.textContent = 'Крутить';
      buttonLoader.style.display = 'none';
      showResult(sectorNumbers[winningIndex]);
    }, 4000);
  };

  const showResult = (number) => {
    const resultElement = document.createElement('div');
    resultElement.className = 'result-notification';
    resultElement.textContent = `Выпал сектор: ${number}`;
    resultElement.setAttribute('role', 'alert');
    
    document.body.appendChild(resultElement);
    
    setTimeout(() => {
      resultElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      resultElement.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(resultElement);
      }, 300);
    }, 3000);
  };

  spinBtn.addEventListener('click', spinWheel);
  
  spinBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    spinBtn.classList.add('touched');
  });
  
  spinBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    spinBtn.classList.remove('touched');
  });
});
