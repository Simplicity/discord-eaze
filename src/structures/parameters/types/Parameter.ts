/* eslint-disable @typescript-eslint/no-explicit-any */

import CommandContext from '../../command/CommandContext';

const defVal = (o: any, k: string, d: any): any => typeof o[k] === 'undefined' ? d : o[k];

interface DefaultOptions {
  required: boolean;
  showUsage?: boolean;
  full?: boolean;
  whitelist?: string[];
  fullJoin?: string;
  missingError: string;
  name?: string;
  aliases?: string[];
}

interface Parameter extends DefaultOptions {
  type: 'string';
}

class Parameter {
  protected static parseOptions(options: DefaultOptions): object {
    return {
      aliases: options.aliases,
      full: !!options.full,
      fullJoin: options.fullJoin,
      missingError: options.missingError || 'Couldn\'t obtain one of the parameters',
      name: options.name,
      required: defVal(options, 'required', true),
      showUsage: defVal(options, 'showUsage', true),
      whitelist: options.whitelist,
    };
  }

  private static _parse(arg: object, options: object, context: CommandContext): unknown {
    // tslint:disable-next-line: static-this
    return this.parse.call(options, arg, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected static parse(arg: object, ctx: CommandContext): any {
    return arg;
  }
}

export default Parameter;
