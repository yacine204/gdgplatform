const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false,
		ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
	}
);

const User = sequelize.define('User', {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	passwordHash: { type: DataTypes.STRING, allowNull: false },
	role: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'user',
		validate: {
			isIn: [['user','admin']],
		},
	},
});

const UserSession = sequelize.define('UserSession', {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	tokenHash: { type: DataTypes.STRING, allowNull: false },
	expiresAt: { type: DataTypes.DATE, allowNull: false },
});

const Video = sequelize.define('Video', {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	title: { type: DataTypes.STRING, allowNull: false },
	videoUrl: { type: DataTypes.STRING, allowNull: false },
	thumbnailUrl: { type: DataTypes.STRING },
	isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const Course = sequelize.define('Course', {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.TEXT },
});

UserSession.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(UserSession, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

Course.belongsTo(User, { as: 'owner', foreignKey: { name: 'ownerId', allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(Course, { as: 'courses', foreignKey: 'ownerId' });

Video.belongsTo(Course, { foreignKey: { name: 'courseId', allowNull: false }, onDelete: 'CASCADE' });
Course.hasMany(Video, { as: 'videos', foreignKey: 'courseId' });

const initializeDatabase = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		console.log('Database synced via Sequelize');
	} catch (err) {
		console.error('Sequelize init failed', err);
		throw err;
	}
};

module.exports = {
	sequelize,
	initializeDatabase,
	User,
	UserSession,
	Course,
	Video,
};
