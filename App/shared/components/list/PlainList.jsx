import React from 'react';
import { List, Button } from 'antd';
import styles from './index.less';
import _ from 'lodash';

export default class PlainList extends React.Component {
    static defaultProps = {
        size: 'small',
        itemLayout: 'horizontal',
        className: styles.list,
    };
    loadMore (key) {
        const { relate, loadMore } = this.props;
        const page = relate.getPageAttribute(key);
        if (!page) {
            loadMore(1);
        } else if (page.hasMore) {
            loadMore(page.pageNo + 1);
        }
    }
    render () {
        const { data, listName, title, loading, loadingMore, relate, pageSize, itemLayout, size, className, renderItem } = this.props;
        const dataSource = _.isArray(data) ? data : data[listName] || [];
        const page = relate.getPageAttribute(listName);
        const hasMore = !page ? dataSource.length === pageSize : page.hasMore;
        return (
            <div className={styles.container}>
                <List
                    size={size}
                    className={className}
                    loading={loading || loadingMore}
                    itemLayout={itemLayout}
                    header={!!title && <h3>{title}</h3>}
                    dataSource={dataSource}
                    loadMore={
                        !_.isEmpty(dataSource) &&
                        <div className={styles.loadMoreContainer}>
                            {
                                hasMore &&
                                <Button loading={loading || loadingMore} onClick={this.loadMore.bind(this, listName)} size='small' type='dashed'>加载更多</Button>
                                ||
                                <span>全部加载完成</span>
                            }
                        </div>
                    }
                    renderItem={renderItem} />
            </div>
        );
    }
}
