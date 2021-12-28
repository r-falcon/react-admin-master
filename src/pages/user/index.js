import React from 'react';
import styles from './index.less';
import { userTable } from './service';
import { parseTime } from '@/utils/tools';
import { Switch, Table, Button, Modal, Popconfirm, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
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
    visible: false,
    title: '',
    detailVisible: false,

    IPT_RULE_USERNAME: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],

    IPT_RULE_ROLE: [
      {
        required: true,
        message: '请选择角色',
      },
    ],

    IPT_RULE_EMAIL: [
      {
        required: true,
        message: '请输入邮箱地址',
      },
    ],

    IPT_RULE_MOBILE: [
      {
        required: true,
        message: '请输入手机号',
      },
    ],

    IPT_RULE_STATE: [
      {
        required: true,
        message: '请选择启用状态',
      },
    ],
  };

  columns = [
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
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (text, record, index) => {
        return (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => this.handleUpdate(record)}
            />

            <Popconfirm
              onConfirm={() => this.handleDelete(record)}
              okText="确认"
              title="确认删除该所选项么？"
              cancelText="取消"
            >
              <Button
                shape="circle"
                type="danger"
                className={styles.btnStyle}
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>

            <Button
              shape="circle"
              icon={<EyeOutlined />}
              className={styles.btnStyle}
              size="small"
              onClick={() => this.handleDetail(record)}
            />
          </div>
        );
      },
    },
  ];

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

  handleAdd = () => {
    this.setState({
      title: '新增信息',
      visible: true,
    });
  };

  handleUpdate = record => {
    console.log('click update');
    this.setState({
      title: '修改信息',
      visible: true,
    });
    console.log(this.state);
  };

  // handleOk = () => {
  //   console.log('修改确认');
  //   this.reset();
  // };

  handleCancel = () => {
    console.log('确认取消');
    this.reset();
  };

  onFinish = values => {
    console.log('form data', values);
    this.reset();
  };

  reset = () => {
    this.setState({
      visible: false,
    });
  };

  handleDelete = record => {
    console.log('delete', record);
  };

  handleDetail = record => {
    console.log('detail', record);
    this.setState({
      detailVisible: true,
    });
  };

  handleDetailOk = () => {
    console.log('详情确认');
    this.detailReset();
  };

  handleDetailCancel = () => {
    console.log('详情取消');
    this.detailReset();
  };

  detailReset = () => {
    this.setState({
      detailVisible: false,
    });
  };

  render() {
    return (
      <div>
        <Button
          type="primary"
          size="small"
          className={styles.addBtn}
          onClick={() => this.handleAdd()}
        >
          + 新增
        </Button>

        <Table
          bordered
          rowKey={record => record.id}
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.userList}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />

        {/* 
          onOk={this.handleOk}
          onCancel={this.handleCancel}
         */}
        <Modal
          title={this.state.title}
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {/* <Form initialValues={this.state.form} onFinish={this.onFinish}> */}
          <Form onFinish={this.onFinish}>
            <Form.Item name="username" label="用户名" rules={this.state.IPT_RULE_USERNAME}>
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item name="role_name" label="角色" rules={this.state.IPT_RULE_ROLE}>
              <Input placeholder="请输入角色名" />
            </Form.Item>

            <Form.Item name="email" label="邮箱" rules={this.state.IPT_RULE_EMAIL}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item name="mobile" label="手机" rules={this.state.IPT_RULE_MOBILE}>
              <Input placeholder="请输入手机" />
            </Form.Item>

            <Form.Item name="mg_state" label="状态" rules={this.state.IPT_RULE_STATE}>
              <Input placeholder="请输入启用状态" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="信息详情"
          visible={this.state.detailVisible}
          onOk={this.handleDetailOk}
          onCancel={this.handleDetailCancel}
        >
          <p>信息详情</p>
        </Modal>
      </div>
    );
  }
}

export default User;
