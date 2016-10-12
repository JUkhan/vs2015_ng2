"use strict";
class FV {
    static required(val, fieldName) {
        if (val) {
            return true;
        }
        return `${fieldName} is required.`;
    }
    static minLength(limit, message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            if (val.length < limit) {
                return message || `Minimum length is ${limit} characters.`;
            }
            return true;
        };
    }
    static maxLength(limit, message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            if (val.length > limit) {
                return message || `Maximum length is ${limit} characters.`;
            }
            return true;
        };
    }
    static email(message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(val)) {
                return message || 'Invalid email ID.';
            }
            return true;
        };
    }
    static regex(exp, message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            if (!exp.test(val)) {
                return message;
            }
            return true;
        };
    }
}
exports.FV = FV;

//# sourceMappingURL=FV.js.map
