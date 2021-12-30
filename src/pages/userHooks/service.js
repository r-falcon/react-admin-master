import request from '../../utils/request';

export const userTable = params => request.get('/api/private/v1/users', { params: params });

export const roleList = () => request.get('/api/private/v1/roles');

export const addUser = data => request.post('/api/private/v1/users', { data: data });

export const editUser = (id, data) => request.put(`/api/private/v1/users/${id}`, { data: data });

export const changeStatus = (id, type) => request.put(`/api/private/v1/users/${id}/state/${type}`);

export const deleteUser = id => request.delete(`/api/private/v1/users/${id}`);
