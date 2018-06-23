import React from 'react';
import { Input, Spin, Button } from 'antd';
import styles from './index.less';
const Search = Input.Search;

export default class TableContainer extends React.Component {
    static defaultProps = {
        placeholder: '输入关键字查找',
    };
    handleGoBack () {
        this.props.history.goBack();
    }
    render () {
        const { loading, placeholder, title, onSearch, history, refresh, buttons = [], leftControl, rightControl, children } = this.props;
        return (
            <div className={styles.container}>
                {
                    (!!leftControl || !!rightControl || !!onSearch || !!title || !!buttons.length || !!history) &&
                    <div className={styles.searchContainer}>
                        {
                            !!leftControl &&
                            <div className={styles.leftControlContainer}>
                                {leftControl}
                            </div>
                        }
                        {
                            !!onSearch &&
                            <div className={styles.search} >
                                <Search placeholder={placeholder} onSearch={onSearch} maxLength={20} />
                            </div>
                        }
                        {
                            !!title &&
                            <div className={styles.tableTitle}>{title}</div>
                        }
                        <div className={styles.buttonsContainer}>
                            { rightControl }
                            {
                                ([{ text: '返回', onClick: ::this.handleGoBack, visible: !!history }, { text: '刷新', onClick: refresh, visible: !!refresh }, ...buttons]).map((item, i) => (
                                    (item.visible !== false && !loading) && <Button key={i} style={{ marginLeft: 10 }} disabled={item.disabled} onClick={item.onClick}>{item.text}</Button>
                            ))}
                        </div>
                    </div>
                }
                { children }
            </div>
        );
    }
}
