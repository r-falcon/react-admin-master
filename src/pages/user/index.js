import React from 'react';
// import styles from './index.less';
import { userTable } from './service';
import { parseTime } from '../../utils/tools';
import { Switch, Table, Pagination } from 'antd';

class User extends React.Component {
  state = {
    // 注意：使用table自带的分页需要一次性把数据全部请求出来
    queryParams: {
      query: '',
      pagenum: 1,
      // pagesize: 5,
      pagesize: 100,
    },
    total: 0,
    userList: [],
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role_name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机',
      dataIndex: 'mobile',
    },
    {
      title: '启用状态',
      dataIndex: 'mg_state',
      render: record => {
        return <Switch checked={record} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: record => {
        return <span>{parseTime(record)}</span>;
      },
    },
  ];

  paginationProps = {
    showSizeChanger: true, //设置每页显示数据条数
    showQuickJumper: false,
    showTotal: () => `共${this.state.total}条`,
    pageSizeOptions: [5, 10, 20, 50],
    defaultCurrent: 1,
    defaultPageSize: 5,
    total: this.state.total,
    hideOnSinglePage: true,
    onChange: this.handlePageChange,
  };

  componentDidMount() {
    this.getUserList(this.state.queryParams);
  }

  getUserList = params => {
    console.log(params);
    userTable(params)
      .then(res => {
        this.setState({
          total: res.data.total,
          userList: res.data.users,
        });
      })
      .catch(err => console.log(err));
  };

  handlePageChange = page => {
    this.getUserList({ ...this.state.queryParams, pagenum: page });
  };

  render() {
    return (
      <div>
        {/* 
          table的分页有两种情况：
            1.直接使用table自带的pagination
            2.隐藏table的pagination，使用自定义pagination组件
         */}
        {/* 第一种：使用单独的分页组件.hideOnSinglePage,只有一页的时候，隐藏分页 */}
        {/* <Table
          bordered
          rowKey={record => record.id}
          columns={this.columns}
          dataSource={this.state.userList}
          pagination={false}
        />
        <Pagination
          style={{ marginTop: '20px' }}
          defaultCurrent={1}
          defaultPageSize={5}
          total={this.state.total}
          hideOnSinglePage={true}
          onChange={this.handlePageChange}
        /> */}

        {/* 第二种：使用table内置的分页 */}
        <Table
          bordered
          rowKey={record => record.id}
          columns={this.columns}
          dataSource={this.state.userList}
          pagination={this.paginationProps}
        />
      </div>
    );
  }
}

export default User;
