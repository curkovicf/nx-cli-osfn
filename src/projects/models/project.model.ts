import {ProjectType} from './project-type.enum';
import {ProjectFolder} from './folder-tree.model';

export interface Project {
  name: string;
  path: string;
  relativePath: string;
  nameInConfig: string;
  tags: string[];
  folderTree: ProjectFolder | null;
  type: ProjectType | undefined;
}
