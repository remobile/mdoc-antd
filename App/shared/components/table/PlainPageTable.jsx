import React from 'react';
import { Table, Button } from 'antd';
import cn from 'classnames';
import { fixColumns } from './config';
import styles from './index.less';
import _ from 'lodash';

export default class PlainTable extends React.Component {
    static defaultProps = {
        className: styles.container,
        tableIndex: '',
        totalTableCount: 1,
    };
    state = {
        current: this.props['lastCurrent' + this.props.tableIndex] || 1,
    };
    componentWillReceiveProps (nextProps) {
        const { listName, pageSize } = this.props;
        if (this.loadingMore) {
            this.loadingMore = false;
            const list = nextProps.data;
            const length = _.isArray(list) ? list.length : (list[listName] || []).length;
            this.setState({ current: Math.floor((length - 1) / pageSize) + 1 });
        }
    }
    resetPageNo () {
        this.setState({ current: 1 });
    }
    onRowClick (record, index, event) {
        if (event.target.className !== 'ant-table-selection-column' && event.target.className !== '__filter_click') {
            const { relate, onRowClick, tableIndex, totalTableCount } = this.props;
            const { current } = this.state;
            if (onRowClick) {
                const options = { ['lastSelectIndex' + tableIndex]: index, ['lastCurrent' + tableIndex]: current };
                if (totalTableCount > 1) {
                    for (let i = 0; i < totalTableCount; i++) {
                        if (i !== tableIndex) {
                            options['lastSelectIndex' + i] = -1;
                            options['lastCurrent' + i] = -1;
                        }
                    }
                }
                relate.setKeepData(options);
                onRowClick(record, index, event);
            }
        }
    }
    onRow (record, index) {
        return {
            onClick: this.onRowClick.bind(this, record, index),
        };
    }
    rowClassName (record, index) {
        const { tableIndex } = this.props;
        const { current } = this.state;
        const lastCurrent = this.props['lastCurrent' + tableIndex];
        const lastSelectIndex = this.props['lastSelectIndex' + tableIndex];
        return current === lastCurrent && lastSelectIndex === index ? 'last_selected' : '';
    }
    loadMore (key) {
        const { relate, loadMore } = this.props;
        const page = relate.getPageAttribute(key);
        if (!page) {
            loadMore(1, () => { this.loadingMore = true; });
        } else if (page.hasMore) {
            loadMore(page.pageNo + 1, () => { this.loadingMore = true; });
        }
    }
    render () {
        const { current } = this.state;
        const {
            data,
            columns,
            pageSize,
            listName,
            loading,
            loadingMore,
            noFooter,
            className,
            rowClassName,
            scrollX,
            rowKey,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            relate,
            ...otherProps
        } = this.props;
        const total = _.isArray(data) ? data.length : (data[listName] || []).length;
        const pagination = {
            total,
            current,
            pageSize,
            itemRender: (current, elementType, originalElement) => {
                if (elementType === 'prev') {
                    return null;
                }
                if (elementType === 'next') {
                    const key = listName;
                    const page = relate.getPageAttribute(key);
                    const hasMore = !page ? total === pageSize : page.hasMore;
                    return hasMore ? <Button style={{ marginRight: 20 }} onClick={this.loadMore.bind(this, key)}>更多</Button> : null;
                }
                return originalElement;
            },
            onChange: (current) => {
                this.setState({ current });
            },
        };
        return (
            <div className={cn(className, styles.table, styles.pageTable)}>
                <Table
                    bordered
                    rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                    columns={fixColumns(columns)}
                    loading={loading || loadingMore}
                    pagination={noFooter !== true && pagination}
                    dataSource={_.isArray(data) ? data : data[listName]}
                    {...otherProps}
                    rowClassName={rowClassName || ::this.rowClassName}
                    {...(scrollX ? { scroll: { x: scrollX } } : {})}
                    onRow={::this.onRow} />
            </div>
        );
    }
}
