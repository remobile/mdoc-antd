import React from 'react';
import { Table, Tabs } from 'antd';
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
    resetPageNo () {
        this.setState({ currents: _.mapValues(this.props.tables, () => 1) });
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
    render () {
        const { currents, activeType } = this.state;
        const {
            tables,
            data,
            columns,
            pageSize,
            listName,
            loading,
            loadingPage,
            loadListPage,
            rowSelection,
            keyword,
            noFooter,
            className,
            scrollX,
            rowKey,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            ...otherProps
        } = this.props;
        const pagination = (total, type) => ({
            total,
            showSizeChanger: false,
            pageSize,
            current: currents[type],
            onChange: (current) => {
                currents[type] = current;
                this.setState({ currents });
                loadListPage && loadListPage(keyword, type, current - 1);
            },
        });
        return (
            <div className={cn(className, styles.table)}>
                <Tabs type='card' onChange={::this.onTabsChange} activeKey={activeType}>
                    {
                        _.map(tables, (item, type) => {
                            const list = data[type] || [];
                            const xscroll = item.scrollX || scrollX;
                            return (
                                <TabPane tab={item.label} key={type}>
                                    <Table
                                        bordered
                                        rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                                        loading={loading || loadingPage}
                                        columns={fixColumns(item.columns || columns)}
                                        dataSource={_.isArray(list) ? list : list[listName]}
                                        rowSelection={item.rowSelection || rowSelection}
                                        pagination={noFooter !== true && item.noFooter !== true && pagination(_.isArray(list) ? list.length : list.count, type)}
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
