import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import _ from 'lodash';
import { Form } from 'antd';
import { TextFormItem, NumberFormItem } from 'components';
import { showError, checkInt2PointNum, checkTelePhone } from 'utils';

@antd_form_create
export class MdocForm extends React.Component {
    handleSubmit (e) {
        e.preventDefault();
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            console.log('========', value);
        });
    }
    render () {
        const { form } = this.props;
        return (
            <Form>
                <TextFormItem form={form} editing label='发货人电话' value={{ senderPhone: '' }} maxLength={11} rules={[ { validator: checkTelePhone } ]} />
                <NumberFormItem form={form} editing label='重量' value={{ weight: '' }} unit='吨' min={0.01} step={0.1} max={100} maxLength={5} rules={[ { validator: checkInt2PointNum } ]} />
                <NumberFormItem form={form} editing label='方量' value={{ size: '' }} unit='方' min={0.01} step={0.1} max={100} maxLength={5} rules={[ { validator: checkInt2PointNum } ]} />
                <NumberFormItem form={form} editing label='件数' value={{ totalNumbers: '' }} unit='件' min={1} step={1} max={1000} maxLength={4} precision={0} />
            </Form>
        );
    }
}
