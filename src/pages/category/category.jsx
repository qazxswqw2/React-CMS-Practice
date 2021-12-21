import React, {Component} from 'react'
import {
  Card,
  Table,
  Button,
  Icon,
  message,
  Modal
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'


export default class Category extends Component {

  state = {
    loading: false, // is status loading
    categorys: [], // first class category
    subCategorys: [], // second class category
    parentId: '0', // The parent category ID of the currentcategory list
    parentName: '', // The parent category name of the current category list
    showStatus: 0, // 0: no display, 1: display add, 2: display update
  }

  /*
  Initialize the array of all columns of the Table
   */
  initColumns = () => {
    this.columns = [
      {
        title: 'Category Name',
        dataIndex: 'name', 
      },
      {
        title: 'Actions',
        width: 300,
        render: (category) => ( // render action labels
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>Edit Category</LinkButton>
            {this.state.parentId==='0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>Show Subcategory</LinkButton> : null}

          </span>
        )
      }
    ]
  }


  /*
  get categories data from the server
   */
  getCategorys = async (parentId) => {

    // update loading status
    this.setState({loading: true})
    parentId = parentId || this.state.parentId
    // get data
    const result = await reqCategorys(parentId)
    // close loading
    this.setState({loading: false})

    if(result.status===0) {
      const categorys = result.data
      if(parentId==='0') {
        // update first class category
        this.setState({
          categorys
        })
        console.log('----', this.state.categorys.length)
      } else {
        // update second class category
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('Error!')
    }
  }

  /*
  show sub category
   */
  showSubCategorys = (category) => {
    // update status
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { 
      console.log('parentId', this.state.parentId) // '0'
      // get sub category
      this.getCategorys()
    })
  }

  /*
  show the first class category list
   */
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  /*
  cancel button
   */
  handleCancel = () => {
    // clear input
    this.form.resetFields()
  
    this.setState({
      showStatus: 0
    })
  }

  /*
  add form status
   */
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  /*
  add category
   */
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // close comfirm form
        this.setState({
          showStatus: 0
        })

        
        const {parentId, categoryName} = values
        // clear input
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if(result.status===0) {

          // add first class category
          if(parentId===this.state.parentId) {
            this.getCategorys()
          } else if (parentId==='0'){ // Add a first class category under the second class category list
            this.getCategorys('0')
          }
        }
      }
    })
  }


  /*
  update comfirm form
   */
  showUpdate = (category) => {
    
    this.category = category
    
    this.setState({
      showStatus: 2
    })
  }

  /*
  update category
   */
  updateCategory = () => {
    console.log('updateCategory()')
    // form validation
    this.form.validateFields(async (err, values) => {
      if(!err) {
        
        this.setState({
          showStatus: 0
        })

        // prepare data
        const categoryId = this.category._id
        const {categoryName} = values
        // clear input
        this.form.resetFields()

        // 2. send update category request to the server
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status===0) {
          this.getCategorys()
        }
      }
    })


  }

  
  componentWillMount () {
    this.initColumns()
  }

  
  componentDidMount () {
    // show categories
    this.getCategorys()
  }

  render() {

    // get state
    const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state
    // get selected category
    const category = this.category || {} 

    // title left
    const title = parentId === '0' ? 'First Class Category List' : (
      <span>
        <LinkButton onClick={this.showCategorys}>First Class Category List</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    )
    // title right
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'/>
        Add
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId==='0' ? categorys : subCategorys}
          columns={this.columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />

        <Modal
          title="Add Category"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {this.form = form}}
          />
        </Modal>

        <Modal
          title="Update Category"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => {this.form = form}}
          />
        </Modal>
      </Card>
    )
  }
}