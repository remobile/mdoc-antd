import React from 'react';
import { Form } from 'antd';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import { getFormItemLayout } from './config';
import styles from './index.less';
const FormItem = Form.Item;

export default class TableFormItem extends React.Component {
    render () {
        const { label, children, onEdit, editing, layout, type } = this.props;

        return (
            <FormItem
                {...getFormItemLayout(layout)}
                label={label}
                >
                <div className={styles.tableContainer}>
                    {
                        editing &&
                        <div style={{ width: 60, height: 60 }}>
                            <FloatingActionButton className={styles.iconButton} onTouchTap={onEdit}>
                                {(!type && !children) || type === 'add' ? <ContentAdd /> : <EditorModeEdit /> }
                            </FloatingActionButton>
                        </div>
                    }
                    { children }
                </div>
            </FormItem>
        );
    }
}
