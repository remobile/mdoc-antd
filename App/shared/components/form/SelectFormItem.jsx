import React from 'react';
import { Form, Select } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import { getFormItemLayout, getDefaultRules } from './config';
const FormItem = Form.Item;
const Option = Select.Option;

export default class SelectFormItem extends React.Component {
    render () {
        const { form, label, value, options, unit, editing, layout, rules, required = true, hasFeedback = true, addonAfter, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        const initialValue = _.isArray(value[key]) ? _.map(value[key], o => options[o]) : options[value[key]];

        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue,
                        rules: getDefaultRules(label, required, rules),
                    })(
                        <Select placeholder={`请选择${label}`} {...otherProps}>
                            { _.values(_.mapValues(options, (v, k) => <Option key={k} value={v}>{v}</Option>))}
                        </Select>
                    ) || (
                        <span className={styles.value}>{_.isArray(initialValue) ? initialValue.join('; ') : initialValue}</span>
                    )
                }
                { !!unit && <span className={styles.unit}>{unit}</span> }
                { editing && addonAfter }
            </FormItem>
        );
    }
}
