const { Video } = require('../db/db');

const VideoDao = {
    async create(payload) {
        try {
            return await Video.create(payload);
        } catch (err) {
            console.error('Failed to create video', err);
            throw err;
        }
    },

    async update(criteria, updates) {
        try {
            return await Video.update(updates, { where: criteria, returning: true });
        } catch (err) {
            console.error('Failed to update video', err);
            throw err;
        }
    },

    async getBy(criteria) {
        try {
            return await Video.findOne({ where: criteria });
        } catch (err) {
            console.error('Failed to find video', err);
            throw err;
        }
    },

    async list(options = {}) {
        try {
            return await Video.findAll(options);
        } catch (err) {
            console.error('Failed to list videos', err);
            throw err;
        }
    },

    async delete(criteria) {
        try {
            return await Video.destroy({ where: criteria });
        } catch (err) {
            console.error('Failed to delete video', err);
            throw err;
        }
    },
};

module.exports = VideoDao;