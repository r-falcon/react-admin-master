import React from 'react';
import { goodsList, goodsDelete } from './service';
import { Table, Button, Input, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { parseTime } from '@/utils/tools';

const { Search } = Input;
class Goods extends React.Component {
  state = {
    queryParams: {
      query: '',
      pagenum: 1,
      pagesize: 5,
    },
    allList: [],
    pagination: {
      pageSizeOptions: ['5', '10', '20', '50'],
      defaultCurrent: 1,
      defaultPageSize: 5,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
    },
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
        title: '商品名称',
        dataIndex: 'goods_name',
        align: 'center',
      },
      {
        title: '商品价格',
        dataIndex: 'goods_price',
        align: 'center',
      },
      {
        title: '商品数量',
        dataIndex: 'goods_number',
        align: 'center',
      },
      {
        title: '商品重量',
        dataIndex: 'goods_weight',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'add_time',
        align: 'center',
        render: (text, record, index) => parseTime(record.add_time),
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
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => this.handleUpdate(record.goods_id)}
              />

              <Popconfirm
                onConfirm={() => this.handleDelete(record.goods_id)}
                okText="确认"
                title={`确认删除id为${record.goods_id}的选项么？`}
                cancelText="取消"
              >
                <Button
                  shape="circle"
                  type="danger"
                  size="small"
                  style={{ marginLeft: '20px' }}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
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

    this.getList(params);
  };

  getList = async params => {
    try {
      this.setState({
        loading: true,
      });
      const res = await goodsList({ ...params });
      this.setState({
        loading: false,
        pagination: { ...this.state.pagination, total: res.data.total },
        allList: res.data.goods,
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 分页变动
   */
  handleTableChange = pagination => {
    this.initData({ ...this.state.queryParams }, { ...pagination });
  };

  /**
   * 搜索
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
   * 新增、修改
   */
  handleUpdate = goodsId => {
    router.push({
      pathname: '/goods/add',
      query: {
        goodsId: goodsId,
      },
    });
  };

  handlePageJump = () => {
    router.push('/goods/add');
  };

  /**
   * 删除
   */
  handleDelete = async id => {
    try {
      const res = await goodsDelete(id);
      if (res.meta.status === 200) {
        message.success('删除成功');
        this.initData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { loading, allList, pagination } = this.state;

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

          <Button
            type="primary"
            size="small"
            style={{ fontSize: '12px' }}
            onClick={this.handlePageJump}
          >
            + 新增
          </Button>
        </div>

        <Table
          bordered
          rowKey={record => record.goods_id}
          loading={loading}
          dataSource={allList}
          columns={this.getColumns()}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Goods;
