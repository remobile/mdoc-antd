import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import _ from 'lodash';
import moment from 'moment';
import { Form, Button, notification } from 'antd';
import { PlainFormItem, TextFormItem, NumberFormItem, SelectFormItem, RadioFormItem, CheckFormItem, CheckGroupFormItem, DateFormItem, DateRangeFormItem, StarFormItem, ImageFormItem, ImageListFormItem, AddressFormItem } from 'components';
import { showSuccess, showError, getCheckRules, post } from 'utils';

const DATE_FORMAT = 'YYYY-MM-DD';

@antd_form_create
export default class MdocForm extends React.Component {
    state = {
        model: this.props.model,
    };
    componentDidMount () {
        notification.config({
            placement: 'bottomLeft',
            bottom: 30,
            duration: 3,
        });
    }
    handleSubmit (e) {
        e.preventDefault();
        const { form, url } = this.props;
        const { model } = this.state;
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
                } else if (/^__address_/.test(k)) {
                    const key = k.replace(/^__address_/, '');
                    const item = _.find(model, o=>o.key===key);
                    value[key] = v.join('');
                    if (typeof item.defaultValue === 'number') {
                        value[`${key}LastCode`] = this.refs[`_address_${key}FormItem`].getAddressLastCode();
                    }
                }
            });
            value = _.omitBy(value, (v, k) => /^__.*/.test(k));
            console.log(value);
            return;

            post(url, value).then((ret)=>{
                if (!ret.success) {
                    showError(ret.msg);
                } else {
                    showSuccess('提交成功');
                }
            });
        });
    }
    handleReset (e) {
        e.preventDefault();
        this.props.form.resetFields();
    }
    onItemChange(type, key, watch, e) {
        const { model } = this.state;
        let value = e;
        if (['text', 'radio', 'check'].indexOf(type) > -1) {
            value = e.target.value;
        } else if (type === 'date') {
            const item = _.find(model, m=>m.key===key);
            value = e.format(item.format||DATE_FORMAT);
        } else if (type === 'daterange') {
            const item = _.find(model, m=>m.key===key);
            value = e.map(o=>o.format(item.format||DATE_FORMAT));
        } else if (type === 'select') {
            const item = _.find(model, m=>m.key===key);
            value = _.findKey(item.options, v => v === value);
            if (_.isArray(item.options)) {
                value = value * 1;
            }
        }
        !_.isArray(watch) && (watch = [watch]);
        let _model;
        let needUpdate = false;
        watch.forEach(o=>{
            if (typeof o === 'function') {
                o(value);
            } else {
                const item = _.find(model, m=>m.key===o.key);
                if (o.affect === 'visible') {
                    item[o.affect] = o.calc(value);
                } else {
                    !_model && ( _model = _.cloneDeep(model) );
                    const _item = _.find(_model, m=>m.key===o.key);
                    item['visible'] = false;
                    _item[o.affect] = o.calc(value);
                }
                needUpdate = true;
            }
        });
        if (needUpdate) {
            this.setState({ model }, ()=>{
                _model && this.setState({ model: _model });
            });
        }
    }
    renderFormItem(item) {
        const { form } = this.props;
        const {
            visible = true,
            watch,
            type,
            label,
            key,
            maxLength,
            min,
            step,
            max,
            required = true,
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
            count,
            width,
            height,
            addressType,
        } = item;
        if (!visible) {
            return null;
        }
        const rules = getCheckRules(item.rules);
        switch (type) {
            case 'text': {
                return <TextFormItem editing form={form} label={label} required={required} value={{ [key]: defaultValue }} maxLength={maxLength} rules={rules}  onChange={watch && this.onItemChange.bind(this, 'text', key, watch)} />;
            }
            case 'number': {
                return <NumberFormItem editing form={form} label={label} required={required} value={{ [key]: defaultValue }} min={min} step={step} max={max} maxLength={maxLength} rules={rules} precision={precision} unit={unit}  onChange={watch && this.onItemChange.bind(this, 'number', key, watch)} />;
            }
            case 'select': {
                return <SelectFormItem editing form={form} label={label} required={required} value={{ [`__select_${key}`]: defaultValue }} options={options} unit={unit} onChange={watch && this.onItemChange.bind(this, 'select', key, watch)} />;
            }
            case 'radio': {
                return <RadioFormItem editing form={form} label={label} required={required} value={{ [key]: defaultValue }} titles={titles} reverse={reverse} onChange={watch && this.onItemChange.bind(this, 'radio', key, watch)}/>;
            }
            case 'check': {
                return group
                &&
                <CheckGroupFormItem editing form={form} label={label} required={required} list={group} value={{ [key]: defaultValue }} onChange={watch && this.onItemChange.bind(this, 'checkgroup', key, watch)} />
                ||
                <CheckFormItem editing form={form} label={label} required={required} value={{ [key]: defaultValue }} onChange={watch && this.onItemChange.bind(this, 'check', key, watch)} />;
            }
            case 'date': {
                return _.isArray(defaultValue)
                &&
                <DateRangeFormItem editing form={form} label={label} required={required} value={{ [`__date_range_${key}`]: defaultValue.map(o=>moment(o)) }} showToday={showToday} showTime={showTime} format={format} range={range && range.map(o=>moment(o))} onOk={watch && this.onItemChange.bind(this, 'daterange', key, watch)} />
                ||
                <DateFormItem editing form={form} label={label} required={required} value={{ [`__date_${key}`]: moment(defaultValue) }} showToday={showToday} showTime={showTime}  format={format} range={range && range.map(o=>moment(o))} onOk={watch && this.onItemChange.bind(this, 'date', key, watch)} />;
            }
            case 'star': {
                return <StarFormItem editing form={form} label={label} required={required} value={{ [key]: defaultValue }} count={count} />;
            }
            case 'image': {
                return <ImageFormItem editing form={form} label={label} required={required} value={{ [key]: defaultValue }} width={width} height={height} />;
            }
            case 'imageList': {
                return <ImageListFormItem editing form={form} label={label} required={required} value={{ [key]: defaultValue }} count={count} width={width} height={height} />;
            }
            case 'address': {
                return <AddressFormItem editing form={form} label={label} type={addressType} required={required} value={{ [`__address_${key}`]: defaultValue }} ref={`_address_${key}FormItem`} onChange={watch && this.onItemChange.bind(this, 'address', key, watch)}/>;
            }
            default: {
                return <PlainFormItem label={label} required={required} value={defaultValue} unit={unit} />;
            }
        }

    }
    render () {
        const { model } = this.state;
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
