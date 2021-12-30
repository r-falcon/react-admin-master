import React, { useState, useEffect } from 'react';
import { userTable, addUser, editUser, changeStatus, deleteUser } from './service';
import { Table, Switch, Button, Popconfirm, Modal, Form, Input, Row, Col, message } from 'antd';
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
      render: (text, record, index) => {
        return (
          <Switch
            checked={record.mg_state}
            onChange={checked => handleSwitchChange(record.id, checked)}
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
  const [form] = Form.useForm();
  const [rowId, setRowId] = useState(null);

  /**
   * 详情
   */

  const [detailVisible, setDetailVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const getList = (params = {}, paginationInfo = null) => {
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
  };

  const handleTableChange = values => {
    getList({ ...queryParams }, { ...values });
  };

  /**
   * 修改状态
   */
  const handleSwitchChange = async (id, checked) => {
    await changeStatus(id, checked);
    message.success('状态修改成功！');
    getList({ ...queryParams });
  };

  /**
   * 新增+修改
   */
  const handleAdd = () => {
    console.log('handle add');
    setIsAdd(true);
    setVisible(true);
  };

  const handleUpdate = record => {
    console.log('update');
    setIsAdd(false);
    setRowId(record.id);
    form.setFieldsValue({ ...record });
    setVisible(true);
  };

  const handleCancel = () => {
    reset();
  };

  const reset = () => {
    setVisible(false);
    setRowId(null);
    form.resetFields();
  };

  const onFinish = values => {
    if (rowId) {
      editUser(rowId, values).then(res => {
        message.success('修改成功！');
        reset();
        getList({ ...queryParams });
      });
    } else {
      addUser(values)
        .then(res => {
          message.success('添加成功！');
          reset();
          getList({ ...queryParams });
        })
        .catch(err => console.log(err));
    }
  };

  /**
   * 删除
   */
  const handleDelete = record => {
    deleteUser(record.id)
      .then(res => {
        message.success('删除成功！');
        getList({ ...queryParams });
      })
      .catch(err => console.log(err));
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
  }, []);

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
            <Input disabled={rowId} />
          </Form.Item>

          {rowId ? null : (
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
          )}

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
