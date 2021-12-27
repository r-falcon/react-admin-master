import React from 'react';
// import styles from './index.less';
import { userTable } from './service';
import { parseTime } from '../../utils/tools';
import { Switch, Table } from 'antd';
class User extends React.Component {
  state = {
    userList: [],
    pagination: {
      pageSizeOptions: ['5', '10', '20', '30', '50'],
      defaultCurrent: 1,
      defaultPageSize: 5,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
    },
    queryParams: {
      query: '',
      pagenum: 1,
      pagesize: 5,
    },
    loading: false,
  };

  // 计算属性
  get columns() {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        align: 'center',
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        align: 'center',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        align: 'center',
      },
      {
        title: '启用状态',
        dataIndex: 'mg_state',
        align: 'center',
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
  }

  componentDidMount() {
    this.initData({ ...this.state.queryParams });
  }

  initData = (params = {}, paginationInfo = null) => {
    if (paginationInfo) {
      this.setState({
        pagination: {
          ...this.state.pagination,
          current: paginationInfo.current,
          pageSize: paginationInfo.pageSize,
        },
      });
      params.pagesize = paginationInfo.pageSize;
      params.pagenum = paginationInfo.current;
      params.query = '';
    } else {
      console.log(this.state);
      params.pagesize = this.state.pagination.defaultPageSize;
      params.pagenum = this.state.pagination.defaultCurrent;
      params.query = '';
    }

    this.setState({
      loading: true,
    });

    userTable({ ...params })
      .then(res => {
        this.setState({
          loading: false,
          pagination: { ...this.state.pagination, total: res.data.total },
          userList: res.data.users,
        });
      })
      .catch(err => console.log(err));
  };

  handleTableChange = pagination => {
    this.initData({ ...this.state.queryParams }, { ...pagination });
  };

  render() {
    return (
      <div>
        <Table
          bordered
          rowKey={record => record.id}
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.userList}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default User;
