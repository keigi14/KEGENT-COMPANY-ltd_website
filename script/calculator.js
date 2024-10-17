// script.js

let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;

const numberButtons = document.querySelectorAll('.btn[data-number]');
const operatorButtons = document.querySelectorAll('.btn[data-operator]');
const equalsButton = document.getElementById('equalsBtn');
const clearButton = document.getElementById('clearBtn');
const deleteButton = document.getElementById('deleteBtn');
const pointButton = document.getElementById('pointBtn');
const lastOperationScreen = document.getElementById('lastOperationScreen');
const currentOperationScreen = document.getElementById('currentOperationScreen');

// Add event listeners
numberButtons.forEach((button) => {
  button.addEventListener('click', () => appendNumber(button.textContent));
});

operatorButtons.forEach((button) => {
  button.addEventListener('click', () => setOperation(button.textContent));
});

equalsButton.addEventListener('click', performEvaluation);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
pointButton.addEventListener('click', appendPoint);

// Keyboard input event listener
window.addEventListener('keydown', handleKeyboardInput);

function appendNumber(number) {
  if (currentOperationScreen.textContent === '0' || shouldResetScreen)
    resetScreen();
  currentOperationScreen.textContent += number;
}

function resetScreen() {
  currentOperationScreen.textContent = '';
  shouldResetScreen = false;
}

function clear() {
  currentOperationScreen.textContent = '0';
  lastOperationScreen.textContent = '';
  firstOperand = '';
  secondOperand = '';
  currentOperation = null;
}

function appendPoint() {
  if (shouldResetScreen) resetScreen();
  if (currentOperationScreen.textContent === '') currentOperationScreen.textContent = '0';
  if (currentOperationScreen.textContent.includes('.')) return;
  currentOperationScreen.textContent += '.';
}

function deleteNumber() {
  currentOperationScreen.textContent = currentOperationScreen.textContent.toString().slice(0, -1);
}

function setOperation(operator) {
  if (currentOperation !== null) performEvaluation();
  firstOperand = currentOperationScreen.textContent;
  currentOperation = operator;
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`;
  shouldResetScreen = true;
}

function performEvaluation() {
  if (currentOperation === null || shouldResetScreen) return;
  if (currentOperation === '÷' && currentOperationScreen.textContent === '0') {
    alert("You can't divide by 0!");
    return;
  }
  secondOperand = currentOperationScreen.textContent;
  currentOperationScreen.textContent = roundResult(
    operate(currentOperation, firstOperand, secondOperand)
  );
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`;
  currentOperation = null;

  // Log the calculation to the backend (ensure this is working)
  logCalculation(
    `${firstOperand} ${currentOperation} ${secondOperand} = ${currentOperationScreen.textContent}`
  );
}


function logCalculation(calculation) {
  fetch('http://localhost:3000/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ calculation }),
  })
    .then((response) => response.json())
    .then((data) => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}


function roundResult(number) {
  return Math.round(number * 1000) / 1000;
}

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === '.') appendPoint();
  if (e.key === '=' || e.key === 'Enter') performEvaluation();
  if (e.key === 'Backspace') deleteNumber();
  if (e.key === 'Escape') clear();
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/')
    setOperation(convertOperator(e.key));
}

function convertOperator(keyboardOperator) {
  if (keyboardOperator === '/') return '÷';
  if (keyboardOperator === '*') return '×';
  if (keyboardOperator === '-') return '−';
  if (keyboardOperator === '+') return '+';
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+':
      return add(a, b);
    case '−':
      return subtract(a, b);
    case '×':
      return multiply(a, b);
    case '÷':
      if (b === 0) return null;
      else return divide(a, b);
    default:
      return null;
  }
}
// Existing calculator code ...
	
	 // Add event listener for the History button
	 const historyButton = document.getElementById('historyBtn');
	 historyButton.addEventListener('click', fetchHistory);
	
	 // Fetch history from the backend
	 function fetchHistory() {
	   fetch('http://localhost:3000/history')
	       .then(response => response.json())
	           .then(data => {
	                 console.log('Calculation history:', data.calculations);
	                       displayHistory(data.calculations);
	                           })
	                               .catch(error => {
	                                     console.error('Error fetching history:', error);
	                                         });
	                                         }
	
	                                         // Display history in an alert box or console
	                                         function displayHistory(calculations) {
	                                           let historyText = 'Calculation History:\n';
	                                             calculations.forEach(calc => {
	                                                 historyText += `${calc.operation} = ${calc.result} (at ${new Date(calc.timestamp).toLocaleTimeString()})\n`;
	                                                   });
	                                                     alert(historyText);
	             }
