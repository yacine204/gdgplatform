const courseDao = require('../1-dao/course');
const VideoDao = require('../1-dao/video');

const toPlain = (instance) => (typeof instance?.get === 'function' ? instance.get({ plain: true }) : instance);

const ensureOwner = (course, userId) => course && Number(course.ownerId) === Number(userId);

const courseController = {
	async listCourses(req, res) {
		try {
			const courses = await courseDao.findAll({ order: [['createdAt', 'DESC']] });
			return res.status(200).json(courses.map(toPlain));
		} catch (err) {
			console.error('List courses failed', err);
			return res.status(500).json({ message: 'Server error' });
		}
	},

	async createCourse(req, res) {
		try {
			const ownerId = req.user?.id || req.body.ownerId;
			const { title, description } = req.body || {};

			if (!ownerId || !title) {
				return res.status(400).json({ message: 'ownerId and title are required' });
			}

			const course = await courseDao.create({ title, description, ownerId });
			return res.status(201).json(course);
		} catch (err) {
			console.error('Create course failed', err);
			return res.status(500).json({ message: 'Server error' });
		}
	},

	async updateCourse(req, res) {
		try {
			const { id } = req.params;
			const ownerId = req.user?.id || req.body.ownerId;
			const updates = { ...req.body };

			if (!id || !ownerId) {
				return res.status(400).json({ message: 'id and ownerId are required' });
			}

			const existing = await courseDao.findById(id);
			if (!existing || !ensureOwner(existing, ownerId)) {
				return res.status(404).json({ message: 'Course not found or unauthorized' });
			}

			delete updates.ownerId;
			const { course } = await courseDao.update(id, updates);
			return res.status(200).json(course ?? (await courseDao.findById(id)));
		} catch (err) {
			console.error('Update course failed', err);
			return res.status(500).json({ message: 'Server error' });
		}
	},

	async deleteCourse(req, res) {
		try {
			const { id } = req.params;
			const ownerId = req.user?.id || req.body.ownerId;

			if (!id || !ownerId) {
				return res.status(400).json({ message: 'id and ownerId are required' });
			}

			const course = await courseDao.findById(id);
			if (!course || !ensureOwner(course, ownerId)) {
				return res.status(404).json({ message: 'Course not found or unauthorized' });
			}

			await courseDao.remove(id);
			return res.status(204).send();
		} catch (err) {
			console.error('Delete course failed', err);
			return res.status(500).json({ message: 'Server error' });
		}
	},

	async getCourse(req, res) {
		try {
			const { id } = req.params;
			const requesterId = req.user?.id;
			const role = req.user?.role;

			const course = await courseDao.findById(id);
			if (!course) {
				return res.status(404).json({ message: 'Course not found' });
			}

			const isAdmin = role === 'admin';
			const isOwner = ensureOwner(course, requesterId);
			const videoFilters = {
				where: {
					courseId: id,
					...(isAdmin || isOwner ? {} : { isPublic: true }),
				},
				order: [['createdAt', 'ASC']],
			};

			const videos = await VideoDao.list(videoFilters);
			const payload = toPlain(course);
			payload.videos = videos.map(toPlain);
			return res.status(200).json(payload);
		} catch (err) {
			console.error('Get course failed', err);
			return res.status(500).json({ message: 'Server error' });
		}
	},
};

module.exports = courseController;
