import React from 'react';
import styles from './index.less';
import {
  userTable,
  addUser,
  editUser,
  changeStatus,
  deleteUser,
  roleList,
  setterUser,
} from './service';
import { parseTime } from '@/utils/tools';
import {
  Switch,
  Table,
  Button,
  Popconfirm,
  Form,
  Modal,
  Input,
  Row,
  Col,
  Select,
  message,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

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

    visible: false,
    title: '',
    rowId: null,
    detailVisible: false,
    isAdd: false,
    settingVisible: false,

    form: {},
    roleData: [],
    rid: '',
  };

  layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  formRef = React.createRef();

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
        render: (text, record, index) => {
          return (
            <Switch
              checked={record.mg_state}
              onChange={checked => this.handleSwitchChange(record.id, checked)}
            />
          );
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

              <Button
                shape="circle"
                style={{ background: '#E6A23C', color: '#fff' }}
                icon={<SettingOutlined />}
                className={styles.btnStyle}
                size="small"
                onClick={() => this.handleSetting(record)}
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

  /**
   * 数据初始化
   */
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

    this.getList(params);
  };

  getList = async params => {
    try {
      this.setState({
        loading: true,
      });
      const res = await userTable({ ...params });
      this.setState({
        loading: false,
        pagination: { ...this.state.pagination, total: res.data.total },
        userList: res.data.users,
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 模糊搜索
   */
  handleSearch = value => {
    this.setState(
      {
        queryParams: { ...this.state.queryParams, query: value },
      },
      () => {
        this.initData({ ...this.state.queryParams });
      },
    );
  };

  /**
   * 分页变动
   */
  handleTableChange = pagination => {
    console.log('change', pagination);
    this.initData({ ...this.state.queryParams }, { ...pagination });
  };

  /**
   * 用户状态修改
   */
  handleSwitchChange = (id, checked) => {
    console.log(id, checked);
    changeStatus(id, checked)
      .then(res => {
        message.success('修改状态成功！');
        this.initData({ ...this.state.queryParams });
      })
      .catch(err => console.log(err));
  };

  /**
   * 添加修改
   */
  handleAdd = () => {
    this.setState({
      visible: true,
      isAdd: true,
    });
  };

  handleUpdate = record => {
    this.formRef.current.setFieldsValue({ ...record });
    this.setState({
      visible: true,
      isAdd: false,
      rowId: record.id,
    });
  };

  onFinish = values => {
    if (this.state.rowId) {
      editUser(this.state.rowId, values)
        .then(res => {
          message.success('修改成功！');
          this.reset();
          this.initData({ ...this.state.queryParams });
        })
        .catch(err => console.log(err));
    } else {
      addUser(values)
        .then(res => {
          message.success('添加成功！');
          this.reset();
          this.initData({ ...this.state.queryParams });
        })
        .catch(err => console.log(err));
    }
  };

  onCancel = () => {
    this.reset();
  };

  reset = () => {
    this.formRef.current.resetFields();
    this.setState({
      visible: false,
      rowId: null,
    });
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
    deleteUser(record.id)
      .then(res => {
        message.success('删除成功！');
        this.initData({ ...this.state.queryParams });
      })
      .catch(err => console.log(err));
  };

  /**
   * 分配权限
   */
  handleSetting = record => {
    this.getRoleList();
    this.setState({
      settingVisible: true,
      form: record,
    });
  };

  getRoleList = async () => {
    try {
      const res = await roleList();
      this.setState({
        roleData: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleRoleSelect = value => {
    this.setState({
      rid: value,
    });
  };

  setOk = async () => {
    if (this.state.rid === '') {
      message.success('维持原角色不变!');
      this.setReset();
    } else {
      try {
        const res = await setterUser(this.state.form.id, this.state.rid);
        message.success('分配角色成功！');
        this.setReset();
        this.initData({ ...this.state.queryParams });
      } catch (err) {
        console.log(err);
      }
    }
  };

  setCancel = () => {
    this.setReset();
  };

  setReset = () => {
    this.setState({
      settingVisible: false,
      form: {},
      rid: '',
    });
  };

  /**
   * 卸载
   */
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };

  render() {
    const {
      form,
      loading,
      userList,
      pagination,
      isAdd,
      visible,
      detailVisible,
      settingVisible,
      roleData,
    } = this.state;
    return (
      <div>
        <div className={styles.header}>
          <Search
            placeholder="请输入关键字进行搜索"
            className={styles.search}
            onSearch={this.handleSearch}
          />

          <Button
            type="primary"
            size="small"
            className={styles.addBtn}
            onClick={() => this.handleAdd()}
          >
            + 新增
          </Button>
        </div>

        <Table
          bordered
          rowKey={record => record.id}
          loading={loading}
          columns={this.getColumns()}
          dataSource={userList}
          pagination={pagination}
          onChange={this.handleTableChange}
        />

        <Modal
          title={isAdd ? '添加信息' : '修改信息'}
          visible={visible}
          forceRender={true}
          footer={null}
          onCancel={this.onCancel}
        >
          <Form {...this.layout} labelAlign="left" ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item
              label="用户"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户',
                },
              ]}
            >
              <Input disabled={!isAdd} />
            </Form.Item>

            {isAdd ? (
              <Form.Item
                label="密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            ) : null}

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱',
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

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="详情信息"
          visible={detailVisible}
          onOk={this.clickOk}
          onCancel={this.clickCancel}
        >
          <Row>
            <Col span={12}>用户名：{form.username}</Col>
            <Col span={12}>角 色：{form.role_name}</Col>
            <Col span={12}>邮 箱：{form.email}</Col>
            <Col span={12}>手 机：{form.mobile}</Col>
            <Col span={12}>状 态：{form.mg_state === true ? '启用' : '停用'}</Col>
          </Row>
        </Modal>

        <Modal
          title="分配权限"
          visible={settingVisible}
          onOk={this.setOk}
          onCancel={this.setCancel}
        >
          <p>当前用户：{form.username}</p>
          <p>当前角色：{form.role_name}</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            分配角色：
            <Select
              style={{ width: '50%' }}
              defaultValue={form.role_name}
              onChange={this.handleRoleSelect}
            >
              {roleData.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.roleName}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>
    );
  }
}

export default User;
