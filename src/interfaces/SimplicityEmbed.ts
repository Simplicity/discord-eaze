import { GuildMember, Message, MessageEmbed, User } from 'discord.js';
import CommandContext from '../structures/command/CommandContext';

const types = { error: 'RED', normal: process.env.COLOR, warn: '#fdfd96' };

class SimplicityEmbed extends MessageEmbed {
  constructor(public embedResolvable = {}, public options = {}, public data = {}) {
    super(data);
    this._setupEmbed(embedResolvable, options);
  }

  _setupEmbed(embedResolvable: object, options: object): SimplicityEmbed {
    this.options = Object.assign({
      autoAuthor: true,
      autoFooter: true,
      autoTimestamp: true,
      type: 'normal',
    }, options);

    if (embedResolvable instanceof User) embedResolvable = { author: embedResolvable };
    if (embedResolvable instanceof GuildMember) embedResolvable = { author: embedResolvable.user };

    if (typeof embedResolvable === 'function' && embedResolvable.name === 'fixedT') {
      embedResolvable = { t: embedResolvable };
    }

    if (embedResolvable instanceof Message) {
      const context = new CommandContext({ message: embedResolvable });
      embedResolvable = {
        author: context.author,
        t: context.t,
      };
    }

    embedResolvable = Object.assign({ author: null, emoji: null, t: null }, embedResolvable);

    this.t = embedResolvable.t;
    this.emoji = embedResolvable.emoji;

    if (embedResolvable.author) {
      if (this.options.autoAuthor) this.setAuthor(embedResolvable.author);
      if (this.options.autoFooter) this.setFooter(embedResolvable.author.tag);
      if (this.options.autoTimestamp) this.setTimestamp();
    }

    const color = types[this.options.type] || types.normal || 'BLUE';
    this.setColor(color);

    return this;
  }
}

export default SimplicityEmbed;
