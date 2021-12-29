import request from '../../utils/request';

export const userTable = params => request.get('/api/private/v1/users', { params: params });

export const roleList = () => request.get('/api/private/v1/roles');
