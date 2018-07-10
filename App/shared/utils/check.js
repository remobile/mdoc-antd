import _ from 'lodash';

function testTelePhone (phone) {
    return /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(phone);
}
function testPhone (phone) {
    return /^0\d{2,3}-\d{7,8}$/.test(phone);
}

function checkTelePhone (rule, value, callback) {
    if (!testTelePhone(value)) {
        callback('请输入正确的手机号码');
    } else {
        callback();
    }
}
function checkSitePhone (rule, value, callback) {
    if (!testPhone(value)) {
        callback('请输入正确的座机号码');
    } else {
        callback();
    }
}
function checkPhone (rule, value, callback) {
    if (!testPhone(value) && !testTelePhone(value)) {
        callback('请输入正确的电话号码');
    } else {
        callback();
    }
}
function checkPayPassword (value) {
    return /^\d{6}$/.test(value);
}
function checkPhoneList (rule, value = '', callback) {
    const phoneList = _.reject(_.map(value.split(/;|；/), m => m.trim()), o => !o.length);
    if (phoneList.length && !_.every(phoneList, o => testPhone(o) || testTelePhone(o))) {
        callback('请输入正确的电话号码');
    } else {
        callback();
    }
}
function checkEmail (rule, value, callback) {
    if (value && !/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
        callback('请输入正确的邮箱地址');
    } else {
        callback();
    }
}
function checkBankCard (rule, value, callback) {
    if (value && !/^(\d{16}|\d{19})$/.test(value)) {
        callback('请输入正确的银行卡卡号');
    } else {
        callback();
    }
}
function checkQQ (rule, value, callback) {
    if (value && !/^[1-9][0-9]{4,10}$/.test(value)) {
        callback('请输入正确的QQ号码');
    } else {
        callback();
    }
}
function checkPassword (rule, value, callback) {
    if (!value) {
        callback();
    } else if (!/^[\x21-\x7e]{6,20}$/.test(value)) {
        callback('密码只能由6-20位数字，大小写字母和英文符号组成');
    } else {
        callback();
    }
}
function checkVerifyCode (rule, value, callback) {
    if (value && !/^\d{6}$/.test(value)) {
        callback('请输入正确的验证码');
    } else {
        callback();
    }
}
function checkRecuitNumber (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('人数必须是整数');
    } else if (value && value < 1) {
        callback('人数不能少于1');
    } else {
        callback();
    }
}
function checkAgeNumber (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('年龄必须是整数');
    } else if (value && value < 18) {
        callback('年龄不能少于18');
    } else if (value && value > 70) {
        callback('年龄不能大于70');
    } else {
        callback();
    }
}
function checkRecuitMoney (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('资薪必须是整数');
    } else if (value && value < 1) {
        callback('资薪不能少于1');
    } else {
        callback();
    }
}
function testPlateNo (plateNo) {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(plateNo);
}
function checkPlateNo (rule, value, callback) {
    if (!testPlateNo(value)) {
        callback('请输入正确的车牌');
    } else {
        callback();
    }
}
function checkAge (rule, str, callback) {
    let re = /^[0-9]*[1-9][0-9]*$/;
    if (!re.test(str)) {
        callback('请输入正确的年龄');
    } else {
        callback();
    }
}
function checkTax (rule, str, callback) {
    let re = /^[A-Z0-9]{18}$/;
    if (!re.test(str)) {
        callback('请输入正确的税号');
    } else {
        callback();
    }
}
function checkIdentifyNumber (rule, str, callback) {
    let re = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (!re.test(str)) {
        callback('请输入正确身份证号');
    } else {
        callback();
    }
}
function checkInt2PointNum (rule, str, callback) {
    let re = /^[0-9]+(.[0-9]{1,2})?$/;
    if (!re.test(str)) {
        callback('请输入正数且最多保留2位小数');
    } else {
        callback();
    }
}

export function getCheckRules(_this, rules) {
    if (!rules) {
        return undefined;
    }
    // 函数
    if (typeof rules === 'function') {
        return [ { validator: rules.bind(_this) } ];
    }
    // 正则表达式
    if (typeof rules === 'object' && rules.reg instanceof RegExp) {
        return [ { validator: function(rule, str, callback) {
            if (!rules.reg.test(str)) {
                callback(rules.text);
            } else {
                callback();
            }
        } } ];
    }
    // 特殊处理
    if (/password->/.test(rules)) {
        const items = rules.split('->');
        return [ { validator: function (rule, value, callback) {
            if (!value) {
                callback();
            } else if (!/^[\x21-\x7e]{6,20}$/.test(value)) {
                callback('密码只能由6-20位数字，大小写字母和英文符号组成');
            } else {
                const { validateFields } = _this.props.form;
                if (value) {
                    validateFields([items[1]], { force: true });
                }
                callback();
            }
        } } ];
    }
    if (/password<-/.test(rules)) {
        const items = rules.split('<-');
        return [ { validator: function (rule, value, callback) {
            const { getFieldValue } = _this.props.form;
            if (value && value !== getFieldValue(items[1])) {
                callback('两次输入密码不一致');
            } else {
                callback();
            }
        } } ];
    }

    // 默认规则
    const maps = {
        telephone: checkTelePhone,
        sitephone: checkSitePhone,
        phone: checkPhone,
        phoneList: checkPhoneList,
        verifyCode: checkVerifyCode,
        password: checkPassword,
        qq: checkQQ,
        identifyNumber: checkIdentifyNumber,
        tax: checkTax,
        plateNo: checkPlateNo,
        age: checkAge,
        email: checkEmail,
    };

    return [ { validator: maps[rules] } ];
}
