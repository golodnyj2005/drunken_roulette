document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the roulette page
  const isRoulettePage = window.location.pathname.includes('about.html');

  if (isRoulettePage) {
    // Get DOM elements
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const wheelContainer = document.querySelector('.roulette-wheel-container');
    const numberInput = document.getElementById('number-input');
    const numberDecrease = document.getElementById('number-decrease');
    const numberIncrease = document.getElementById('number-increase');
    const numberOptions = document.querySelectorAll('.number-option');

    // Check if all required elements exist
    if (!wheel || !spinBtn || !numberInput || !wheelContainer || !numberDecrease || !numberIncrease) {
      console.error('Required elements not found!');
      return;
    }

    // Get button elements after confirming spinBtn exists
    const buttonText = spinBtn.querySelector('.button-text');
    const buttonLoader = spinBtn.querySelector('.button-loader');

    // Check if button elements exist
    if (!buttonText || !buttonLoader) {
      console.error('Button elements not found!');
      return;
    }

    // Set container size
    const setContainerSize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      wheelContainer.style.width = `${Math.min(size, 320)}px`;
      wheelContainer.style.height = `${Math.min(size, 320)}px`;
    };

    // Initialize sizes
    setContainerSize();
    window.addEventListener('resize', setContainerSize);

    // Create SVG element
    const createSVGElement = (tag, attributes) => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
      return element;
    };

    // Wheel parameters
    const centerX = 160;
    const centerY = 160;
    const radius = 150;
    const sectorNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Clear wheel before creating sectors
    while (wheel.firstChild) {
      wheel.removeChild(wheel.firstChild);
    }

    // Create roulette sectors
    sectorNumbers.forEach((number, i) => {
      const startAngle = (i * 30 - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);

      // Create sector path
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

      // Text in sector
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

    // Center circle
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

    // Decorative star in center
    const star = createSVGElement('text', {
      x: centerX,
      y: centerY + 8,
      'text-anchor': 'middle',
      'font-size': '24px',
      'font-weight': 'bold',
      fill: '#fff',
      'text-shadow': '0 0 10px rgba(255, 255, 255, 0.7)',
      'aria-hidden': 'true'
    });
    star.textContent = '🌟';
    wheel.appendChild(star);

    // Get current sector under arrow
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

    // Update visual number selection
    const updateNumberSelection = () => {
      numberOptions.forEach(option => {
        option.classList.toggle(
          'selected', 
          parseInt(option.dataset.number) === parseInt(numberInput.value)
        );
      });
    };

    // Handlers for +/- buttons
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

    // Handlers for number selection from grid
    numberOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Vibration on mobile devices (if supported)
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        numberInput.value = option.dataset.number;
        updateNumberSelection();
        
        // Selection animation
        option.classList.add('selected-pulse');
        setTimeout(() => {
          option.classList.remove('selected-pulse');
        }, 300);
      });
    });

    // Spin wheel
    const spinWheel = (e) => {
      if (e) e.preventDefault();
      if (spinBtn.disabled) return;
      
      const selectedNumber = parseInt(numberInput.value);
      if (isNaN(selectedNumber)) {
        showResult(null, "Пожалуйста, выберите число от 1 до 12");
        return;
      }
      
      if (selectedNumber < 1 || selectedNumber > 12) {
        showResult(null, "Пожалуйста, выберите число от 1 до 12");
        return;
      }
      
      spinBtn.disabled = true;
      numberInput.disabled = true;
      numberDecrease.disabled = true;
      numberIncrease.disabled = true;
      buttonText.textContent = 'Вращается...';
      buttonLoader.style.display = 'block';
      
      // Reset animation
      wheel.style.transition = 'none';
      wheel.style.transform = 'rotate(0deg)';
      void wheel.offsetWidth;

      // Calculate final angle
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
          showResult(sectorNumber, `Поздравляем! Вы Выиграли! Выпал номер ${Number(sectorNumber)}`);
        } else {
          showResult(sectorNumber, `Выпал номер ${Number(sectorNumber)} Попробуйте ещё раз!`);
        }
      }, 4000);
    };

    // Show result
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

    // Event handlers for spin button
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

    // Initialize on load
    updateNumberSelection();
  }
});
