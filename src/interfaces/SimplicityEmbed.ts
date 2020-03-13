import { Guild, GuildMember, Message, MessageEmbed, User, EmbedFieldData } from 'discord.js';

const types: Record<string, string> = { error: 'RED', normal: process.env.COLOR || '#00a1c3', warn: '#fdfd96' };

interface EmbedAdditions {
  author?: User;
  member?: GuildMember;
}

type EmbedResolvable = EmbedAdditions | Message | User | GuildMember;

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

class SimplicityEmbed extends MessageEmbed {
  constructor(public embedResolvable?: EmbedResolvable, public options: EmbedOptions = {}, public data = {}) {
    super(data);
    this.setupEmbed(embedResolvable || {}, options);
  }

  setupEmbed(embedResolvable: EmbedResolvable, options: EmbedOptions): this {
    this.options = Object.assign({
      autoAuthor: true,
      autoFooter: true,
      autoTimestamp: true,
      type: 'normal',
    }, options);

    if (embedResolvable instanceof User) embedResolvable = { author: embedResolvable };
    if (embedResolvable instanceof GuildMember) embedResolvable = { author: embedResolvable.user };
    if (embedResolvable instanceof Message) embedResolvable = { author: embedResolvable.author };

    embedResolvable = Object.assign({ author: null, emoji: null }, embedResolvable);

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

  setAuthor(name: User | Guild | GuildMember | string = '???', iconURL = '', url = ''): this {
    const authorName = checkName(name);
    const authorNameIcon = checkIcon(name);
    const authorIcon = checkIcon(iconURL);
    if (authorName) name = authorName;
    if (authorNameIcon && !iconURL) iconURL = authorNameIcon;
    if (authorIcon) iconURL = authorIcon;

    return super.setAuthor(name, iconURL, url);
  }

  setFooter(text: string | User | GuildMember | Guild = '???', iconURL = ''): this {
    const footerTextName = checkName(text);
    const footerTextIcon = checkIcon(text);
    const footerIcon = checkIcon(iconURL);
    if (footerTextName) text = footerTextName;
    if (footerTextIcon && !iconURL) iconURL = footerTextIcon;
    if (footerIcon) iconURL = footerIcon;

    return super.setFooter(text, iconURL);
  }

  setDescription(description = '???'): this {
    return super.setDescription(description);
  }

  setTitle(title = '???'): this {
    return super.setTitle(title);
  }

  addField(name = '???', value = '???', inline = false): this {
    return super.addFields({ inline, name, value });
  }

  addFields(...fields: EmbedFieldData[]): this {
    return super.addFields(fields);
  }

  setThumbnail(url = ''): this {
    const thumbnail = checkIcon(url) || url;
    return super.setThumbnail(thumbnail);
  }

  setImage(url = ''): this {
    const image = checkIcon(url) || url;
    return super.setImage(image);
  }
}

export default SimplicityEmbed;
