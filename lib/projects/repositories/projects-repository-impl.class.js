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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsRepositoryImpl = void 0;
//  System
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const nx_generator_model_1 = require("../models/nx-generator.model");
const folder_tree_model_1 = require("../models/folder-tree.model");
const project_type_enum_1 = require("../models/project-type.enum");
//  Utils
const os_utils_namespace_1 = require("../../shared/util/os-utils.namespace");
const node_utils_namespace_1 = require("../../shared/util/node-utils.namespace");
const string_utils_namespace_1 = require("../../shared/util/string-utils.namespace");
class ProjectsRepositoryImpl {
    openConfigFiles(workspacePath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.workspacePath = workspacePath;
            try {
                this.nxJsonFile = yield fs_extra_1.default.readJSON(`${workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}nx.json`);
            }
            catch (err) {
                console.warn('No nx.json file.');
            }
            try {
                this.workspaceJson = yield fs_extra_1.default.readJSON(`${workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}workspace.json`);
            }
            catch (err) {
                console.warn('No workspace.json file.');
            }
            try {
                this.angularJson = yield fs_extra_1.default.readJSON(`${workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}angular.json`);
            }
            catch (err) {
                console.warn('No angular.json file.');
            }
        });
    }
    clean() {
        this.nxJsonFile = undefined;
        this.workspaceJson = undefined;
        this.workspacePath = undefined;
        this.angularJson = undefined;
    }
    /**
     *
     * @param currPath
     */
    getAllProjectsV2(currPath) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            let projects = [];
            let matchingNameCounter = 0;
            const files = yield fs_extra_1.default.readdir(currPath);
            try {
                for (var files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), !files_1_1.done;) {
                    const file = files_1_1.value;
                    const absolutePath = path_1.default.join(currPath, file);
                    const isFileDirectory = (yield fs_extra_1.default.stat(absolutePath)).isDirectory();
                    if (isFileDirectory && !file.includes('node_modules') && !file.includes('dist')) {
                        projects = [...projects, ...(yield this.getAllProjectsV2(absolutePath))];
                    }
                    else if (this.isProject(file, files)) {
                        matchingNameCounter++;
                    }
                    if (matchingNameCounter > 1) {
                        const name = this.getProjectName(currPath);
                        const path = currPath;
                        const relativePath = this.trimToRelativePath(currPath);
                        const type = this.getProjectType(currPath);
                        const nameInConfig = this.findProjectNameInConfigFiles(currPath);
                        const folderTree = yield this.getProjectFolderTree(currPath);
                        const tags = yield this.getTags(nameInConfig, currPath);
                        projects.push({
                            name,
                            path,
                            relativePath,
                            type,
                            nameInConfig,
                            folderTree,
                            tags,
                        });
                        matchingNameCounter = 0;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) yield _a.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return projects;
        });
    }
    /**
     *
     * @param workspacePath
     */
    cleanEmptyDirWinFunction(workspacePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileStats = yield fs_extra_1.default.lstat(workspacePath);
            if (!fileStats.isDirectory()) {
                return;
            }
            let fileNames = yield fs_extra_1.default.readdir(workspacePath);
            if (fileNames.length > 0) {
                const recursiveRemovalPromises = fileNames.map(fileName => this.cleanEmptyDirWinFunction(path_1.default.join(workspacePath, fileName)));
                yield Promise.all(recursiveRemovalPromises);
                // re-evaluate fileNames; after deleting subdirectory
                // we may have parent directory empty now
                fileNames = yield fs_extra_1.default.readdir(workspacePath);
            }
            if (fileNames.length === 0) {
                yield fs_extra_1.default.rmdir(workspacePath);
            }
        });
    }
    /**
     *
     * @param pwd
     */
    getProjectFolderTree(pwd) {
        var e_2, _a;
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const name = pwd.split(os_utils_namespace_1.OsUtils.getPlatformPathSeparator()).pop();
            let folderType;
            if (!name) {
                return null;
            }
            for (const type of folder_tree_model_1.folderTypes) {
                if (type.includes(name)) {
                    folderType = type;
                    break;
                }
            }
            const projectTree = {
                name,
                folderContent: [],
                isDir: true,
                dirType: folderType !== null && folderType !== void 0 ? folderType : folder_tree_model_1.FolderType.unknown,
            };
            const files = yield fs_extra_1.default.readdir(pwd);
            try {
                for (var files_2 = __asyncValues(files), files_2_1; files_2_1 = yield files_2.next(), !files_2_1.done;) {
                    const file = files_2_1.value;
                    //  Check if its folder, and if it is call recursively
                    const absolutePath = path_1.default.join(pwd, file);
                    const isDir = (yield fs_extra_1.default.stat(absolutePath)).isDirectory();
                    if (isDir) {
                        const folderTree = yield this.getProjectFolderTree(absolutePath);
                        if (!folderTree) {
                            continue;
                        }
                        (_b = projectTree.folderContent) === null || _b === void 0 ? void 0 : _b.push(folderTree);
                    }
                    else {
                        let fileType;
                        for (const type of folder_tree_model_1.fileTypes) {
                            if (file.includes(type)) {
                                fileType = type;
                                break;
                            }
                        }
                        //  If its file push to content
                        (_c = projectTree.folderContent) === null || _c === void 0 ? void 0 : _c.push({
                            name: file,
                            isDir: false,
                            fileType: fileType !== null && fileType !== void 0 ? fileType : folder_tree_model_1.FileType.unknown,
                        });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (files_2_1 && !files_2_1.done && (_a = files_2.return)) yield _a.call(files_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return projectTree;
        });
    }
    /**
     *
     * @param pwd
     */
    getProjectName(pwd) {
        const splitPath = pwd.split(os_utils_namespace_1.OsUtils.getPlatformPathSeparator());
        return splitPath[splitPath.length - 1];
    }
    /**
     *
     * @param workspacePath
     * @param file
     * @param projects
     */
    getProjectsNames(workspacePath, file, projects) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = `${workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}${file}`;
            const fileAsJson = yield fs_extra_1.default.readJSON(filePath);
            Object.entries(fileAsJson.projects).forEach(([key, value]) => {
                var _a;
                let currentProjectPath;
                if (file === 'workspace.json') {
                    currentProjectPath = os_utils_namespace_1.OsUtils.parsePath(value);
                }
                else {
                    currentProjectPath = os_utils_namespace_1.OsUtils.parsePath((_a = value.root) !== null && _a !== void 0 ? _a : '');
                }
                projects.forEach(project => {
                    const trimmedPath = os_utils_namespace_1.OsUtils.parsePath(this.trimToRelativePath(project.path).substring(1));
                    if (currentProjectPath === trimmedPath) {
                        project.nameInConfig = key;
                    }
                });
            });
        });
    }
    /**
     *
     * @param projectPath
     * @param projects
     */
    getProjectNameFromConfigFile(projects, projectPath) {
        let name = '';
        Object.entries(projects).forEach(([key, value]) => {
            var _a;
            let currentProjectPath = '';
            currentProjectPath = ((_a = value) === null || _a === void 0 ? void 0 : _a.root)
                ? os_utils_namespace_1.OsUtils.parsePath(value.root)
                : os_utils_namespace_1.OsUtils.parsePath(value);
            const trimmedPath = os_utils_namespace_1.OsUtils.parsePath(this.trimToRelativePath(projectPath).substring(1));
            if (currentProjectPath === trimmedPath) {
                name = key;
            }
        });
        return name;
    }
    findProjectNameInConfigFiles(projectPath) {
        let name = '';
        if (this.angularJson) {
            name = this.getProjectNameFromConfigFile(this.angularJson.projects, projectPath);
            if (name) {
                return name;
            }
        }
        if (this.workspaceJson) {
            name = this.getProjectNameFromConfigFile(this.workspaceJson.projects, projectPath);
        }
        return name;
    }
    /**
     *
     * @param pwd
     */
    getProjectType(pwd) {
        const libraryTypes = Object.values(project_type_enum_1.ProjectType);
        const keywords = this.trimToRelativePath(pwd)
            .split('/')
            .filter(item => item !== '' && item !== '/')
            .reverse();
        for (let index = 0; index < libraryTypes.length; index++) {
            if (keywords[0].includes(libraryTypes[index]) ||
                keywords[1].includes(libraryTypes[index])) {
                return libraryTypes[index];
            }
        }
        return undefined;
    }
    getTags(projectName, currPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = [
                ...(yield this.getTagsFromProjectJson(`${currPath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}project.json`)),
                ...this.getTagsFromConfigFile(this.workspaceJson, projectName),
                ...this.getTagsFromConfigFile(this.angularJson, projectName),
                ...this.getTagsFromConfigFile(this.nxJsonFile, projectName),
            ];
            return [...new Set(tags)];
        });
    }
    /**
     *
     * @param configFile
     * @param projectName
     */
    getTagsFromConfigFile(configFile, projectName) {
        if (!(configFile === null || configFile === void 0 ? void 0 : configFile.projects)) {
            return [];
        }
        const tags = [];
        Object.entries(configFile.projects).forEach(([key, value]) => {
            var _a;
            const tagsArr = (_a = value) === null || _a === void 0 ? void 0 : _a.tags;
            if (projectName === key && tagsArr && tagsArr.length > 0) {
                tags.push(...tagsArr);
            }
        });
        return tags;
    }
    /**
     *
     * @param projectsJsonPath
     */
    getTagsFromProjectJson(projectsJsonPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = [];
            yield fs_extra_1.default
                .readJSON(projectsJsonPath)
                .then(result => tags.push(...result.tags))
                .catch(() => null);
            return tags;
        });
    }
    /**
     *
     * @param dto
     */
    removeTag(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            let isSuccess = false;
            const { tagToDelete, selectedProject, workspacePath } = dto;
            const pathToNxJson = `${workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}nx.json`;
            const nxJson = yield fs_extra_1.default.readJSON(pathToNxJson);
            Object.entries(nxJson.projects).forEach(([key, value]) => {
                if (key === selectedProject) {
                    const projectObj = value;
                    const tagIndex = projectObj.tags.indexOf(tagToDelete);
                    projectObj.tags.splice(tagIndex, 1);
                    isSuccess = true;
                }
            });
            yield fs_extra_1.default.writeJSON(pathToNxJson, nxJson).catch(() => (isSuccess = false));
            return isSuccess;
        });
    }
    addTagV2(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.attemptToAddTagToProjectJson(dto);
            yield this.attemptAddTagToConfigFiles(dto, this.nxJsonFile, 'nx.json');
            yield this.attemptAddTagToConfigFiles(dto, this.angularJson, 'angular.json');
            yield this.attemptAddTagToConfigFiles(dto, this.workspaceJson, 'workspace.json');
        });
    }
    attemptToAddTagToProjectJson(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tags, projectPath } = dto;
            if (!this.workspacePath) {
                throw new Error('Please set workspace path.');
            }
            const filename = 'project.json';
            const projectJsonPath = os_utils_namespace_1.OsUtils.parsePath(`${this.workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}${projectPath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}${filename}`)
                .replace('//', '/')
                .replace('\\\\', '\\');
            const projectJson = yield fs_extra_1.default
                .readJSON(projectJsonPath)
                .catch(err => console.log('There is no project.json'));
            if (!projectJson || !(projectJson === null || projectJson === void 0 ? void 0 : projectJson.tags)) {
                return false;
            }
            projectJson.tags = [
                ...new Set([...projectJson.tags, ...tags].filter(el => Boolean(el)).map(el => el.trim())),
            ];
            yield fs_extra_1.default.writeJSON(projectJsonPath, projectJson);
            return true;
        });
    }
    attemptAddTagToConfigFiles(dto, configFile, configFileName) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { tags, selectedProjectName } = dto;
            if (!this.workspacePath) {
                throw new Error('Open the config file first');
            }
            if (!((_b = (_a = configFile === null || configFile === void 0 ? void 0 : configFile.projects) === null || _a === void 0 ? void 0 : _a[selectedProjectName]) === null || _b === void 0 ? void 0 : _b.tags)) {
                return;
            }
            configFile.projects[selectedProjectName].tags = [
                ...new Set([...configFile.projects[selectedProjectName].tags, ...tags]
                    .filter(el => Boolean(el))
                    .map(el => el.trim())),
            ];
            const parsedPath = os_utils_namespace_1.OsUtils.parsePath(`${this.workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}${configFileName}`);
            yield fs_extra_1.default.writeJSON(parsedPath, configFile);
        });
    }
    /**
     *
     * @param dto
     */
    addTag(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspacePath, tags, selectedProjectName } = dto;
            const pathToNxJson = `${workspacePath}${os_utils_namespace_1.OsUtils.getPlatformPathSeparator()}nx.json`;
            const nxJson = yield fs_extra_1.default.readJSON(pathToNxJson);
            Object.entries(nxJson.projects).forEach(([key, value]) => {
                if (key === selectedProjectName) {
                    const projectObj = value;
                    projectObj.tags.push(...tags);
                }
            });
            yield fs_extra_1.default.writeJSON(pathToNxJson, nxJson);
            return tags;
        });
    }
    /**
     *
     * @param file
     * @param files
     */
    isProject(file, files) {
        return (file.toString() === '.eslintrc.json' ||
            file.toString() === 'tsconfig.json' ||
            (file.toString() === 'tsconfig.spec.json' && files.includes('src')));
    }
    /**
     *
     * @param pwd
     */
    trimToRelativePath(pwd) {
        if (!this.workspacePath) {
            throw new Error('Workspace path is not defined.');
        }
        return os_utils_namespace_1.OsUtils.parsePath(pwd).replace(this.workspacePath, '');
    }
    /**
     *
     * @param dto
     */
    generateNxArtifact(dto) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { nxGenerator, workspacePath } = dto;
            const name = (0, nx_generator_model_1.getNxGeneratorFieldValue)(nxGenerator, 'name');
            const directory = (0, nx_generator_model_1.getNxGeneratorFieldValue)(nxGenerator, 'directory');
            //  FIXME: Check nullable
            const dir = string_utils_namespace_1.StringUtils.removeSpecialCharFrontBack(os_utils_namespace_1.OsUtils.parsePath(directory !== null && directory !== void 0 ? directory : ''));
            const cmd = os_utils_namespace_1.OsUtils.parsePath(`${nxGenerator.cmd} ${dir ? dir + '/' : ''}${string_utils_namespace_1.StringUtils.removeSpecialCharacters(name !== null && name !== void 0 ? name : '')}`);
            const args = [];
            const { textInputs, checkboxes, dropDowns } = nxGenerator.form;
            textInputs.forEach(textInput => textInput.input && textInput.title !== 'directory' && textInput.title !== 'name'
                ? args.push(`--${textInput.title} ${textInput.input}`)
                : null);
            checkboxes.forEach(checkBoxInput => checkBoxInput.isChecked
                ? args.push(`--${checkBoxInput.title} ${checkBoxInput.isChecked}`)
                : null);
            dropDowns.forEach(dropDownInput => dropDownInput.selectedItem
                ? args.push(`--${dropDownInput.title} ${dropDownInput.selectedItem}`)
                : null);
            const result = yield node_utils_namespace_1.NodeUtils.executeCommand(cmd, args, workspacePath, 'CREATE');
            return {
                isSuccess: true,
                log: (_a = result === null || result === void 0 ? void 0 : result.log) !== null && _a !== void 0 ? _a : '',
            };
        });
    }
}
exports.ProjectsRepositoryImpl = ProjectsRepositoryImpl;
//# sourceMappingURL=projects-repository-impl.class.js.map