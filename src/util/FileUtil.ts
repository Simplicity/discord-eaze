import { readdirSync, statSync } from 'fs';
import { join, resolve, extname } from 'path';

class FileUtil {
  static async requireDirectory(
    directory: string,
    {
      recursive = true,
      extensions = ['.json', '.js', '.ts'],
      instanceClass,
      deleteCache = true,
    }: { recursive: boolean; deleteCache: boolean; extensions: string[]; instanceClass: Function },
    callback: (error: Error | null, result: any, filepath: string) => any,
  ): Promise<any> {
    const filePaths = FileUtil.readdirRecursive(directory, recursive, extensions);
    // eslint-disable-next-line no-restricted-syntax
    for (const filepath of filePaths) {
      try {
      // eslint-disable-next-line no-await-in-loop
        const required = await import(resolve(filepath));
        if (instanceClass) {
          const classe = FileUtil.resolveClassExport(required, instanceClass);
          if (classe) {
            callback(null, classe, filepath);
          } else if (deleteCache) {
            delete require.cache[require.resolve(filepath)];
          }
        } else {
          callback(null, required, filepath);
        }
      } catch (error) {
        callback(error, null, filepath);
      }
    }
  }

  static readdirRecursive(
    directory: string,
    recursive = true,
    extensions = ['.json', '.js', '.ts'],
  ): string[] {
    const result = [];

    (function read(dir: string): void {
      const files = readdirSync(dir);

      // eslint-disable-next-line no-restricted-syntax
      for (const file of files) {
        const filepath = join(dir, file);

        if (recursive && statSync(filepath).isDirectory()) {
          read(filepath);
        } else if (extensions.includes(extname(filepath))) {
          result.push(filepath);
        }
      }
    }(directory));

    return result;
  }

  static resolveClassExport<C extends Function>(Required: any, instance: C): C | null {
    if (Required instanceof instance) return Required as C;
    if (Required && Required.prototype instanceof instance) return new Required();
    if (typeof Required === 'function') {
      const instanced = new Required();
      if (instanced instanceof instance) return instanced as C;
    }
    return null;
  }
}

export default FileUtil;
