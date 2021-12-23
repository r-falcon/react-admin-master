import styles from './index.css';
import { Layout, Menu, Icon } from 'antd';
import router from 'umi/router';
// import { Redirect } from 'react-router';
// import Login from '../pages/login';
// import { isLogin } from '../utils/auth';

function BasicLayout(props) {
  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;

  // if (isLogin()) {
  return (
    <Layout className={styles.wrapper}>
      <Header className={styles.header}>header content</Header>
      <Layout className={styles.container}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          theme="light"
          className={styles.sider}
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div> logo </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['user01']}>
            <Menu.Item
              key="index"
              onClick={() => {
                router.replace('/');
              }}
            >
              <Icon type="index"></Icon>
              <span>首页</span>
            </Menu.Item>
            <SubMenu
              key="user"
              title={
                <span>
                  <Icon type="user" />
                  <span> 用户管理 </span>
                </span>
              }
            >
              <Menu.Item
                key="user01"
                onClick={() => {
                  router.replace('/user/index');
                }}
              >
                用户列表
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="right"
              title={
                <span>
                  <Icon type="form" />
                  <span> 权限管理 </span>
                </span>
              }
            >
              <Menu.Item
                key="right01"
                onClick={() => {
                  router.replace('/right/role');
                }}
              >
                角色列表
              </Menu.Item>
              <Menu.Item
                key="right02"
                onClick={() => {
                  router.replace('/right/index');
                }}
              >
                权限列表
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="goods"
              title={
                <span>
                  <Icon type="appstore" />
                  <span> 商品管理 </span>
                </span>
              }
            >
              <Menu.Item
                key="goods01"
                onClick={() => {
                  router.replace('/goods/list');
                }}
              >
                商品列表
              </Menu.Item>
              <Menu.Item
                key="goods02"
                onClick={() => {
                  router.replace('/goods/params');
                }}
              >
                分类参数
              </Menu.Item>
              <Menu.Item
                key="goods03"
                onClick={() => {
                  router.replace('/goods/add');
                }}
              >
                添加商品
              </Menu.Item>
              <Menu.Item
                key="goods04"
                onClick={() => {
                  router.replace('/goods/sort');
                }}
              >
                商品分类
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="order"
              title={
                <span>
                  <Icon type="table" />
                  <span> 订单管理 </span>
                </span>
              }
            >
              <Menu.Item
                key="order01"
                onClick={() => {
                  router.replace('/order/list');
                }}
              >
                订单列表
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="chart"
              title={
                <span>
                  <Icon type="pie-chart" />
                  <span> 数据统计 </span>
                </span>
              }
            >
              <Menu.Item
                key="chart01"
                onClick={() => {
                  router.replace('/chart/show');
                }}
              >
                数据报表
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className={styles.app}>
          <Content className={styles.content}>
            <div className={styles.main}>{props.children}</div>
          </Content>
          <Footer className={styles.footer}>OnlineRetailers ©2021 Created by XiaodaiRong</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
  // } else {
  //   return <Login />;
  //   // return <Redirect to="/login" />;
  // }
}

export default BasicLayout;