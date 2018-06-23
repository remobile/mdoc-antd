import React from 'react';
import { Form } from 'antd';
import { findDOMNode } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import styles from './index.less';
import { getFormItemLayout, isNullValue } from './config';
const FormItem = Form.Item;

/*
 * value 为同行
 * children 为 下一行
 */
export default class EditFormItem extends React.Component {
    componentDidMount () {
        this.props.required && this.changeRequired(this.props.editing);
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        if (props.editing !== nextProps.editing && this.props.required) {
            this.changeRequired(nextProps.editing);
        }
    }
    changeRequired (editing) {
        const node = findDOMNode(this.formItem);
        if (node) {
            const label = node.querySelectorAll('label')[0];
            if (label) {
                if (editing) {
                    label.classList.add('ant-form-item-required');
                } else {
                    label.classList.remove('ant-form-item-required');
                }
            }
        }
    }
    render () {
        const { label, value, children, onEdit, editing, layout, formGroup, type } = this.props;

        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                ref={(ref) => { this.formItem = ref; }}
                >
                <div className={styles.iconButtonContainer}>
                    {
                        editing &&
                        <FloatingActionButton className={styles.iconButton} onTouchTap={onEdit}>
                            {(!type && (!(children || value))) || type === 'add' ? <ContentAdd /> : <EditorModeEdit /> }
                        </FloatingActionButton>
                    }
                    { !isNullValue(value) && <span className={editing ? '' : styles.value}>{value}</span> }
                    {!editing && !(children || !isNullValue(value)) && '无'}
                </div>
                {children}
            </FormItem>
        );
    }
}
