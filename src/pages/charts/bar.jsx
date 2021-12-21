import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component {

  state = {
    sales: [5, 20, 36, 10, 10, 20], 
    stores: [6, 10, 25, 20, 15, 10], 
  }

  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      stores: state.stores.reduce((pre, store) => {
        pre.push(store-1)
        return pre
      }, []),
    }))
  }

  /*
  bar chart configuration
   */
  getOption = (sales, stores) => {
    return {
      title: {
        text: 'ECharts Demo 1'
      },
      tooltip: {},
      legend: {
        data:['Sale', 'Stock']
      },
      xAxis: {
        data: ["item1","item2","item3","item4","item5","item6"]
      },
      yAxis: {},
      series: [{
        name: 'Sale',
        type: 'bar',
        data: sales
      }, {
        name: 'Stock',
        type: 'bar',
        data: stores
      }]
    }
  }

  render() {
    const {sales, stores} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>Update</Button>
        </Card>

        <Card title='Bar Chart 1'>
          <ReactEcharts option={this.getOption(sales, stores)} />
        </Card>

      </div>
    )
  }
}