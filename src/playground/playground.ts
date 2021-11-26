import {ProjectsRepositoryImpl} from '../projects/repositories/projects-repository-impl.class';
import * as path from 'path';
import * as fsExtra from 'fs-extra';

//  Setup stuff
const projectsRepo = new ProjectsRepositoryImpl();
const configFile = path.join(__dirname, 'playground-config.json');

(async () => {
  //  Load config file
  const workspaces = await fsExtra.readJSON(configFile);

  //  Get paths
  const ngWorkspace = workspaces['ng-workspace'];
  const reactWorkspace = workspaces['react-workspace'];
  const ngNestWorkspace = workspaces['ng-nest-workspace'];
  const ngSpotifyWorkspace = workspaces['ng-spotify-workspace'];
  const nxCliWorkspace = workspaces['nx-cli-workspace'];

  //  Impl stuff

})();

