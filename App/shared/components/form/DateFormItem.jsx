import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Form, DatePicker } from 'antd';
import styles from './index.less';
import { getFormItemLayout, isNullValue } from './config';
const FormItem = Form.Item;

export default class DateFormItem extends React.Component {
    render () {
        const { form, label, value, placeholder, editing, layout, range = [], required = true, hasFeedback = true, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        let disabledDate;
        let initialValue;
        if (range.length > 1) {
            const min = moment(range[0]);
            const max = moment(range[1]);
            initialValue = value[key] ? moment(value[key]) : max;
            disabledDate = (current) => {
                return current && (current.valueOf() < min.valueOf() || current.valueOf() > max.valueOf());
            };
        } else if (range.length > 0) {
            const min = moment(range[0]);
            initialValue = moment(value[key]);
            disabledDate = (current) => {
                return current && (current.valueOf() < min.valueOf());
            };
        } else {
            initialValue = moment(value[key]);
        }

        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue,
                        rules: [{ type: 'object', required, message: '请选择' + label }],
                    })(
                        <DatePicker {...otherProps} placeholder={placeholder || `请选择${label}`} disabledDate={disabledDate} />
                    ) || (
                        <span className={styles.value}>{isNullValue(value[key]) ? '无' : value[key]}</span>
                    )
                }
            </FormItem>
        );
    }
}
