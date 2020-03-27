import PermissionUtil from '../../util/PermissionUtil';
import CommandContext from './CommandContext';
import CommandError from './CommandError';

interface Requirements {
  devOnly?: boolean;
  guildOnly?: boolean;
}

class CommandRequirements {
  public static async handle(
    ctx: CommandContext,
    requirements: Requirements,
  ): Promise<CommandError | void> {
    const isDev = await PermissionUtil.verifyDev(ctx.author.id, ctx.client);
    if (!isDev && requirements.devOnly) throw new CommandError('Developer only');

    if (requirements.guildOnly && !ctx.guild) throw new CommandError('Guild only');
  }
}

export default CommandRequirements;
