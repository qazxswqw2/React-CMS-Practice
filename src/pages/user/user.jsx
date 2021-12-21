import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'


export default class User extends Component {

  state = {
    users: [], // all users list
    roles: [], // all roles list
    isShow: false, // confirm show status
  }

  initColumns = () => {
    this.columns = [
      {
        title: 'Username',
        dataIndex: 'username'
      },
      {
        title: 'Email',
        dataIndex: 'email'
      },

      {
        title: 'Phone Number',
        dataIndex: 'phone'
      },
      {
        title: 'Created Time',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: 'Role',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: 'Actions',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>Edit</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
          </span>
        )
      },
    ]
  }

  /*
  init role
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // save data
    this.roleNames = roleNames
  }

  /*
  show add interface
   */
  showAdd = () => {
    this.user = null // clear saved user
    this.setState({isShow: true})
  }

  /*
  show update interface
   */
  showUpdate = (user) => {
    this.user = user // save user data
    this.setState({
      isShow: true
    })
  }

  /*
  delete user
   */
  deleteUser = (user) => {
    Modal.confirm({
      title: `Delete ${user.username}?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('Deleted!')
          this.getUsers()
        }
      }
    })
  }

  /*
  add/update user
   */
  addOrUpdateUser = async () => {

    this.setState({isShow: false})

    // 1. collect data
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    // if update, give a id
    if (this.user) {
      user._id = this.user._id
    }

    // 2. request for add/update api
    const result = await reqAddOrUpdateUser(user)
    // 3. render
    if(result.status===0) {
      message.success(`${this.user ? 'Edit' : 'Add'} user success`)
      this.getUsers()
    }
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status===0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }


  render() {

    const {users, roles, isShow} = this.state
    const user = this.user || {}

    const title = <Button type='primary' onClick={this.showAdd}>Add New User</Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: 2}}
        />

        <Modal
          title={user._id ? 'Edit User' : 'Add New User'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>

      </Card>
    )
  }
}