import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import _ from 'lodash';
import { Form } from 'antd';
import { PlainFormItem, TextFormItem, NumberFormItem } from 'components';
import { showError, getCheckRules } from 'utils';

@antd_form_create
export class MdocForm extends React.Component {
    handleSubmit (e) {
        e.preventDefault();
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            console.log('========', value);
        });
    }
    renderFormItem(item) {
        const { form } = this.props;
        const {
            type,
            label,
            key,
            maxLength,
            min,
            step,
            max,
            required,
            unit,
            precision = 0,
            defaultValue ='',
        } = item;
        const rules = getCheckRules(item.rules);
        switch (type) {
            case 'text':
                return <TextFormItem editing form={form} label={label} value={{ [key]: defaultValue }} maxLength={maxLength} rules={rules} />;
            break;
            case 'number':
                return <NumberFormItem editing form={form} label={label} value={{ [key]: defaultValue }} min={min} step={step} max={max} maxLength={maxLength} rules={rules} precision={precision} unit={unit} />;
            break;
            default:
                return <PlainFormItem label={label} value={defaultValue} unit={unit} />;
        }

    }
    render () {
        const { model } = this.props;
        return (
            <Form>
                { model.map(o=>::this.renderFormItem(o)) }
            </Form>
        );
    }
}
