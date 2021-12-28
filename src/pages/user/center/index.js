import React from 'react';
import styles from './index.less';
import { Card, Tabs, Form, Input, Button } from 'antd';
import { getUserInfo } from '@/utils/auth';
import { UserOutlined, MailOutlined, MobileOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { parseTime } from '@/utils/tools';

const { TabPane } = Tabs;
class Center extends React.Component {
  state = {
    IPT_RULE_OLDPASS: [
      {
        required: true,
        message: '请输入旧密码',
      },
    ],
    IPT_RULE_NEWPASS: [
      {
        required: true,
        message: '请输入新密码',
      },
    ],
    IPT_RULE_CONFIRMPASS: [
      {
        required: true,
        message: '请确认新密码',
      },
    ],

    IPT_RULE_USERNAME: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],

    IPT_RULE_EMAIL: [
      {
        required: true,
        message: '请输入邮箱',
      },
    ],

    IPT_RULE_MOBILE: [
      {
        required: true,
        message: '请输入手机',
      },
    ],
  };

  editPass = values => {
    console.log('editPass', values);
  };

  editInfo = values => {
    console.log('editInfo', values);
  };

  render() {
    return (
      <div className={styles.mainBox}>
        <Card className={styles.cardBox}>
          <div className={styles.header}>
            <span>个人信息</span>
          </div>

          <div className={styles.avatarBox}>
            <img
              className={styles.avatar}
              src={require('../../../assets/images/user/avatar.png')}
              alt="用户头像"
            />
          </div>

          <ul className={styles.userBox}>
            <li className={styles.liItem}>
              <UserOutlined /> 用户名
              <div className={styles.liRight}>{getUserInfo().username}</div>
            </li>
            <li className={styles.liItem}>
              <MailOutlined /> 邮箱
              <div className={styles.liRight}>{getUserInfo().email}</div>
            </li>
            <li className={styles.liItem}>
              <MobileOutlined /> 手机
              <div className={styles.liRight}>{getUserInfo().mobile}</div>
            </li>
            <li className={styles.liItem}>
              <FieldTimeOutlined /> 创建日期
              <div className={styles.liRight}>{parseTime(new Date())}</div>
            </li>
          </ul>
        </Card>

        <div className={styles.infoBox}>
          <Tabs>
            <TabPane tab="忘记密码" key="1">
              <Form className={styles.formBox} labelAlign="left" onFinish={this.editPass}>
                <Form.Item name="oldPass" label="旧密码" rules={this.state.IPT_RULE_OLDPASS}>
                  <Input.Password className={styles.iptWidth} placeholder="请输入旧密码" />
                </Form.Item>

                <Form.Item name="newPass" label="新密码" rules={this.state.IPT_RULE_NEWPASS}>
                  <Input.Password className={styles.iptWidth} placeholder="请输入新密码" />
                </Form.Item>

                <Form.Item
                  name="confirmPass"
                  label="确认密码"
                  rules={this.state.IPT_RULE_CONFIRMPASS}
                >
                  <Input.Password className={styles.iptWidth} placeholder="请确认新密码" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    确 认
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="修改信息" key="2">
              <Form
                className={styles.formBox}
                initialValues={getUserInfo()}
                labelAlign="left"
                onFinish={this.editInfo}
              >
                <Form.Item name="username" label="用户" rules={this.state.IPT_RULE_USERNAME}>
                  <Input className={styles.iptWidth} placeholder="请输入用户" />
                </Form.Item>

                <Form.Item name="email" label="邮箱" rules={this.state.IPT_RULE_EMAIL}>
                  <Input className={styles.iptWidth} placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item name="mobile" label="手机" rules={this.state.IPT_RULE_MOBILE}>
                  <Input className={styles.iptWidth} placeholder="请输入手机" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    确 认
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Center;
