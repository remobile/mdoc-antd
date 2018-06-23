import React from 'react';
import _ from 'lodash';
import { Form, Input } from 'antd';
import styles from './index.less';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDelete from 'material-ui/svg-icons/action/delete';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import { getFormItemLayout, getDefaultRules, isNullValue } from './config';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default class TextFormItem extends React.Component {
    componentWillReceiveProps (nextProps) {
        if (this.innderUpdate) {
            this.innderUpdate = false;
            return;
        }
        const props = this.props;
        if (props.onChange) {
            const { value, editing } = nextProps;
            if (!_.isEqual(value, props.value)) {
                const key = _.keys(value)[0];
                editing && props.form.setFieldsValue({ [key]: value[key] });
            }
        }
    }
    handleChange = (e) => {
        const { onChange } = this.props;
        if (onChange) {
            this.innderUpdate = true;
            onChange(e.target.value);
        }
    }
    render () {
        const { form, label, value, placeholder, editing, rows, layout, rules, buttons = [], style, className, required = true, hasFeedback = true, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        const option = {};
        if (rows) {
            option.type = 'textarea';
            if (_.isArray(rows)) {
                if (rows.length === 1) {
                    option.autosize = { minRows: rows[0], maxRows: rows[0] };
                } else {
                    option.autosize = { minRows: rows[0], maxRows: rows[1] };
                }
            } else {
                option.autosize = { minRows: rows, maxRows: rows };
            }
        }
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                style={style}
                className={className}
                >
                <div className={buttons.length ? styles.iconButtonContainer : ''}>
                    {
                        !!buttons.length && buttons.map((item, i) => (
                            item.visible &&
                            <FloatingActionButton secondary={item.type === 'delete'} key={i} className={styles.iconButton} onTouchTap={item.onClick}>
                                {
                                    item.type === 'add' ? <ContentAdd /> :
                                    item.type === 'delete' ? <ContentDelete /> :
                                    item.type === 'up' ? <NavigationArrowUpward /> :
                                    <NavigationArrowDownward />
                                }
                            </FloatingActionButton>
                        ))
                    }
                    {
                        editing && form.getFieldDecorator(key, {
                            initialValue: value[key],
                            rules: getDefaultRules(label, required, rules),
                        })(
                            !!rows &&
                            <TextArea {...option} {...otherProps} placeholder={placeholder || `请输入${label}`} onChange={::this.handleChange} />
                            ||
                            <Input {...otherProps} placeholder={placeholder || `请输入${label}`} onChange={::this.handleChange} />
                        ) || (
                            <span className={styles.value}>{isNullValue(value[key]) ? '无' : value[key]}</span>
                        )
                    }
                </div>
            </FormItem>
        );
    }
}
