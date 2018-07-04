import React from 'react';
import { TableContainer, PlainTable, PlainPageTable } from 'components';
import { Modal } from 'antd';
import styles from './index.less';
import _ from 'lodash';

export default class MdocSelectTable extends React.Component {
    static defaultProps = {
        pageSize: 30,
        listName: 'list',
        params: {},
        width: 800,
    };
    state = {
        params: this.props.params,
        selects: [],
        visible: true,
        hasOkButton: false,
    };
    componentWillReceiveProps(nextProps) {
        this.setState({ visible: true, selects: [] });
    }
    hide () {
        this.setState({ visible: false });
    }
    refresh () {
        this.table.refresh();
    }
    onSearch (keyword) {
        const { params } = this.state;
        this.setState({ params: { ...params, keyword } }, ::this.refresh);
    }
    handleOk () {
        const { selects } = this.state;
        const { onSelect } = this.props;
        this.setState({ visible: false });
        onSelect && onSelect(selects);
    }
    render () {
        const { params, selects, visible, hasOkButton } = this.state;
        const { title, hasTotalCount, url, listName, pageSize, columns, rejectIds, multi, onSelect, width } = this.props;
        const Component = hasTotalCount ? PlainTable : PlainPageTable;
        const selectedIds = selects.map(o => o.id);
        const rowSelection = {
            type: multi ? 'checkbox' : 'radio',
            selectedRowKeys: selectedIds,
            onSelect: (record, selected, selectedRows) => {
                this.setState({ selects: selectedRows, hasOkButton : !!selectedRows.length });
            },
            getCheckboxProps: record => ({
                disabled: multi ? false : !!_.find(selects, o=>o.id === record.id),
            }),
        };
        return (
            visible &&
            <Modal title={title} visible className={hasOkButton ? styles.branchShopModal : styles.branchShopModalNoButton} bodyStyle={{width}} width={width} onCancel={::this.hide} onOk={::this.handleOk} okText='选择' cancelText='取消'>
                <TableContainer onSearch={::this.onSearch} >
                    <Component
                        ref={(ref) => { this.table = ref; }}
                        url={url}
                        listName={listName}
                        params={params}
                        pageSize={pageSize}
                        columns={columns}
                        className={styles.tableContainer}
                        rowSelection={rowSelection} />
                </TableContainer>
            </Modal>
        );
    }
}
