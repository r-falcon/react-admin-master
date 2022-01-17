import React from 'react';
import {
  roleList,
  deleteAssignRole,
  addRole,
  editRole,
  deleteRole,
  rightList,
  setRole,
} from './service';
import { Table, Button, Tag, Row, Col, Popconfirm, Modal, Form, Input, Tree, message } from 'antd';
import { CaretRightFilled, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './role.less';
class Role extends React.Component {
  state = {
    allRoleList: [],
    loading: false,

    rowId: null,

    isAdd: false,
    visible: false,

    setVisible: false,
    rightsTree: [],
    defKeys: [],
    idStr: '',
  };

  layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  formRef = React.createRef();

  replaceFields = { children: 'children', title: 'authName', key: 'id' };

  getColumns() {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        align: 'center',
      },
      {
        title: '角色描述',
        dataIndex: 'roleDesc',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'option',
        align: 'center',
        render: (text, record, index) => (
          <div>
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={<EditOutlined />}
              onClick={() => this.handleUpdate(record)}
            />

            <Popconfirm
              onConfirm={() => this.handleDelete(record.id)}
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
              style={{ background: '#E6A23C', color: '#fff' }}
              size="small"
              icon={<SettingOutlined />}
              className={styles.btnStyle}
              onClick={() => this.handleSetting(record)}
            />
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    this.getRoleList();
  }

  getRoleList = async () => {
    try {
      this.setState({
        loading: true,
      });
      const res = await roleList();
      const role_show = [];
      res.data.map(item => {
        role_show.push({
          id: item.id,
          roleName: item.roleName,
          roleDesc: item.roleDesc,
          expandable: item.children.length > 0,
          params: item.children.length > 0 ? item.children : [],
        });
      });
      this.setState({
        loading: false,
        allRoleList: role_show,
      });
    } catch (err) {
      this.setState({
        loading: false,
      });
      console.log(err);
    }
  };

  /**
   * 删除角色指定权限
   */
  handleTagDelete = async (roleId, rightId) => {
    try {
      await deleteAssignRole(roleId, rightId);
      message.success('成功移除权限');
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * table展开行渲染内容
   */
  expandedRowRender = record => {
    return (
      <div>
        {record.params.map((item1, index1) => (
          <Row
            key={item1.id}
            className={`${styles.bdbottom} ${styles.vcenter} ${index1 === 0 ? 'bdtop' : ''}`}
          >
            <Col span={5}>
              <Tag
                className={styles.tag}
                color="blue"
                closable
                onClose={() => this.handleTagDelete(record.id, item1.id)}
              >
                {item1.authName}
              </Tag>
              <CaretRightFilled />
            </Col>

            <Col span={19}>
              {item1.children.map((item2, index2) => (
                <Row key={item2.id} className={`${styles.vcenter} ${index2 === 0 ? '' : 'bdtop'}`}>
                  <Col span={6}>
                    <Tag
                      className={styles.tag}
                      color="green"
                      closable
                      onClose={() => this.handleTagDelete(record.id, item2.id)}
                    >
                      {item2.authName}
                    </Tag>
                    <CaretRightFilled />
                  </Col>

                  <Col span={18}>
                    {item2.children.map((item3, index3) => (
                      <Tag
                        className={styles.tag}
                        color="orange"
                        key={item3.id}
                        closable
                        onClose={() => this.handleTagDelete(record.id, item3.id)}
                      >
                        {item3.authName}
                      </Tag>
                    ))}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        ))}
      </div>
    );
  };

  /**
   * 新增、编辑
   */
  handleAdd = () => {
    this.setState({
      isAdd: true,
      visible: true,
    });
  };

  handleUpdate = record => {
    this.setState({
      isAdd: false,
      visible: true,
      rowId: record.id,
    });
    setTimeout(() => {
      this.formRef.current.setFieldsValue(record);
    }, 100);
  };

  handleCancel = () => {
    this.reset();
  };

  onFinish = async values => {
    const { rowId } = this.state;
    if (rowId) {
      try {
        const res = await editRole(rowId, values);
        if (res.meta.status === 200) {
          message.success('修改成功');
          this.reset();
          this.getRoleList();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await addRole(values);
        if (res.meta.status === 201) {
          message.success('添加成功');
          this.reset();
          this.getRoleList();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  reset = () => {
    this.formRef.current.resetFields();
    this.setState({
      visible: false,
      rowId: null,
    });
  };

  /**
   * 删除
   */
  handleDelete = async rowId => {
    try {
      const res = await deleteRole(rowId);
      if (res.meta.status === 200) {
        message.success('删除成功');
        this.getRoleList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 分配权限
   */
  handleSetting = record => {
    this.getRightsTree(record);
    this.setState({
      setVisible: true,
      rowId: record.id,
    });
  };

  getRightsTree = async record => {
    const newRecord = JSON.parse(JSON.stringify(record).replace(/params/g, 'children'));

    try {
      const res = await rightList('tree');
      const keys = [];
      this.getLeafKeys(newRecord, keys);
      this.setState({
        rightsTree: res.data,
        defKeys: keys,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 递归形式，获取角色下的所有三级权限id，并保存到defKeys数组中
  getLeafKeys = (node, arr) => {
    console.log(node, arr);
    if (!node.children) {
      return arr.push(node.id);
    }
    node.children.map(item => {
      this.getLeafKeys(item, arr);
    });
  };

  handleTreeCheck = (checkedKeys, info) => {
    const allChecked = [...checkedKeys, ...info.halfCheckedKeys];
    const strs = allChecked.join(',');
    this.setState({
      defKeys: checkedKeys,
      idStr: strs,
    });
  };

  setOk = async () => {
    const { rowId, idStr } = this.state;
    try {
      const res = await setRole(rowId, idStr);
      if (res.meta.status === 200) {
        message.success('分配权限成功');
        this.setReset();
        this.getRoleList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  setCancel = () => {
    this.setReset();
  };

  setReset = () => {
    this.setState({
      setVisible: false,
      rowId: null,
      defKeys: [],
      idStr: '',
    });
  };

  render() {
    const { loading, allRoleList, isAdd, visible, setVisible, rightsTree, defKeys } = this.state;
    return (
      <div>
        <Button type="primary" size="small" className={styles.addBtn} onClick={this.handleAdd}>
          + 添加
        </Button>

        <Table
          bordered
          rowKey={record => record.id}
          columns={this.getColumns()}
          loading={loading}
          dataSource={allRoleList}
          expandable={{
            expandedRowRender: record => this.expandedRowRender(record),
            rowExpandable: record => record.expandable,
          }}
        />

        <Modal
          title={isAdd ? '添加角色' : '修改角色'}
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form {...this.layout} labelAlign="left" ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item
              label="角色名称"
              name="roleName"
              rules={[{ required: true, message: '请填写角色名称' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="角色描述"
              name="roleDesc"
              rules={[{ required: true, message: '请填写角色描述' }]}
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

        <Modal title="分配权限" visible={setVisible} onOk={this.setOk} onCancel={this.setCancel}>
          <Tree
            checkable
            treeData={rightsTree}
            fieldNames={this.replaceFields}
            checkedKeys={defKeys}
            autoExpandParent={true}
            onCheck={this.handleTreeCheck}
          />
        </Modal>
      </div>
    );
  }
}

export default Role;
