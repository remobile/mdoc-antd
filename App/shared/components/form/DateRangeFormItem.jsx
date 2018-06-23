import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Form, DatePicker } from 'antd';
import styles from './index.less';
import { getFormItemLayout, isNullValue } from './config';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

export default class DateRangeFormItem extends React.Component {
    render () {
        const { form, label, value, editing, layout, format, range = [], required = true, hasFeedback = true, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        let disabledDate;
        let initialValue = value[key][0];
        const start = moment(value[key][0]);
        const end = moment(value[key][1]);
        if (range.length > 1) {
            const min = moment(range[0]);
            const max = moment(range[1]);
            initialValue = initialValue ? [ start.isBefore(min) ? min : start.isAfter(max) ? max : start, end.isAfter(max) ? max : end.isBefore(min) ? min : end ] : undefined;
            disabledDate = (current) => {
                return current && (current.valueOf() < min.valueOf() || current.valueOf() > max.valueOf());
            };
        } else if (range.length > 0) {
            const min = moment(range[0]);
            initialValue = initialValue ? [ start.isBefore(min) ? min : start, end.isBefore(min) ? min : end ] : undefined;
            disabledDate = (current) => {
                return current && (current.valueOf() < min.valueOf());
            };
        } else {
            initialValue = initialValue ? [ start, end ] : undefined;
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
                        rules: [{ type: 'array', required, message: '请选择' + label }],
                    })(
                        <RangePicker {...otherProps} format={format} disabledDate={disabledDate} />
                    ) || (
                        <span className={styles.value}>
                            {
                                isNullValue(value[key][0]) ? '无' : `从 ${moment(value[key][0]).format(format)} 到 ${moment(value[key][1]).format(format)}`
                            }
                        </span>
                    )
                }
            </FormItem>
        );
    }
}
