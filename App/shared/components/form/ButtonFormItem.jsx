import React from 'react';
import { Form } from 'antd';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDelete from 'material-ui/svg-icons/action/delete';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import styles from './index.less';
import { getFormItemLayout } from './config';
const FormItem = Form.Item;

export default class ButtonFormItem extends React.Component {
    render () {
        const { label, layout, buttons, formGroup, children } = this.props;

        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                >
                <div className={styles.iconButtonContainer}>
                    {
                        buttons.map((item, i) => (
                            item.visible &&
                            <FloatingActionButton key={i} secondary={item.type === 'delete'} className={styles.iconButton} onTouchTap={item.onClick}>
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
                {children}
            </FormItem>
        );
    }
}
