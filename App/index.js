import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import _ from 'lodash';
import moment from 'moment';
import { Form, Button } from 'antd';
import { PlainFormItem, TextFormItem, NumberFormItem, SelectFormItem, RadioFormItem, CheckFormItem, CheckGroupFormItem, DateFormItem, DateRangeFormItem } from 'components';
import { showError, getCheckRules } from 'utils';

const DATE_FORMAT = 'YYYY-MM-DD';

@antd_form_create
export class MdocForm extends React.Component {
    handleSubmit (e) {
        e.preventDefault();
        const { form, model } = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            _.forEach(value, (v, k)=>{
                if (/^__select_/.test(k)) {
                    const key = k.replace(/^__select_/, '');
                    const item = _.find(model, o=>o.key===key);
                    value[key] = _.findKey(item.options, v1 => v1 === v);
                    if (_.isArray(item.options)) {
                        value[key] = value[key] * 1;
                    }
                } else if (/^__date_range_/.test(k)) {
                    const key = k.replace(/^__date_range_/, '');
                    const item = _.find(model, o=>o.key===key);
                    value[key] = v.map(o=>o.format(item.format||DATE_FORMAT));
                } else if (/^__date_/.test(k)) {
                    const key = k.replace(/^__date_/, '');
                    const item = _.find(model, o=>o.key===key);
                    value[key] = v.format(item.format||DATE_FORMAT);
                }
            });
            value = _.omitBy(value, (v, k) => /^__.*/.test(k));

            console.log('========', value);
        });
    }
    handleReset (e) {
        e.preventDefault();
        this.props.form.resetFields();
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
            options,
            titles,
            reverse,
            group,
            showToday,
            showTime,
            range,
            format = DATE_FORMAT,
        } = item;
        const rules = getCheckRules(item.rules);
        switch (type) {
            case 'text':
                return <TextFormItem editing form={form} label={label} value={{ [key]: defaultValue }} maxLength={maxLength} rules={rules} />;
            case 'number':
                return <NumberFormItem editing form={form} label={label} value={{ [key]: defaultValue }} min={min} step={step} max={max} maxLength={maxLength} rules={rules} precision={precision} unit={unit} />;
            case 'select':
                return <SelectFormItem editing form={form} label={label} value={{ [`__select_${key}`]: defaultValue }} options={options} unit={unit} />;
            case 'radio':
                return <RadioFormItem editing form={form} label={label} value={{ [key]: defaultValue }} titles={titles} reverse={reverse} />
            case 'check':
                return group
                &&
                <CheckGroupFormItem editing form={form} label={label} list={group} value={{ [key]: defaultValue }} />
                ||
                <CheckFormItem editing form={form} label={label} value={{ [key]: defaultValue }} />
            case 'date':
                return _.isArray(defaultValue)
                &&
                <DateRangeFormItem editing form={form} label={label} value={{ [`__date_range_${key}`]: defaultValue.map(o=>moment(o)) }} showToday={showToday} showTime={showTime} format={format} range={range && range.map(o=>moment(o))} />
                ||
                <DateFormItem editing form={form} label={label} value={{ [`__date_${key}`]: moment(defaultValue) }} showToday={showToday} showTime={showTime}  format={format} range={range && range.map(o=>moment(o))} />
            default:
                return <PlainFormItem label={label} value={defaultValue} unit={unit} />;
        }

    }
    render () {
        const { model } = this.props;
        return (
            <Form>
                { model.map(o=>::this.renderFormItem(o)) }
                <div className={styles.buttonContainer}>
                    <Button className={styles.button} type='primary' onClick={::this.handleSubmit}>提交</Button>
                    <Button type='ghost' onClick={::this.handleReset}>清空</Button>
                </div>
            </Form>
        );
    }
}
