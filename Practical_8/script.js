class RepCounter {
    constructor() {
        this.counter = 0;
        this.counterElement = document.getElementById('counter');
        this.increaseBtn = document.getElementById('increase');
        this.decreaseBtn = document.getElementById('decrease');
        this.resetBtn = document.getElementById('reset');

        this.init();
    }

    init() {
        // Load saved counter value from localStorage
        this.loadCounter();

        // Add event listeners
        this.increaseBtn.addEventListener('click', () => this.increase());
        this.decreaseBtn.addEventListener('click', () => this.decrease());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Add keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Update display
        this.updateDisplay();
    }

    increase() {
        this.counter++;
        this.updateDisplay();
        this.saveCounter();
        this.animateButton(this.increaseBtn);
    }

    decrease() {
        if (this.counter > 0) {
            this.counter--;
            this.updateDisplay();
            this.saveCounter();
        }
        this.animateButton(this.decreaseBtn);
    }

    reset() {
        this.counter = 0;
        this.updateDisplay();
        this.saveCounter();
        this.animateButton(this.resetBtn);
    }

    updateDisplay() {
        this.counterElement.textContent = this.counter;

        // Add visual feedback for counter changes
        this.counterElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.counterElement.style.transform = 'scale(1)';
        }, 150);
    }

    saveCounter() {
        localStorage.setItem('gymRepCounter', this.counter.toString());
    }

    loadCounter() {
        const saved = localStorage.getItem('gymRepCounter');
        if (saved !== null) {
            this.counter = parseInt(saved, 10) || 0;
        }
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }

    handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
            case '+':
                e.preventDefault();
                this.increase();
                break;
            case 'ArrowDown':
            case '-':
                e.preventDefault();
                this.decrease();
                break;
            case 'r':
            case 'R':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.reset();
                }
                break;
        }
    }
}

// Initialize the counter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RepCounter();
});