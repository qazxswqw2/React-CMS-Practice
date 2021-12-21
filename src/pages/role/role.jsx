import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {connect} from 'react-redux'

import {PAGE_SIZE} from "../../utils/constants"
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'


class Role extends Component {

  state = {
    roles: [], // all roles array
    role: {}, // selected role
    isShowAdd: false, // show add interface
    isShowAuth: false, // show permission interface
  }

  constructor (props) {
    super(props)

    this.auth = React.createRef()
  }

  initColumn = () => {
    this.columns = [
      {
        title: 'Role Name',
        dataIndex: 'name'
      },
      {
        title: 'Created Time',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: 'Authorization Time',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: 'Authorizer',
        dataIndex: 'auth_name'
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status===0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }


  onRow = (role) => {
    return {
      onClick: event => { // click row
        console.log('row onClick()', role)
        this.setState({
          role
        })
      },
    }
  }

  /*
  add role
   */
  addRole = () => {
    // pass form validation
    this.form.validateFields(async (error, values) => {
      if (!error) {

        // close add comfirm
        this.setState({
          isShowAdd: false
        })

        // collect data
        const {roleName} = values
        this.form.resetFields()

        // request add role api
        const result = await reqAddRole(roleName)
       
        if (result.status===0) {
          message.success('Role added')
          
          const role = result.data
          

          // Update roles state
          this.setState(state => ({
            roles: [...state.roles, role]
          }))

        } else {
          message.success('Failed')
        }

      }
    })


  }

  /*
  Update Role
   */
  updateRole = async () => {

    
    this.setState({
      isShowAuth: false
    })

    const role = this.state.role
    // get menus data
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username

    // request update role api
    const result = await reqUpdateRole(role)
    if (result.status===0) {
      
      if (role._id === this.props.user.role_id) {
        this.props.logout()
        message.success('Success')
      } else {
        message.success('Success')
        this.setState({
          roles: [...this.state.roles]
        })
      }

    }
  }

  componentWillMount () {
    this.initColumn()
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {

    const {roles, role, isShowAdd, isShowAuth} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>Add New Role</Button> &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>Set Role Permissions</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => { // when some radio onclick then fn
              this.setState({
                role
              })
            }

          }}
          onRow={this.onRow}
        />

        <Modal
          title="Add New Role"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => this.form = form}
          />
        </Modal>

        <Modal
          title="Set Role Permissions"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
        >
          <AuthForm ref={this.auth} role={role}/>
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(Role)