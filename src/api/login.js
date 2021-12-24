import request from '../utils/request';

export const loginApi = data => request.post('/api/private/v1/login', { data: data });
