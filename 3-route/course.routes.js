const express = require('express');
const courseController = require('../2-controlelr/course.controller');
const { authenticate, requireRole } = require('../4-middleware/middleware');

const router = express.Router();

router.get('/', authenticate, courseController.listCourses);
router.post('/', authenticate, requireRole('admin'), courseController.createCourse);
router.get('/:id', authenticate, courseController.getCourse);
router.patch('/:id', authenticate, requireRole('admin'), courseController.updateCourse);
router.delete('/:id', authenticate, requireRole('admin'), courseController.deleteCourse);

module.exports = router;
