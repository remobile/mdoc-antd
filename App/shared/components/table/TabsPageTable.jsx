import React from 'react';
import { Table, Tabs, Button } from 'antd';
import _ from 'lodash';
import cn from 'classnames';
import { showError, post } from 'utils';
import styles from './index.less';
import { fixColumns } from './config';
const TabPane = Tabs.TabPane;

export default class TabsPageTable extends React.Component {
    static defaultProps = {
        className: styles.tableContainer,
    };
    state = {
        loading: false,
        pageSize: this.props.pageSize,
        activeType: _.keys(this.props.tables)[0],
        data: _.mapValues(this.props.tables, o=>({list: [], current: 1, hasMore: true, maxCount: 0})),
    };
    componentDidMount() {
        this.getPageList('', 0);
    }
    refresh() {
        this.setState({
            data: _.mapValues(this.props.tables, o=>({list: [], current: 1, hasMore: true, maxCount: 0})),
        }, ()=>{
            this.getPageList('', 0);
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
    getPageList(type, pageNo) {
        let { pageSize } = this.state;
        const { url, params, listName, tables } = this.props;
        const types = _.keys(tables);

        if (type) {
            if (!this.state.data[type].hasMore) {
                return;
            }
            if (!this.needLoadPage(this.state.data[type].list, pageNo, pageSize)) {
                return;
            }
        }
        this.setState({loading: true}, ()=>{
            post(url, {
                type,
                pageNo,
                pageSize,
                ...params,
            }).then((ret)=>{
                if (!ret.success) {
                    this.setState({loading: false});
                    return showError(ret.msg);
                }
                console.log("=====", this.state.data);
                this.setState({
                    data: {
                        ...this.state.data,
                        ..._.mapValues(ret.context, (v, k)=>{
                            console.log("====", v, k, this.state.data[k]);
                            const item = this.state.data[k];
                            let { list, hasMore } = item;
                            const _list = _.get(v, listName) || [];
                            const _listLen = _list.length;
                            if (_listLen < pageSize) {
                                hasMore = false;
                            }
                            list.length < pageNo*pageSize && (list.length = pageNo*pageSize);
                            list.splice(pageNo*pageSize, _listLen, ..._list);
                            return { ...item, list, hasMore, current: pageNo+1, maxCount: list.length };
                        }),
                    },
                    loading: false,
                });
            });
        });
    }
    onRowClick (record, index, event) {
        if (event.target.className !== 'ant-table-selection-column' && event.target.className !== '__filter_click') {
            const { onRowClick } = this.props;
            const { activeType } = this.state;
            onRowClick && onRowClick(record, index, activeType, event);
        }
    }
    onRow (record, index) {
        return { onClick: this.onRowClick.bind(this, record, index) };
    }
    onTabsChange (key) {
        this.setState({ activeType: key });
    }
    loadMore (type) {
        const { data, pageSize } = this.state;
        this.getPageList(type, Math.floor((data[type].maxCount-1)/pageSize)+1);
    }
    render () {
        const { pageSize, activeType, loading } = this.state;
        const {
            tables,
            columns,
            noFooter,
            pageSizeOptions,
            className,
            scrollX,
            rowKey,
        } = this.props;
        const pagination = (total, type) => ({
            total,
            pageSize,
            current: this.state.data[type].current,
            showSizeChanger: !!pageSizeOptions,
            pageSizeOptions,
            onShowSizeChange: (current, pageSize) => {
                this.state.data[type].current = current;
                this.setState({ data: this.state.data, pageSize }, ()=>{
                    this.getPageList('', current - 1);
                });
            },
            itemRender: (current, elementType, originalElement) => {
                if (elementType === 'prev') {
                    return null;
                }
                if (elementType === 'next') {
                    const hasMore = this.state.data[type].hasMore;
                    return hasMore ? <Button style={{ marginRight: 20 }} onClick={this.loadMore.bind(this, type)}>更多</Button> : null;
                }
                return originalElement;
            },
            onChange: (current) => {
                this.state.data[type].current = current;
                this.setState({ data: this.state.data }, ()=>{
                    this.getPageList(type, current - 1);
                });
            },
        });
        return (
            <div className={cn(className, styles.table, styles.pageTable)}>
                <Tabs type='card' onChange={::this.onTabsChange} activeKey={activeType}>
                    {
                        _.map(tables, (item, type) => {
                            const list = this.state.data[type].list;
                            const xscroll = item.scrollX || scrollX;
                            return (
                                <TabPane tab={item.label} key={type}>
                                    <Table
                                        bordered
                                        rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                                        loading={loading}
                                        columns={fixColumns(item.columns || columns)}
                                        dataSource={list}
                                        pagination={noFooter !== true && item.noFooter !== true && pagination(list.length, type)}
                                        {...(xscroll ? { scroll: { x: xscroll } } : {})}
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
