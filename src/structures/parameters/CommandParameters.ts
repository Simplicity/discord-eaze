/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import CommandContext from '../command/CommandContext';
import CommandError from '../command/CommandError';
import ParameterTypes from './types';
import Parameter from './types/Parameter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNull = (n: any): boolean => n === null || n === undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const funcOrString = (f: Function | string, ...args: any[]): any => (typeof f === 'function' ? f(...args) : f);

const normalizeParam = (options: Parameter): object => {
  const types = options.type.split(/ ?| ?/g);
  const parameters = [];
  for (const i of Object.keys(types)) {
    const entry = types[i];
    const type = ParameterTypes[entry] || entry;
    if (!type || !(type.prototype instanceof Parameter)) throw new TypeError('Invalid parameter type');
    options = { ...type.parseOptions(i), ...options };
    parameters.push(type);
  }
  return { ...options, moreParams: parameters.length > 1, types: parameters };
};

class CommandParameters {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated`);
  }

  public static parseOptions(params: unknown[] = []): object {
    const { length } = params;
    const hasFlags = Array.isArray(params[length - 1]);
    return {
      flags: hasFlags ? params[length - 1].map(normalizeParam) : null,
      parameters: (hasFlags ? params.slice(0, length - 1) : params).map(normalizeParam),
    };
  }

  private static async handle(context: CommandContext, options: object, args: object): Promise<void | []> {
    const opts = CommandParameters.parseOptions(options);
    await CommandParameters.handleFlags(context, opts, args);
    return CommandParameters.handleArguments(context, opts, args);
  }

  private static async handleFlags(context: CommandContext, opts: object, args: object): Promise<void> {
    if (opts.flags) {
      const flagIndex = args.findIndex((a) => a.startsWith('--'));
      if (flagIndex > -1) {
        const [, ...allFlags] = args.splice(flagIndex).join(' ').split('--');
        const flagsObject = {};

        const flagsParsed = allFlags.map((s) => s.trim().split(/[ \t]+/));
        for (const parsedArg of flagsParsed) {
          const [name, ...flagArgs] = parsedArg;
          const flag = opts.flags.find((f) => f.name === name || (f.aliases && f.aliases.includes(name)));
          if (!flag) return;

          const flagValue = flagArgs.join(' ');
          const missingErr = funcOrString(flag.missingError, context);
          // tslint:disable-next-line: static-this
          flagsObject[flag.name] = await this.parseParameter(context, flag, flagValue, missingErr);
        }
        context.flags = flagsObject;
      }
    }
  }

  private static async handleArguments(context: CommandContext, opts, args): [] {
    const parsedArgs = [];

    const parseState = context.parseState = { argIndex: 0 };
    for (let i = 0; i < opts.parameters.length; i++) {
      const param = opts.parameters[i];

      let arg = args[parseState.argIndex];
      if (
        opts.parameters.length > args.length
        && !param.required && parseState.argIndex === args.length - 1
        && opts.parameters.some((p, pi) => pi > i && p.required)
      ) {
        parsedArgs.push(undefined);
        continue;
      }

      if (param.full) arg = args.slice(parseState.argIndex).join(param.fullJoin || ' ');

      // tslint:disable-next-line: static-this
      const parsedArg = await this.parseParameter(
        context, param, arg, funcOrString(param.missingError, context),
      );
      parsedArgs.push(parsedArg);
      parseState.argIndex++;
    }
    delete context.parseState;

    return parsedArgs;
  }

  private static async parseParameter(
    context: CommandContext,
    param: object,
    arg: object,
    missingErr: string,
  ): Promise<void> {
    let parsedArg;
    for (const parameter of param.types) {
      const result = await parameter._parse(arg, param, context);
      if (!isNull(result)) {
        parsedArg = result;
        break;
      }
    }

    if (isNull(parsedArg) && param.required) {
      throw new CommandError(missingErr, { delete: true, showUsage: param.showUsage });
    }

    if (!isNull(parsedArg)) {
      if (param.whitelist) {
        const whitelist = funcOrString(param.whitelist, parsedArg, context);
        const whitelisted = Array.isArray(whitelist) ? whitelist.includes(parsedArg) : !!whitelist;
        if (!whitelisted) {
          throw new CommandError(missingErr, { delete: true, showUsage: param.showUsage });
        }
      }
    }

    return parsedArg;
  }
}

export default CommandParameters;
