(function() {
    // Define calculator HTML and styles
    const calculatorHTML = `
        <div id="calculatorWindow" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid black;
            padding: 5px;
            z-index: 1000;
            display: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
            <div id="closeCalculator" style="
                position: absolute;
                top: 5px;
                right: 5px;
                width: 20px;
                height: 20px;
                background: red;
                color: white;
                text-align: center;
                line-height: 20px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                cursor: pointer;
                border-radius: 50%;
            ">X</div>
            <table>
                <tr>
                    <td id="tdD" colspan="4"></td>
                </tr>
                <tr>
                    <td id="tdC">C</td>
                    <td id="tdB">B</td>
                    <td id="td/">/</td>
                    <td id="td*">*</td>
                </tr>
                <tr>
                    <td id="td7">7</td>
                    <td id="td8">8</td>
                    <td id="td9">9</td>
                    <td id="td-">-</td>
                </tr>
                <tr>
                    <td id="td4">4</td>
                    <td id="td5">5</td>
                    <td id="td6">6</td>
                    <td id="td+">+</td>
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
        </div>
    `;

    const calculatorStyles = `
        @font-face {
            font-family: 'Digital-7';
            src: url('https://dryjan.github.io/kalkulator/fonts/digital-7.mono.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Inconsolata';
            src: url('https://dryjan.github.io/kalkulator/fonts/inconsolata-regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        #calculatorWindow table, #calculatorWindow td {
            border: 1px solid black;
            user-select: none;
        }
        #calculatorWindow td {
            text-align: center;
            width: 50px;
            height: 50px;
            font-size: 250%;
            font-family: 'Inconsolata';
        }
        #calculatorWindow td:hover {
            background-color: hsl(0, 0%, 90%);
        }
        #calculatorWindow #tdD {
            width: 209px;
            height: 50px;
            font-family: 'Digital-7';
            font-size: 300%;
        }
        #calculatorWindow #tdD:hover {
            background-color: white;
        }
        #calculatorWindow #td\\= {
            width: 50px;
            height: 103px;
        }
        #calculatorWindow #tdN {
            font-size: 175%;
        }
    `;

    // Append styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = calculatorStyles;
    document.head.appendChild(styleSheet);

    // Append calculator HTML to body
    document.body.insertAdjacentHTML('beforeend', calculatorHTML);

    // Calculator logic
    let displayedNum = '';
    let lastNum = '';
    let lastOp = '';
    let currentOp = '';
    let activeInput = null;

    function display() {
        const h = displayedNum.slice(0, 9);
        document.getElementById('tdD').innerText = h;
    }

    function tdNum(num) {
        if (currentOp) {
            lastNum = displayedNum;
            displayedNum = '';
            lastOp = currentOp;
            currentOp = '';
            if (lastOp === '=') {
                lastNum = '';
                lastOp = '';
            }
        }
        displayedNum += num;
        display();
    }

    function tdOp(op) {
        if (displayedNum) {
            if (currentOp === '=') {
                lastNum = '';
                lastOp = '';
            }
            currentOp = op;
            displayedNum = eval(lastNum + lastOp + displayedNum).toString();
            display();
        }
    }

    function tdEq() {
        if (((lastNum && !currentOp) || currentOp === '=') && !isNaN(parseFloat(displayedNum))) {
            if (currentOp) {
                displayedNum = eval(displayedNum + lastOp + lastNum).toString();
            } else {
                currentOp = '=';
                const h = displayedNum;
                displayedNum = eval(lastNum + lastOp + displayedNum).toString();
                lastNum = h;
            }
            display();
            // Insert result into input and hide calculator
            if (activeInput) {
                activeInput.value = displayedNum;
                document.getElementById('calculatorWindow').style.display = 'none';
                // Reset calculator
                displayedNum = '';
                lastNum = '';
                lastOp = '';
                currentOp = '';
                display();
            }
        }
    }

    function tdPoint() {
        if (!displayedNum.includes('.')) {
            if (currentOp) {
                lastNum = displayedNum;
                displayedNum = '';
                lastOp = currentOp;
                currentOp = '';
            }
            displayedNum += '.';
            display();
        }
    }

    function tdNeg() {
        if (displayedNum && !isNaN(parseFloat(displayedNum))) {
            displayedNum = (parseFloat(displayedNum) * -1).toString();
            display();
        }
    }

    function tdBack() {
        if (displayedNum && !currentOp) {
            displayedNum = displayedNum.slice(0, -1);
            display();
        }
    }

    function tdClear() {
        displayedNum = '';
        lastNum = '';
        lastOp = '';
        currentOp = '';
        display();
    }

    // Add event listeners to calculator buttons
    const nums = '1234567890';
    for (let i = 0; i < nums.length; i++) {
        const btn = document.getElementById('td' + nums[i]);
        if (btn) {
            btn.addEventListener('click', () => tdNum(nums[i]));
        }
    }

    const ops = '-+/*';
    for (let i = 0; i < ops.length; i++) {
        const btn = document.getElementById('td' + ops[i]);
        if (btn) {
            btn.addEventListener('click', () => tdOp(ops[i]));
        }
    }

    const eqBtn = document.getElementById('td=');
    if (eqBtn) {
        eqBtn.addEventListener('click', tdEq);
    }

    const pointBtn = document.getElementById('td.');
    if (pointBtn) {
        pointBtn.addEventListener('click', tdPoint);
    }

    const negBtn = document.getElementById('tdN');
    if (negBtn) {
        negBtn.addEventListener('click', tdNeg);
    }

    const backBtn = document.getElementById('tdB');
    if (backBtn) {
        backBtn.addEventListener('click', tdBack);
    }

    const clearBtn = document.getElementById('tdC');
    if (clearBtn) {
        clearBtn.addEventListener('click', tdClear);
    }

    // Add close button functionality
    const closeBtn = document.getElementById('closeCalculator');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('calculatorWindow').style.display = 'none';
            // Reset calculator
            displayedNum = '';
            lastNum = '';
            lastOp = '';
            currentOp = '';
            display();
        });
    }

    // Add click event listener to all inputs
    function addCalculatorTrigger() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            // Skip if already has the event listener to avoid duplicates
            if (!input.dataset.calculatorAttached) {
                input.addEventListener('click', () => {
                    activeInput = input;
                    document.getElementById('calculatorWindow').style.display = 'block';
                    // Initialize with input value if valid number
                    if (!isNaN(parseFloat(input.value))) {
                        displayedNum = input.value;
                        display();
                    } else {
                        displayedNum = '';
                        lastNum = '';
                        lastOp = '';
                        currentOp = '';
                        display();
                    }
                });
                input.dataset.calculatorAttached = 'true';
            }
        });
    }

    // Initialize on script execution
    addCalculatorTrigger();

    // Observe DOM changes to handle dynamically added inputs
    const observer = new MutationObserver(addCalculatorTrigger);
    observer.observe(document.body, { childList: true, subtree: true });
})();
