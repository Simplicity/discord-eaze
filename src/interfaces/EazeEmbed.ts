import {
  Guild, GuildMember, MessageEmbed, User,
} from 'discord.js';
import { resolveImage, resolveName } from '..';

export type EmbedImputResolvable = string | User | GuildMember | Guild;

/**
 * Represents an embed in a message (rich embed)
 */
export class EazeEmbed extends MessageEmbed {
  /**
   * Sets the author of this embed.
   * @param {EmbedImputResolvable} name The name of the author
   * @param {EmbedImputResolvable} [iconURL] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {this}
   */
  setAuthor(name: EmbedImputResolvable, iconURL?: EmbedImputResolvable, url?: string): this {
    return super.setAuthor(
      resolveName(name) || name,
      (resolveImage(name) ?? resolveImage(iconURL)) as string | undefined,
      url,
    );
  }

  /**
   * Sets the footer of this embed.
   * @param {EmbedImputResolvable} text The text of the footer
   * @param {EmbedImputResolvable} [iconURL] The icon URL of the footer
   * @returns {this}
   */
  setFooter(text: EmbedImputResolvable, iconURL?: EmbedImputResolvable): this {
    return super.setFooter(
      resolveName(text) || text,
      (resolveImage(text) ?? resolveImage(iconURL)) as string | undefined,
    );
  }

  /**
   * Sets the thumbnail of this embed.
   * @param {EmbedImputResolvable} url The URL of the thumbnail
   * @returns {this}
   */
  setThumbnail(url: EmbedImputResolvable): this {
    const thumbnail = resolveImage(url) || (url as string);
    return super.setThumbnail(thumbnail);
  }

  /**
   * Sets the image of this embed.
   * @param {EmbedImputResolvable} url The URL of the image
   * @returns {this}
   */
  setImage(url: EmbedImputResolvable): this {
    const image = resolveImage(url) || (url as string);
    return super.setImage(image);
  }
}
