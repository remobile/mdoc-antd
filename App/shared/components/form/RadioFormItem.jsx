import React from 'react';
import _ from 'lodash';
import { Form, Radio } from 'antd';
import { getFormItemLayout } from './config';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class RadioFormItem extends React.Component {
    render () {
        const { form, label, value, editing, layout, titles, reverse, addonAfter, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                    })(
                        <RadioGroup {...otherProps} style={{ marginTop: 10 }}>
                            <Radio value={!reverse}>{titles ? titles[0] : '是'}</Radio>
                            <Radio value={!!reverse}>{titles ? titles[1] : '否'}</Radio>
                            { addonAfter }
                        </RadioGroup>
                    ) || (
                        <span >{(reverse ? !value[key] : value[key]) ? (titles ? titles[0] : '是') : titles ? titles[1] : '否'}</span>
                    )
                }
            </FormItem>
        );
    }
}
