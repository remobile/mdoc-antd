import React from 'react';
import { Form } from 'antd';
import styles from './index.less';
import { findDOMNode } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDelete from 'material-ui/svg-icons/action/delete';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import { getFormItemLayout } from './config';
const FormItem = Form.Item;

export default class ChildFormItem extends React.Component {
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
        const { label, children, editing, layout, formGroup, buttons = [] } = this.props;

        return (
            <div>
                <FormItem
                    {...getFormItemLayout(layout, formGroup)}
                    label={label}
                    ref={(ref) => { this.formItem = ref; }}
                    className={editing && buttons.length ? '' : styles.subFormLabel} >
                    {
                        editing &&
                        <div className={styles.iconButtonContainer}>
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
                        </div>
                    }
                </FormItem>
                <div className={styles.subForm}>
                    {children}
                </div>
            </div>
        );
    }
}
