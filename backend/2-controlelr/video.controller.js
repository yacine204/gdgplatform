const VideoDao = require('../1-dao/video');
const courseDao = require('../1-dao/course');

const ensureCourseOwner = (course, userId) => course && Number(course.ownerId) === Number(userId);

const videoController = {
    async listVideos(req, res) {
        try {
            const ownerId = req.user?.id;
            const isAdmin = req.user?.role === 'admin';
            const { courseId } = req.query || {};

            if (isAdmin) {
                const where = courseId ? { courseId } : {};
                const videos = await VideoDao.list({ where });
                return res.status(200).json(videos);
            }

            if (!courseId) {
                return res.status(400).json({ message: 'courseId is required for viewers.' });
            }

            const course = await courseDao.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const isOwner = ensureCourseOwner(course, ownerId);
            const videos = await VideoDao.list({
                where: {
                    courseId,
                    ...(isOwner ? {} : { isPublic: true }),
                },
            });
            return res.status(200).json(videos);
        } catch (err) {
            console.error('List videos failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async createVideo(req, res) {
        try {
            const ownerId = req.user?.id;
            const { title, videoUrl, thumbnailUrl, isPublic = false, courseId } = req.body || {};

            if (!ownerId || !title || !videoUrl || !courseId) {
                return res.status(400).json({ message: 'owner, title, videoUrl, and courseId are required' });
            }

            const course = await courseDao.findById(courseId);
            if (!course || !ensureCourseOwner(course, ownerId)) {
                return res.status(404).json({ message: 'Course not found or unauthorized' });
            }

            const video = await VideoDao.create({ title, videoUrl, thumbnailUrl, isPublic, courseId });
            return res.status(201).json(video);
        } catch (err) {
            console.error('Create video failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async updateVideo(req, res) {
        try {
            const { id } = req.params;
            const ownerId = req.user?.id;
            const updates = { ...req.body };

            if (!id || !ownerId) {
                return res.status(400).json({ message: 'id and authenticated user are required' });
            }

            const video = await VideoDao.getBy({ id });
            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }

            const course = await courseDao.findById(video.courseId);
            if (!ensureCourseOwner(course, ownerId)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            if (updates.courseId && updates.courseId !== video.courseId) {
                const newCourse = await courseDao.findById(updates.courseId);
                if (!ensureCourseOwner(newCourse, ownerId)) {
                    return res.status(403).json({ message: 'Unauthorized to move video to target course' });
                }
            }

            const [count, rows] = await VideoDao.update({ id }, updates);
            if (!count) {
                return res.status(404).json({ message: 'Video not found' });
            }
            return res.status(200).json(rows?.[0] ?? (await VideoDao.getBy({ id })));
        } catch (err) {
            console.error('Update video failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async deleteVideo(req, res) {
        try {
            const { id } = req.params;
            const ownerId = req.user?.id;

            if (!id || !ownerId) {
                return res.status(400).json({ message: 'id and authenticated user are required' });
            }

            const video = await VideoDao.getBy({ id });
            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }

            const course = await courseDao.findById(video.courseId);
            if (!ensureCourseOwner(course, ownerId)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            await VideoDao.delete({ id });
            return res.status(204).send();
        } catch (err) {
            console.error('Delete video failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async getVideo(req, res) {
        try {
            const { id } = req.params;
            const ownerId = req.user?.id;
            const isAdmin = req.user?.role === 'admin';
            const video = await VideoDao.getBy({ id });
            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }

            if (!isAdmin) {
                const course = await courseDao.findById(video.courseId);
                const isOwner = ensureCourseOwner(course, ownerId);
                if (!isOwner && !video.isPublic) {
                    return res.status(403).json({ message: 'Unauthorized' });
                }
            }

            return res.status(200).json(video);
        } catch (err) {
            console.error('Get video failed', err);
            return res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = videoController;