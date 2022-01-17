import React from 'react';
import { rightList } from './service';
import { Table, Tag } from 'antd';
class Right extends React.Component {
  state = {
    allRightList: [],
    loading: false,
  };

  getColumns() {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '权限名称',
        dataIndex: 'authName',
        align: 'center',
      },
      {
        title: '权限路径',
        dataIndex: 'path',
        align: 'center',
      },
      {
        title: '权限等级',
        dataIndex: 'level',
        align: 'center',
        render: (text, record, index) =>
          record.level === '0' ? (
            <Tag color="red">一级</Tag>
          ) : record.level === '1' ? (
            <Tag color="green">二级</Tag>
          ) : (
            <Tag color="orange">三级</Tag>
          ),
      },
    ];
  }

  componentDidMount() {
    this.getRightsList('list');
  }

  getRightsList = async type => {
    try {
      this.setState({
        loading: true,
      });
      const res = await rightList(type);
      console.log('获取所有权限列表', res);
      this.setState({
        loading: false,
        allRightList: res.data,
      });
    } catch (err) {
      this.setState({
        loading: false,
      });
      console.log(err);
    }
  };

  render() {
    const { loading, allRightList } = this.state;
    return (
      <div>
        <Table
          bordered
          rowKey={record => record.id}
          columns={this.getColumns()}
          loading={loading}
          dataSource={allRightList}
        />
      </div>
    );
  }
}

export default Right;
