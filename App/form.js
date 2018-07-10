import React from 'react';
import ReactDOM from 'react-dom';
import MdocForm from './MdocForm';

export const antd = {
    renderForm(el, options) {
        ReactDOM.render(
            React.createElement(MdocForm, options),
            typeof el === 'string' ? document.getElementById(el) : el
        );
    },
};
