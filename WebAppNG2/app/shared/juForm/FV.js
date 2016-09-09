"use strict";
var FV = (function () {
    function FV() {
    }
    FV.required = function (val, fieldName) {
        if (val) {
            return true;
        }
        return fieldName + " is required.";
    };
    FV.minLength = function (limit, message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            if (val.length < limit) {
                return message || "Minimum length is " + limit + " characters.";
            }
            return true;
        };
    };
    FV.maxLength = function (limit, message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            if (val.length > limit) {
                return message || "Maximum length is " + limit + " characters.";
            }
            return true;
        };
    };
    FV.email = function (message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(val)) {
                return message || 'Invalid email ID.';
            }
            return true;
        };
    };
    FV.regex = function (exp, message) {
        return function (val, fieldName) {
            val = (val || '').toString();
            if (!exp.test(val)) {
                return message;
            }
            return true;
        };
    };
    return FV;
}());
exports.FV = FV;
//# sourceMappingURL=FV.js.map