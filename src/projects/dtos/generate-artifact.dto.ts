import {NxGenerator} from '../models/nx-generator.model';

export interface GenerateArtifactDto {
  nxGenerator: NxGenerator;
  workspacePath: string;
  selectedProjectName: string;
}
