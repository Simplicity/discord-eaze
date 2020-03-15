import fs, { Stats } from 'fs';
import path from 'path';
import { promisify } from 'util';

export const readdir = promisify(fs.readdir);
export const readFile = promisify(fs.readFile);
export const stat = promisify(fs.stat);

class FileUtil {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  public static async requireDirectory(
    dirPath: string,
    error = (x: Error, ...args: string[]): void => console.error(x.stack, args),
    success = (file: File, fileName: string, dirName: string | undefined): void => console.log(dirName, fileName),
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
