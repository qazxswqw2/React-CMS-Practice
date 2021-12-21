import React, {Component} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

/*
top component
 */
export default class App extends Component {


  render () {
    return (
      <HashRouter>
        <Switch> {/*After the match is successful, stop continuing to match*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </HashRouter>
    )
  }
}