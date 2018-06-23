import React from 'react';
import { Table } from 'antd';
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
    render () {
        const { current, _pageSize } = this.state;
        const {
            columns,
            pageSize,
            totalCount,
            loading,
            loadingPage,
            loadListPage,
            keyword,
            noFooter,
            showSizeChanger,
            pageSizeOptions,
            className,
            rowClassName,
            scrollX,
            rowKey,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            ...otherProps
        } = this.props;
        const pagination = {
            total: totalCount,
            current,
            pageSize: _pageSize || pageSize,
            showSizeChanger,
            pageSizeOptions,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ _pageSize: pageSize });
            },
            onChange: (current) => {
                this.setState({ current });
                loadListPage && loadListPage(keyword, current - 1);
            },
        };
        return (
            <div className={cn(className, styles.table)}>
                <Table
                    bordered
                    rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                    columns={fixColumns(columns)}
                    loading={loading || loadingPage}
                    pagination={noFooter !== true && pagination}
                    {...otherProps}
                    rowClassName={rowClassName || ::this.rowClassName}
                    {...(scrollX ? { scroll: { x: scrollX } } : {})}
                    onRow={::this.onRow} />
            </div>
        );
    }
}
