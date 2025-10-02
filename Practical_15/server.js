const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: 'library-portal-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    const { name } = req.body;

    if (name && name.trim()) {
        req.session.user = {
            name: name.trim(),
            loginTime: new Date().toLocaleString()
        };
        res.redirect('/profile');
    } else {
        res.render('login', { error: 'Please enter your name' });
    }
});

app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

app.listen(PORT, () => {
    console.log(`Library Portal running on http://localhost:${PORT}`);
});