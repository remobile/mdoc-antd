import React from 'react';
import { Form, Rate } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';

const FormItem = Form.Item;

export default class StarFormItem extends React.Component {
    static defaultProps = {
        count: 5,
    };
    render () {
        const { form, label, value, count, editing, layout, formGroup, children } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem {...getFormItemLayout(layout, formGroup)} label={label}>
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                    })(
                        <Rate count={count} />
                    ) || (
                        <Rate disabled count={count} value={value[key]} />
                    )
                }

            </FormItem>
        );
    }
}
