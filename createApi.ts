import createJsonFileAsync from './createJsonFileAsync';
import { join } from 'path';

export interface ModulesData extends ModuleBasicData {
  updatedAt: number;
  latestVersion: string;
}

export interface CompleteModuleData extends ModuleBasicData {
  updatedAt: number;
  latestVersion: string;
  versions: Array<VersionData>;
}

export type VersionedModuleData = ModuleBasicData & VersionData;

export interface ModuleBasicData {
  moduleId: string;
  authors: string[];
  description: string;
  name: string;
  sourceUrl: string;
}

export interface VersionData {
  updatedAt: number;
  downloadUrl: string;
  releaseNotes: string[];
  dependencies: Array<Dependency>;
  version: string;
}

export type ModuleInfo = CompleteModuleData | Array<ModulesData> | VersionedModuleData;

export interface Dependency {
  id: string;
  versionConstrain?: string;
}

const handleInput = async (publicPath: string, modules: Array<VersionedModuleData>) => {
  const groupedModules: Array<Array<VersionedModuleData>> = modules.reduce(
    (groupedModules: Array<Array<VersionedModuleData>>, module: VersionedModuleData) => {
      const otherVersions = groupedModules.find((modules) => modules[0].moduleId === module.moduleId);
      if (otherVersions === undefined) {
        groupedModules.push([module]);
      } else {
        otherVersions.push(module);
      }
      return groupedModules;
    },
    []
  );
  const completeModulesData: Array<CompleteModuleData> = groupedModules.map((modules) => {
    const latestModule = modules.reduce((latest: VersionedModuleData, module: VersionedModuleData) => {
      if (latest.updatedAt >= module.updatedAt) {
        return latest;
      }
      return module;
    });
    const completeModuleData: CompleteModuleData = {
      moduleId: latestModule.moduleId,
      authors: latestModule.authors,
      description: latestModule.description,
      name: latestModule.name,
      sourceUrl: latestModule.sourceUrl,
      updatedAt: latestModule.updatedAt,
      latestVersion: latestModule.version,
      versions: [
        {
          updatedAt: latestModule.updatedAt,
          downloadUrl: latestModule.downloadUrl,
          releaseNotes: latestModule.releaseNotes,
          dependencies: latestModule.dependencies,
          version: latestModule.version
        }
      ]
    };
    modules.forEach((module) => {
      if (module.updatedAt === latestModule.updatedAt) return;
      completeModuleData.versions.push({
        updatedAt: module.updatedAt,
        downloadUrl: module.downloadUrl,
        releaseNotes: module.releaseNotes,
        dependencies: module.dependencies,
        version: module.version
      });
    });
    return completeModuleData;
  });
  const allModulesData: Array<ModulesData> = completeModulesData.map((complete) => {
    const { versions, ...generalInfo } = complete;
    return generalInfo;
  });
  await Promise.all([
    ...modules.map((module) =>
      createJsonFileAsync(publicPath, join('module', module.moduleId, `${module.version}.json`), module)
    ),
    ...completeModulesData.map((data) =>
      createJsonFileAsync(publicPath, join('module', data.moduleId, `index.json`), data)
    ),
    createJsonFileAsync(publicPath, join('modules', 'index.json'), allModulesData)
  ]);
};

export default handleInput;
