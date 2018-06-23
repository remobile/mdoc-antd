import React from 'react';
import { _N } from 'utils';
import _ from 'lodash';
import styles from './index.less';

export function fixColumns (columns) {
    columns = _.cloneDeep(columns);
    return columns.map((o) => {
        let unitRender;
        if (o.unit) {
            unitRender = (data = 0, record, index) => <span>{ _N(o.value ? o.value(data, record, index) : data) }<span className={styles.unit}>{_.isFunction(o.unit) ? o.unit(data, record, index) : o.unit}</span></span>;
        }

        let valuesRender;
        if (o.values) {
            valuesRender = (data, record, index) => {
                const values = _.reject(o.values(data, record, index), k => _.isNil(k));
                return (
                    <div className={styles.baseValueContainer}>
                        {
                            values.map((item, k) => (
                                k === 0 && (
                                    <span key={k}>
                                        { item }
                                        { !!o.unit && <span className={styles.unit}>{_.isFunction(o.unit) ? o.unit(data, record, index) : o.unit}</span> }
                                    </span>
                                ) || (
                                    !!item.value &&
                                    <span key={k} className={styles.baseValue}>
                                        { item.value }
                                        { !!item.unit && <span className={styles.unit}>{_.isFunction(item.unit) ? item.unit(data, record, index) : item.unit}</span> }
                                    </span>
                                    ||
                                    <span key={k} className={styles.baseValue}>
                                        { item }
                                    </span>
                                )
                            ))
                        }
                    </div>
                );
            };
        }
        if (!o.render) {
            o.render = (data, record, index) => {
                if (valuesRender) {
                    data = valuesRender(data, record, index);
                } else if (unitRender) {
                    data = unitRender(data, record, index);
                } else if (o.value) {
                    data = o.value(data, record, index);
                } else if (_.isNil(data)) {
                    data = '无';
                }
                return data;
            };
        } else {
            const render = o.render;
            o.render = (data, record, index) => {
                data = render(data, record, index);
                if (o.unit) {
                    data = <span>{data}<span className={styles.unit}>{_.isFunction(o.unit) ? o.unit(data, record, index) : o.unit}</span></span>;
                }
                return data;
            };
        }

        if (o.totalUnit) {
            const title = o.title;
            o.title = <span>{title}<span className={styles.unit}>({o.totalUnit})</span></span>;
            delete o.totalUnit;
        }
        return o;
    });
}
