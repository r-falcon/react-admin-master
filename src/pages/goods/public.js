import React from 'react';
import { Cascader } from 'antd';
import { connect } from 'dva';
class SelectOptons extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sortParams/getSortOptions',
      params: { type: 3 },
    });
  }

  render() {
    const { sortOptions, sortFieldProps } = this.props;
    return (
      <Cascader
        placeholder="请选择"
        options={sortOptions}
        expandTrigger="hover"
        fieldNames={sortFieldProps}
        onChange={this.props.handleChange}
      />
    );
  }
}

const mapStateToProps = state => {
  const { sortOptions, sortFieldProps } = state.sortParams;
  return {
    sortOptions,
    sortFieldProps,
  };
};

const SortPublic = connect(mapStateToProps)(SelectOptons);

export default SortPublic;
