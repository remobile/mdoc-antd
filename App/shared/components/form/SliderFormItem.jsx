import React from 'react';
import _ from 'lodash';
import { Form, Slider } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
const FormItem = Form.Item;

export default class SliderFormItem extends React.Component {
    render () {
        const { form, label, value, min, max, step, unit, editing, layout, rules, marks, dots=false, range=false, required = true, hasFeedback = true, formGroup, ...otherProps } = this.props;
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
                        rules: getDefaultRules(label, required, rules),
                    })(
                        <Slider {...otherProps} min={min} max={max} step={step} marks={marks} range={range} style={{marginRight: 50}} />
                    ) || (
                        <span className={styles.value}>{_.isArray(value[key]) ? value[key].join(' - ') : value[key]}</span>
                    )
                }
                { !!unit && !editing && <span className={styles.unit}>{unit}</span> }
            </FormItem>
        );
    }
}
