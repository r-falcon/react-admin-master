import React from 'react';
import SortPublic from './public';
import { sortParams } from './service';
import { Card, Tabs, Table } from 'antd';

const { TabPane } = Tabs;

class Params extends React.Component {
  state = {
    cateId: null,
    activeTab: '1',
    manyParams: [],
    onlyParams: [],
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
        title: '参数名称',
        dataIndex: 'attr_name',
        align: 'center',
      },
      {
        title: '参数内容',
        dataIndex: 'attr_vals',
        align: 'center',
      },
    ];
  }

  tabOptions = [
    {
      key: '1',
      title: '动态参数',
    },
    {
      key: '2',
      title: '静态属性',
    },
  ];

  /**
   * 变更商品分类
   */
  handleSortChange = value => {
    const sortId = this.getSortId(value);
    this.setState(
      {
        cateId: sortId,
      },
      () => {
        const { activeTab } = this.state;
        this.handleRequest(activeTab);
      },
    );
  };

  /**
   * 获取所属类别id
   */
  getSortId = selectArr => {
    if (selectArr && selectArr.length === 3) {
      return selectArr[2];
    }
    return null;
  };

  /**
   * 控制tab面板的切换
   */
  handleTabChange = value => {
    this.setState(
      {
        activeTab: value,
      },
      () => {
        const { activeTab } = this.state;
        this.handleRequest(activeTab);
      },
    );
  };

  /**
   * 不同切换的请求
   */
  handleRequest = tabId => {
    const { cateId } = this.state;
    if (tabId === '1') {
      this.getSortInfo(cateId, { sel: 'many' });
    } else {
      this.getSortInfo(cateId, { sel: 'only' });
    }
  };

  /**
   * 获取分类参数列表,{sel:many动态，only静态}
   */
  getSortInfo = async (sortId, params) => {
    try {
      const res = await sortParams(Number(sortId), params);
      const { activeTab } = this.state;
      if (activeTab === '1') {
        this.setState({
          manyParams: res.data,
        });
      } else {
        this.setState({
          onlyParams: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { activeTab, manyParams, onlyParams } = this.state;
    return (
      <div>
        <div>
          请选择商品分类：
          <SortPublic handleChange={this.handleSortChange} />
        </div>

        <Card>
          <Tabs activeKey={activeTab} onChange={this.handleTabChange}>
            {this.tabOptions.map(item => (
              <TabPane key={item.key} tab={item.title}>
                <Table
                  bordered
                  rowKey={record => record.attr_id}
                  dataSource={Number(activeTab) === 1 ? manyParams : onlyParams}
                  columns={this.getColumns()}
                />
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default Params;
