import React from 'react';
import * as echarts from 'echarts';
import EChartsReact from 'echarts-for-react';
import { echartsData } from './service';

class Chart extends React.Component {
  state = {
    chartInfo: {},
  };

  componentDidMount() {
    this.getChartData();
  }

  getChartData = async () => {
    try {
      const res = await echartsData();
      this.setState({
        chartInfo: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  getOptions = chartInfo => {
    console.log('render data');
    console.log(chartInfo);

    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: chartInfo.legend,
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: chartInfo.xAxis,
      yAxis: chartInfo.yAxis,
      series: chartInfo.series,
    };
    return options;
  };

  render() {
    const { chartInfo } = this.state;
    return (
      <div>
        {JSON.stringify(chartInfo) === '{}' ? (
          'waiting'
        ) : (
          <EChartsReact option={this.getOptions(chartInfo)} lazyUpdate={true} />
        )}
      </div>
    );
  }
}

export default Chart;
