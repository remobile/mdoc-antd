import _ from 'lodash';

export function testTelePhone (phone) {
    return /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(phone);
}
export function testPhone (phone) {
    return /^0\d{2,3}-\d{7,8}$/.test(phone);
}

export function checkTelePhone (rule, value, callback) {
    if (!testTelePhone(value)) {
        callback('请输入正确的手机号码');
    } else {
        callback();
    }
}
export function checkSitePhone (rule, value, callback) {
    if (!testPhone(value)) {
        callback('请输入正确的座机号码');
    } else {
        callback();
    }
}
export function checkPhone (rule, value, callback) {
    if (!testPhone(value) && !testTelePhone(value)) {
        callback('请输入正确的电话号码');
    } else {
        callback();
    }
}
export function checkPayPassword (value) {
    return /^\d{6}$/.test(value);
}
export function checkPhoneList (rule, value = '', callback) {
    const phoneList = _.reject(_.map(value.split(/;|；/), m => m.trim()), o => !o.length);
    if (phoneList.length && !_.every(phoneList, o => testPhone(o) || testTelePhone(o))) {
        callback('请输入正确的电话号码');
    } else {
        callback();
    }
}
export function checkEmail (rule, value, callback) {
    if (value && !/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
        callback('请输入正确的邮箱地址');
    } else {
        callback();
    }
}
export function checkBankCard (rule, value, callback) {
    if (value && !/^(\d{16}|\d{19})$/.test(value)) {
        callback('请输入正确的银行卡卡号');
    } else {
        callback();
    }
}
export function checkQQ (rule, value, callback) {
    if (value && !/^[1-9][0-9]{4,10}$/.test(value)) {
        callback('请输入正确的QQ号码');
    } else {
        callback();
    }
}
export function checkPassword (rule, value, callback) {
    if (!value) {
        callback();
    } else if (!/^[\x21-\x7e]{6,20}$/.test(value)) {
        callback('密码只能由6-20位数字，大小写字母和英文符号组成');
    } else {
        callback();
    }
}
export function checkVerifyCode (rule, value, callback) {
    if (value && !/^\d{6}$/.test(value)) {
        callback('请输入正确的验证码');
    } else {
        callback();
    }
}
export function checkRecuitNumber (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('人数必须是整数');
    } else if (value && value < 1) {
        callback('人数不能少于1');
    } else {
        callback();
    }
}
export function checkAgeNumber (rule, value, callback) {
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
export function checkRecuitMoney (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('资薪必须是整数');
    } else if (value && value < 1) {
        callback('资薪不能少于1');
    } else {
        callback();
    }
}
export function testPlateNo (plateNo) {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(plateNo);
}
export function checkPlateNo (rule, value, callback) {
    if (!testPlateNo(value)) {
        callback('请输入正确的车牌');
    } else {
        callback();
    }
}
export function checkAge (rule, str, callback) {
    let re = /^[0-9]*[1-9][0-9]*$/;
    if (!re.test(str)) {
        callback('请输入正确的年龄');
    } else {
        callback();
    }
}
export function checkTax (rule, str, callback) {
    let re = /^[A-Z0-9]{18}$/;
    if (!re.test(str)) {
        callback('请输入正确的税号');
    } else {
        callback();
    }
}
export function checkIdentifyNumber (rule, str, callback) {
    let re = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (!re.test(str)) {
        callback('请输入正确身份证号');
    } else {
        callback();
    }
}
export function checkInt2PointNum (rule, str, callback) {
    let re = /^[0-9]+(.[0-9]{1,2})?$/;
    if (!re.test(str)) {
        callback('请输入正数且最多保留2位小数');
    } else {
        callback();
    }
}
