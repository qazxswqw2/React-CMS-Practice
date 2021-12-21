import React, {Component} from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from "../../utils/memoryUtils";

const Option = Select.Option


export default class ProductHome extends Component {

  state = {
    total: 0, // number of products
    products: [], // array of products
    loading: false, // is loading
    searchName: '', // search by name
    searchType: 'productName', // search type
  }

  /*
  init table
   */
  initColumns = () => {
    this.columns = [
      {
        title: 'Product Name',
        dataIndex: 'name',
      },
      {
        title: 'Product Description',
        dataIndex: 'desc',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render: (price) => '$' + price  
      },
      {
        width: 100,
        title: 'Status',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status===1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? 'off sale' : 'on sale'}
              </Button>
              <span>{status===1 ? 'on sale' : 'off sale'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: 'Actions',
        render: (product) => {
          return (
            <span>
              {/*send state to routes*/}
              <LinkButton onClick={() => this.showDetail(product)}>Details</LinkButton>
              <LinkButton onClick={() => this.showUpdate(product)}>Edit</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  /*
  details
   */
  showDetail = (procut) => {
    // send data to detail component
    memoryUtils.product = procut
    this.props.history.push('/product/detail')
  }

  /*
  Edit
   */
  showUpdate = (procut) => {
    // send data
    memoryUtils.product = procut
    this.props.history.push('/product/addupdate')
  }

  /*
  get page list
   */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum // save page number
    this.setState({loading: true}) // loading on

    const {searchName, searchType} = this.state
    
    let result
    if (searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else { 
      result = await reqProducts(pageNum, PAGE_SIZE)
    }

    this.setState({loading: false}) // loading off
    if (result.status === 0) {
      // get data and update
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }

  /*
  update product status
   */
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if(result.status===0) {
      message.success('Updated')
      this.getProducts(this.pageNum)
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getProducts(1)
  }

  render() {

    // get data
    const {products, total, loading, searchType, searchName} = this.state



    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='productName'>By Name</Option>
          <Option value='productDesc'>By Desc</Option>
        </Select>
        <Input
          placeholder='Keyword'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={event => this.setState({searchName:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'/>
        Add New Product
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}