import {ProjectsRepositoryImpl} from '../projects/repositories/projects-repository-impl.class';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import {TagDto} from '../projects/dtos/tag.dto';

//  Setup stuff
const projectsRepo = new ProjectsRepositoryImpl();
const configFile = path.join(__dirname, 'playground-config.json');
const logFile = 'playground-logs.json';

class WorkspacesPaths {
  public ngWorkspace: string;
  public reactWorkspace: string;
  public ngNestWorkspace: string;
  public ngSpotifyWorkspace: string;
  public nxCliWorkspace: string;

  constructor(workspaces: any) {
    this.ngWorkspace = workspaces['ng-workspace'];
    this.reactWorkspace = workspaces['react-workspace'];
    this.ngNestWorkspace = workspaces['ng-nest-workspace'];
    this.ngSpotifyWorkspace = workspaces['ng-spotify-workspace'];
    this.nxCliWorkspace = workspaces['nx-cli-workspace'];
  }
}

(async () => {
  //  Load config file
  const workspaces = await fsExtra.readJSON(configFile);
  const workspacesPaths = new WorkspacesPaths(workspaces);

  //  Test get projects feat
  // await getProjects(workspacesPaths);

  // Test setting tags feat
  await addTags(workspacesPaths);
})();

async function getProjects(workspacesPaths: WorkspacesPaths): Promise<void> {
  // ng
  await projectsRepo.openConfigFiles(workspacesPaths.ngWorkspace);
  const ngProjects = await projectsRepo.getAllProjectsV2(
    workspacesPaths.ngWorkspace,
  );
  projectsRepo.clean();
  await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngProjects);

  // react
  // await projectsRepo.openConfigFiles(workspacesPaths.reactWorkspace);
  // const reactProjects = await projectsRepo.getAllProjectsV2(workspacesPaths.reactWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, reactProjects);

  // ngNest
  // await projectsRepo.openConfigFiles(workspacesPaths.ngNestWorkspace);
  // const ngNestProjects = await projectsRepo.getAllProjectsV2(workspacesPaths.ngNestWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngNestProjects);

  // ngSpotify
  // await projectsRepo.openConfigFiles(workspacesPaths.ngSpotifyWorkspace);
  // const ngSpotifyProjects = await projectsRepo.getAllProjectsV2(workspacesPaths.ngSpotifyWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngSpotifyProjects);

  // nxCli
  // await projectsRepo.openConfigFiles(workspacesPaths.nxCliWorkspace);
  // const ngCliProjects = await projectsRepo.getAllProjectsV2(workspacesPaths.nxCliWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngCliProjects);
}

async function addTags(workspacesPaths: WorkspacesPaths): Promise<void> {
  //  Prepare dto
  //  ng dto
  const dto: TagDto = {
    tags: ['scope:test-tag-feat'],
    workspacePath: workspacesPaths.ngWorkspace,
    selectedProjectName: 'test-lib',
    projectPath: '/libs/test-lib',
  };

  //  react dto
  const reactDto: TagDto = {
    tags: ['scope:test-tag-feat'],
    workspacePath: workspacesPaths.ngWorkspace,
    selectedProjectName: 'test-lib',
    projectPath: 'libs/react-lib',
  };

  //  react dto
  const ngNest: TagDto = {
    tags: ['scope:test-tag-feat'],
    workspacePath: workspacesPaths.ngWorkspace,
    selectedProjectName: 'test-lib',
    projectPath: 'libs/react-lib',
  };

  //  Add tag
  await projectsRepo.openConfigFiles(workspacesPaths.reactWorkspace);
  await projectsRepo.addTagV2(reactDto);
  projectsRepo.clean();
}
