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
    };
    state = {
        params: this.props.params,
        selects: [],
        visible: true,
        hasOkButton: false,
    };
    show () {
        this.setState({ visible: true });
    }
    hide () {
        this.setState({ visible: false, selects: [] });
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
        const { hasTotalCount, url, listName, pageSize, columns, rejectIds, multi, onSelect } = this.props;
        const Component = hasTotalCount ? PlainTable : PlainPageTable;
        const selectedIds = selects.map(o => o.id);
        const rowSelection = {
            type: multi ? 'checkbox' : 'radio',
            selectedRowKeys: selectedIds,
            onSelect: (record, selected, selectedRows) => {
                this.setState({ selects: selectedRows, hasOkButton : !!selectedRows.length });
            },
            getCheckboxProps: record => ({
                disabled: !!_.find(selects, o=>o.id === record.id),
            }),
        };
        return (
            visible &&
            <Modal title={'选择分店'} visible className={hasOkButton ? styles.branchShopModal : styles.branchShopModalNoButton} onCancel={::this.hide} onOk={::this.handleOk}>
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
