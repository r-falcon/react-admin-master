import React from 'react';
import styles from './index.less';
import { Layout, Menu, Dropdown, ConfigProvider } from 'antd';
import ZhCN from 'antd/lib/locale-provider/zh_CN';
import {
  HomeOutlined,
  UserOutlined,
  FormOutlined,
  ShopOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import router from 'umi/router';
import { Redirect } from 'react-router';
import { isLogin, getLocalUser } from '@/utils/auth';
import { parseTime } from '@/utils/tools';
class BasicLayout extends React.Component {
  state = {
    openKeys: [],
    date: new Date(),
  };

  optionsList = (
    <Menu>
      <Menu.Item key="1" onClick={() => router.push('/')}>
        首页
      </Menu.Item>
      <Menu.Item key="2" onClick={() => router.push('/center/index')}>
        个人中心
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          // 删除全部数据
          // window.localStorage.clear();
          // 删除某项 数据
          window.localStorage.removeItem('user_info');
          window.localStorage.removeItem('user_token');
          window.location.reload();
        }}
      >
        退出登录
      </Menu.Item>
    </Menu>
  );

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        date: new Date(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
          <Header className={styles.header}>
            <p className={styles.title}>Online Retailers Management System</p>
            <div className={styles.headerRight}>
              <span className={styles.timer}>
                {parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')}
              </span>
              <Dropdown overlay={this.optionsList} arrow>
                <div className={styles.avatarWrapper}>
                  <img
                    className={styles.avatar}
                    src={require('../assets/images/user/avatar.png')}
                    alt="user avatar"
                  />
                  <span style={{ marginLeft: '10px' }}>{getLocalUser()?.username}</span>
                  <CaretDownOutlined style={{ margin: '5px 0 0 5px' }} />
                </div>
              </Dropdown>
            </div>
          </Header>
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
                  <HomeOutlined />
                  <span>首页</span>
                </Menu.Item>

                <SubMenu
                  key="user"
                  title={
                    <span>
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
                  <Menu.Item
                    key="user02"
                    onClick={() => {
                      router.push('/userHooks/index');
                    }}
                  >
                    用户列表[hooks]
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  key="right"
                  title={
                    <span>
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
                <ConfigProvider locale={ZhCN}>
                  <div className={styles.main}>{this.props.children}</div>
                </ConfigProvider>
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
