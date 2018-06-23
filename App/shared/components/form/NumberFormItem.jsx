import React from 'react';
import _ from 'lodash';
import { Form, InputNumber } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
const FormItem = Form.Item;

function checkMinNumber (rule, value, callback) {
    if (!value) {
        callback();
    } else if (!/^\d+(\.\d+)?$/.test(value) || value < 0.000001) {
        callback('无效数字');
    } else {
        callback();
    }
}

export default class NumberFormItem extends React.Component {
    componentWillReceiveProps (nextProps) {
        if (this.innderUpdate) {
            this.innderUpdate = false;
            return;
        }

        const props = this.props;
        if (props.onChange) {
            const { value, editing } = nextProps;
            if (!_.isEqual(value, props.value)) {
                const key = _.keys(value)[0];
                editing && props.form.setFieldsValue({ [key]: value[key] });
            }
        }
    }
    handleChange = (value) => {
        const { onChange } = this.props;
        if (onChange) {
            this.innderUpdate = true;
            onChange(value);
        }
    }
    render () {
        const { form, label, value, min, max, step, unit, editing, layout, rules, required = true, hasFeedback = true, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: getDefaultRules(label, required, rules || [ { validator: checkMinNumber } ]),
                    })(
                        <InputNumber {...otherProps} min={min} max={max} step={step} onChange={::this.handleChange} />
                    ) || (
                        <span className={styles.value}>{value[key]}</span>
                    )
                }
                { !!unit && <span className={styles.unit}>{unit}</span> }
            </FormItem>
        );
    }
}
