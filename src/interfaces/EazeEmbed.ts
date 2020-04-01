import {
  Guild, GuildMember, Message, MessageEmbed, User, EmbedFieldData,
} from 'discord.js';

const types: Record<string, string> = { error: 'RED', normal: process.env.COLOR || '#00a1c3', warn: '#fdfd96' };

interface EmbedAdditions {
  author?: User | null;
  member?: GuildMember;
}

type EmbedResolvable = EmbedAdditions | Message | User | GuildMember;
type ImputResolvable = string | User | GuildMember | Guild;
interface EmbedOptions {
  autoAuthor?: boolean;
  autoFooter?: boolean;
  autoTimestamp?: boolean;
  type?: string;
}

function checkName(resolvable: Guild | GuildMember | User | string): string {
  if (resolvable instanceof User) return resolvable.tag;
  if (resolvable instanceof GuildMember) return resolvable.user.tag;
  if (resolvable instanceof Guild) return resolvable.name;
  return resolvable;
}

function checkIcon(resolvable: Guild | GuildMember | User | string): string | null {
  const opts: { dynamic: boolean; size: 2048 } = { dynamic: true, size: 2048 };
  if (resolvable instanceof User) return resolvable.displayAvatarURL(opts);
  if (resolvable instanceof GuildMember) return resolvable.user.displayAvatarURL(opts);
  if (resolvable instanceof Guild) return resolvable.iconURL(opts);
  return resolvable;
}

class EazeEmbed extends MessageEmbed {
  constructor(
    public embedResolvable?: EmbedResolvable,
    public options: EmbedOptions = {},
    public data = {},
  ) {
    super(data);
    this.setupEmbed(embedResolvable || {}, options);
  }

  private setupEmbed(embedResolvable: EmbedResolvable, options: EmbedOptions): this {
    this.options = {
      autoAuthor: true, autoFooter: true, autoTimestamp: true, type: 'normal', ...options,
    };

    if (embedResolvable instanceof User) embedResolvable = { author: embedResolvable };
    if (embedResolvable instanceof GuildMember) embedResolvable = { author: embedResolvable.user };
    if (embedResolvable instanceof Message) embedResolvable = { author: embedResolvable.author };

    embedResolvable = { author: null, ...embedResolvable };

    if (embedResolvable.author) {
      if (this.options.autoAuthor) this.setAuthor(embedResolvable.author);
      if (this.options.autoFooter) this.setFooter(embedResolvable.author.tag);
      if (this.options.autoTimestamp) this.setTimestamp();
    }

    const color: string = (this.options.type && types[this.options.type]) || types.normal;
    this.setColor(color);

    return this;
  }

  setColor(color: string): this {
    return super.setColor(color);
  }

  setAuthor(name: ImputResolvable, iconURL?: ImputResolvable, url?: string): this {
    const authorName = checkName(name);
    const authorNameIcon = checkIcon(name);
    const authorIcon = iconURL && checkIcon(iconURL);

    if (authorName) name = authorName;
    if (authorNameIcon && !iconURL) iconURL = authorNameIcon;
    if (authorIcon) iconURL = authorIcon;

    return super.setAuthor(name, String(iconURL), url);
  }

  setFooter(text: ImputResolvable, iconURL?: ImputResolvable): this {
    const footerTextName = checkName(text);
    const footerTextIcon = checkIcon(text);
    const footerIcon = iconURL && checkIcon(iconURL);

    if (footerTextName) text = footerTextName;
    if (footerTextIcon && !iconURL) iconURL = footerTextIcon;
    if (footerIcon) iconURL = footerIcon;

    return super.setFooter(text, String(iconURL));
  }

  setDescription(description: string): this {
    return super.setDescription(description);
  }

  setTitle(title: string): this {
    return super.setTitle(title);
  }

  addField(name: string, value: string, inline = false): this {
    return super.addFields({ inline, name, value });
  }

  addFields(...fields: EmbedFieldData[]): this {
    return super.addFields(fields);
  }

  setThumbnail(url: string): this {
    const thumbnail = checkIcon(url) || url;
    return super.setThumbnail(thumbnail);
  }

  setImage(url: string): this {
    const image = checkIcon(url) || url;
    return super.setImage(image);
  }
}

export default EazeEmbed;
