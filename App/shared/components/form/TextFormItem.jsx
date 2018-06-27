import React from 'react';
import _ from 'lodash';
import { Form, Input } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules, isNullValue } from './config';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default class TextFormItem extends React.Component {
    render () {
        const { form, label, value, placeholder, editing, rows, layout, rules, style, className, required = true, hasFeedback = true, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        const option = {};
        if (rows) {
            option.type = 'textarea';
            if (_.isArray(rows)) {
                if (rows.length === 1) {
                    option.autosize = { minRows: rows[0], maxRows: rows[0] };
                } else {
                    option.autosize = { minRows: rows[0], maxRows: rows[1] };
                }
            } else {
                option.autosize = { minRows: rows, maxRows: rows };
            }
        }
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                style={style}
                className={className}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: getDefaultRules(label, required, rules),
                    })(
                        !!rows &&
                        <TextArea {...option} {...otherProps} placeholder={placeholder || `请输入${label}`} />
                        ||
                        <Input {...otherProps} placeholder={placeholder || `请输入${label}`} />
                    ) || (
                        <span className={styles.value}>{isNullValue(value[key]) ? '无' : value[key]}</span>
                    )
                }
            </FormItem>
        );
    }
}
