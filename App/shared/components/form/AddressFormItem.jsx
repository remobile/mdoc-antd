import React from 'react';
import _ from 'lodash';
import { Form, Cascader } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
const FormItem = Form.Item;

function getCheckValidator (label, options, needWhole) {
    return (rule, value, callback) => {
        if (!value || !value.length) {
            callback();
        } else {
            let item;
            for (const v of value) {
                item = _.find(options, m => m.value === v);
                if (!item) {
                    break;
                }
                options = item.children;
            }
            if (needWhole && (!item || !item.isLeaf)) {
                callback(`请选择完整${label}`);
            } else {
                callback();
            }
        }
    };
}

function getRegionAddress (parentCode, type = 0, callback) {
}

export default class AddressFormItem extends React.Component {
    static defaultProps = {
        type: 0,
    };
    constructor (props) {
        super(props);
        this.state = {
            options: props.options,
        };
    }
    componentDidMount () {
        const { form, value } = this.props;
        form.setFieldsValue(value);
    }
    componentWillReceiveProps (nextProps) {
        const { options, value } = nextProps;
        if (options && !_.isEqual(options, this.props.options)) {
            this.setState({ options });
        }
        if (value && !_.isEqual(value, this.props.value)) {
            this.props.form.setFieldsValue(value);
        }
    }
    loadData (selectedOptions) {
        const type = this.props.type;
        const item = selectedOptions[selectedOptions.length - 1];
        item.loading = true;
        getRegionAddress(item.code, type, (address) => {
            item.children = address && address.map(o => ({ value: o.name, label: o.name, code: o.code, level: o.level, isLeaf: type !== 2 ? o.isLeaf : o.level === 10 || o.level === 100 }));
            item.loading = false;
            this.setState({
                options: [...this.state.options],
            });
        });
    }
    onChange (value, selectedOptions) {
        const { onChange } = this.props;
        onChange && onChange(selectedOptions[selectedOptions.length - 1]);
    }
    getAddressLastCode () {
        return (this.getAddressLastItem() || {}).code;
    }
    getAddressLastItem () {
        let lastItem;
        let { options } = this.state;
        const { form, value } = this.props;
        const key = _.keys(value)[0];
        const values = form.getFieldValue(key);
        if (values) {
            for (const v of values) {
                const item = _.find(options, o => o.value === v);
                if (item) {
                    lastItem = item;
                    options = item.children;
                }
            }
        }
        return lastItem;
    }
    getAddressOptions () {
        return this.state.options;
    }
    render () {
        const { options } = this.state;
        const { form, label, value, editing, layout, placeholder, rules, required = true, needWhole = true, hasFeedback = true, disabled, formGroup, addonAfter } = this.props;
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
                        rules: getDefaultRules(label, required, rules || [ { validator: getCheckValidator(label, options, needWhole) } ], '选择'),
                    })(
                        <Cascader
                            placeholder={placeholder || `请选择${label}`}
                            options={options}
                            loadData={::this.loadData}
                            onChange={::this.onChange}
                            changeOnSelect
                            disabled={disabled}
                            />
                    ) || (
                        <span className={styles.value}>{value[key]}</span>
                    )
                }
                {editing && addonAfter}
            </FormItem>
        );
    }
}
