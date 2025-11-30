const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
