import { Form } from 'antd';
export default (target) => {
    const Component = Form.create()(target);
    Component.fragments = target.fragments;
    return Component;
};
