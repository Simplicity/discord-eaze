import fs, { Stats } from 'fs';
import path from 'path';
import { promisify } from 'util';

export const readdir = promisify(fs.readdir);
export const readFile = promisify(fs.readFile);
export const stat = promisify(fs.stat);

class FileUtil {
  static async requireDirectory(
    dirPath: string,
    recursive = true,
    callback: (error: Error | null, file: File | null, filename: string, dirname: string) => any,
  ): Promise<object> {
    const files = await readdir(dirPath);
    const filesObject: Record<string, object> = {};
    return Promise.all(files.map(async (file: string) => {
      const fullPath = path.resolve(dirPath, file);
      if (/\.(js|json)$/.test(file)) {
        const filename = file.replace(/.js|.json/g, '');
        const dirname = String(dirPath.split(/\\|\//g).pop());
        try {
          const required = await import(fullPath);
          callback(null, required, filename, dirname);
          filesObject[file] = required;
          return required;
        } catch (e) {
          callback(e, null, filename, dirname);
        }
      } else if (recursive) {
        const isDirectory = await stat(fullPath).then((f: Stats) => f.isDirectory());
        if (isDirectory) return FileUtil.requireDirectory(fullPath, recursive, callback);
      }
    })).then(() => filesObject);
  }
}

export default FileUtil;
