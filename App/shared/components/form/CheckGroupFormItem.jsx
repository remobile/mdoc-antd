import React from 'react';
import _ from 'lodash';
import { Form, Checkbox, Row, Col } from 'antd';
import { getFormItemLayout } from './config';
import styles from './index.less';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

export default class CheckGroupFormItem extends React.Component {
    render () {
        const { form, label, list, value, editing, layout, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                >
                {
                    form.getFieldDecorator(key, {
                        initialValue: value[key],
                    })(
                        <CheckboxGroup {...otherProps} className={styles.checkGroup}>
                            <Row>
                                {list.map((o, k) => <Col key={k} span={12}><Checkbox disabled={!editing} value={o.value}>{o.label}</Checkbox></Col>)}
                            </Row>
                        </CheckboxGroup>
                    )
                }
            </FormItem>
        );
    }
}
