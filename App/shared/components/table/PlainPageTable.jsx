import React from 'react';
import { Table, Button } from 'antd';
import cn from 'classnames';
import { showError, post } from 'utils';
import { fixColumns } from './config';
import styles from './index.less';
import _ from 'lodash';

export default class PlainPageTable extends React.Component {
    static defaultProps = {
        className: styles.tableContainer,
    };
    state = {
        loading: false,
        current: 1,
        pageSize: this.props.pageSize,
        hasMore: true,
        list: [],
    };
    componentDidMount() {
        this.maxCount = 0;
        this.getPageList(0);
    }
    refresh() {
        this.maxCount = 0;
        this.setState({
            current: 1,
            hasMore: true,
            list: [],
        }, ()=>{
            this.getPageList(0);
        });
    }
    needLoadPage (list, pageNo, pageSize) {
        const detectList = _.slice(list, pageNo * pageSize, (pageNo + 1) * pageSize);
        let needLoad = true;
        if (detectList.length === pageSize) {
            needLoad = !_.every(detectList);
        }
        return needLoad;
    }
    getPageList(pageNo) {
        let { list, hasMore, pageSize } = this.state;
        if (!hasMore) {
            return;
        }
        if (!this.needLoadPage(list, pageNo, pageSize)) {
            return;
        }
        const { url, params, listName } = this.props;
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
                if (_listLen < pageSize) {
                    hasMore = false;
                }
                list.length < pageNo*pageSize && (list.length = pageNo*pageSize);
                list.splice(pageNo*pageSize, _listLen, ..._list);
                this.maxCount = list.length;
                this.setState({ list, hasMore, current: pageNo+1, loading: false });
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
    loadMore () {
        const { pageSize } = this.state;
        this.getPageList(Math.floor((this.maxCount-1)/pageSize)+1);
    }
    render () {
        const { list, current, pageSize, hasMore, loading } = this.state;
        const {
            columns,
            noFooter,
            pageSizeOptions,
            className,
            scrollX,
            rowKey,
            rowSelection,
        } = this.props;
        const total = list.length;
        const pagination = {
            total,
            current,
            pageSize,
            showSizeChanger: !!pageSizeOptions,
            pageSizeOptions,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ current, pageSize }, ()=>{
                    this.getPageList(current - 1);
                });
            },
            itemRender: (current, elementType, originalElement) => {
                if (elementType === 'prev') {
                    return null;
                }
                if (elementType === 'next') {
                    return hasMore ? <Button style={{ marginRight: 20 }} onClick={::this.loadMore}>更多</Button> : null;
                }
                return originalElement;
            },
            onChange: (current) => {
                this.setState({ current }, ()=>{
                    this.getPageList(current - 1);
                });
            },
        };
        return (
            <div className={cn(className, styles.table, styles.pageTable)}>
                <Table
                    bordered
                    rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                    columns={fixColumns(columns)}
                    loading={loading}
                    pagination={noFooter !== true && pagination}
                    dataSource={list}
                    rowSelection={rowSelection}
                    {...(scrollX ? { scroll: { x: scrollX } } : {})}
                    onRow={::this.onRow} />
            </div>
        );
    }
}
