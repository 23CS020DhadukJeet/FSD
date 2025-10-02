const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Tax calculation function
function calculateTax(income) {
    let tax = 0;
    let taxRate = 0;

    // Progressive tax brackets (simplified example)
    if (income <= 10000) {
        tax = 0;
        taxRate = 0;
    } else if (income <= 40000) {
        tax = (income - 10000) * 0.10;
        taxRate = 10;
    } else if (income <= 85000) {
        tax = 3000 + (income - 40000) * 0.22;
        taxRate = 22;
    } else if (income <= 160000) {
        tax = 12900 + (income - 85000) * 0.24;
        taxRate = 24;
    } else {
        tax = 30900 + (income - 160000) * 0.32;
        taxRate = 32;
    }

    return { tax, taxRate };
}

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        totalIncome: null,
        taxAmount: null,
        taxRate: null,
        finalIncome: null,
        errors: null,
        income1: '',
        income2: ''
    });
});

app.post('/calculate', (req, res) => {
    const { income1, income2 } = req.body;
    const errors = [];

    // Validate inputs
    if (!income1 || income1.trim() === '') {
        errors.push('Income Source 1 is required');
    }

    if (!income2 || income2.trim() === '') {
        errors.push('Income Source 2 is required');
    }

    const num1 = parseFloat(income1);
    const num2 = parseFloat(income2);

    if (income1 && (isNaN(num1) || num1 < 0)) {
        errors.push('Income Source 1 must be a valid positive number');
    }

    if (income2 && (isNaN(num2) || num2 < 0)) {
        errors.push('Income Source 2 must be a valid positive number');
    }

    if (errors.length > 0) {
        return res.render('index', {
            totalIncome: null,
            taxAmount: null,
            taxRate: null,
            finalIncome: null,
            errors,
            income1: income1 || '',
            income2: income2 || ''
        });
    }

    // Calculate total income on server side
    const totalIncome = num1 + num2;

    // Calculate tax
    const { tax, taxRate } = calculateTax(totalIncome);
    const finalIncome = totalIncome - tax;

    res.render('index', {
        totalIncome: totalIncome.toFixed(2),
        taxAmount: tax.toFixed(2),
        taxRate: taxRate,
        finalIncome: finalIncome.toFixed(2),
        errors: null,
        income1,
        income2
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});