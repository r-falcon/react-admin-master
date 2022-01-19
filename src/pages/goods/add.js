import React from 'react';
import { Card, Steps, Tabs, Form, Input, Cascader, Button, Checkbox, Upload, message } from 'antd';
import {
  FormOutlined,
  SnippetsOutlined,
  BookOutlined,
  PictureOutlined,
  ProjectOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { goodsSort, sortParams, goodsAdd, goodsById, goodsUpdate } from './service';
import { getToken } from '@/utils/auth';
import Editor from '@/components/WangEditor';
import router from 'umi/router';

const { Step } = Steps;
const { TabPane } = Tabs;

class Add extends React.Component {
  state = {
    goodsId: this.props.location.query?.goodsId,
    currentStep: '1',
    activeTab: '1',
    form: {},
    sortOptions: [],
    manyParams: [],
    onlyParams: [],
  };

  uploadUrl = 'http://127.0.0.1:8888/api/private/v1/upload';
  header = {
    Authorization: getToken(),
  };

  layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  };
  formRef = React.createRef();

  stepOptions = [
    {
      key: '1',
      title: '基本信息',
      icon: <FormOutlined />,
    },
    {
      key: '2',
      title: '商品参数',
      icon: <SnippetsOutlined />,
    },
    {
      key: '3',
      title: '商品属性',
      icon: <BookOutlined />,
    },
    {
      key: '4',
      title: '商品图片',
      icon: <PictureOutlined />,
    },
    {
      key: '5',
      title: '商品内容',
      icon: <ProjectOutlined />,
    },
    {
      key: '6',
      title: '操作完成',
      icon: <SmileOutlined />,
    },
  ];

  sortFieldProps = {
    label: 'cat_name',
    value: 'cat_id',
    children: 'children',
  };

  componentDidMount() {
    this.getSortList({ type: 3 });
    const { goodsId } = this.state;
    if (goodsId) {
      this.getGoodsDetail(goodsId);
    }
  }

  /**
   * 获取分类参数列表
   */
  getSortList = async params => {
    try {
      const res = await goodsSort(params);
      this.setState({
        sortOptions: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 根据id查询详情
   */
  getGoodsDetail = async id => {
    try {
      const res = await goodsById(id);
      res.data.goods_cat = res.data.goods_cat.split(',');
      this.formRef.current.setFieldsValue({ ...res.data });
    } catch (err) {
      console.log(err);
    }
  };

  onFinish = values => {
    const { form, currentStep, activeTab } = this.state;
    this.setState(
      {
        form: { ...form, ...values },
        currentStep: (Number(currentStep) + 1).toString(),
        activeTab: (Number(activeTab) + 1).toString(),
      },
      () => {
        const { form, activeTab } = this.state;
        const cateId = this.getSortId(form.goods_cat);
        if (Number(activeTab) === 2) {
          this.getSortInfo(cateId, { sel: 'many' });
        } else if (Number(activeTab) === 3) {
          this.getSortInfo(cateId, { sel: 'only' });
        } else if (Number(activeTab) === 6) {
          const { manyParams, onlyParams, form } = this.state;
          const attr = [];
          manyParams &&
            manyParams.map(item => {
              attr.push({
                attr_id: item.attr_id,
                attr_value: item.attr_vals.join(),
              });
            });
          onlyParams &&
            onlyParams.map(item => {
              attr.push({
                attr_id: item.attr_id,
                attr_value: item.attr_vals,
              });
            });
          this.setState(
            {
              form: { ...form, goods_cat: form.goods_cat.join(), attrs: attr },
            },
            () => {
              const { form, goodsId } = this.state;
              if (goodsId) {
                this.handleGoodsUpdate(goodsId, form);
              } else {
                this.handleGoodsAdd(form);
              }
            },
          );
        }
      },
    );
  };

  /**
   * 添加商品
   */
  handleGoodsAdd = async data => {
    try {
      const res = await goodsAdd(data);
      if (res.meta.status === 201) {
        message.success('商品添加成功');
        router.push('/goods/list');
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 修改商品
   */
  handleGoodsUpdate = async (id, data) => {
    try {
      const res = await goodsUpdate(id, data);
      if (res.meta.status === 200) {
        message.success('商品修改成功');
        router.push('/goods/list');
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 获取分类参数id
   */
  getSortId = sortArr => {
    if (sortArr && sortArr.length === 3) {
      return sortArr[2];
    }
    return null;
  };

  /**
   * 获取分类参数列表,{sel:many动态， only静态}
   */
  getSortInfo = async (sortId, params) => {
    try {
      const res = await sortParams(sortId, params);
      if (params.sel === 'many') {
        res.data.length > 0 &&
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
          });
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

  /**
   * checkbox 改变
   */
  handleCheckBox = (value, record) => {
    record.attr_vals = value;
  };

  /**
   * 上传文件改变
   */
  handleUploadChange = res => {
    const img = [];
    img.push({
      name: res.file.name,
      url: res.file.response?.data.url,
    });
    const { form } = this.state;
    this.setState({
      form: { ...form, pics: img },
    });
  };

  render() {
    const { goodsId, currentStep, activeTab, sortOptions } = this.state;
    return (
      <div>
        <Card style={{ padding: '20px' }}>
          <Steps current={currentStep}>
            {this.stepOptions.map(item => (
              <Step key={item.key} title={item.title} icon={item.icon}></Step>
            ))}
          </Steps>

          <Tabs activeKey={activeTab} tabPosition="left" style={{ marginTop: '50px' }}>
            {this.stepOptions
              .filter(item => Number(item.key) < 6)
              .map(item => (
                <TabPane key={item.key} tab={item.title}>
                  {(() => {
                    switch (item.key) {
                      case '1':
                        return (
                          <div>
                            <Form
                              {...this.layout}
                              labelAlign="left"
                              ref={this.formRef}
                              onFinish={this.onFinish}
                            >
                              <Form.Item
                                label="商品名称"
                                name="goods_name"
                                rules={[{ required: true, message: '请输入商品名称' }]}
                              >
                                <Input />
                              </Form.Item>

                              <Form.Item
                                label="商品价格"
                                name="goods_price"
                                rules={[{ required: true, message: '请填写商品价格' }]}
                              >
                                <Input type="number" />
                              </Form.Item>

                              <Form.Item
                                label="商品重量"
                                name="goods_weight"
                                rules={[{ required: true, message: '请填写商品重量' }]}
                              >
                                <Input type="number" />
                              </Form.Item>

                              <Form.Item
                                label="商品数量"
                                name="goods_number"
                                rules={[{ required: true, message: '请填写商品数量' }]}
                              >
                                <Input type="number" />
                              </Form.Item>

                              <Form.Item
                                label="商品分类"
                                name="goods_cat"
                                rules={[{ required: true, message: '请选择商品分类' }]}
                              >
                                <Cascader
                                  options={sortOptions}
                                  expandTrigger="hover"
                                  fieldNames={this.sortFieldProps}
                                />
                              </Form.Item>
                              <Form.Item>
                                <Button type="primary" htmlType="submit">
                                  提交
                                </Button>
                              </Form.Item>
                            </Form>
                          </div>
                        );
                      case '2':
                        const { manyParams } = this.state;
                        manyParams.forEach(item => {
                          const options = [];
                          item.attr_vals.forEach(item => {
                            options.push({
                              label: item,
                              value: item,
                            });
                          });
                          item.options = options;
                        });

                        return (
                          <div>
                            <Form
                              {...this.layout}
                              labelAlign="left"
                              ref={this.formRef}
                              onFinish={this.onFinish}
                            >
                              {manyParams.map(item => (
                                <Form.Item label={item.attr_name} key={item.attr_id}>
                                  <Checkbox.Group
                                    options={item.options}
                                    onChange={value => this.handleCheckBox(value, item)}
                                  />
                                </Form.Item>
                              ))}

                              <Form.Item>
                                <Button type="primary" htmlType="submit">
                                  提交
                                </Button>
                              </Form.Item>
                            </Form>
                          </div>
                        );
                      case '3':
                        const { onlyParams } = this.state;
                        return (
                          <div>
                            <Form
                              labelCol={{ span: 3 }}
                              wrapperCol={{ span: 21 }}
                              labelAlign="left"
                              ref={this.formRef}
                              onFinish={this.onFinish}
                            >
                              {onlyParams.map(item => (
                                <Form.Item label={item.attr_name} key={item.attr_id}>
                                  <Input value={item.attr_vals} />
                                </Form.Item>
                              ))}

                              <Form.Item>
                                <Button type="primary" htmlType="submit">
                                  提交
                                </Button>
                              </Form.Item>
                            </Form>
                          </div>
                        );
                      case '4':
                        return (
                          <div>
                            <Form
                              {...this.layout}
                              labelAlign="left"
                              ref={this.formRef}
                              onFinish={this.onFinish}
                            >
                              <Form.Item label="文件上传">
                                <Upload
                                  action={this.uploadUrl}
                                  headers={this.header}
                                  onChange={this.handleUploadChange}
                                >
                                  <Button>
                                    <UploadOutlined />
                                    点击上传
                                  </Button>
                                </Upload>
                              </Form.Item>

                              <Form.Item>
                                <Button type="primary" htmlType="submit">
                                  提交
                                </Button>
                              </Form.Item>
                            </Form>
                          </div>
                        );
                      case '5':
                        return (
                          <div>
                            <Form
                              {...this.layout}
                              labelAlign="left"
                              ref={this.formRef}
                              onFinish={this.onFinish}
                            >
                              <Form.Item
                                label="商品内容"
                                name="goods_introduce"
                                rules={[{ required: true, message: '请添加商品介绍' }]}
                              >
                                <Editor />
                              </Form.Item>

                              <Form.Item>
                                <Button type="primary" htmlType="submit">
                                  提交
                                </Button>
                              </Form.Item>
                            </Form>
                          </div>
                        );
                      default:
                        break;
                    }
                  })(item)}
                </TabPane>
              ))}
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default Add;
