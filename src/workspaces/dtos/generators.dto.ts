import {NxGenerator} from '../../projects/models/nx-generator.model';

export interface GeneratorsDto {
  workspacePath: string;
  generators: NxGenerator[];
}
