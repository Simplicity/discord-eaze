import CommandContext from './CommandContext';

type RestrictionType = 'dm' | 'guild';

interface CommandOptions {
  category?: string;
  aliases?: string[];
  restriction?: RestrictionType | RestrictionType[];
  ownerOnly?: boolean;
}

class Command {
  id: string;

  category: string;

  aliases: string[];

  restriction: RestrictionType[];

  ownerOnly: boolean;

  constructor(
    id: string, {
      restriction, category, aliases, ownerOnly,
    }: CommandOptions = {},
  ) {
    this.id = id;
    this.restriction = typeof restriction === 'string' ? [restriction] : restriction ?? ['dm', 'guild'];
    this.category = category ?? 'general';
    this.aliases = Array.isArray(aliases) ? [...aliases, id] : [id];
    this.ownerOnly = Boolean(ownerOnly);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(ctx: CommandContext, ...args: object[]): any {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }
}

export default Command;
