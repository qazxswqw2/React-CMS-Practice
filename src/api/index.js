/*
Define the API request according to the API document
 */
import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''
// Login
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// get Categories
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// Add Category
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// Update Category
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// get one Category
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// get Products
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// Update product status
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')



/*
Search product pagination list 
searchType: productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})


// delete Image
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// Add/Edit product
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')

// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')


// get roles
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// add role
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
// update role
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')


// get users
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// delete user
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
// add/update user
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

/*
jsonp to get weather
Solve cross-domain GET requests issues
 */
export const reqWeather = () => {

  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Melbourne,au&appid=911bdbd9749af9ffa52fabb2f46d1258`
    // performing jsonp request
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data)
      
      if (!err) {
        
        const {main, icon} = data.weather[0]
        const dayPictureUrl = `http://openweathermap.org/img/wn/${icon}.png`
        const weather = main
        resolve({dayPictureUrl, weather})
      } else {
        
        message.error('Failed to get weather information!')
      }

    })
  })
}
