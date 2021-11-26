"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeUtils = void 0;
const child_process_1 = require("child_process");
var NodeUtils;
(function (NodeUtils) {
    function executeCommand(cmd, args, pwd, successKeyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield spawnPromise(cmd, args, pwd);
                return {
                    isSuccess: result.includes(successKeyword),
                    log: result.trim(),
                };
            }
            catch (err) {
                return null;
            }
        });
    }
    NodeUtils.executeCommand = executeCommand;
    function spawnPromise(command, args, path) {
        // *** Return the promise
        return new Promise((resolve, reject) => {
            var _a;
            const process = (0, child_process_1.spawn)(command, args, {
                shell: true,
                detached: false,
                cwd: path,
            });
            if (!process.stdin) {
                throw new Error('Unable to open stream, stdin');
            }
            if (!process.stdout) {
                throw new Error('Unable to open stream, stdout');
            }
            let std_out = '';
            process.stdout.on('data', (data) => {
                console.log(data.toString());
                std_out += data.toString();
            });
            process.stdout.on('close', () => resolve(std_out));
            process.stdout.on('exit', () => resolve(std_out));
            (_a = process.stderr) === null || _a === void 0 ? void 0 : _a.on('data', () => resolve(std_out));
            process.on('error', (err) => reject(err));
            process.on('exit', () => resolve(std_out));
        });
    }
    NodeUtils.spawnPromise = spawnPromise;
})(NodeUtils = exports.NodeUtils || (exports.NodeUtils = {}));
//# sourceMappingURL=node-utils.namespace.js.map