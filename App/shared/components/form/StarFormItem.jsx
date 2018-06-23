import React from 'react';
import { Form } from 'antd';
import styles from './index.less';
import { getFormItemLayout } from './config';

const FormItem = Form.Item;

export default class StarFormItem extends React.Component {
    render () {
        const { label, value = 0, layout, formGroup, children } = this.props;
        return (
            <FormItem {...getFormItemLayout(layout, formGroup)} label={label}>
                <div className={styles.starContainer}>
                    {[0, 1, 2, 3, 4, 5, 6].map(o => <img key={o} src={`/client/img/star_${o >= value ? 'inactive' : 'activate'}.png`} className={styles.star} />)}
                    {children}
                </div>
            </FormItem>
        );
    }
}
