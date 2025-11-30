const { Course } = require('../db/db');

const courseDao = {
	async create(payload) {
		try {
			return await Course.create(payload);
		} catch (err) {
			console.error('Failed to create course', err);
			throw err;
		}
	},

	async update(id, updates) {
		try {
			const [count, rows] = await Course.update(updates, {
				where: { id },
				returning: true,
			});
			return { count, course: rows?.[0] };
		} catch (err) {
			console.error('Failed to update course', err);
			throw err;
		}
	},

	async remove(id) {
		try {
			return await Course.destroy({ where: { id } });
		} catch (err) {
			console.error('Failed to delete course', err);
			throw err;
		}
	},

	async findById(id, options = {}) {
		try {
			return await Course.findByPk(id, options);
		} catch (err) {
			console.error('Failed to find course', err);
			throw err;
		}
	},

	async findAll(options = {}) {
		try {
			return await Course.findAll(options);
		} catch (err) {
			console.error('Failed to list courses', err);
			throw err;
		}
	},
};

module.exports = courseDao;
