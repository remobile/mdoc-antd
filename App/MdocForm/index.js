import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import _ from 'lodash';
import moment from 'moment';
import { Form, Button, notification } from 'antd';
import { PlainFormItem, TextFormItem, NumberFormItem, SelectFormItem, RadioFormItem, CheckFormItem, CheckGroupFormItem, DateFormItem, DateRangeFormItem, StarFormItem, ImageFormItem, ImageListFormItem, AddressFormItem } from 'components';
import { showSuccess, showError, getCheckRules, getAddressOptions, post } from 'utils';

const DATE_FORMAT = 'YYYY-MM-DD';
const addressList=[{"isLeaf":true,"id":1,"code":11,"parentCode":0,"name":"北京","level":0},{"isLeaf":true,"id":336,"code":12,"parentCode":0,"name":"天津","level":0},{"isLeaf":false,"id":632,"code":13,"parentCode":0,"name":"河北","level":2},{"isLeaf":false,"id":3098,"code":14,"parentCode":0,"name":"山西","level":2},{"isLeaf":false,"id":4666,"code":15,"parentCode":0,"name":"内蒙古","level":2},{"isLeaf":false,"id":5824,"code":21,"parentCode":0,"name":"辽宁","level":2},{"isLeaf":false,"id":7528,"code":22,"parentCode":0,"name":"吉林","level":2},{"isLeaf":false,"id":8555,"code":23,"parentCode":0,"name":"黑龙江","level":2},{"isLeaf":true,"id":10540,"code":31,"parentCode":0,"name":"上海","level":0},{"isLeaf":false,"id":10803,"code":32,"parentCode":0,"name":"江苏","level":2},{"isLeaf":false,"id":12591,"code":33,"parentCode":0,"name":"浙江","level":2},{"isLeaf":false,"id":14229,"code":34,"parentCode":0,"name":"安徽","level":2},{"isLeaf":false,"id":16063,"code":35,"parentCode":0,"name":"福建","level":2},{"isLeaf":false,"id":17354,"code":36,"parentCode":0,"name":"江西","level":2},{"isLeaf":false,"id":19275,"code":37,"parentCode":0,"name":"山东","level":2},{"isLeaf":false,"id":21382,"code":41,"parentCode":0,"name":"河南","level":2},{"isLeaf":false,"id":24017,"code":42,"parentCode":0,"name":"湖北","level":2},{"isLeaf":false,"id":25574,"code":43,"parentCode":0,"name":"湖南","level":2},{"isLeaf":false,"id":28235,"code":44,"parentCode":0,"name":"广东","level":2},{"isLeaf":false,"id":30163,"code":45,"parentCode":0,"name":"广西","level":2},{"isLeaf":false,"id":31562,"code":46,"parentCode":0,"name":"海南","level":2},{"isLeaf":false,"id":31928,"code":50,"parentCode":0,"name":"重庆","level":1},{"isLeaf":false,"id":33005,"code":51,"parentCode":0,"name":"四川","level":2},{"isLeaf":false,"id":37904,"code":52,"parentCode":0,"name":"贵州","level":2},{"isLeaf":false,"id":39555,"code":53,"parentCode":0,"name":"云南","level":2},{"isLeaf":false,"id":41102,"code":54,"parentCode":0,"name":"西藏","level":2},{"isLeaf":false,"id":41876,"code":61,"parentCode":0,"name":"陕西","level":2},{"isLeaf":false,"id":43775,"code":62,"parentCode":0,"name":"甘肃","level":2},{"isLeaf":false,"id":45285,"code":63,"parentCode":0,"name":"青海","level":2},{"isLeaf":false,"id":45752,"code":64,"parentCode":0,"name":"宁夏","level":2},{"isLeaf":false,"id":46046,"code":65,"parentCode":0,"name":"新疆","level":2}];

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
                    if (item.hasLastCode) {
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
        if (typeof watch === 'function') {
            watch(value);
        } else {
            let _model;
            watch.forEach(o=>{
                const item = _.find(model, m=>m.key===o.key);
                if (o.affect === 'visible') {
                    item[o.affect] = o.calc(value);
                } else {
                    !_model && ( _model = _.cloneDeep(model) );
                    const _item = _.find(_model, m=>m.key===o.key);
                    item['visible'] = false;
                    _item[o.affect] = o.calc(value);
                }
            });
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
                return <AddressFormItem editing form={form} label={label} required={required} value={{ [`__address_${key}`]: defaultValue || [] }} options={_.map(addressList, o => ({ value: o.name, label: o.name, code: o.code, level: o.level, isLeaf: o.isLeaf }))} ref={`_address_${key}FormItem`} />;
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
