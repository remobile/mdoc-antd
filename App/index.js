import React from 'react';
import ReactDOM from 'react-dom';
import MdocForm from './MdocForm';
import MdocTable from './MdocTable';
import MdocSelectTable from './MdocSelectTable';


export function renderForm(el, options) {
    ReactDOM.render(
        React.createElement(MdocForm, options),
        typeof el === 'string' ? document.getElementById(el) : el
    );
}

export function renderTable(el, options) {
    ReactDOM.render(
        React.createElement(MdocTable, options),
        typeof el === 'string' ? document.getElementById(el) : el
    );
}

export function renderSelectTable(options) {
    ReactDOM.render(
        React.createElement(MdocSelectTable, options),
        document.body,
    );
}
