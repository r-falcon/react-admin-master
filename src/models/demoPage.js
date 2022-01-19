import { message } from 'antd';

export default {
  // 命名空间为string,且唯一;models有多个model,通过命名空间区分
  namespace: 'demoPage',

  // 里面定义一些默认值.[key|value]的格式
  state: {
    num: 3,
    newStr: '123',
  },

  // 更新state的唯一地方,处理同步操作,把新的state给return出去.官方推荐处理逻辑放在effects中
  reducers: {
    // 方法接收2个参数,第一个是旧的state,第二个是action,没有可以不写或写_
    addNum(state, _) {
      return { ...state, num: state.num + 1 };
    },

    subNum(state, _) {
      return { ...state, num: state.num - 1 };
    },

    showSomething(state, { newStr }) {
      return { ...state, newStr };
    },
  },

  // effects处理异步,用于与后台交互获取数据.数据逻辑处理也在此进行,处理完给reducers
  effects: {
    /**
     * 方法接收2个参数，第一个是传过来的action(没有可以写 _ )，第二个基本是用其中call, put, select这3个参数
     * call,用来写与后台的交互
     * put,用来触发reducers中方法，与dispatch功能一样
     * select,用来选择models层所有model里state的数据
     */
    *clickShow({ who }, { call, put, select }) {
      // const num = yield select((state) => state.testPage.num) //select选择state数据
      // const resp = yield call(service.shoppingWZ,{name:who,age:33}); //带参请求后台数据
      // const resp = yield call(service.shoppingWZ);
      const newStr = who + ' hello world';
      // 触发reducers方法
      yield put({
        type: 'showSomething',
        newStr,
      });
      message.success('设置参数成功');
    },
  },

  subscriptions: {
    setup({ dispatch, history, query, store }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/goods/demo') {
          const newStr = 'love and peace';
          dispatch({
            type: 'showSomething',
            newStr,
          });
        }
      });
    },
  },
};
