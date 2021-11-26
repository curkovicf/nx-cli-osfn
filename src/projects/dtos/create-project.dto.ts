export interface CreateProjectDto {
  path: string;
  workspacePath: string;
  tags?: string[];
  flags?: string[];
  type: 'app' | 'lib';
}
