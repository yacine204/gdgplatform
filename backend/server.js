require('dotenv').config();

const express = require('express');
const cors = require('cors');

const userRoutes = require('./3-route/users.routes');
const courseRoutes = require('./3-route/course.routes');
const videoRoutes = require('./3-route/video.routes');
const { initializeDatabase } = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database', err);
        process.exit(1);
    });