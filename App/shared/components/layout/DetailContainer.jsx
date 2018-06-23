import React from 'react';
import { Button, Spin } from 'antd';
import styles from './index.less';

export default class DetailContainer extends React.Component {
    handleGoBack () {
        this.props.history.goBack();
    }
    render () {
        let { title, loading, editing, waiting, operType, buttons = [], leftControl, history, children, topPadding } = this.props;
        return (
            <div className={styles.container}>
                <div className={styles.topContainer} {...(topPadding !== undefined ? { style:{ marginBottom: topPadding } } : {})} >
                    <div className={styles.titleContainer}>
                        <div className={styles.title}>{title}</div>
                        {
                            !!leftControl &&
                            <div className={styles.leftDetailControlContainer}>
                                {leftControl}
                            </div>
                        }
                    </div>
                    <div style={{ zIndex: 1000 }}>
                        {
                            ([{ text: '返回', onClick: ::this.handleGoBack, visible: !editing && !!history }, { text: '取消', onClick: ::this.handleGoBack, visible: operType === 0 }, ...buttons]).map((item, i) => (
                                (item.visible !== false && !loading) && <Button key={i} type='ghost' style={{ marginLeft: 10 }} onClick={item.onClick} loading={waiting}>{item.text}</Button>
                        ))}
                    </div>
                </div>
                <div className={styles.detailPanel} style={loading ? { display: 'flex' } : undefined}>
                    { loading ? <div className={styles.detailPanelSpin}><Spin /></div> : children }
                </div>
            </div>
        );
    }
}
