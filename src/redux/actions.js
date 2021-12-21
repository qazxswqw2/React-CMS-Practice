/*
redux action-creators
 */
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from './action-types'
import {reqLogin} from '../api'
import storageUtils from "../utils/storageUtils";

/*
head title action
 */
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})

/*
receive user action
 */
export const receiveUser = (user) => ({type: RECEIVE_USER, user})

/*
error message action
 */
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

/*
log out action
 */
export const logout = () =>  {
  // delete user from local
  storageUtils.removeUser()

  return {type: RESET_USER}
}

/*
login action
 */
export const login = (username, password) => {
  return async dispatch => {
    // async + await to simplify promise request
    const result = await reqLogin(username, password)  // {status: 0, data: user} {status: 1, msg: 'xxx'}
    
    if(result.status===0) {
      const user = result.data
      // save user in local
      storageUtils.saveUser(user)
      
      dispatch(receiveUser(user))
    } else { 
      const msg = result.msg
      // message.error(msg)
      dispatch(showErrorMsg(msg))
    }

  }
}
