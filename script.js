class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.currentOperand === '') {
            this.currentOperandTextElement.innerText = '0';
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        }

        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-action="number"]');
const operationButtons = document.querySelectorAll('[data-action="operator"]');
const equalsButton = document.getElementById('equals');
const deleteButton = document.getElementById('delete');
const clearButton = document.getElementById('clear');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Add visual feedback for keyboard input
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
        simulateClick(equalsButton);
    } else if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        simulateClick(deleteButton);
    } else if (key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
        simulateClick(clearButton);
    } else if (['+', '-', '*', '/'].includes(key)) {
        let op = key;
        if (key === '*') op = '×';
        if (key === '/') op = '÷';
        calculator.chooseOperation(op);
        calculator.updateDisplay();

        operationButtons.forEach(button => {
            if (button.innerText === op) simulateClick(button);
        });
    } else if (/[0-9.]/.test(key)) {
        calculator.appendNumber(key);
        calculator.updateDisplay();

        numberButtons.forEach(button => {
            if (button.innerText === key) simulateClick(button);
        });
    }
});

function simulateClick(element) {
    if (!element) return;
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 100);
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Initialize display
calculator.updateDisplay();

// --- Fire Canvas Animation Logic ---
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 30 + 10;
        this.speedY = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        // Oranges, reds, yellows
        this.color = `hsla(${Math.random() * 40}, 100%, 60%, ${Math.random() * 0.4 + 0.1})`;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.life -= this.decay;
        this.size *= 0.95;
    }
    draw() {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Remove dead particles
        if (particles[i].life <= 0 || particles[i].size <= 0.5) {
            particles.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    ctx.globalCompositeOperation = 'source-over';
    // Dark transparent background to create trail effect
    ctx.fillStyle = 'rgba(10, 1, 1, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add new particles each frame up to a limit
    if (particles.length < 200) {
        for (let i = 0; i < 4; i++) {
            particles.push(new Particle());
        }
    }

    handleParticles();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
