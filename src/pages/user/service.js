import request from '../../utils/request';

export const userTable = params => request.get('/api/private/v1/users', { params: params });
