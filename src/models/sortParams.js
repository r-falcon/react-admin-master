import { message } from 'antd';
import { goodsSort } from '@/services/common';

export default {
  namespace: 'sortParams',

  state: {
    sortOptions: [],
    sortFieldProps: {
      label: 'cat_name',
      value: 'cat_id',
      children: 'children',
    },
  },

  reducers: {
    showOptions(state, { sortOptions }) {
      return { ...state, sortOptions };
    },
  },

  effects: {
    *getSortOptions(payload, { call, put, select }) {
      const res = yield call(goodsSort, payload.params);
      const sortOptions = res.data;
      yield put({
        type: 'showOptions',
        sortOptions,
      });
    },
  },
};
