const resolveDefaultApiUrl = () => {
	if (import.meta.env.VITE_API_URL) {
		return import.meta.env.VITE_API_URL;
	}
	if (typeof window !== 'undefined') {
		const { hostname } = window.location;
		if (hostname === 'localhost' || hostname === '127.0.0.1') {
			return 'http://localhost:3000/api';
		}
	}
	return 'https://express-js-on-vercel-wine-one-57.vercel.app/api';
};

const API_BASE_URL = resolveDefaultApiUrl();

const parseResponse = async (response) => {
	if (response.status === 204) {
		return null;
	}

	const text = await response.text();
	if (!text) {
		return null;
	}

	try {
		return JSON.parse(text);
	} catch (err) {
		console.error('Failed to parse response', err);
		return null;
	}
};

export const request = async (path, { method = 'GET', body, token, headers = {} } = {}) => {
	const config = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
	};

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	if (body && method !== 'GET') {
		config.body = JSON.stringify(body);
	}

	const response = await fetch(`${API_BASE_URL}${path}`, config);
	const data = await parseResponse(response);

	if (!response.ok) {
		const error = new Error(data?.message || 'Request failed');
		error.status = response.status;
		throw error;
	}

	return data;
};
