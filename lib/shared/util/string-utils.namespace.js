"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
var StringUtils;
(function (StringUtils) {
    function addBackslashAtEndIfNotThere(inputString) {
        return inputString.charAt(inputString.length - 1) === '/'
            ? inputString
            : `${inputString}/`;
    }
    StringUtils.addBackslashAtEndIfNotThere = addBackslashAtEndIfNotThere;
    function removeConsecutiveCommas(str) {
        return str.replace(/(,)\1+/g, '');
    }
    StringUtils.removeConsecutiveCommas = removeConsecutiveCommas;
    function removeSpecialCharFrontBack(str) {
        let parsedString = str;
        //  Check if first char is not a letter
        if (str.charAt(0).match(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g)) {
            parsedString = parsedString.substring(1);
        }
        //  Check if last char is not a letter
        if (str.charAt(str.length - 1).match(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g)) {
            parsedString = parsedString.slice(0, -1);
        }
        return parsedString;
    }
    StringUtils.removeSpecialCharFrontBack = removeSpecialCharFrontBack;
    function removeSpecialCharacters(str) {
        return str.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
    }
    StringUtils.removeSpecialCharacters = removeSpecialCharacters;
})(StringUtils = exports.StringUtils || (exports.StringUtils = {}));
//# sourceMappingURL=string-utils.namespace.js.map