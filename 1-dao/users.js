const { User } = require('../db/db');

const usersDao = {
    async create(payload) {
        try {
            return await User.create(payload);
        } catch (err) {
            console.error('Failed to create user', err);
            throw err;
        }
    },

    async findBy(criteria) {
        try {
            return await User.findOne({ where: criteria });
        } catch (err) {
            console.error('Failed to find user', err);
            throw err;
        }
    },

    async findAll(criteria = {}) {
        try {
            return await User.findAll({ where: criteria });
        } catch (err) {
            console.error('Failed to list users', err);
            throw err;
        }
    },

    async update(criteria, updates) {
        try {
            return await User.update(updates, { where: criteria, returning: true });
        } catch (err) {
            console.error('Failed to update user', err);
            throw err;
        }
    },

    async remove(criteria) {
        try {
            return await User.destroy({ where: criteria });
        } catch (err) {
            console.error('Failed to delete user', err);
            throw err;
        }
    },
};

module.exports = usersDao;