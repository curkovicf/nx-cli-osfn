//  System
import path from 'path';
import fsExtra from 'fs-extra';

//  Models
import {IProjectsRepository} from './projects-repository.interface';
import {getNxGeneratorFieldValue} from '../models/nx-generator.model';
import {Project} from '../models/project.model';
import {
  FileType,
  fileTypes,
  FolderType,
  folderTypes,
  ProjectFolder,
} from '../models/folder-tree.model';
import {ProjectType} from '../models/project-type.enum';

//  Dtos
import {TagDto} from '../dtos/tag.dto';
import {RemoveTagDto} from '../dtos/remove-tag.dto';
import {GenerateArtifactDto} from '../dtos/generate-artifact.dto';

//  Utils
import {OsUtils} from '../../shared/util/os-utils.namespace';
import {NodeUtils} from '../../shared/util/node-utils.namespace';
import {StringUtils} from '../../shared/util/string-utils.namespace';

export class ProjectsRepositoryImpl implements IProjectsRepository {
  private nxJsonFile: any | undefined;
  private workspaceJson: any | undefined;
  private angularJson: any | undefined;
  private workspacePath: string | undefined;

  async openConfigFiles(workspacePath: string): Promise<void> {
    this.workspacePath = OsUtils.parsePath(workspacePath);

    try {
      this.nxJsonFile = await fsExtra.readJSON(
        `${workspacePath}${OsUtils.getPlatformPathSeparator()}nx.json`,
      );
    } catch (err) {
      console.warn('No nx.json file.');
    }

    try {
      this.workspaceJson = await fsExtra.readJSON(
        `${workspacePath}${OsUtils.getPlatformPathSeparator()}workspace.json`,
      );
    } catch (err) {
      console.warn('No workspace.json file.');
    }

    try {
      this.angularJson = await fsExtra.readJSON(
        `${workspacePath}${OsUtils.getPlatformPathSeparator()}angular.json`,
      );
    } catch (err) {
      console.warn('No angular.json file.');
    }
  }

  clean(): void {
    this.nxJsonFile = undefined;
    this.workspaceJson = undefined;
    this.workspacePath = undefined;
    this.angularJson = undefined;
  }

  /**
   *
   * @param currPath
   */
  async getAllProjectsV2(currPath: string): Promise<Project[]> {
    let projects: Project[] = [];
    let matchingNameCounter = 0;

    const files = await fsExtra.readdir(currPath);

    for await (const file of files) {
      const absolutePath = path.join(currPath, file);
      const isFileDirectory = (await fsExtra.stat(absolutePath)).isDirectory();

      if (isFileDirectory && !file.includes('node_modules') && !file.includes('dist')) {
        projects = [...projects, ...(await this.getAllProjectsV2(absolutePath))];
      } else if (this.isProject(file, files)) {
        matchingNameCounter++;
      }

      if (matchingNameCounter > 1) {
        const name = this.getProjectName(currPath);
        const path = currPath;
        const relativePath = this.trimToRelativePath(currPath);
        const type = this.getProjectType(currPath);
        const nameInConfig = this.findProjectNameInConfigFiles(currPath);
        const folderTree = await this.getProjectFolderTree(currPath);
        const tags = await this.getTags(nameInConfig, currPath);

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

    return projects;
  }

  /**
   *
   * @param workspacePath
   */
  async cleanEmptyDirWinFunction(workspacePath: string): Promise<void> {
    const fileStats = await fsExtra.lstat(workspacePath);

    if (!fileStats.isDirectory()) {
      return;
    }

    let fileNames = await fsExtra.readdir(workspacePath);

    if (fileNames.length > 0) {
      const recursiveRemovalPromises = fileNames.map(fileName =>
        this.cleanEmptyDirWinFunction(path.join(workspacePath, fileName)),
      );
      await Promise.all(recursiveRemovalPromises);

      // re-evaluate fileNames; after deleting subdirectory
      // we may have parent directory empty now
      fileNames = await fsExtra.readdir(workspacePath);
    }

    if (fileNames.length === 0) {
      await fsExtra.rmdir(workspacePath);
    }
  }

  /**
   *
   * @param pwd
   */
  async getProjectFolderTree(pwd: string): Promise<ProjectFolder | null> {
    const name = pwd.split(OsUtils.getPlatformPathSeparator()).pop();
    let folderType;

    if (!name) {
      return null;
    }

    for (const type of folderTypes) {
      if (type.includes(name)) {
        folderType = type;
        break;
      }
    }

    const projectTree: ProjectFolder = {
      name,
      folderContent: [],
      isDir: true,
      dirType: folderType ?? FolderType.unknown,
    };

    const files = await fsExtra.readdir(pwd);

    for await (const file of files) {
      //  Check if its folder, and if it is call recursively
      const absolutePath = path.join(pwd, file);
      const isDir = (await fsExtra.stat(absolutePath)).isDirectory();

      if (isDir) {
        const folderTree = await this.getProjectFolderTree(absolutePath);

        if (!folderTree) {
          continue;
        }

        projectTree.folderContent?.push(folderTree);
      } else {
        let fileType;

        for (const type of fileTypes) {
          if (file.includes(type)) {
            fileType = type;
            break;
          }
        }

        //  If its file push to content
        projectTree.folderContent?.push({
          name: file,
          isDir: false,
          fileType: fileType ?? FileType.unknown,
        });
      }
    }

    return projectTree;
  }

  /**
   *
   * @param pwd
   */
  getProjectName(pwd: string): string {
    const splitPath = pwd.split(OsUtils.getPlatformPathSeparator());
    return splitPath[splitPath.length - 1];
  }

  /**
   *
   * @param workspacePath
   * @param file
   * @param projects
   */
  async getProjectsNames(
    workspacePath: string,
    file: string,
    projects: Project[],
  ): Promise<void> {
    const filePath = `${workspacePath}${OsUtils.getPlatformPathSeparator()}${file}`;
    const fileAsJson = await fsExtra.readJSON(filePath);

    Object.entries(fileAsJson.projects).forEach(([key, value]) => {
      let currentProjectPath: string;

      if (file === 'workspace.json') {
        currentProjectPath = OsUtils.parsePath(value as string);
      } else {
        currentProjectPath = OsUtils.parsePath((value as {root: any}).root ?? '');
      }

      projects.forEach(project => {
        const trimmedPath = OsUtils.parsePath(
          this.trimToRelativePath(project.path).substring(1),
        );

        if (currentProjectPath === trimmedPath) {
          project.nameInConfig = key;
        }
      });
    });
  }

  /**
   *
   * @param projectPath
   * @param projects
   */
  getProjectNameFromConfigFile(projects: any, projectPath: string): string {
    let name: string = '';

    // console.log('Projects from name stuff', projects)

    Object.entries(projects).forEach(([key, value]) => {
      let currentProjectPath: string = '';

      currentProjectPath = (value as {root: any})?.root
        ? OsUtils.parsePath((value as {root: any}).root)
        : OsUtils.parsePath(value as string);

      const trimmedPath = OsUtils.parsePath(
        this.trimToRelativePath(projectPath).substring(1),
      );

      console.log('Mrks ', this.workspacePath);
      console.log(
        'Testara ',
        OsUtils.parsePath(projectPath).replace(this.workspacePath ?? '', ''),
      );

      console.log('Replaced ', projectPath);

      console.log('Trimmed path ', trimmedPath);
      console.log('Current project path ', currentProjectPath);

      if (currentProjectPath === trimmedPath) {
        name = key;
      }
    });

    return name;
  }

  private findProjectNameInConfigFiles(projectPath: string): string {
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
  getProjectType(pwd: string): ProjectType | undefined {
    const libraryTypes = Object.values(ProjectType);
    const keywords = this.trimToRelativePath(pwd)
      .split('/')
      .filter(item => item !== '' && item !== '/')
      .reverse();

    for (let index = 0; index < libraryTypes.length; index++) {
      if (
        keywords[0].includes(libraryTypes[index]) ||
        keywords[1].includes(libraryTypes[index])
      ) {
        return libraryTypes[index];
      }
    }

    return undefined;
  }

  async getTags(projectName: string, currPath: string): Promise<string[]> {
    const tags: string[] = [
      ...(await this.getTagsFromProjectJson(
        `${currPath}${OsUtils.getPlatformPathSeparator()}project.json`,
      )),
      ...this.getTagsFromConfigFile(this.workspaceJson, projectName),
      ...this.getTagsFromConfigFile(this.angularJson, projectName),
      ...this.getTagsFromConfigFile(this.nxJsonFile, projectName),
    ];

    return [...new Set(tags)];
  }

  /**
   *
   * @param configFile
   * @param projectName
   */
  getTagsFromConfigFile(configFile: any, projectName: string): string[] {
    if (!configFile?.projects) {
      return [];
    }

    const tags: string[] = [];

    Object.entries(configFile.projects).forEach(([key, value]) => {
      const tagsArr = (value as {tags: undefined | string[]})?.tags;

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
  async getTagsFromProjectJson(projectsJsonPath: string): Promise<string[]> {
    const tags: string[] = [];

    await fsExtra
      .readJSON(projectsJsonPath)
      .then(result => tags.push(...result.tags))
      .catch(() => null);

    return tags;
  }

  /**
   *
   * @param dto
   */
  async removeTag(dto: RemoveTagDto): Promise<boolean> {
    let isSuccess = false;
    const {tagToDelete, selectedProject, workspacePath} = dto;

    const pathToNxJson = `${workspacePath}${OsUtils.getPlatformPathSeparator()}nx.json`;
    const nxJson = await fsExtra.readJSON(pathToNxJson);

    Object.entries(nxJson.projects).forEach(([key, value]) => {
      if (key === selectedProject) {
        const projectObj = value as {tags: string[]};
        const tagIndex = projectObj.tags.indexOf(tagToDelete);

        projectObj.tags.splice(tagIndex, 1);

        isSuccess = true;
      }
    });

    await fsExtra.writeJSON(pathToNxJson, nxJson).catch(() => (isSuccess = false));

    return isSuccess;
  }

  async addTagV2(dto: TagDto): Promise<void> {
    await this.attemptToAddTagToProjectJson(dto);
    await this.attemptAddTagToConfigFiles(dto, this.nxJsonFile, 'nx.json');
    await this.attemptAddTagToConfigFiles(dto, this.angularJson, 'angular.json');
    await this.attemptAddTagToConfigFiles(dto, this.workspaceJson, 'workspace.json');
  }

  private async attemptToAddTagToProjectJson(dto: TagDto): Promise<boolean> {
    const {tags, projectPath} = dto;

    if (!this.workspacePath) {
      throw new Error('Please set workspace path.');
    }

    const filename = 'project.json';
    const projectJsonPath = OsUtils.parsePath(
      `${
        this.workspacePath
      }${OsUtils.getPlatformPathSeparator()}${projectPath}${OsUtils.getPlatformPathSeparator()}${filename}`,
    )
      .replace('//', '/')
      .replace('\\\\', '\\');

    const projectJson = await fsExtra
      .readJSON(projectJsonPath)
      .catch(err => console.log('There is no project.json'));

    if (!projectJson || !projectJson?.tags) {
      return false;
    }

    projectJson.tags = [
      ...new Set(
        [...projectJson.tags, ...tags].filter(el => Boolean(el)).map(el => el.trim()),
      ),
    ];

    await fsExtra.writeJSON(projectJsonPath, projectJson);

    return true;
  }

  private async attemptAddTagToConfigFiles(
    dto: TagDto,
    configFile: any,
    configFileName: string,
  ): Promise<void> {
    const {tags, selectedProjectName} = dto;

    if (!this.workspacePath) {
      throw new Error('Open the config file first');
    }

    if (!configFile?.projects?.[selectedProjectName]?.tags) {
      return;
    }

    configFile.projects[selectedProjectName].tags = [
      ...new Set(
        [...configFile.projects[selectedProjectName].tags, ...tags]
          .filter(el => Boolean(el))
          .map(el => el.trim()),
      ),
    ];

    const parsedPath = OsUtils.parsePath(
      `${this.workspacePath}${OsUtils.getPlatformPathSeparator()}${configFileName}`,
    );

    await fsExtra.writeJSON(parsedPath, configFile);
  }

  /**
   *
   * @param dto
   */
  async addTag(dto: TagDto): Promise<string[]> {
    const {workspacePath, tags, selectedProjectName} = dto;

    const pathToNxJson = `${workspacePath}${OsUtils.getPlatformPathSeparator()}nx.json`;
    const nxJson = await fsExtra.readJSON(pathToNxJson);

    Object.entries(nxJson.projects).forEach(([key, value]) => {
      if (key === selectedProjectName) {
        const projectObj = value as {tags: string[]};
        projectObj.tags.push(...tags);
      }
    });

    await fsExtra.writeJSON(pathToNxJson, nxJson);

    return tags;
  }

  /**
   *
   * @param file
   * @param files
   */
  isProject(file: string, files: string[]): boolean {
    return (
      file.toString() === '.eslintrc.json' ||
      file.toString() === 'tsconfig.json' ||
      (file.toString() === 'tsconfig.spec.json' && files.includes('src'))
    );
  }

  /**
   *
   * @param pwd
   */
  trimToRelativePath(pwd: string): string {
    if (!this.workspacePath) {
      throw new Error('Workspace path is not defined.');
    }

    return OsUtils.parsePath(pwd).replace(this.workspacePath, '');
  }

  /**
   *
   * @param dto
   */
  async generateNxArtifact(
    dto: GenerateArtifactDto,
  ): Promise<NodeUtils.ExecuteCommandResponse> {
    const {nxGenerator, workspacePath} = dto;

    const name = getNxGeneratorFieldValue(nxGenerator, 'name');
    const directory = getNxGeneratorFieldValue(nxGenerator, 'directory');

    //  FIXME: Check nullable
    const dir = StringUtils.removeSpecialCharFrontBack(
      OsUtils.parsePath(directory ?? ''),
    );
    const cmd = OsUtils.parsePath(
      `${nxGenerator.cmd} ${dir ? dir + '/' : ''}${StringUtils.removeSpecialCharacters(
        name ?? '',
      )}`,
    );
    const args: string[] = [];

    const {textInputs, checkboxes, dropDowns} = nxGenerator.form;

    textInputs.forEach(textInput =>
      textInput.input && textInput.title !== 'directory' && textInput.title !== 'name'
        ? args.push(`--${textInput.title} ${textInput.input}`)
        : null,
    );

    checkboxes.forEach(checkBoxInput =>
      checkBoxInput.isChecked
        ? args.push(`--${checkBoxInput.title} ${checkBoxInput.isChecked}`)
        : null,
    );

    dropDowns.forEach(dropDownInput =>
      dropDownInput.selectedItem
        ? args.push(`--${dropDownInput.title} ${dropDownInput.selectedItem}`)
        : null,
    );

    const result = await NodeUtils.executeCommand(cmd, args, workspacePath, 'CREATE');

    return {
      isSuccess: true,
      log: result?.log ?? '',
    };
  }
}
