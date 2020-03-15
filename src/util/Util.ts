/* eslint-disable @typescript-eslint/ban-ts-ignore */

class Util {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  // @ts-ignore
  public static getLength(val): number | null {
    if (val instanceof Error) return val.message.length;

    if (val === null || val === undefined || val === false) return 0;

    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return 1;
    if (typeof val === 'string' || typeof val === 'function' || Array.isArray(val)) return val.length;

    // @ts-ignore
    if (val.toString === Object.prototype.toString) {
      // @ts-ignore
      const type = val.toString();

      if (type === '[object File]' || type === '[object Map]' || type === '[object Set]') return val.size;

      if (type === '[object Object]') {
        return Object.keys(val).length;
      }
    }

    return 1;
  }

  // @ts-ignore
  public static fixPlural(val, singular: string, plural = `${singular}s`): string {
    if (!singular) return '???';

    const length = Util.getLength(val);
    if (length !== 1) return plural;

    return singular;
  }
}

export default Util;
