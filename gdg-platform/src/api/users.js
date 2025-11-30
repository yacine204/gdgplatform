import { request } from './httpClient';

export const UsersAPI = {
	register: (payload) => request('/users/register', { method: 'POST', body: payload }),
	login: (payload) => request('/users/login', { method: 'POST', body: payload }),
	list: (token) => request('/users', { token }),
	get: (id, token) => request(`/users/${id}`, { token }),
	update: (id, payload, token) => request(`/users/${id}`, { method: 'PATCH', body: payload, token }),
	delete: (id, token) => request(`/users/${id}`, { method: 'DELETE', token }),
};
