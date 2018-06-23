function getNotEmptyValidator (label, word) {
    return (rule, value, callback) => {
        if (typeof value === 'string' && value && !value.trim()) {
            callback(`请${word}${label}`);
        } else {
            callback();
        }
    };
}
export function getFormItemLayout (layout, formGroup, hasOffset) {
    if (formGroup) {
        return {};
    }
    return {
        labelCol: { span: layout && layout[0] ? layout[0] : 4 },
        wrapperCol: { span: layout ? (layout[1] ? layout[1] : 16 - layout[0]) : 12, offset: hasOffset ? (layout && layout[0] ? layout[0] : 4) : 0 },
    };
}
export function getDefaultRules (label, required, rules = [], word = '填写') {
    const defaultRules = required ? [ { required, message: `请${word}${label}` }, { validator: getNotEmptyValidator(label, word) } ] : [];
    return [ ...defaultRules, ...rules ];
}
export function isNullValue (value) {
    if (!value) {
        if (value === 0) {
            return false;
        }
        return true;
    }
    return false;
}
export function formatFileSize (size) {
    if (size >= 1048576) { // 1M
        return (size / 1048576).toFixed(2).replace(/\.?0*$/, '') + 'M';
    }
    if (size >= 1024) { // 1K
        return (size / 1024).toFixed(2).replace(/\.?0*$/, '') + 'K';
    }
    return size + 'B';
}
