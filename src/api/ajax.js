/*
Function module that can send asynchronous ajax requests
Package axios library
 */

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET') {

  return new Promise((resolve, reject) => {
    let promise
    
    if(type==='GET') { // performing a GET request
      promise = axios.get(url, { 
        params: data 
      })
    } else { //  performing a POST request
      promise = axios.post(url, data)
    }
    
    // all Promise Requests handling exception
    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
      // reject(error)
      message.error('Error: ' + error.message)
    })
  })


}
