import React from 'react';
import _ from 'lodash';
import { Form, Cascader } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
import { post, getAddressOptions } from 'utils';
const FormItem = Form.Item;

const DEFAULT_OPTIONS = [{isLeaf:true,id:1,code:11,parentCode:0,label:'北京',value:'北京',level:0},{isLeaf:true,id:336,code:12,parentCode:0,label:'天津',value:'天津',level:0},{isLeaf:false,id:632,code:13,parentCode:0,label:'河北',value:'河北',level:2},{isLeaf:false,id:3098,code:14,parentCode:0,label:'山西',value:'山西',level:2},{isLeaf:false,id:4666,code:15,parentCode:0,label:'内蒙古',value:'内蒙古',level:2},{isLeaf:false,id:5824,code:21,parentCode:0,label:'辽宁',value:'辽宁',level:2},{isLeaf:false,id:7528,code:22,parentCode:0,label:'吉林',value:'吉林',level:2},{isLeaf:false,id:8555,code:23,parentCode:0,label:'黑龙江',value:'黑龙江',level:2},{isLeaf:true,id:10540,code:31,parentCode:0,label:'上海',value:'上海',level:0},{isLeaf:false,id:10803,code:32,parentCode:0,label:'江苏',value:'江苏',level:2},{isLeaf:false,id:12591,code:33,parentCode:0,label:'浙江',value:'浙江',level:2},{isLeaf:false,id:14229,code:34,parentCode:0,label:'安徽',value:'安徽',level:2},{isLeaf:false,id:16063,code:35,parentCode:0,label:'福建',value:'福建',level:2},{isLeaf:false,id:17354,code:36,parentCode:0,label:'江西',value:'江西',level:2},{isLeaf:false,id:19275,code:37,parentCode:0,label:'山东',value:'山东',level:2},{isLeaf:false,id:21382,code:41,parentCode:0,label:'河南',value:'河南',level:2},{isLeaf:false,id:24017,code:42,parentCode:0,label:'湖北',value:'湖北',level:2},{isLeaf:false,id:25574,code:43,parentCode:0,label:'湖南',value:'湖南',level:2},{isLeaf:false,id:28235,code:44,parentCode:0,label:'广东',value:'广东',level:2},{isLeaf:false,id:30163,code:45,parentCode:0,label:'广西',value:'广西',level:2},{isLeaf:false,id:31562,code:46,parentCode:0,label:'海南',value:'海南',level:2},{isLeaf:false,id:31928,code:50,parentCode:0,label:'重庆',value:'重庆',level:1},{isLeaf:false,id:33005,code:51,parentCode:0,label:'四川',value:'四川',level:2},{isLeaf:false,id:37904,code:52,parentCode:0,label:'贵州',value:'贵州',level:2},{isLeaf:false,id:39555,code:53,parentCode:0,label:'云南',value:'云南',level:2},{isLeaf:false,id:41102,code:54,parentCode:0,label:'西藏',value:'西藏',level:2},{isLeaf:false,id:41876,code:61,parentCode:0,label:'陕西',value:'陕西',level:2},{isLeaf:false,id:43775,code:62,parentCode:0,label:'甘肃',value:'甘肃',level:2},{isLeaf:false,id:45285,code:63,parentCode:0,label:'青海',value:'青海',level:2},{isLeaf:false,id:45752,code:64,parentCode:0,label:'宁夏',value:'宁夏',level:2},{isLeaf:false,id:46046,code:65,parentCode:0,label:'新疆',value:'新疆',level:2}];

function getCheckValidator (label, options, needWhole) {
    return (rule, value, callback) => {
        if (!value || !value.length) {
            callback();
        } else {
            let item;
            for (const v of value) {
                item = _.find(options, m => m.value === v);
                if (!item) {
                    break;
                }
                options = item.children;
            }
            if (needWhole && (!item || !item.isLeaf)) {
                callback(`请选择完整${label}`);
            } else {
                callback();
            }
        }
    };
}

function getRegionAddress (parentCode, type, callback) {
    post('/api/getRegionAddress', { parentCode, type }).then((ret)=>{
        const addressList = ret.success ? ret.context.addressList : [];
        const address = addressList.map(o => ({ value: o.name, label: o.name, code: o.code, level: o.level, isLeaf: type !== 2 ? o.isLeaf : o.level === 10 || o.level === 100 }));
        callback(address);
    });
}

function getRegionAddressFromLastCode (addressLastCode, type, callback) {
    post('/api/getRegionAddressFromLastCode', { addressLastCode, type }).then((ret)=>{
        const address = getAddressOptions(ret.success ? ret.context.addressList : [], addressLastCode);
        callback(address);
    });
}

export default class AddressFormItem extends React.Component {
    static defaultProps = {
        type: 0,
    };
    constructor (props) {
        super(props);
        this.state = {
            show: false,
        };
    }
    componentDidMount () {
        const { form, value, type } = this.props;
        const key = _.keys(value)[0];
        let v = value[key];
        if (v < 0) { // 小于0的时候说明传入的是parentCode
            getRegionAddress(-v, type, (address) => {
                this.setState({ options: address, initialValue: [], show: true });
            });
        } else if (v >= 100) { //需要去拉取 options
            getRegionAddressFromLastCode(v, type, (address) => {
                this.setState({ initialValue: address.value, options: address.options, show: true });
            });
        } else {
            if (typeof v === 'number') { // 数字
                v = (_.find(DEFAULT_OPTIONS, o=>o.code==v)||{}).value;
            }
            this.setState({ initialValue: v ? [v] : [], options: DEFAULT_OPTIONS, show: true });
        }
    }
    loadData (selectedOptions) {
        const type = this.props.type;
        const item = selectedOptions[selectedOptions.length - 1];
        item.loading = true;
        getRegionAddress(item.code, type, (address) => {
            item.children = address;
            item.loading = false;
            this.setState({
                options: [...this.state.options],
            });
        });
    }
    onChange (value, selectedOptions) {
        const { onChange } = this.props;
        const lastItem = selectedOptions[selectedOptions.length - 1];
        onChange && onChange({
            isLeaf: lastItem.isLeaf,
            lastCode: lastItem.code,
            value: selectedOptions.map(o=>o.value),
        });
    }
    getAddressLastCode () {
        return (this.getAddressLastItem() || {}).code;
    }
    getAddressLastItem () {
        let lastItem;
        let { options } = this.state;
        const { form, value } = this.props;
        const key = _.keys(value)[0];
        const values = form.getFieldValue(key);
        if (values) {
            for (const v of values) {
                const item = _.find(options, o => o.value === v);
                if (item) {
                    lastItem = item;
                    options = item.children;
                }
            }
        }
        return lastItem;
    }
    render () {
        const { show, initialValue, options } = this.state;
        const { form, label, value, editing, layout, placeholder, rules, required = true, needWhole = true, hasFeedback = true, formGroup } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                >
                {
                    show && form.getFieldDecorator(key, {
                        initialValue,
                        rules: getDefaultRules(label, required, rules || [ { validator: getCheckValidator(label, options, needWhole) } ], '选择'),
                    })(
                        <Cascader
                            placeholder={placeholder || `请选择${label}`}
                            options={options}
                            loadData={::this.loadData}
                            onChange={::this.onChange}
                            changeOnSelect
                            />
                    )
                }
            </FormItem>
        );
    }
}
