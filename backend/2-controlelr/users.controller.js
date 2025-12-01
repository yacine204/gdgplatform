const jwt = require('jsonwebtoken');
const usersDao = require('../1-dao/users.js');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const serializeUser = (userInstance) => {
    if (!userInstance) return null;
    const plain = typeof userInstance.get === 'function' ? userInstance.get({ plain: true }) : userInstance;
    delete plain.passwordHash;
    return plain;
};

const issueToken = (userInstance) => {
    const payload = { sub: userInstance.id, role: userInstance.role };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const usersController = {
    async createUser(req, res) {
        try {
            const { email, password, role  } = req.body || {};
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            const existing = await usersDao.findBy({ email });
            if (existing) {
                return res.status(409).json({ message: 'User already exists.' });
            }

            const created = await usersDao.create({ email, passwordHash: password, role });
            return res.status(201).json({ user: serializeUser(created), token: issueToken(created) });
        } catch (err) {
            console.error('Create user failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async loginUser(req, res) {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            const user = await usersDao.findBy({ email });
            if (!user || user.passwordHash !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            return res.status(200).json({ user: serializeUser(user), token: issueToken(user) });
        } catch (err) {
            console.error('Login failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async listUsers(_req, res) {
        try {
            const users = await usersDao.findAll();
            return res.status(200).json(users.map(serializeUser));
        } catch (err) {
            console.error('List users failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await usersDao.findBy({ id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(serializeUser(user));
        } catch (err) {
            console.error('Get user failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updates = { ...req.body };

            if (!Object.keys(updates).length) {
                return res.status(400).json({ message: 'No updates provided' });
            }

            if (updates.password) {
                updates.passwordHash = updates.password;
                delete updates.password;
            }

            const [count, rows] = await usersDao.update({ id }, updates);
            if (!count) {
                return res.status(404).json({ message: 'User not found' });
            }

            const updated = Array.isArray(rows) && rows.length ? rows[0] : await usersDao.findBy({ id });
            return res.status(200).json(serializeUser(updated));
        } catch (err) {
            console.error('Update user failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await usersDao.remove({ id });
            if (!deleted) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(204).send();
        } catch (err) {
            console.error('Delete user failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = usersController;