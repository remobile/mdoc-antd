import React from 'react';
import _ from 'lodash';
import { Form, InputNumber, Checkbox } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
const FormItem = Form.Item;

export default class PriceFormItem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            hasBaseValue: !!props.base,
            base: props.base,
        };
    }
    getBaseValue () {
        const { hasBaseValue, base } = this.state;
        return hasBaseValue ? base : 0;
    }
    handleBaseChange (value) {
        this.setState({ hasBaseValue: !!value, base: value });
    }
    handleCheckboxChange (e) {
        this.setState({ hasBaseValue: e.target.checked });
    }
    render () {
        const { hasBaseValue, base } = this.state;
        const { form, label, value, min, max, step, unit, editing, layout, rules, required = true, hasFeedback = true, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout)}
                label={label}
                hasFeedback={hasFeedback}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: getDefaultRules(label, required, rules),
                    })(
                        <InputNumber {...otherProps} min={min} max={max} step={step} />
                    ) || (
                        <span className={styles.value}>{value[key]}</span>
                    )
                }
                <span className={styles.unit} style={{ marginRight: unit === '元' ? 40 : 24 }}>{unit}</span>
                {
                    editing && (
                        hasBaseValue &&
                        <span>
                            <span>保底价：</span>
                            <InputNumber value={base} min={min} max={max} step={step} onChange={::this.handleBaseChange} />
                        </span>
                        ||
                        <Checkbox defaultChecked={false} onChange={::this.handleCheckboxChange}>
                            允许使用设置名次来设置{label}
                        </Checkbox>
                    ) || (
                        hasBaseValue &&
                        <span className={styles.value}>{base}</span>
                    )
                }
                { hasBaseValue && <span className={styles.unit}>{unit}</span> }
            </FormItem>
        );
    }
}
