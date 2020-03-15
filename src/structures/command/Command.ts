import SimplicityClient from '../../client/SimplicityClient';
import PermissionUtil from '../../util/PermissionUtil';
import CommandContext from './CommandContext';
import CommandCooldown from './CommandCooldown';
import CommandError from './CommandError';
import CommandRequirements from './CommandRequirements';

interface Command {
  name: string;
  category: string;
  aliases: string[];
  requirements?: object;
  responses?: object;
  subcommands?: Command[];
  cooldown?: number;
  usersCooldown?: CommandCooldown;
}

interface CommandData {
  name?: string;
  category?: string;
  aliases?: string[];
  requirements?: object;
  responses?: object;
  subcommands?: Command[];
  cooldown?: number;
}

class Command {
  constructor(public client: SimplicityClient, public options: CommandData = {}, public parameters = []) {
    this.client = client;
    this.parameters = parameters;
    this.setup(options);
  }

  private setup(options: CommandData): void {
    if (!options.name) throw new Error(`${this.constructor.name} doesn't have name`);
    if (!options.category) throw new Error(`${this.constructor.name} doesn't have category`);

    this.name = options.name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.requirements = options.requirements || {};
    this.responses = options.responses || {};
    this.subcommands = options.subcommands || [];
    this.cooldown = options.cooldown || Number(process.env.COMMAND_COOLDOWN) || 10000;
    if (this.cooldown > 0) this.usersCooldown = new CommandCooldown(this.cooldown);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected run(ctx: CommandContext, args: object[]): void {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }

  private async _run(ctx: CommandContext, args?: object[]): Promise<undefined> {
    let inCooldown = true;
    const isDev = await PermissionUtil.verifyDev(ctx.author.id, ctx.client);
    try {
      if (!isDev && this.usersCooldown) {
        const cooldown = await this.runCooldown(ctx.author.id);
        if (cooldown === 'continue') inCooldown = false;
        if (cooldown === 'ratelimit') return;
      }

      const [subcmd] = ctx.args;
      const subcommand = subcmd && this.getSubCommand(subcmd.toLowerCase());
      if (subcommand) {
        await this.runSubCommand(subcommand, ctx);
        return;
      }

      if (this.requirements) {
        await CommandRequirements.handle(ctx, this.requirements);
      }

      await this.run(ctx, ...args);
    } catch (error) {
      this.client.emit('commandError', error, ctx);
    } finally {
      if (!isDev && this.usersCooldown && !inCooldown) this.usersCooldown.add(ctx.author.id);
    }
  }

  private runCooldown(userID: string): CommandError | string | undefined {
    const isCooldown = this.usersCooldown?.isCooldown(userID);
    if (typeof isCooldown === 'string' && ['continue', 'ratelimit'].includes(isCooldown)) return isCooldown;
    else if (typeof isCooldown !== 'undefined' && typeof isCooldown !== 'string') {
      throw new CommandError(this.usersCooldown?.toMessage(isCooldown), { notEmbed: true });
    }

    return 'continue';
  }

  private getSubCommand(name: string): Command | undefined {
    return this.subcommands?.find((c) => c.name === name || (Array.isArray(c.aliases) && c.aliases.includes(name)));
  }

  private runSubCommand(subcommand: Command, context: CommandContext): Promise<void> {
    context.query = context.query?.replace(`${context.args[0]} `, '').slice(1);
    context.args = context.args.slice(1);
    return subcommand._run(context);
  }
}

export default Command;
