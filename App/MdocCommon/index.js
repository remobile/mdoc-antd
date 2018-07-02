import React from 'react';
import { TableContainer, PlainTable, PlainPageTable, TabsTable, TabsPageTable } from 'components';

export default class MdocTable  extends React.Component {
    static defaultProps = {
        pageSize: 30,
        listName: 'list',
        params: {},
    };
    state = {
        params: this.props.params,
    }
    refresh () {
        this.table.refresh();
    }
    onSearch (keyword) {
        const { params } = this.state;
        this.setState({ params: { ...params, keyword } }, ::this.refresh);
    }
    render () {
        const { params } = this.state;
        const { hasTotalCount, tables, url, listName, pageSize, columns, onRowClick, pageSizeOptions, noFooter } = this.props;
        const Component = tables ? (hasTotalCount ? TabsTable : TabsPageTable) : (hasTotalCount ? PlainTable : PlainPageTable);
        return (
            <TableContainer
                onSearch={::this.onSearch}
                refresh={::this.refresh}>
                <Component
                    ref={(ref) => { this.table = ref; }}
                    url={url}
                    listName={listName}
                    params={params}
                    pageSize={pageSize}
                    tables={tables}
                    columns={columns}
                    pageSizeOptions={pageSizeOptions}
                    noFooter={noFooter}
                    onRowClick={onRowClick} />
            </TableContainer>
        );
    }
}
