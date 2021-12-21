import React, {Component} from 'react'
import {
  Icon,
  Card,
  Statistic,
  DatePicker,
  Timeline
} from 'antd'
import moment from 'moment'

import Line from './line'
import Bar from './bar'
import './home.less'

const dateFormat = 'DD/MM/YYYY'
const {RangePicker} = DatePicker

export default class Home extends Component {

  state = {
    isVisited: true
  }

  handleChange = (isVisited) => {
    return () => this.setState({isVisited})
  }

  render() {
    const {isVisited} = this.state

    return (
      <div className='home'>
        <Card
          className="home-card"
          title="Products in total"
          extra={<Icon style={{color: 'rgba(0,0,0,.45)'}} type="question-circle"/>}
          style={{width: 250}}
          headStyle={{color: 'rgba(0,0,0,.45)'}}
        >
          <Statistic
            value={1128163}
            suffix=""
            style={{fontWeight: 'bolder'}}
          />
          <Statistic
            value={15}
            valueStyle={{fontSize: 15}}
            prefix={'Weekly'}
            suffix={<div>%<Icon style={{color: 'red', marginLeft: 10}} type="arrow-down"/></div>}
          />
          <Statistic
            value={10}
            valueStyle={{fontSize: 15}}
            prefix={'Daily'}
            suffix={<div>%<Icon style={{color: '#3f8600', marginLeft: 10}} type="arrow-up"/></div>}
          />
        </Card>

        <Line/>

        <Card
          className="home-content"
          title={<div className="home-menu">
            <span className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'}
                  onClick={this.handleChange(true)}>Vistors</span>
            <span className={isVisited ? "" : 'home-menu-active'} onClick={this.handleChange(false)}>Sales</span>
          </div>}
          extra={<RangePicker
            defaultValue={[moment('2019/01/01', dateFormat), moment('2019/06/01', dateFormat)]}
            format={dateFormat}
          />}
        >
          <Card
            className="home-table-left"
            title={isVisited ? 'Vistor Trends' : 'Sale Trends'}
            bodyStyle={{padding: 0, height: 275}}
            extra={<Icon type="reload"/>}
          >
            <Bar/>
          </Card>

          <Card title='Missions' extra={<Icon type="reload"/>} className="home-table-right">
            <Timeline>
              <Timeline.Item color="green">1</Timeline.Item>
              <Timeline.Item color="green">2</Timeline.Item>
              <Timeline.Item color="red">
                <p>3</p>
                <p>4</p>
              </Timeline.Item>
              <Timeline.Item>
                <p>5</p>
                <p>6</p>
                <p>7</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Card>
      </div>
    )
  }
}