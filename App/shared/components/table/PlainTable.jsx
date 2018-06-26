import React from 'react';
import { Table } from 'antd';
import cn from 'classnames';
import { showError, post } from 'utils';
import { fixColumns } from './config';
import styles from './index.less';
import _ from 'lodash';

export default class PlainTable extends React.Component {
    static defaultProps = {
        className: styles.tableContainer,
    };
    state = {
        loading: false,
        current: 1,
        pageSize: this.props.pageSize,
        totalCount: 0,
        list: [],
    };
    componentDidMount() {
        this.getPageList(0);
    }
    refresh() {
        this.setState({
            current: 1,
            totalCount: 0,
            list: [],
        }, ()=>{
            this.getPageList(0);
        });
    }
    needLoadPage (list, totalCount, pageNo, pageSize) {
        const maxFullPage = Math.floor((totalCount - 1) / pageSize);
        const maxDetectListSize = pageNo < maxFullPage ? pageSize : totalCount - maxFullPage * pageSize;
        const detectList = _.slice(list, pageNo * pageSize, (pageNo + 1) * pageSize);
        let needLoad = true;
        if (detectList.length === maxDetectListSize) {
            needLoad = !_.every(detectList);
        }
        return needLoad;
    }
    getPageList(pageNo) {
        let { list, totalCount, pageSize } = this.state;
        const { url, params, listName } = this.props;
        if (!this.needLoadPage(list, totalCount, pageNo, pageSize)) {
            return;
        }
        this.setState({loading: true}, ()=>{
            post(url, {
                pageNo,
                pageSize,
                ...params,
            }).then((ret)=>{
                if (!ret.success) {
                    this.setState({loading: false});
                    return showError(ret.msg);
                }
                const _list = _.get(ret, `context.${listName}`) || [];
                const _listLen = _list.length;
                list.length < pageNo*pageSize && (list.length = pageNo*pageSize);
                list.splice(pageNo*pageSize, _listLen, ..._list);
                if (pageNo === 0) {
                    totalCount = _.get(ret, 'context.count') || 0;
                }
                this.setState({ list, totalCount, loading: false });
            });
        });
    }
    onRowClick (record, index, event) {
        if (event.target.className !== 'ant-table-selection-column' && event.target.className !== '__filter_click') {
            const { onRowClick } = this.props;
            onRowClick && onRowClick(record, index, event);
        }
    }
    onRow (record, index) {
        return { onClick: this.onRowClick.bind(this, record, index) };
    }
    render () {
        const { list, totalCount, current, pageSize, loading } = this.state;
        const {
            columns,
            noFooter,
            pageSizeOptions,
            className,
            scrollX,
            rowKey,
        } = this.props;
        const pagination = {
            total: totalCount,
            current,
            pageSize,
            showSizeChanger: !!pageSizeOptions,
            pageSizeOptions,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ current, pageSize }, ()=>{
                    this.getPageList(current - 1);
                });
            },
            onChange: (current) => {
                this.setState({ current }, ()=>{
                    this.getPageList(current - 1);
                });
            },
        };
        return (
            <div className={cn(className, styles.table)}>
                <Table
                    bordered
                    rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                    columns={fixColumns(columns)}
                    loading={loading}
                    pagination={noFooter !== true && pagination}
                    dataSource={list}
                    {...(scrollX ? { scroll: { x: scrollX } } : {})}
                    onRow={::this.onRow} />
            </div>
        );
    }
}
