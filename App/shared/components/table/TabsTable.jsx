import React from 'react';
import { Table, Tabs } from 'antd';
import _ from 'lodash';
import cn from 'classnames';
import styles from './index.less';
import { showError, post } from 'utils';
import { fixColumns } from './config';
const TabPane = Tabs.TabPane;

export default class PlainTable extends React.Component {
    static defaultProps = {
        className: styles.tableContainer,
    };
    state = {
        loading: false,
        pageSize: this.props.pageSize,
        activeType: _.keys(this.props.tables)[0],
        data: _.mapValues(this.props.tables, o=>({list: [], current: 1, totalCount: 0})),
    };
    componentDidMount() {
        this.getPageList('', 0);
    }
    refresh() {
        this.setState({
            data: _.mapValues(this.props.tables, o=>({list: [], current: 1, totalCount: 0})),
        }, ()=>{
            this.getPageList('', 0);
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
    getPageList(type, pageNo) {
        let { data, pageSize } = this.state;
        const { url, params, listName, tables } = this.props;
        const types = _.keys(tables);

        if (type) {
            if (!this.needLoadPage(data[type].list, data[type].totalCount, pageNo, pageSize)) {
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
                this.setState({
                    data: {
                        ...data,
                        ..._.mapValues(ret.context, (v, k)=>{
                            const item = data[k];
                            let { list, totalCount } = item;
                            const _list = _.get(v, listName) || [];
                            const _listLen = _list.length;
                            if (pageNo === 0) {
                                totalCount = _.get(v, 'count') || 0;
                            }
                            list.length < pageNo*pageSize && (list.length = pageNo*pageSize);
                            list.splice(pageNo*pageSize, _listLen, ..._list);
                            return { ...item, list, totalCount, current: pageNo+1 };
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
            const { currents, activeType } = this.state;
            onRowClick && onRowClick(record, index, activeType, event);
        }
    }
    onRow (record, index) {
        return { onClick: this.onRowClick.bind(this, record, index) };
    }
    onTabsChange (key) {
        this.setState({ activeType: key });
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
        const pagination = (type) => ({
            total: this.state.data[type].totalCount,
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
            onChange: (current) => {
                this.state.data[type].current = current;
                this.setState({ data: this.state.data }, ()=>{
                    this.getPageList(type, current - 1);
                });
            },
        });
        return (
            <div className={cn(className, styles.table)}>
                <Tabs type='card' onChange={::this.onTabsChange} activeKey={activeType}>
                    {
                        _.map(tables, (item, type) => {
                            const list = this.state.data[type].list;
                            const totalCount = this.state.data[type].totalCount;
                            const xscroll = item.scrollX || scrollX;
                            return (
                                <TabPane tab={item.label} key={type}>
                                    <Table
                                        bordered
                                        rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                                        loading={loading}
                                        columns={fixColumns(item.columns || columns)}
                                        dataSource={list}
                                        pagination={noFooter !== true && item.noFooter !== true && pagination(type)}
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
