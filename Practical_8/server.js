const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Data storage
const dataFile = 'counter-data.json';

// Helper functions
function loadCounter() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data).counter || 0;
        }
    } catch (error) {
        console.error('Error loading counter:', error);
    }
    return 0;
}

function saveCounter(count) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify({ counter: count }));
    } catch (error) {
        console.error('Error saving counter:', error);
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/counter', (req, res) => {
    const counter = loadCounter();
    res.json({ counter });
});

app.post('/api/counter/increase', (req, res) => {
    let counter = loadCounter();
    counter++;
    saveCounter(counter);
    res.json({ counter });
});

app.post('/api/counter/decrease', (req, res) => {
    let counter = loadCounter();
    if (counter > 0) {
        counter--;
    }
    saveCounter(counter);
    res.json({ counter });
});

app.post('/api/counter/reset', (req, res) => {
    saveCounter(0);
    res.json({ counter: 0 });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});