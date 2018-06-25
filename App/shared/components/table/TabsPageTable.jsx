import React from 'react';
import { Table, Tabs, Button } from 'antd';
import _ from 'lodash';
import cn from 'classnames';
import styles from './index.less';
import { fixColumns } from './config';
const TabPane = Tabs.TabPane;

export default class PlainTable extends React.Component {
    static defaultProps = {
        className: styles.tableContainer,
        listName: 'list',
    };
    state = {
        currents: Object.assign(_.mapValues(this.props.tables, () => 1), this.props.lastCurrents),
        activeType: this.props.activeType || this.props.lastActiveType || _.keys(this.props.tables)[0],
    };
    componentWillReceiveProps (nextProps) {
        const { currents, activeType } = this.state;
        const { tables, listName, pageSize } = this.props;
        if (this.loadingMore) {
            this.loadingMore = false;
            const list = nextProps.data[activeType];
            const length = _.isArray(list) ? list.length : (list[tables[activeType].listName || listName] || []).length;
            currents[activeType] = Math.floor((length - 1) / pageSize) + 1;
            this.setState({ currents });
        }
    }
    onRowClick (record, index, event) {
        if (event.target.className !== 'ant-table-selection-column' && event.target.className !== '__filter_click') {
            const { relate, onRowClick } = this.props;
            const { currents, activeType } = this.state;
            if (onRowClick) {
                relate.setKeepData({ lastSelectIndex: index, lastCurrents: currents, lastActiveType: activeType });
                onRowClick(record, index, activeType, event);
            }
        }
    }
    onRow (record, index) {
        return {
            onClick: this.onRowClick.bind(this, record, index),
        };
    }
    rowClassName (type, record, index) {
        const { lastActiveType, lastCurrents = {}, lastSelectIndex } = this.props;
        const { currents } = this.state;
        return lastActiveType === type && currents[type] === lastCurrents[type] && lastSelectIndex === index ? 'last_selected' : '';
    }
    onTabsChange (key) {
        const { onTabsChange } = this.props;
        this.setState({ activeType: key });
        onTabsChange && onTabsChange(key);
    }
    loadMore (type, key) {
        const { relate, loadMore } = this.props;
        const page = relate.getPageAttribute(key);
        if (!page) {
            loadMore(type, 1, () => { this.loadingMore = true; });
        } else if (page.hasMore) {
            loadMore(type, page.pageNo + 1, () => { this.loadingMore = true; });
        }
    }
    render () {
        const { currents, activeType } = this.state;
        const {
            tables,
            data,
            columns,
            pageSize,
            listName,
            loading,
            loadingMore,
            rowSelection,
            noFooter,
            className,
            scrollX,
            rowKey,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            relate,
            ...otherProps
        } = this.props;
        const pagination = (total, type) => ({
            total,
            showSizeChanger: false,
            pageSize,
            current: currents[type],
            itemRender: (current, elementType, originalElement) => {
                if (elementType === 'prev') {
                    return null;
                }
                if (elementType === 'next') {
                    const key = tables[type].listName || (type + '.' + listName);
                    const page = relate.getPageAttribute(key);
                    const hasMore = !page ? total === pageSize : page.hasMore;
                    return hasMore ? <Button style={{ marginRight: 20 }} onClick={this.loadMore.bind(this, type, key)}>更多</Button> : null;
                }
                return originalElement;
            },
            onChange: (current) => {
                currents[type] = current;
                this.setState({ currents });
            },
        });
        return (
            <div className={cn(className, styles.table, styles.pageTable)}>
                <Tabs type='card' onChange={::this.onTabsChange} activeKey={activeType}>
                    {
                        _.map(tables, (item, type) => {
                            const list = data[type] || [];
                            const xscroll = item.scrollX || scrollX;
                            const dataSource = _.isArray(list) ? list : list[item.listName || listName] || [];
                            return (
                                <TabPane tab={item.label} key={type}>
                                    <Table
                                        bordered
                                        rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                                        loading={loading || loadingMore}
                                        columns={fixColumns(item.columns || columns)}
                                        dataSource={dataSource}
                                        rowSelection={item.rowSelection || rowSelection}
                                        pagination={noFooter !== true && item.noFooter !== true && pagination(dataSource.length, type)}
                                        {...otherProps}
                                        {...(xscroll ? { scroll: { x: xscroll } } : {})}
                                        rowClassName={this.rowClassName.bind(this, type)}
                                        onRow={::this.onRow} />
                                </TabPane>
                            );
                        })
                    }
                </Tabs>
            </div>
        );
    }
}
