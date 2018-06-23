import React from 'react';
import { Form, Icon, Upload, Modal } from 'antd';
import _ from 'lodash';
import styles from './index.less';
import { formatFileSize, getFormItemLayout } from './config';
import { showError } from '../../utils/confirm';
const FormItem = Form.Item;

const uploadProps = {
    name: 'file',
    action: '/api/uploadFile',
    supportServerRender: true,
};

function getCheckValidator (label, count) {
    return (rule, value, callback) => {
        if (!value || value.length < count) {
            callback(`请选择 ${label} `);
        } else {
            callback();
        }
    };
}

export default class ImageListFormItem extends React.Component {
    static defaultProps = {
        maxSize: 500 * 1024, // 500K
    };
    constructor (props, context) {
        super(props, context);
        const key = _.keys(props.value)[0];
        const fileList = props.value[key] ? props.value[key].map((o, i) => ({ url: o, status: 'done', uid: -i })) : [];
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList,
        };
    }
    componentWillReceiveProps (nextProps) {
        if (this.innderUpdate) {
            this.innderUpdate = false;
            return;
        }

        const props = this.props;
        const { value, editing } = nextProps;
        if (!_.isEqual(value, props.value)) {
            const key = _.keys(value)[0];
            const fileList = value[key] ? value[key].map((o, i) => ({ url: o, status: 'done', uid: -i })) : [];
            this.setState({ fileList });
            editing && props.form.setFieldsValue({ [key]: value[key] });
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    handleChange = ({ fileList }) => {
        const { form, value, onChange } = this.props;
        const key = _.keys(value)[0];
        this.setState({ fileList }, () => {
            if (_.every(fileList, o => o.status === 'done')) {
                const urls = fileList.map(o => o.url || (o.status === 'done' ? o.response.context.url : undefined));
                form.setFieldsValue({ [key]: urls });
                if (onChange) {
                    this.innderUpdate = true;
                    onChange(urls);
                }
            }
        });
    };
    beforeUpload (file) {
        const { maxSize } = this.props;
        if (file.size > maxSize) {
            showError('图片大小不能超过' + formatFileSize(maxSize));
            return false;
        }
        return true;
    }
    render () {
        const { form, label, layout, editing, count, value, required = true, classNames = [] } = this.props;
        const { previewVisible, previewImage, fileList } = this.state;
        const key = _.keys(value)[0];
        const uploadButton = (
            <div>
                <Icon type='plus' style={{ fontSize: 40, color: '#999' }} />
                <div style={{ fontSize: 8 }}>Upload</div>
            </div>
        );
        return (
            <FormItem
                {...getFormItemLayout(layout)}
                label={label}
                className={styles.imageList}
                >
                {editing && form.getFieldDecorator(key, { initialValue: value[key], rules:[ { required, message: `请选择${label}` }, { validator: getCheckValidator(label, count) } ] })(<span style={{ marginTop: 10 }} />)}
                <div className={classNames[0]}>
                    <Upload
                        {...uploadProps}
                        accept='.jpg,.png'
                        listType='picture-card'
                        fileList={fileList}
                        beforeUpload={::this.beforeUpload}
                        onPreview={::this.handlePreview}
                        onRemove={editing}
                        onChange={::this.handleChange}
                        className={classNames[1]}
                        >
                        {(!editing || fileList.length >= count) ? null : uploadButton}
                    </Upload>
                </div>
                {
                    previewVisible &&
                    <Modal visible footer={null} className={styles.imageModal} onCancel={this.handleCancel}>
                        <img style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                }
            </FormItem>
        );
    }
}
