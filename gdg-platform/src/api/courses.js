import { request } from './httpClient';

export const CoursesAPI = {
	list: (token) => request('/courses', { token }),
	create: (payload, token) => request('/courses', { method: 'POST', body: payload, token }),
	get: (id, token) => request(`/courses/${id}`, { token }),
	update: (id, payload, token) => request(`/courses/${id}`, { method: 'PATCH', body: payload, token }),
	delete: (id, token) => request(`/courses/${id}`, { method: 'DELETE', token }),
};
