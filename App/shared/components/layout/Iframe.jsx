import React from 'react';
import request from 'superagent';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import { iframeResizer } from 'iframe-resizer';
import styles from './index.less';

class Iframe extends React.Component {
    state = {
        isShowSpin: true,
    };
    componentDidMount () {
        this.fetchContent();
    }
    componentWillReceiveProps (nextProps) {
        const { src } = nextProps;
        if (src !== this.props.src) {
            this.fetchContent();
        }
    }
    fetchContent () {
        this.setState({ isShowSpin:true });
        request.get(this.props.src).end((err, res) => {
            this.setState({ isShowSpin:false });
            this.updateIframe(res.text);
        });
    }
    updateIframe (content) {
        const frame = this.refs.frame;
        if (!frame) return;
        const doc = frame.contentDocument;
        if (!doc) return;
        doc.open();
        doc.write(content);
        doc.close();
        iframeResizer(this.props.iframeResizerOptions, frame);
    }
    injectIframeResizerUrl () {
        const frame = this.refs.frame;
        if (!frame) return;
        const doc = frame.contentDocument;
        if (!doc) return;
        let injectTarget = null;
        ['head', 'HEAD', 'body', 'BODY', 'div', 'DIV'].forEach(tagName => {
            if (injectTarget) return;
            const found = doc.getElementsByTagName(tagName);
            if (!(found && found.length)) return;
            injectTarget = found[0];
        });
        if (!injectTarget) {
            console.error('Unable to inject iframe resizer script');
            return;
        }
        const resizerScriptElement = document.createElement('script');
        resizerScriptElement.type = 'text/javascript';
        resizerScriptElement.src = this.props.iframeResizerUrl;
        injectTarget.appendChild(resizerScriptElement);
    }
    onLoad () {
        this.injectIframeResizerUrl();
    }
    render () {
        const { id, frameBorder, className, style } = this.props;
        const { isShowSpin } = this.state;
        return (
            <div>
                <iframe
                    ref='frame'
                    id={id}
                    frameBorder={frameBorder}
                    className={className}
                    style={style}
                    onLoad={::this.onLoad}
                    />
                {
                        isShowSpin &&
                        <div className={styles.detailPanelSpin}><Spin /></div>
                    }

            </div>
        );
    }
}
Iframe.defaultProps = {
    iframeResizerEnable: true,
    iframeResizerOptions: {
        checkOrigin: false,
    },
    iframeResizerUrl: '/client/js/iframeResizer.contentWindow.min.js',
    frameBorder: 0,
    style: {
        width: '100%',
        minHeight: 20,
    },
};

export default Iframe;
