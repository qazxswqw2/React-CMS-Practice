import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {
  Form,
  Icon,
  Input,
  Button,
} from 'antd'
import {connect} from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo.png'
import {login} from '../../redux/actions'

const Item = Form.Item  // get form.item

/*
login component
 */
class Login extends Component {

  handleSubmit = (event) => {

    // Prevent default submit
    event.preventDefault()

    // Check all form fields
    this.props.form.validateFields(async (err, values) => {
      
      if (!err) {
        
        const {username, password} = values

        this.props.login(username, password)

      } else {
        console.log('Validation Failed!')
      }
    });

    // get form Object
    // const form = this.props.form
    // // Get the input data of the form item
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()', values)
  }

  
  validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('Password must be entered')
    } else if (value.length<4) {
      callback('Password length cannot be less than 4 digits')
    } else if (value.length>12) {
      callback('Password length cannot be greater than 12 digits')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('The password must be composed of English letters, numbers or underscores')
    } else {
      callback() 
    }
  }

  render () {

    // If the user has logged in, it will automatically jump to the management interface
    const user = this.props.user
    if(user && user._id) {
      return <Redirect to='/home'/>
    }

    // get form Object
    const form = this.props.form
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React Project: CMS</h1>
        </header>
        <section className="login-content">
          <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
          <h2>User Login</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {
                getFieldDecorator('username', { 
                  // Declarative verification
                  rules: [
                    { required: true, whitespace: true, message: 'Username must be entered' },
                    { min: 4, message: 'At least 4 usernames' },
                    { max: 12, message: 'Up to 12 usernames' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username must be composed of English letters, numbers or underscores' },
                  ],
                  initialValue: 'admin', // Initial value
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="username"
                  />
                )
              }
            </Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="password"
                  />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Login
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}


/*
antd API: Pass a powerful object attribute to the Form component: form
 */
const WrapLogin = Form.create()(Login)
export default connect(
  state => ({user: state.user}),
  {login}
)(WrapLogin)




