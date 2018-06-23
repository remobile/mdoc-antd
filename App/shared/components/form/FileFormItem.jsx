import React from 'react';
import { Form, Icon, Upload } from 'antd';
import _ from 'lodash';
import { getFormItemLayout } from './config';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

const uploadProps = {
    name: 'file',
    action: '/api/uploadFile',
    supportServerRender: true,
};

export default class FileFormItem extends React.Component {
    state = {
        fileList: [],
    };
    constructor (props, context) {
        super(props, context);
        this.key = _.keys(props.value)[0];
        this.state = {
            file: { url: props.value[this.key] },
        };
    }
    componentWillReceiveProps (nextProps) {
        if (this.innderUpdate) {
            this.innderUpdate = false;
            return;
        }
        const props = this.props;
        const { value } = nextProps;
        if (!_.isEqual(value, props.value)) {
            this.setState({ file: { url: value[this.key] } });
            props.form.setFieldsValue(value);
        }
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    handleChange = (info) => {
        const { value, form, onChange } = this.props;
        const { status, originFileObj, response } = info.file;
        const { file } = this.state;
        const key = _.keys(value)[0];
        this.setState({ fileList: info.fileList.slice(-1) });
        if (status === 'uploading') {
            if (!file.base64Code) {
                this.getBase64(originFileObj, base64Code => {
                    file.base64Code = base64Code;
                });
            }
        } else if (status === 'done') {
            file.url = response.context.url;
            form.setFieldsValue({ [key]: file.url });
            if (onChange) {
                this.innderUpdate = true;
                onChange(file.url);
            }
        }
        this.setState({ file });
    };
    render () {
        const { form, label, value, layout, editing, required = true, classNames = [] } = this.props;
        const { file, fileList } = this.state;
        const key = _.keys(value)[0];
        const url = value[key];
        return (
            <FormItem
                {...getFormItemLayout(layout)}
                label={label}
                >
                {editing && form.getFieldDecorator(key, { initialValue: url, rules:[{ required, message: `请选择${label}` }] })(<span />)}
                {
                    editing &&
                    <div className={classNames[0]}>
                        <Dragger {...uploadProps} showUploadList={false} fileList={fileList} accept='.html' onChange={::this.handleChange}>
                            {
                                (file.base64Code || file.url) && <span style={{ color: '#E3E3E3' }}>可点击重传</span>
                            }
                            {
                                file.base64Code || file.url ?
                                    <iframe src={file.url || file.base64Code} className={classNames[1]} style={{ border: 0 }} />
                                :
                                    <Icon type='plus' />
                            }
                        </Dragger>
                    </div>
                    ||
                    <iframe src={url} className={classNames[0]} style={{ border: 0 }} />
                }
            </FormItem>
        );
    }
}
