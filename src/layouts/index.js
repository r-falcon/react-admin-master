import React from 'react';
import styles from './index.less';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  FormOutlined,
  ShopOutlined,
  OrderedListOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import router from 'umi/router';
import { Redirect } from 'react-router';
import { isLogin } from '../utils/auth';

class BasicLayout extends React.Component {
  state = {
    openKeys: [],
  };

  openChange = openKeys => {
    let keysLen = openKeys.length;
    if (keysLen > 1) {
      var trueOpen = openKeys.filter(item => {
        // 最后一个是当前展开的，把当前展开以及父导航设置为openkeys
        return openKeys[keysLen - 1].includes(item);
      });
      this.setState({ openKeys: trueOpen });
    } else {
      this.setState({ openKeys: openKeys });
    }
  };

  render() {
    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;

    if (isLogin()) {
      return (
        <Layout className={styles.wrapper}>
          <Header className={styles.header}>Online Retailers Management System</Header>
          <Layout className={styles.container}>
            <Sider theme="light" className={styles.sider}>
              <div className={styles.siderTitle}> -电商管理后台- </div>
              <Menu
                theme="light"
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.openChange}
              >
                <Menu.Item
                  key="index"
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  {/* <Icon type="home"></Icon> */}
                  <HomeOutlined />
                  <span>首页</span>
                </Menu.Item>

                <SubMenu
                  key="user"
                  title={
                    <span>
                      {/* <Icon type="user" /> */}
                      <UserOutlined />
                      <span> 用户管理 </span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="user01"
                    onClick={() => {
                      router.push('/user/index');
                    }}
                  >
                    用户列表
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  key="right"
                  title={
                    <span>
                      {/* <Icon type="form" /> */}
                      <FormOutlined />
                      <span> 权限管理 </span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="right01"
                    onClick={() => {
                      router.push('/right/role');
                    }}
                  >
                    角色列表
                  </Menu.Item>
                  <Menu.Item
                    key="right02"
                    onClick={() => {
                      router.push('/right/index');
                    }}
                  >
                    权限列表
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  key="goods"
                  title={
                    <span>
                      {/* <Icon type="appstore" /> */}
                      <ShopOutlined />
                      <span> 商品管理 </span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="goods01"
                    onClick={() => {
                      router.push('/goods/list');
                    }}
                  >
                    商品列表
                  </Menu.Item>
                  <Menu.Item
                    key="goods02"
                    onClick={() => {
                      router.push('/goods/params');
                    }}
                  >
                    分类参数
                  </Menu.Item>
                  <Menu.Item
                    key="goods03"
                    onClick={() => {
                      router.push('/goods/add');
                    }}
                  >
                    添加商品
                  </Menu.Item>
                  <Menu.Item
                    key="goods04"
                    onClick={() => {
                      router.push('/goods/sort');
                    }}
                  >
                    商品分类
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  key="order"
                  title={
                    <span>
                      {/* <Icon type="table" /> */}
                      <OrderedListOutlined />
                      <span> 订单管理 </span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="order01"
                    onClick={() => {
                      router.push('/order/list');
                    }}
                  >
                    订单列表
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  key="chart"
                  title={
                    <span>
                      {/* <Icon type="pie-chart" /> */}
                      <PieChartOutlined />
                      <span> 数据统计 </span>
                    </span>
                  }
                >
                  <Menu.Item
                    key="chart01"
                    onClick={() => {
                      router.push('/chart/show');
                    }}
                  >
                    数据报表
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout className={styles.app}>
              <Content className={styles.content}>
                <div className={styles.main}>{this.props.children}</div>
              </Content>
              <Footer className={styles.footer}>
                OnlineRetailers ©2021 Created by XiaodaiRong
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}

export default BasicLayout;
