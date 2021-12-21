import React, {PureComponent} from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Cascader,
  Button,
  message
} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import memoryUtils from "../../utils/memoryUtils";

const {Item} = Form
const { TextArea } = Input


class ProductAddUpdate extends PureComponent {

  state = {
    options: [],
  }

  constructor (props) {
    super(props)

    // ref label
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys) => {
    // Generate options array based on categorys
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // not a leaf child
    }))

    // Update of second class category product
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0') {
      // get the second class category list
      const subCategorys = await this.getCategorys(pCategoryId)
      // Generate options array based on categorys
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // Find the first class category option object corresponding to the current product
      const targetOption = options.find(option => option.value===pCategoryId)

      // Associate
      targetOption.children = childOptions
    }


    // update options status
    this.setState({
      options
    })
  }

  /*
  Asynchronously obtain the primary/secondary category list and show
  */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      // if first class
      if (parentId==='0') {
        this.initOptions(categorys)
      } else { // second class
        return categorys  
    }
  }
  }

  /*
  price validation
   */
  validatePrice = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() // pass
    } else {
      callback('Price must be greater than 0') // not pass
    }
  }

  /*
  callback fn for sub category
   */
  loadData = async selectedOptions => {
    // get selected option obj
    const targetOption = selectedOptions[0]
    // is loading
    targetOption.loading = true

    // get secondary class category
    const subCategorys = await this.getCategorys(targetOption.value)
    // close loading
    targetOption.loading = false
    // is second class exists
    if (subCategorys && subCategorys.length>0) {
      
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      
      targetOption.children = childOptions
    } else { 
      targetOption.isLeaf = true
    }

    // up date option status
    this.setState({
      options: [...this.state.options],
    })
  }

  submit = () => {
    // form validation pass 
    this.props.form.validateFields(async (error, values) => {
      if (!error) {

        // 1. collect data and create product obj
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        // if update, need update id
        if(this.isUpdate) {
          product._id = this.product._id
        }

        // 2. call api
        const result = await reqAddOrUpdateProduct(product)

        // 3. result success or fail
        if (result.status===0) {
          message.success(`${this.isUpdate ? 'Update' : 'Add'} Product Success!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? 'Update' : 'Add'} Product Fail!`)
        }
      }
    })
  }

  componentDidMount () {
    this.getCategorys('0')
  }

  componentWillMount () {
    // get product data from memory
    const product = memoryUtils.product 
    
    this.isUpdate = !!product._id
    // save product
    this.product = product || {}
  }

  /*
  clear product data in memory
  */
  componentWillUnmount () {
    memoryUtils.product = {}
  }

  render() {

    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product
    // 
    const categoryIds = []
    if(isUpdate) {
      // first class category product
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        // second class
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    // item layout configuration
    const formItemLayout = {
      labelCol: { span: 2 },  
      wrapperCol: { span: 8 }, 
    }

    // title left
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? 'Edit Product' : 'Add Product'}</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="Product Name">
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  {required: true, message: 'Product name must be entered'}
                ]
              })(<Input placeholder='Please enter product name'/>)
            }
          </Item>
          <Item label="product description">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  {required: true, message: 'Product description must be entered'}
                ]
              })(<TextArea placeholder="Please enter product description" autosize={{ minRows: 2, maxRows: 6 }} />)
            }

          </Item>
          <Item label="Product Price">

            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  {required: true, message: 'Must enter the product price'},
                  {validator: this.validatePrice}
                ]
              })(<Input type='number' placeholder='Please enter the product price' addonAfter='AUD'/>)
            }
          </Item>
          <Item label="Product Category">
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  {required: true, message: 'Must specify product category'},
                ]
              })(
                <Cascader
                  placeholder='Please specify product category'
                  options={this.state.options}  
                  loadData={this.loadData} 
                />
              )
            }

          </Item>
          <Item label="Product Image">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="Product Details" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>Submit</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)

