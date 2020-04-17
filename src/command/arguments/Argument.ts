import { MessageAdditions, MessageAttachment, MessageEmbed } from 'discord.js';
import CommandContext from '../CommandContext';
import { EazeClient } from '../../client/EazeClient';

export type ResolveMessage = MessageAdditions | MessageAttachment | MessageEmbed | string;
export type ResolveMatch = 'word' | 'content' | 'full';
export type ResolveResponse = ResolveMessage |
((ctx: CommandContext, text: string) => ResolveMessage | Promise<ResolveMessage>);
export type ResolveDefault = ((ctx: CommandContext, text: string) => any) | any;
export type ResolveValidate = (ctx: CommandContext, result: any) => boolean | Promise<boolean>;

interface ArgumentOptions {
  match: ResolveMatch;
  missingError?: ResolveResponse;
  invalidError?: ResolveResponse;
  validate?: ResolveValidate;
  defaultValue?: ResolveDefault;
}

interface FlagOptions {
  flags?: string | string[];
}

export type ReturnResolveFuncArgument = { result: any; content: string } | null;

export abstract class Argument {
  client: EazeClient;

  match: ResolveMatch;

  missingError?: ResolveResponse;

  invalidError?: ResolveResponse;

  validate?: ResolveValidate;

  defaultValue?: ResolveDefault;

  flags?: string[];

  constructor(client: EazeClient, options: ArgumentOptions & FlagOptions) {
    this.client = client;
    this.match = options.match;
    this.missingError = options.missingError ?? client.defaultArgumentOptions?.missingError;
    this.invalidError = options.invalidError ?? client.defaultArgumentOptions?.invalidError;
    this.validate = options.validate;
    this.defaultValue = options.defaultValue;
    this.flags = typeof options.flags === 'string' ? [options.flags] : options.flags ?? [];
  }

  abstract resolve(context: CommandContext, content: string): ReturnResolveFuncArgument;

  abstract parse(context: CommandContext, result: any): any;
}
