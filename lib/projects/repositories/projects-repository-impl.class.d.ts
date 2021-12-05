import { IProjectsRepository } from './projects-repository.interface';
import { Project } from '../models/project.model';
import { ProjectFolder } from '../models/folder-tree.model';
import { ProjectType } from '../models/project-type.enum';
import { TagDto } from '../dtos/tag.dto';
import { RemoveTagDto } from '../dtos/remove-tag.dto';
import { GenerateArtifactDto } from '../dtos/generate-artifact.dto';
import { NodeUtils } from '../../shared/util/node-utils.namespace';
export declare class ProjectsRepositoryImpl implements IProjectsRepository {
    private nxJsonFile;
    private workspaceJson;
    private angularJson;
    private workspacePath;
    openConfigFiles(workspacePath: string): Promise<void>;
    clean(): void;
    /**
     *
     * @param currPath
     */
    getAllProjectsV2(currPath: string): Promise<Project[]>;
    /**
     *
     * @param workspacePath
     */
    cleanEmptyDirWinFunction(workspacePath: string): Promise<void>;
    /**
     *
     * @param pwd
     */
    getProjectFolderTree(pwd: string): Promise<ProjectFolder | null>;
    /**
     *
     * @param pwd
     */
    getProjectName(pwd: string): string;
    /**
     *
     * @param workspacePath
     * @param file
     * @param projects
     */
    getProjectsNames(workspacePath: string, file: string, projects: Project[]): Promise<void>;
    /**
     *
     * @param projectPath
     * @param projects
     */
    getProjectNameFromConfigFile(projects: any, projectPath: string): string;
    private findProjectNameInConfigFiles;
    /**
     *
     * @param pwd
     */
    getProjectType(pwd: string): ProjectType | undefined;
    getTags(projectName: string, currPath: string): Promise<string[]>;
    /**
     *
     * @param configFile
     * @param projectName
     */
    getTagsFromConfigFile(configFile: any, projectName: string): string[];
    /**
     *
     * @param projectsJsonPath
     */
    getTagsFromProjectJson(projectsJsonPath: string): Promise<string[]>;
    /**
     *
     * @param dto
     */
    removeTag(dto: RemoveTagDto): Promise<boolean>;
    addTagV2(dto: TagDto): Promise<void>;
    private attemptToAddTagToProjectJson;
    private attemptAddTagToConfigFiles;
    /**
     *
     * @param dto
     */
    addTag(dto: TagDto): Promise<string[]>;
    /**
     *
     * @param file
     * @param files
     */
    isProject(file: string, files: string[]): boolean;
    /**
     *
     * @param pwd
     */
    trimToRelativePath(pwd: string): string;
    /**
     *
     * @param dto
     */
    generateNxArtifact(dto: GenerateArtifactDto): Promise<NodeUtils.ExecuteCommandResponse>;
}
//# sourceMappingURL=projects-repository-impl.class.d.ts.map