import { NxGenerator } from '../../projects/models/nx-generator.model';
import { Project } from '../../projects/models/project.model';
export interface Workspace {
    name: string;
    path: string;
    tags: string[];
    selectedProject?: Project;
    consoleLogs: string[];
    generators: NxGenerator[];
}
//# sourceMappingURL=workspace.model.d.ts.map