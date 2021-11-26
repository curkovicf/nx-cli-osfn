import { NxGenerator } from '../../projects/models/nx-generator.model';
export declare class WorkspacesRepositoryImpl {
    isPathNxWorkspace(pwd: string): Promise<boolean>;
    getWorkspaceName(pwd: string): Promise<any>;
    getAllTags(workspacePath: string): Promise<string[]>;
    /**
     *
     * @param workspacePath
     */
    getAvailableNxGenerators(workspacePath: string): Promise<NxGenerator[]>;
}
//# sourceMappingURL=workspaces-repository-impl.class.d.ts.map