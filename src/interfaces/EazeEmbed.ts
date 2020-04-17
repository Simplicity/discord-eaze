import {
  Guild, GuildMember, MessageEmbed, User,
} from 'discord.js';
import { resolveImage, resolveName } from '..';

export type EmbedImputResolvable = string | User | GuildMember | Guild;

export class EazeEmbed extends MessageEmbed {
  setAuthor(name: EmbedImputResolvable, iconURL?: EmbedImputResolvable, url?: string): this {
    return super.setAuthor(
      resolveName(name) || name,
      (resolveImage(name) ?? resolveImage(iconURL)) as string | undefined,
      url,
    );
  }

  setFooter(text: EmbedImputResolvable, iconURL?: EmbedImputResolvable): this {
    return super.setFooter(
      resolveName(text) || text,
      (resolveImage(text) ?? resolveImage(iconURL)) as string | undefined,
    );
  }

  setThumbnail(url: EmbedImputResolvable): this {
    const thumbnail = resolveImage(url) || (url as string);
    return super.setThumbnail(thumbnail);
  }

  setImage(url: EmbedImputResolvable): this {
    const image = resolveImage(url) || (url as string);
    return super.setImage(image);
  }
}
