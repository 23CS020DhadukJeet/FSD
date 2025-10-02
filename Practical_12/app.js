const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index', { result: null, error: null });
});

app.post('/calculate', (req, res) => {
    const { number1, number2, operation } = req.body;

    // Input validation
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    if (isNaN(num1) || isNaN(num2)) {
        return res.render('index', {
            result: null,
            error: 'Please enter valid numbers only!'
        });
    }

    let result;
    let error = null;

    try {
        switch (operation) {
            case 'add':
                result = num1 + num2;
                break;
            case 'subtract':
                result = num1 - num2;
                break;
            case 'multiply':
                result = num1 * num2;
                break;
            case 'divide':
                if (num2 === 0) {
                    error = 'Cannot divide by zero!';
                } else {
                    result = num1 / num2;
                }
                break;
            default:
                error = 'Please select an operation!';
        }

        // Round result to 2 decimal places if needed
        if (result !== undefined && !Number.isInteger(result)) {
            result = Math.round(result * 100) / 100;
        }

    } catch (err) {
        error = 'Something went wrong. Please try again!';
    }

    res.render('index', { result, error });
});

app.listen(PORT, () => {
    console.log(`Kids Calculator running on http://localhost:${PORT}`);
});