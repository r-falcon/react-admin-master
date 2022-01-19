import React from 'react';
import { orderList, orderById } from './service';
import { Tag, Table, Input, Button, Modal, Row, Col } from 'antd';
import { parseTime } from '@/utils/tools';
import { EyeOutlined } from '@ant-design/icons';

const { Search } = Input;

class Order extends React.Component {
  state = {
    queryParams: {
      query: '',
      pagenum: 1,
      pagesize: 5,
    },
    allOrders: [],
    pagination: {
      pageSizeOptions: ['5', '10', '20', '50'],
      defaultCurrent: 1,
      defaultPageSize: 5,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
    },
    loading: false,

    visible: false,
    orderInfo: {},
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
        title: '订单编号',
        dataIndex: 'order_number',
        align: 'center',
      },
      {
        title: '订单价格',
        dataIndex: 'order_price',
        align: 'center',
      },
      {
        title: '是否付款',
        dataIndex: 'pay_status',
        align: 'center',
        render: (text, record, index) =>
          record.pay_status === '0' ? (
            <Tag color="red">未付款</Tag>
          ) : (
            <Tag color="green">已付款</Tag>
          ),
      },
      {
        title: '是否发货',
        dataIndex: 'is_send',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        align: 'center',
        render: (text, record, index) => parseTime(record.create_time),
      },
      {
        title: '操作',
        dataIndex: 'option',
        align: 'center',
        render: (text, record, index) => {
          return (
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => this.handleDetail(record.order_id)}
            />
          );
        },
      },
    ];
  }

  getOrderColumns() {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '商品ID',
        dataIndex: 'goods_id',
        align: 'center',
      },
      {
        title: '商品单价',
        dataIndex: 'goods_price',
        align: 'center',
      },
      {
        title: '商品数量',
        dataIndex: 'goods_number',
        align: 'center',
      },
      {
        title: '商品总价',
        dataIndex: 'goods_total_price',
        align: 'center',
      },
    ];
  }

  componentDidMount() {
    this.initData(this.state.queryParams);
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

    this.getOrderList(params);
  };

  getOrderList = async params => {
    try {
      this.setState({
        loading: true,
      });
      const res = await orderList(params);
      console.log('获取结果', res);
      this.setState({
        loading: false,
        pagination: { ...this.state.pagination, total: res.data.total },
        allOrders: res.data.goods,
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleTableChange = pagination => {
    this.initData(this.state.queryParams, pagination);
  };

  handleSearch = value => {
    this.setState(
      {
        queryParams: { ...this.state.queryParams, query: value },
      },
      () => {
        this.initData(this.state.queryParams);
      },
    );
  };

  handleDetail = async orderId => {
    try {
      const res = await orderById(orderId);
      console.log('详情为', res);
      this.setState({
        visible: true,
        orderInfo: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { allOrders, loading, pagination, visible, orderInfo } = this.state;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '10px 0',
          }}
        >
          <Search
            placeholder="请输入搜索关键字"
            style={{ width: '240px' }}
            onSearch={this.handleSearch}
          />
        </div>

        <Table
          bordered
          rowKey={record => record.order_id}
          loading={loading}
          dataSource={allOrders}
          columns={this.getColumns()}
          pagination={pagination}
          onChange={this.handleTableChange}
        />

        <Modal
          title="订单详情"
          visible={visible}
          width={700}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row gutter={20}>
            <Col span={24}>订单编号：{orderInfo.order_number}</Col>
            <Col span={12}>订单价格：{orderInfo.order_price}</Col>
            <Col span={12}>是否付款：{orderInfo.pay_status === '0' ? '未付款' : '已付款'}</Col>
            <Col span={12}>创建时间：{parseTime(orderInfo.create_time)}</Col>
          </Row>
          {orderInfo.goods && orderInfo.goods.length > 0 ? (
            <Table
              bordered
              rowKey={record => record.id}
              dataSource={orderInfo.goods}
              columns={this.getOrderColumns()}
              style={{ marginTop: '20px' }}
            />
          ) : null}
        </Modal>
      </div>
    );
  }
}

export default Order;
