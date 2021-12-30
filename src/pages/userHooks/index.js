import React, { useState, useEffect } from 'react';
import { userTable, roleList } from './service';
import {
  Table,
  Switch,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Row,
  Col,
} from 'antd';
import { parseTime } from '@/utils/tools';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './index.less';

function UserHooks() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSizeOptions: ['5', '10', '20', '30', '50'],
    defaultCurrent: 1,
    defaultPageSize: 5,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
  });

  const queryParams = {
    query: '',
    pagenum: 1,
    pagesize: 5,
  };

  const columns = [
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
              onClick={() => handleUpdate(record)}
            />

            <Popconfirm
              onConfirm={() => handleDelete(record)}
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
              onClick={() => handleDetail(record)}
            />
          </div>
        );
      },
    },
  ];

  /**
   *  添加
   *  修改
   */
  const [isAdd, setIsAdd] = useState(false);
  const [visible, setVisible] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [form] = Form.useForm();
  const statusOptions = [
    {
      value: true,
      label: '启用',
    },
    {
      value: false,
      label: '停用',
    },
  ];

  /**
   * 详情
   */

  const [detailVisible, setDetailVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const getList = useCallback((params = {}, paginationInfo = null) => {
    if (paginationInfo) {
      setPagination(pagination => ({
        ...pagination,
        current: paginationInfo.current,
        pageSize: paginationInfo.pageSize,
      }));
      params.pagenum = paginationInfo.current;
      params.pagesize = paginationInfo.pageSize;
    } else {
      params.pagenum = pagination.defaultCurrent;
      params.pagesize = pagination.defaultPageSize;
    }
    setLoading(true);
    userTable({ ...params })
      .then(res => {
        setLoading(false);
        setUserList(res.data.users);
        setPagination(pagination => ({
          ...pagination,
          total: res.data.total,
        }));
      })
      .catch(err => console.log(err));
  });

  const handleTableChange = values => {
    getList({ ...queryParams }, { ...values });
  };

  /**
   * 新增+修改
   */

  const handleAdd = () => {
    console.log('handle add');
    getRoleList();
    setIsAdd(true);
    setVisible(true);
  };

  const handleUpdate = record => {
    console.log('update');
    console.log(record);
    getRoleList();
    setIsAdd(false);
    form.setFieldsValue({ ...record });
    setVisible(true);
  };

  const handleCancel = () => {
    console.log('cancel');
    setVisible(false);
    form.resetFields();
  };

  const onFinish = values => {
    console.log('success', values);
  };

  const getRoleList = () => {
    roleList()
      .then(res => {
        var roles = [];
        res.data.forEach(item => {
          roles.push({
            value: item.roleName,
            label: item.roleName + '-' + item.roleDesc,
          });
        });
        setRoleData(roles);
      })
      .catch(err => console.log(err));
  };

  /**
   * 删除
   */

  const handleDelete = record => {
    console.log('delete');
    console.log(record);
  };

  /**
   * 详情
   */
  const handleDetail = record => {
    console.log('detail');
    console.log(record);
    setFormData(record);
    setDetailVisible(true);
  };

  const handleDetailOk = () => {
    setDetailVisible(false);
  };

  const handleDetailCancel = () => {
    setDetailVisible(false);
  };

  useEffect(() => {
    getList({ ...queryParams });
  }, [getList, queryParams]);

  return (
    <div>
      <Button type="primary" size="small" className={styles.addBtn} onClick={handleAdd}>
        + 新增
      </Button>

      <Table
        bordered
        rowKey={record => record.id}
        loading={loading}
        columns={columns}
        dataSource={userList}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={isAdd ? '新增信息' : '修改信息'}
        visible={visible}
        forceRender={true}
        onCancel={handleCancel}
        footer={null}
      >
        <Form labelAlign="left" form={form} onFinish={onFinish}>
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
            <Input />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role_name"
            rules={[
              {
                required: true,
                message: '请选择角色',
              },
            ]}
          >
            <Select options={roleData} />
          </Form.Item>

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
                message: '请输入手机',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="状态"
            name="mg_state"
            rules={[
              {
                required: true,
                message: '请选择状态',
              },
            ]}
          >
            <Radio.Group options={statusOptions}></Radio.Group>
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
        forceRender={true}
        onOk={handleDetailOk}
        onCancel={handleDetailCancel}
      >
        <Row>
          <Col span={12}>用户名：{formData.username}</Col>
          <Col span={12}>角 色：{formData.role_name}</Col>
          <Col span={12}>邮 箱：{formData.email}</Col>
          <Col span={12}>手 机：{formData.mobile}</Col>
          <Col span={12}>状 态：{formData.mg_state === true ? '启用' : '停用'}</Col>
        </Row>
      </Modal>
    </div>
  );
}

export default UserHooks;
