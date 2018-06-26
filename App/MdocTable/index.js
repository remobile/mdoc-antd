import React from 'react';
import { TableContainer, PlainTable, PlainPageTable, TabsTable, TabsPageTable } from 'components';

export default class MdocTable  extends React.Component {
    static defaultProps = {
        pageSize: 1,
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
        const { url, listName, pageSize, columns, onRowClick, pageSizeOptions } = this.props;
        return (
            <TableContainer
                onSearch={::this.onSearch}
                refresh={::this.refresh}>
                <PlainPageTable
                    ref={(ref) => { this.table = ref; }}
                    url={url}
                    listName={listName}
                    params={params}
                    pageSize={pageSize}
                    columns={columns}
                    pageSizeOptions={pageSizeOptions}
                    onRowClick={onRowClick} />
            </TableContainer>
        );
    }
}
