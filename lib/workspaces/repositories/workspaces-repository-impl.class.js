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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesRepositoryImpl = void 0;
const os_utils_namespace_1 = require("../../shared/util/os-utils.namespace");
const fs_extra_1 = __importDefault(require("fs-extra"));
const nx_generator_model_1 = require("../../projects/models/nx-generator.model");
class WorkspacesRepositoryImpl {
    isPathNxWorkspace(pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fs_extra_1.default.pathExists(`${pwd}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}nx.json`);
        });
    }
    getWorkspaceName(pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fs_extra_1.default.readJSON(`${pwd}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}package.json`);
        });
    }
    getAllTags(workspacePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = [];
            // const pathToNxJson = `${workspacePath}${OsUtils.getPlatformPathSeparator()}nx.json`;
            // const nxJson = await fsExtra.readJSON(pathToNxJson);
            // console.log(nxJson);
            // Object.entries(nxJson.projects).forEach(([key, value]) => tags.push(...(value as { tags: string[] }).tags));
            return tags;
        });
    }
    /**
     *
     * @param workspacePath
     */
    getAvailableNxGenerators(workspacePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const installedGenerators = [];
            const filePath = `${workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}package.json`;
            const packageJson = yield fs_extra_1.default.readJSON(filePath);
            const dependencies = [
                ...Object.entries(packageJson.dependencies),
                ...Object.entries(packageJson.devDependencies),
            ];
            outer: for (const dependencyPair of dependencies) {
                for (const supportedNxGenerator of nx_generator_model_1.supportedNxPackagesAsList) {
                    //   [ 'eslint', '7.22.0' ]
                    const dependencyName = dependencyPair[0];
                    if (dependencyName.includes(supportedNxGenerator)) {
                        //  TODO: Do a one liner
                        const generator = (0, nx_generator_model_1.getNxGenerator)(supportedNxGenerator);
                        if (!generator) {
                            continue;
                        }
                        installedGenerators.push(...(0, nx_generator_model_1.getNxGenerator)(supportedNxGenerator));
                        continue outer;
                    }
                }
            }
            return installedGenerators;
        });
    }
}
exports.WorkspacesRepositoryImpl = WorkspacesRepositoryImpl;
//# sourceMappingURL=workspaces-repository-impl.class.js.map