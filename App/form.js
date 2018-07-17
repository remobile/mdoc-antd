import React from 'react';
import ReactDOM from 'react-dom';
import { notification } from 'antd';
import MdocForm from './MdocForm';

notification.config({
    placement: 'bottomLeft',
    bottom: 30,
    duration: 3,
});

export const antd = {
    renderForm(el, options) {
        ReactDOM.render(
            React.createElement(MdocForm, options),
            typeof el === 'string' ? document.getElementById(el) : el
        );
    },
};
