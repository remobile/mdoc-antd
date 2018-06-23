import React from 'react';
import { Form } from 'antd';
import styles from './index.less';
import { _N } from 'utils';
import { getFormItemLayout, isNullValue } from './config';
const FormItem = Form.Item;

export default class PlainFormItem extends React.Component {
    render () {
        const { label, layout, unit, value, formGroup, children } = this.props;
        const _value = unit ? _N(value || 0) : value;
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                >
                { !isNullValue(_value) && <span className={styles.value}>{_value}{ !!unit && <span className={styles.unit}>{unit}</span> }</span> }
                {children}
                {!(children || !isNullValue(_value)) && '无'}
            </FormItem>
        );
    }
}
