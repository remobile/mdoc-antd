import React from 'react';
import _ from 'lodash';
import { Form, InputNumber, Col } from 'antd';
import styles from './index.less';
import { getFormItemLayout, isNullValue } from './config';
const FormItem = Form.Item;

export default class SizeFormItem extends React.Component {
    constructor (props, context) {
        super(props, context);
        const key = _.keys(props.value)[0];
        this.state = {
            size: props.value[key],
        };
    }
    componentWillReceiveProps (nextProps) {
        if (this.innderUpdate) {
            this.innderUpdate = false;
            return;
        }
        const props = this.props;
        const { value } = nextProps;
        const key = _.keys(value)[0];
        const newSize = value[key];
        if (!_.isEqual(newSize, this.state.size)) {
            this.setState({ size: newSize });
            props.form.setFieldsValue({ [key]: newSize });
        }
    }
    handleChange (tag, val) {
        const { size } = this.state;
        const { form, value, onChange } = this.props;
        const key = _.keys(value)[0];
        size[tag] = val;
        this.setState({ size });
        form.setFieldsValue({ [key]: size });
        if (onChange) {
            this.innderUpdate = true;
            onChange(size);
        }
    }
    checkSize (rule, value, callback) {
        if (!(value.length > 0)) {
            callback('长度必须大于0');
        } else if (!(value.width > 0)) {
            callback('宽度必须大于0');
        } else if (!(value.height > 0)) {
            callback('高度必须大于0');
        } else {
            callback();
        }
    }
    render () {
        const { size } = this.state;
        const { form, label, value, editing, layout, required = true, hasFeedback = true, scopes = [{}], formGroup } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                className={styles.sizeForm}
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={editing && hasFeedback}
                >
                <Col span='1' style={{ color:'#A8A8A8' }}>
                    长：
                </Col>
                <Col span='4'>
                    {
                        editing &&
                        <FormItem label='' hasFeedback>
                            <InputNumber value={size.length} min={scopes[0].min} max={scopes[0].max} step={scopes[0].step} onChange={this.handleChange.bind(this, 'length')} />
                        </FormItem>
                        ||
                        <span className={styles.value}>{isNullValue(size.length) ? '无' : size.length}</span>
                    }
                </Col>
                <Col span='1' />
                <Col span='1' style={{ color:'#A8A8A8' }}>
                    宽：
                </Col>
                <Col span='4'>
                    {
                        editing &&
                        <FormItem label='' hasFeedback>
                            <InputNumber value={size.width} min={scopes.length > 1 ? scopes[1].min : scopes[0].min} max={scopes.length > 1 ? scopes[1].max : scopes[0].max} step={scopes.length > 1 ? scopes[1].step : scopes[0].step} onChange={this.handleChange.bind(this, 'width')} />
                        </FormItem>
                        ||
                        <span className={styles.value}>{isNullValue(size.width) ? '无' : size.width}</span>
                    }
                </Col>
                <Col span='1' />
                <Col span='1' style={{ color:'#A8A8A8' }}>
                    高：
                </Col>
                <Col span='4'>
                    {
                        editing &&
                        <FormItem label='' hasFeedback>
                            <InputNumber value={size.height} min={scopes.length > 2 ? scopes[2].min : scopes[0].min} max={scopes.length > 2 ? scopes[2].max : scopes[0].max} step={scopes.length > 2 ? scopes[2].step : scopes[0].step} onChange={this.handleChange.bind(this, 'height')} />
                        </FormItem>
                        ||
                        <span className={styles.value}>{isNullValue(size.height) ? '无' : size.height}</span>
                    }
                </Col>
                <Col span='1'>
                    {form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: [{ type: 'object', required, message: '请选择' + label }, { validator: ::this.checkSize }],
                    })(<span />)}
                </Col>
            </FormItem>
        );
    }
}
