import {ProjectType} from '../models/project-type.enum';

export interface DeleteProjectDto {
  projectNameInNxJson: string;
  workspacePath: string;
  type: ProjectType;
}
