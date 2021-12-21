import React, {Component} from 'react'
import {Button, Row, Col} from 'antd'
import {connect} from 'react-redux'

import {setHeadTitle} from '../../redux/actions'
import './not-found.less'

class NotFound extends Component {

  goHome = () => {
    this.props.setHeadTitle('Home')
    this.props.history.replace('/home')
  }

  render() {
    return (

      <Row className='not-found'>
        <Col span={12} className='left'></Col>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>Sorry, the page you visited does not exist</h2>
          <div>
            <Button type='primary' onClick={this.goHome}>
              Back to Home Page
            </Button>
          </div>
        </Col>
      </Row>
    )
  }
}

export default connect(
  null,
  {setHeadTitle}
)(NotFound)