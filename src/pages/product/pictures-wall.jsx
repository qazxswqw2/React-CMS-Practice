import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants";

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, 
    previewImage: '', 
    fileList: [
      
    ],
  }

  constructor (props) {
    super(props)

    let fileList = []

    
    const {imgs} = this.props
    if (imgs && imgs.length>0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, 
        name: img, 
        status: 'done', 
        url: BASE_IMG_URL + img
      }))
    }

    // init
    this.state = {
      previewVisible: false, 
      previewImage: '', 
      fileList 
    }
  }

  /*
  get uploaded img array
   */
  getImgs  = () => {
    return this.state.fileList.map(file => file.name)
  }

  /*
  conceal Modal
   */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log('handlePreview()', file)
    // show preview img
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  /*
  file: current img
  fileList: uploaded img array
   */
  handleChange = async ({ file, fileList }) => {
    console.log('handleChange()', file.status, fileList.length, file===fileList[fileList.length-1])

    
    if(file.status==='done') {
      const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: ''}}
      if(result.status===0) {
        message.success('Upload Img Success!')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else {
        message.error('Failed')
      }
    } else if (file.status==='removed') { // delete img
      const result = await reqDeleteImg(file.name)
      if (result.status===0) {
        message.success('Image Deleted')
      } else {
        message.error('Failed')
      }
    }

    // update fileList State
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" /*upload img api*/
          accept='image/*'  /*only accept img*/
          name='image' 
          listType="picture-card"  
          fileList={fileList}  
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}