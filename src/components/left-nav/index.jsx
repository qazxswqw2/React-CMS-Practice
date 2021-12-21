import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'
import {connect} from 'react-redux'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import {setHeadTitle} from '../../redux/actions'

const SubMenu = Menu.SubMenu;

class LeftNav extends Component {

  /*
  Determine if the user has permission
   */
  hasAuth = (item) => {
    const {key, isPublic} = item

    const menus = this.props.user.role.menus
    const username = this.props.user.username
    /*
    1. if the user is admin
    2. if this item is public
    3. if the user has permission: Is the key in the menus
     */
    if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
      return true
    } else if(item.children){ // 4. if the user has permission of children of this item
      return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
    }

    return false
  }

  /*
  Iterate through the menu array
  */
  getMenuNodes_map = (menuList) => {

    const path = this.props.location.pathname

    return menuList.map(item => {
      
      if (this.hasAuth(item)) {

      if(!item.children) {

        // if current item is the current path
        if (item.key===path || path.indexOf(item.key)===0) {
          // Update the headerTitle status in redux
          this.props.setHeadTitle(item.title)
        }

        return (
          <Menu.Item key={item.key}>
            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {

        // Find a sub Item that matches the current request path
        const cItem = item.children.find(cItem => cItem.key===path)
        // open the sub Item
        if (cItem) {
          this.openKey = item.key
        }
        

        return (
          <SubMenu
            key={item.key}
            title={
              <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
            }
          >
            {/* Recursion to show sub menu */}
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        )
      }

      }  
    })
  }

  /*
  get menu list before render
   */
  componentWillMount () {
    this.menuNodes = this.getMenuNodes_map(menuList)
  }

  render() {
    
    // get current path
    let path = this.props.location.pathname
    console.log('render()', path)
    if(path.indexOf('/product')===0) { // The current request is the product or its sub-routing
    }

    // Get the menu item key that needs to be open
    const openKey = this.openKey

    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>CMS</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
        >

          {
            this.menuNodes
          }

        </Menu>
      </div>
    )
  }
}

/*
withRouter:

The new component passes 3 attributes 
to non-routing components: history/location/match
 */
export default connect(
  state => ({user: state.user}),
  {setHeadTitle}
)(withRouter(LeftNav))