import { IProjectsRepository } from './projects-repository.interface';
import { Project } from '../models/project.model';
import { AngularComponent } from '../models/angular-component.model';
import { ProjectFolder } from '../models/folder-tree.model';
import { ProjectType } from '../models/project-type.enum';
import { AngularModule } from '../models/angular-module.model';
import { TagDto } from '../dtos/tag.dto';
import { RemoveTagDto } from '../dtos/remove-tag.dto';
import { GenerateArtifactDto } from '../dtos/generate-artifact.dto';
import { NodeUtils } from '../../shared/util/node-utils.namespace';
export declare class ProjectsRepositoryImpl implements IProjectsRepository {
    /**
     *
     * @param currPath
     * @param workspacePath
     */
    getAllProjectsV2(currPath: string, workspacePath: string): Promise<Project[]>;
    /**
     *
     * @param workspacePath
     */
    cleanEmptyDirWinFunction(workspacePath: string): Promise<void>;
    /**
     *
     * @param projectPath
     */
    getAngularModules(projectPath: string): Promise<AngularModule[]>;
    /**
     *
     * @param txt
     */
    getClassName(txt: string): string;
    /**
     *
     * @param angularModuleTxt
     */
    findDeclaredComponents(angularModuleTxt: string): AngularComponent[];
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
     * @param workspacePath
     * @param projects
     */
    getTagsOfAllProjectsWithinNxJsonFile(workspacePath: string, projects: Project[]): Promise<void>;
    /**
     *
     * @param pwd
     * @param rootPath
     */
    getProjectType(pwd: string, rootPath: string): ProjectType | undefined;
    /**
     *
     * @param dto
     */
    removeTag(dto: RemoveTagDto): Promise<boolean>;
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
     * @param rootPath
     */
    trimToRelativePath(pwd: string, rootPath: string): string;
    /**
     *
     * @param dto
     */
    generateNxArtifact(dto: GenerateArtifactDto): Promise<NodeUtils.ExecuteCommandResponse>;
}
//# sourceMappingURL=projects-repository-impl.class.d.ts.map