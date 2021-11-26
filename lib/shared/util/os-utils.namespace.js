"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OsUtils = void 0;
const os = __importStar(require("os"));
var OsUtils;
(function (OsUtils) {
    let Platform;
    (function (Platform) {
        Platform[Platform["windows"] = 0] = "windows";
        Platform[Platform["unix"] = 1] = "unix";
        Platform[Platform["other"] = 2] = "other";
    })(Platform = OsUtils.Platform || (OsUtils.Platform = {}));
    function getOs() {
        switch (os.platform()) {
            case 'win32':
                return Platform.windows;
            case 'darwin':
            case 'linux':
                return Platform.unix;
            default:
                return Platform.other;
        }
    }
    OsUtils.getOs = getOs;
    function getPlatformPathSeparator() {
        switch (getOs()) {
            case Platform.windows:
                return '\\';
            case Platform.other:
            case Platform.unix:
                return '/';
        }
    }
    OsUtils.getPlatformPathSeparator = getPlatformPathSeparator;
    function parsePath(path) {
        return path.replace(/\\/g, '/');
    }
    OsUtils.parsePath = parsePath;
})(OsUtils = exports.OsUtils || (exports.OsUtils = {}));
//# sourceMappingURL=os-utils.namespace.js.map