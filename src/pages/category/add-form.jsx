import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired, // The function to pass the form object
    categorys: PropTypes.array.isRequired, // first class categories array
    parentId: PropTypes.string.isRequired, // parent category id
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {
    const {categorys, parentId} = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option value='0'>First Class Category</Option>
                {
                  categorys.map(c => <Option value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }

        </Item>

        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [
                {required: true, message: 'Category name must be entered'}
              ]
            })(
              <Input placeholder='Please enter a category name'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)