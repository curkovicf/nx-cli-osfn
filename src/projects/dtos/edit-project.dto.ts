export interface EditProjectDto {
  workspacePath: string;
  project: string;
  newName: string;
  oldName: string;
  newDirectory: string;
  oldDirectory: string;
}
