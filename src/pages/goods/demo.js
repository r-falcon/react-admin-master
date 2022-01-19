import React from 'react';
import { connect } from 'dva';

class Demo extends React.Component {
  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demoPage/addNum',
    });
  };

  handleSub = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demoPage/subNum',
    });
  };

  handleChange = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demoPage/clickShow',
      who: 'falcon',
    });
  };

  render() {
    const { num, newStr } = this.props;
    return (
      <div>
        <p>current num is:{num}</p>
        <button onClick={this.handleAdd}>num++</button>
        <button onClick={this.handleSub}>num--</button>
        <p>current newstr is:{newStr}</p>
        <button onClick={this.handleChange}>change</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { num, newStr } = state.demoPage;
  return {
    num,
    newStr,
  };
};

export default connect(mapStateToProps)(Demo);
