// Create calculator container
const calcContainer = document.createElement('div');
calcContainer.style.position = 'fixed';
calcContainer.style.top = '20px';
calcContainer.style.right = '20px';
calcContainer.style.backgroundColor = '#f0f0f0';
calcContainer.style.padding = '10px';
calcContainer.style.border = '1px solid #ccc';
calcContainer.style.borderRadius = '5px';
calcContainer.style.zIndex = '1000';
calcContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

// Create calculator display
const display = document.createElement('input');
display.type = 'text';
display.style.width = '200px';
display.style.marginBottom = '10px';
display.style.padding = '5px';
display.style.fontSize = '16px';
display.readOnly = true;
display.value = '0';

// Create button container
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'grid';
buttonContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
buttonContainer.style.gap = '5px';

// Calculator buttons
const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C'
];

// Calculator logic
let currentInput = '';
let operator = '';
let firstOperand = null;

function updateDisplay() {
    display.value = currentInput || '0';
}

function handleButtonClick(value) {
    if (value === 'C') {
        currentInput = '';
        operator = '';
        firstOperand = null;
        updateDisplay();
        return;
    }

    if (value === '=') {
        if (firstOperand !== null && operator && currentInput) {
            const secondOperand = parseFloat(currentInput);
            let result;
            switch (operator) {
                case '+': result = firstOperand + secondOperand; break;
                case '-': result = firstOperand - secondOperand; break;
                case '*': result = firstOperand * secondOperand; break;
                case '/': result = firstOperand / secondOperand; break;
            }
            currentInput = result.toString();
            operator = '';
            firstOperand = null;
            updateDisplay();
        }
        return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput) {
            firstOperand = parseFloat(currentInput);
            operator = value;
            currentInput = '';
        }
        return;
    }

    currentInput += value;
    updateDisplay();
}

// Create buttons
buttons.forEach(button => {
    const btn = document.createElement('button');
    btn.textContent = button;
    btn.style.padding = '10px';
    btn.style.fontSize = '16px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => handleButtonClick(button));
    buttonContainer.appendChild(btn);
});

// Assemble calculator
calcContainer.appendChild(display);
calcContainer.appendChild(buttonContainer);
document.body.appendChild(calcContainer);
