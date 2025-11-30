const express = require('express');
const crypto = require('crypto');

const router = express.Router();


const admins = new Map();
const activeTokens = new Map();

router.post('/register', (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (admins.has(email)) {
        return res.status(409).json({ message: 'Admin already exists.' });
    }

    admins.set(email, { email, password });
    return res.status(201).json({ message: 'Admin registered successfully.' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = admins.get(email);
    if (!admin || admin.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = crypto.randomUUID();
    activeTokens.set(token, email);

    return res.status(200).json({ message: 'Login successful.', token });
});

router.post('/logout', (req, res) => {
    const { token } = req.body || {};

    if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
    }

    if (!activeTokens.has(token)) {
        return res.status(401).json({ message: 'Invalid token.' });
    }

    activeTokens.delete(token);
    return res.status(200).json({ message: 'Logout successful.' });
});

module.exports = router;
