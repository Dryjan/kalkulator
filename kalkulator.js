(function() {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'calculator-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.zIndex = '10000';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.padding = '20px';
  overlay.style.borderRadius = '10px';
  overlay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  overlay.style.cursor = 'move'; // For drag functionality

  // Create calculator container
  const calculator = document.createElement('div');
  calculator.style.backgroundColor = 'white';
  calculator.style.padding = '10px';

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #calculator-table, #calculator-table td {
      border: 1px solid black;
      user-select: none;
    }
    #calculator-table td {
      text-align: center;
      width: 100px;
      height: 100px;
      font-size: 50px;
      font-family: 'Courier New', Courier, monospace;
    }
    #calculator-table td:hover {
      background-color: hsl(0, 0%, 90%);
    }
    #tdD {
      width: 418px;
      height: 100px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 60px;
    }
    #tdDisplay:hover {
      background-color: white;
    }
    #td\\+, #td\\= {
      width: 100px;
      height: 206px;
    }
    #tdN {
      font-size: 35px;
    }
    #close-calculator {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-size: 20px;
      color: red;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  calculator.innerHTML = `
    <table id="calculator-table">
      <tr>
        <td id="tdD" colspan="4"></td>
      </tr>
      <tr>
        <td id="tdC">C</td>
        <td id="td/">/</td>
        <td id="td*">*</td>
        <td id="td-">-</td>
      </tr>
      <tr>
        <td id="td7">7</td>
        <td id="td8">8</td>
        <td id="td9">9</td>
        <td id="td+" rowspan="2">+</td>
      </tr>
      <tr>
        <td id="td4">4</td>
        <td id="td5">5</td>
        <td id="td6">6</td>
      </tr>
      <tr>
        <td id="td1">1</td>
        <td id="td2">2</td>
        <td id="td3">3</td>
        <td id="td=" rowspan="2">=</td>
      </tr>
      <tr>
        <td id="tdN">+/-</td>
        <td id="td0">0</td>
        <td id="td.">.</td>
      </tr>
    </table>
    <span id="close-calculator">✖</span>
  `;

  // Append calculator to overlay, and overlay to body
  overlay.appendChild(calculator);
  document.body.appendChild(overlay);

  // Calculator logic
  function display() {
    let h = displayedNum.slice(0, 9);
    document.getElementById('tdD').innerText = h;
  }

  function showVars() {
    console.log(displayedNum);
    console.log(lastNum);
    console.log(lastOp);
    console.log(currentOp);
  }

  function tdClicked(sign) {
    if ('1234567890'.includes(sign)) {
      if (currentOp) {
        lastNum = displayedNum;
        displayedNum = '';
        lastOp = currentOp;
        currentOp = '';
      }
      displayedNum += sign;
      display();
    } else if ('-+/*'.includes(sign)) {
      if (displayedNum) {
        if (currentOp === '=') {
          lastNum = '';
          lastOp = '';
        }
        currentOp = sign;
        displayedNum = eval(lastNum + lastOp + displayedNum).toString();
        display();
      }
    } else if ('=' === sign) {
      if ((lastNum && !currentOp) || currentOp === '=') {
        if (currentOp) {
          displayedNum = eval(displayedNum + lastOp + lastNum).toString();
        } else {
          currentOp = '=';
          let h = displayedNum;
          displayedNum = eval(lastNum + lastOp + displayedNum).toString();
          lastNum = h;
        }
        display();
      }
    } else if ('.' === sign) {
      // Decimal point logic can be added here if needed
    } else { // C
      displayedNum = '';
      display();
      lastNum = '';
      lastOp = '';
      currentOp = '';
    }
    showVars();
  }

  let displayedNum = '';
  let lastNum = '';
  let lastOp = '';
  let currentOp = '';
  let h;

  let signs = '1234567890-+/*=C.';
  for (let i = 0; i < signs.length; i++) {
    let element = document.getElementById('td' + signs[i]);
    if (element) {
      element.addEventListener('click', () => {
        tdClicked(signs[i]);
      });
    }
  }

  // Close button functionality
  document.getElementById('close-calculator').addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.head.removeChild(style);
  });

  // Draggable functionality
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  overlay.addEventListener('mousedown', (e) => {
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
    isDragging = true;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      overlay.style.left = currentX + 'px';
      overlay.style.top = currentY + 'px';
      overlay.style.transform = 'none';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Initialize position
  currentX = window.innerWidth / 2 - overlay.offsetWidth / 2;
  currentY = window.innerHeight / 2 - overlay.offsetHeight / 2;
  overlay.style.left = currentX + 'px';
  overlay.style.top = currentY + 'px';
})();
