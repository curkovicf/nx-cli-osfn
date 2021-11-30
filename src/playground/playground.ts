import {ProjectsRepositoryImpl} from '../projects/repositories/projects-repository-impl.class';
import * as path from 'path';
import * as fsExtra from 'fs-extra';

//  Setup stuff
const projectsRepo = new ProjectsRepositoryImpl();
const configFile = path.join(__dirname, 'playground-config.json');
const logFile = 'playground-logs.json';

(async () => {
  //  Load config file
  const workspaces = await fsExtra.readJSON(configFile);

  //  Get paths
  const ngWorkspace: string = workspaces['ng-workspace'];
  const reactWorkspace: string = workspaces['react-workspace'];
  const ngNestWorkspace: string = workspaces['ng-nest-workspace'];
  const ngSpotifyWorkspace: string = workspaces['ng-spotify-workspace'];
  const nxCliWorkspace: string = workspaces['nx-cli-workspace'];


  // ng
  // await projectsRepo.openConfigFiles(ngWorkspace);
  // const ngProjects = await projectsRepo.getAllProjectsV2(ngWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngProjects);

  // react
  // await projectsRepo.openConfigFiles(reactWorkspace);
  // const reactProjects = await projectsRepo.getAllProjectsV2(reactWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, reactProjects);

  // ngNest
  // await projectsRepo.openConfigFiles(ngNestWorkspace);
  // const ngNestProjects = await projectsRepo.getAllProjectsV2(ngNestWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngNestProjects);

  // ngSpotify
  // await projectsRepo.openConfigFiles(ngSpotifyWorkspace);
  // const ngSpotifyProjects = await projectsRepo.getAllProjectsV2(ngSpotifyWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngSpotifyProjects);

  // nxCli
  // await projectsRepo.openConfigFiles(nxCliWorkspace);
  // const ngCliProjects = await projectsRepo.getAllProjectsV2(nxCliWorkspace);
  // projectsRepo.clean();
  // await fsExtra.writeJSON(`${__dirname}/${logFile}`, ngCliProjects);

})();
