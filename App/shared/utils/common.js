import _ from 'lodash';

export function _N (num, rank = 2) {
    typeof num !== 'number' && (num = 0);
    return parseFloat(num.toFixed(rank));
}
export function omitNil (obj) {
    return _.omitBy(obj, _.isNil);
}
export function needLoadPage (data, property, pageNo, pageSize) {
    const count = _.get(data, 'count');
    const list = _.get(data, property);
    const maxFullPage = Math.floor((count - 1) / pageSize);
    const maxDetectListSize = pageNo < maxFullPage ? pageSize : count - maxFullPage * pageSize;
    const detectList = _.slice(list, pageNo * pageSize, (pageNo + 1) * pageSize);
    let needLoad = true;
    if (detectList.length === maxDetectListSize) {
        needLoad = !_.every(detectList);
    }
    return needLoad;
}
export function until (test, iterator, callback) {
    if (!test()) {
        iterator((err) => {
            if (err) {
                return callback(err);
            }
            until(test, iterator, callback);
        });
    } else {
        callback();
    }
}
export function toThousands (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
export function getPercentages (list) {
    const sum = _.sum(list);
    return list.map((v) => Math.round(v * 100 / sum) + '%');
}
export function formatPhoneList (phoneList = '', phone = '') {
    phoneList = phone + ';' + phoneList.replace('；', ';');
    phoneList = _.uniq(_.filter(_.map(phoneList.split(';'), m => m.trim()), o => !!o));
    return phoneList.join(';');
}
export function getAddressOptions (list = [], lastCode, withTown) { // withTown为true，会一直选择到镇级和街道级
    let options;
    let value = [];
    for (const item of list) {
        const parent = _.find(item, o => o.code === lastCode) || {};
        parent.children = options;
        lastCode = parent.parentCode;
        parent.name && (value.unshift(parent.name));
        options = item.map(o => ({ value: o.name, label: o.name, code: o.code, level: o.level, isLeaf: !withTown ? o.isLeaf : o.level === 10, children: o.children }));
    }
    return {
        value,
        options: options || [],
    };
}
export function getStartPointOptions (list = [], lastCode, id) { // 如果始发地是分店或者收货点，则传id，否则不传，一旦传了id，lastCode则无效
    let options;
    let value = [];
    for (const item of list) {
        const parent = _.find(item, o => !id ? o.code === lastCode : o.id === id) || {};
        parent.children = options;
        lastCode = parent.isLeaf ? parent.addressRegionLastCode : parent.parentCode;
        (parent.id || parent.name) && (value.unshift(parent.id || parent.name));
        options = item.map(o => ({ value: o.id || o.name, label: o.name + (o.isShop ? '（分店）' : o.isAgent ? '（收货点）' : ''), code: o.code, level: o.level, isLeaf: o.isLeaf || false, isShop: o.isShop, isAgent: o.isAgent, children: o.children }));
        id = undefined;
    }
    return {
        value,
        options: options || [],
    };
}
