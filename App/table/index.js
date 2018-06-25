import React from 'react';
import { TableContainer, PlainTable } from 'components';
import { Modal, InputNumber, Select } from 'antd';
import { confirm, showError } from 'utils';
import styles from './index.less';
import _ from 'lodash';

const columns = [{
    title: '分店',
    dataIndex: 'shop.name',
}, {
    title: '物流公司',
    dataIndex: 'shipper.name',
}, {
    title: '到货地',
    dataIndex: 'endPoint',
}, {
    title: '单价',
    dataIndex: 'price',
}, {
    title: '起价',
    dataIndex: 'minFee',
}, {
    title: '时长',
    dataIndex: 'duration',
}, {
    title: '提成比例',
    dataIndex: 'profitRate',
    render: (data, record) => !_.isNil(data) ? <span style={{ color:'red' }}>{data * 100}%</span> : <span style={{ color:'green' }}>{record.defaultProfitRate * 100 || '20'}%</span>,
}];

export default class Roadmaps extends React.Component {
    state = {
        keyword: '',
    }
    refresh () {
        const { keyword } = this.state;
        this.table.refresh(keyword);
    }
    onSearch (keyword) {
        this.setState({ keyword }, ::this.refresh);
    }
    onRowClick (record, index) {

    }
    render () {
        const { roadmaps = {}, rootShop: { isMasterShop } } = this.props;
        return (
            <TableContainer
                onSearch={::this.onSearch}
                refresh={::this.refresh}>
                <PlainTable
                    ref={(ref) => { this.table = ref; }}
                    {...this.props}
                    columns={columns}
                    totalCount={roadmaps.count}
                    dataSource={roadmaps.roadmapList}
                    onRowClick={::this.onRowClick} />
            </TableContainer>
        );
    }
}
