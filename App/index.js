import React from 'react';
import ReactDOM from 'react-dom';
import MdocForm from './MdocForm';
import MdocTable from './MdocTable';
import MdocSelectTable from './MdocSelectTable';
import { confirm, confirmWithPassword, showSuccess, showError, } from 'utils/confirm';

export const antd = {
    confirm,
    confirmWithPassword,
    showSuccess,
    showError,
    renderForm(el, options) {
        ReactDOM.render(
            React.createElement(MdocForm, options),
            typeof el === 'string' ? document.getElementById(el) : el
        );
    },
    renderTable(el, options) {
        ReactDOM.render(
            React.createElement(MdocTable, options),
            typeof el === 'string' ? document.getElementById(el) : el
        );
    },
    renderSelectTable(el, options) {
        ReactDOM.render(
            React.createElement(MdocSelectTable, options),
            typeof el === 'string' ? document.getElementById(el) : el
        );
    },
};
