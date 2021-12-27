import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getLocalUser, setLocalUser, setToken, setUserInfo } from '../../utils/auth';
import { loginApi } from '../../api/login';
import router from 'umi/router';
class Login extends React.Component {
  state = {
    IPT_RULE_USERNAME: [
      {
        required: true,
        message: '请输入用户名:admin',
      },
    ],
    IPT_RULE_PASSWORD: [
      {
        required: true,
        message: '请输入密码:123456',
      },
    ],
  };

  onFinish = values => {
    const { username, password } = values;
    setLocalUser({ username: username, password: password, remember: values.remember });
    loginApi({ username: username, password: password })
      .then(res => {
        setToken(res.data.token);
        setUserInfo(res.data);
        message.success(res.meta.msg);
        router.push('/');
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className={styles.loginBox}>
        <div className={styles.wrapper}>
          <div className={styles.title}>umi-dva-antd</div>
          <div className={styles.welcome}>欢迎使用，请先登录</div>

          <Form
            className={styles.formBox}
            initialValues={getLocalUser().remember === true ? getLocalUser() : { remember: false }}
            onFinish={this.onFinish}
          >
            <Form.Item name="username" rules={this.state.IPT_RULE_USERNAME}>
              <Input prefix={<UserOutlined />} placeholder="账号：admin" />
            </Form.Item>
            <Form.Item name="password" rules={this.state.IPT_RULE_PASSWORD}>
              <Input prefix={<LockOutlined />} placeholder="密码：123456" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Form.Item style={{ marginTop: '10px' }}>
              <Button type="primary" htmlType="submit" className={styles.btn}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
