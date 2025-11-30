import { request } from './httpClient';

export const VideosAPI = {
	list: (token, params = {}) => {
		const query = new URLSearchParams(params).toString();
		const suffix = query ? `?${query}` : '';
		return request(`/videos${suffix}`, { token });
	},
	create: (payload, token) => request('/videos', { method: 'POST', body: payload, token }),
	get: (id, token) => request(`/videos/${id}`, { token }),
	update: (id, payload, token) => request(`/videos/${id}`, { method: 'PATCH', body: payload, token }),
	delete: (id, token) => request(`/videos/${id}`, { method: 'DELETE', token }),
};
