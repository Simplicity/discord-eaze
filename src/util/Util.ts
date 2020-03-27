/* eslint-disable @typescript-eslint/no-explicit-any */

class Util {
  public static getLength(val: any): number | null {
    if (val instanceof Error) return val.message.length;

    if (val === null || val === undefined || val === false) return 0;

    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return 1;
    if (typeof val === 'string' || typeof val === 'function' || Array.isArray(val)) return val.length;

    if (val.toString === Object.prototype.toString) {
      const type = val.toString();

      if (type === '[object File]' || type === '[object Map]' || type === '[object Set]') return val.size;
      if (type === '[object Object]') return Object.keys(val).length;
    }

    return 1;
  }

  public static fixPlural(val: any, singular: string, plural = `${singular}s`): string {
    if (!singular) return '???';

    const length = Util.getLength(val);
    if (length !== 1) return plural;

    return singular;
  }
}

export default Util;
