import React from 'react';
import styles from './index.less';
import { userTable, roleList } from './service';
import { parseTime } from '@/utils/tools';
import {
  Switch,
  Table,
  Button,
  Popconfirm,
  Form,
  Modal,
  Input,
  Select,
  Radio,
  Row,
  Col,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

/**
 * 关于form表单控制，推荐使用useForm进行局部控制，
 * 如果使用class，则使用ref获取form表单进行控制
 */
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

    roleList: [],

    visible: false,
    title: '',
    detailVisible: false,
    isAdd: false,

    form: {},
  };

  layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  formRef = React.createRef();

  statusOptions = [
    {
      value: true,
      label: '启用',
    },
    {
      value: false,
      label: '停用',
    },
  ];

  getColumns() {
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
                title={`确认删除id为${record.id}的选项么？`}
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
    } else {
      params.pagesize = this.state.pagination.defaultPageSize;
      params.pagenum = this.state.pagination.defaultCurrent;
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

  /**
   * 添加修改
   */
  handleAdd = () => {
    this.setState({
      visible: true,
      isAdd: true,
    });
    this.getRoleList();
  };

  handleUpdate = record => {
    this.formRef.current.setFieldsValue({ ...record });
    this.setState({
      visible: true,
      isAdd: false,
    });
    this.getRoleList();
  };

  onFinish = values => {
    console.log('form finished');
    console.log(values);
  };

  onCancel = () => {
    this.formRef.current.resetFields();
    this.setState({
      visible: false,
    });
  };

  getRoleList = () => {
    roleList()
      .then(res => {
        var roles = [];
        res.data.forEach(item => {
          roles.push({
            value: item.roleName,
            label: item.roleName + '-' + item.roleDesc,
          });
        });
        this.setState({
          roleList: roles,
        });
      })
      .catch(err => console.log(err));
  };

  /**
   * 详情
   */
  handleDetail = record => {
    this.setState({
      detailVisible: true,
      form: record,
    });
  };

  clickOk = () => {
    this.setState({
      detailVisible: false,
      form: {},
    });
  };

  clickCancel = () => {
    this.setState({
      detailVisible: false,
      form: {},
    });
  };

  /**
   * 删除
   */
  handleDelete = record => {
    console.log('handle delete');
    console.log(record.id);
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
          columns={this.getColumns()}
          dataSource={this.state.userList}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />

        <Modal
          title={this.state.isAdd ? '添加信息' : '修改信息'}
          visible={this.state.visible}
          forceRender={true}
          footer={null}
          onCancel={this.onCancel}
        >
          <Form {...this.layout} labelAlign="left" ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="用户角色"
              name="role_name"
              rules={[
                {
                  required: true,
                  message: '请选择用户角色',
                },
              ]}
            >
              <Select options={this.state.roleList} />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱地址',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="手机"
              name="mobile"
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="启用状态"
              name="mg_state"
              rules={[
                {
                  required: true,
                  message: '请输入启用状态',
                },
              ]}
            >
              <Radio.Group options={this.statusOptions}></Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="详情信息"
          visible={this.state.detailVisible}
          onOk={this.clickOk}
          onCancel={this.clickCancel}
        >
          <Row>
            <Col span={12}>用户名：{this.state.form.username}</Col>
            <Col span={12}>角 色：{this.state.form.role_name}</Col>
            <Col span={12}>邮 箱：{this.state.form.email}</Col>
            <Col span={12}>手 机：{this.state.form.mobile}</Col>
            <Col span={12}>状 态：{this.state.form.mg_state === true ? '启用' : '停用'}</Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default User;
