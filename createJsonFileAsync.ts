import { writeFile, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { ModuleInfo } from './createApi';

const createJsonFileAsync = async (publicPath: string, slug: string, data: ModuleInfo): Promise<void> => {
  try {
    const fileJson = JSON.stringify(data);
    const filePath = join(publicPath, slug);

    mkdirSync(dirname(filePath), { recursive: true });
    await writeFile(filePath, fileJson, (err) => {
      if (err) {
        console.log(err);
        throw new Error(err.message);
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default createJsonFileAsync;
