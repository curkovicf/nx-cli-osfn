import {OsUtils} from '../../shared/util/os-utils.namespace';
import fsExtra from 'fs-extra';
import {
  getNxGenerator,
  NxGenerator,
  supportedNxPackagesAsList,
} from '../../projects/models/nx-generator.model';

export class WorkspacesRepositoryImpl {
  async isPathNxWorkspace(pwd: string): Promise<boolean> {
    return await fsExtra.pathExists(`${pwd}${OsUtils.getPlatformPathSeparator()}nx.json`);
  }

  async getWorkspaceName(pwd: string): Promise<any> {
    return await fsExtra.readJSON(
      `${pwd}${OsUtils.getPlatformPathSeparator()}package.json`,
    );
  }

  async getAllTags(workspacePath: string): Promise<string[]> {
    const tags: string[] = [];
    // const pathToNxJson = `${workspacePath}${OsUtils.getPlatformPathSeparator()}nx.json`;
    // const nxJson = await fsExtra.readJSON(pathToNxJson);

    // console.log(nxJson);

    // Object.entries(nxJson.projects).forEach(([key, value]) => tags.push(...(value as { tags: string[] }).tags));

    return tags;
  }

  /**
   *
   * @param workspacePath
   */
  async getAvailableNxGenerators(workspacePath: string): Promise<NxGenerator[]> {
    const installedGenerators: NxGenerator[] = [];

    const filePath = `${workspacePath}${OsUtils.getPlatformPathSeparator()}package.json`;
    const packageJson = await fsExtra.readJSON(filePath);

    const dependencies = [
      ...Object.entries(packageJson.dependencies),
      ...Object.entries(packageJson.devDependencies),
    ];

    outer: for (const dependencyPair of dependencies) {
      for (const supportedNxGenerator of supportedNxPackagesAsList) {
        //   [ 'eslint', '7.22.0' ]
        const dependencyName = dependencyPair[0];

        if (dependencyName.includes(supportedNxGenerator)) {
          //  TODO: Do a one liner
          const generator = getNxGenerator(supportedNxGenerator);

          if (!generator) {
            continue;
          }

          installedGenerators.push(...getNxGenerator(supportedNxGenerator));

          continue outer;
        }
      }
    }

    return installedGenerators;
  }
}
