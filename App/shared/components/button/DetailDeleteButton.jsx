import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

export default class DetailDeleteButton extends React.Component {
    render () {
        const { visible, text, onClick } = this.props;
        return (
            visible &&
            <div className={styles.buttonContainer}>
                <Button className={styles.button} type='primary' onClick={onClick}>{text || '删 除'}</Button>
            </div>
        );
    }
}
