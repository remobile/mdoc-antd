import React from 'react';
import _ from 'lodash';
import { Form, Checkbox } from 'antd';
import { getFormItemLayout } from './config';
const FormItem = Form.Item;

export default class CheckFormItem extends React.Component {
    render () {
        const { form, label, value, editing, layout, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup, editing)}
                label={!editing ? label : undefined}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                    })(
                        <Checkbox defaultChecked={value[key]} {...otherProps}>
                            {label}
                        </Checkbox>
                    ) || (
                        <span >{value[key] ? '是' : '否'}</span>
                    )
                }
            </FormItem>
        );
    }
}
