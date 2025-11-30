const express = require('express');
const videoController = require('../2-controlelr/video.controller');
const { authenticate } = require('../4-middleware/middleware');

const router = express.Router();

router.get('/', authenticate, videoController.listVideos);
router.post('/', authenticate, videoController.createVideo);
router.get('/:id', authenticate, videoController.getVideo);
router.patch('/:id', authenticate, videoController.updateVideo);
router.delete('/:id', authenticate, videoController.deleteVideo);

module.exports = router;
