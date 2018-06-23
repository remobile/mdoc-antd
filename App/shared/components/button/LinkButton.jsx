import React from 'react';
import { Link } from 'react-router';

export default class LinkButton extends React.Component {
    async handleLinkClick (e) {
        const forbidClose = this.props.forbidClose(this.props.to || this.props.href);
        const target = e.target;
        if (forbidClose && !target.forbidClose) {
            e.preventDefault();
            e.stopPropagation();
            if (!await forbidClose()) {
                if (this.props.href) {
                    window.location.href = this.props.href;
                } else {
                    target.forbidClose = true;
                    const event = document.createEvent('HTMLEvents');
                    event.initEvent('click', true, true);
                    event.eventType = 'message';
                    target.dispatchEvent(event);
                }
            } else {
                target.forbidClose = false;
            }
        } else {
            target.forbidClose = false;
        }
    }
    render () {
        const { href, to, className, children } = this.props;
        return (
            href &&
            <a href={href} onClick={::this.handleLinkClick} className={className}>{children}</a>
            ||
            <Link to={to} onClick={::this.handleLinkClick} className={className}>{children}</Link>
        );
    }
}
