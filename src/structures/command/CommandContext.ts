import { Emoji } from 'discord.js';
import i18n from 'i18next';
import Constants from '../../util/Constants';

const getCustomEmoji: Emoji = (id: string) => Constants.EMOJIS_CUSTOM && Constants.EMOJIS_CUSTOM[id];
const getDefaultEmoji: string = (name: string) => Constants.EMOJIS && Constants.EMOJIS[name];

class CommandContext {
  constructor(public data: CommandContext) {
    this.totalLength = data.totalLength;

    this.message = data.message;
    this.mentions = this.message.mentions;
    this.member = this.message.member;
    this.guild = this.message.guild;
    this.author = this.message.author;
    this.channel = this.message.channel;
    this.client = this.message.client;
    this.voiceChannel = this.member?.voice?.channel;

    this.prefix = data.prefix;
    this.command = data.command;
    this.botLanguages = Object.keys(i18n.store.data);
    this.language = this.botLanguages.includes(data.language) ?
      data.language :
      process.env.DEFAULT_LANG;
    this.query = data.query;
    this.args = data.args;
    this.t = i18n.getFixedT(this.language);

    this.emoji = this._emoji.bind(this);
    this.send = this.channel.send.bind(this.channel);

    this.canEmbed = this.channel.type !== 'dm' ?
      this.guild && this.guild.me !== null && this.channel.permissionsFor(this.guild.me)?.has('EMBED_LINKS') :
      true;

    this.database = this.client.database;
    this.guildData = data.guildData;
    this.flags = {};
  }

  _emoji(name = 'QUESTION', options = {}): Emoji | string {
    const { id, other } = Object.assign({ id: false, other: null }, options);
    name = name.toUpperCase();

    const custom = getCustomEmoji(name) || (other && getCustomEmoji(other));
    const normal = getDefaultEmoji(name) || (other && getDefaultEmoji(other));

    if (this.guild && this.channel.permissionsFor(this.guild.me).has('USE_EXTERNAL_EMOJIS') && custom) {
      const emoji = this.client.emojis.cache.get(custom);
      if (emoji) return id ? emoji.id : emoji.toString();
    }
    return normal || false;
  }
}

export default CommandContext;
