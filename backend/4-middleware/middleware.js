const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

const authenticate = (req, res, next) => {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) {
		return res.status(401).json({ message: 'Missing authorization token' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = {
			id: decoded.sub,
			email: decoded.email,
			role: decoded.role,
		};
		return next();
	} catch (err) {
		console.error('Auth token invalid', err);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

const optionalAuth = (req, res, next) => {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) {
		return next();
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = {
			id: decoded.sub,
			email: decoded.email,
			role: decoded.role,
		};
		return next();
	} catch (err) {
		console.error('Optional auth token invalid', err);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

const requireRole = (...allowedRoles) => {
	return (req, res, next) => {
		const role = req.user?.role;
		if (!role) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		if (!allowedRoles.includes(role)) {
			return res.status(403).json({ message: 'Insufficient role' });
		}
		next();
	};
};

module.exports = { authenticate, optionalAuth, requireRole };
