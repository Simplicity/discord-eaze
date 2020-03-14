import fs, { Stats } from 'fs';
import path from 'path';
import { promisify } from 'util';

export const readdir: Function = promisify(fs.readdir);
export const readFile: Function = promisify(fs.readFile);
export const stat: Function = promisify(fs.stat);

class FileUtil {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  static async requireDirectory(
    dirPath: string,
    error: Function,
    success?: Function,
    recursive = true,
  ): Promise<object | void> {
    const files = await readdir(dirPath);
    const filesObject: Record<string, object> = {};
    return Promise.all(files.map(async (file: string) => {
      const fullPath = path.resolve(dirPath, file);
      if (/\.(js|json)$/.test(file)) {
        try {
          const required = await import(fullPath);
          if (success) success(required, file.replace(/.js|.json/g, ''), dirPath.split(/\\|\//g).pop());
          filesObject[file] = required;
          return required;
        } catch (e) {
          error(e, file, dirPath);
        }
      } else if (recursive) {
        const isDirectory = await stat(fullPath).then((f: Stats) => f.isDirectory());
        if (isDirectory) return FileUtil.requireDirectory(fullPath, error, success);
      }
    })).then(() => filesObject).catch(console.error);
  }
}

export default FileUtil;
