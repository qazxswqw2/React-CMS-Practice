import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'
import {connect} from 'react-redux'

import LinkButton from '../link-button'
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import './index.less'
import {logout} from '../../redux/actions'

/*
left nav component
 */
class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), // get time
    dayPictureUrl: '', // weather icon url
    weather: '', // weather text
  }

  getTime = () => {
    // Get the current time every 1s, and update the status data currentTime
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }

  getWeather = async () => {
    // get weather
    const {dayPictureUrl, weather} = await reqWeather()
    // update state
    this.setState({dayPictureUrl, weather})
  }

  /*
  log out
   */
  logout = () => {
    
    Modal.confirm({
      content: 'Are you sure to quit?',
      onOk: () => {
        console.log('OK', this)
        this.props.logout()
      }
    })
  }

  /*
    in React hook
    Perform asynchronous operations: send ajax request/start timer
   */
  componentDidMount () {
    // get current time
    this.getTime()
    // get current weather
    this.getWeather()
  }
  

  /*
  Call before the current component is uninstalled
   */
  componentWillUnmount () {
    // clear time interval
    clearInterval(this.intervalId)
  }


  render() {

    const {currentTime, dayPictureUrl, weather} = this.state

    const username = this.props.user.username

    // get current head title
    const title = this.props.headTitle
    return (
      <div className="header">
        <div className="header-top">
          <span>Welcome, {username}</span>
          <LinkButton onClick={this.logout}>Logout</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  {logout}
)(withRouter(Header))