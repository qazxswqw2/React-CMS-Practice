import React, {Component} from 'react'
import {
  Card,
  Icon,
  List
} from 'antd'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'
import memoryUtils from "../../utils/memoryUtils";

const Item = List.Item



export default class ProductDetail extends Component {

  state = {
    cName1: '', // first class category
    cName2: '', // second class category
  }

  async componentDidMount () {

    // get product id
    const {pCategoryId, categoryId} = memoryUtils.product
    if(pCategoryId==='0') { // first class
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { // second class
      
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }

  }

  /*
 clear data
 */
  componentWillUnmount () {
    memoryUtils.product = {}
  }


  render() {

    // get data from memory
    const {name, desc, price, detail, imgs} = memoryUtils.product
    const {cName1, cName2} = this.state

    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={{marginRight: 10, fontSize: 20}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>

        <span>Product Details</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className="left">Product Name:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">Product Description:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">Product Price:</span>
            <span>{price} AUD</span>
          </Item>
          <Item>
            <span className="left">Product Category:</span>
            <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
          </Item>
          <Item>
            <span className="left">Product Image:</span>
            <span>
              {
                imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">Product Details:</span>
            <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
          </Item>

        </List>
      </Card>
    )
  }
}