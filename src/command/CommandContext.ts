import {
  Message, MessageMentions, GuildMember, Guild,
  User, VoiceChannel, TextChannel, DMChannel, NewsChannel,
} from 'discord.js';
import { EazeClient } from '../client/EazeClient';
import Command from './Command';


type TextChannelTypes = TextChannel | DMChannel | NewsChannel;

interface CommandContextOptions {
  message: Message;
  totalLength: number;
  client: EazeClient;
  prefix?: string;
  command?: Command;
  query?: string;
  args: string[];
  guildData?: object;
}

class CommandContext {
  message: Message;

  totalLength: number;

  client: EazeClient;

  prefix?: string;

  command?: Command;

  query?: string;

  args: string[];

  guildData?: object;

  mentions?: MessageMentions;

  member?: GuildMember;

  guild?: Guild;

  author: User;

  voiceChannel?: VoiceChannel;

  botLanguages?: string[];

  language?: string;

  send?: Function;

  canEmbed?: boolean;

  channel?: TextChannelTypes;

  flags: object = {};

  constructor(data: CommandContextOptions) {
    const { message } = data;

    this.totalLength = data.totalLength;
    this.prefix = data.prefix;
    this.command = data.command;
    this.query = data.query;
    this.args = data.args;
    this.guildData = data.guildData;

    this.message = message;
    this.mentions = message.mentions;

    this.author = message.author;
    this.channel = message.channel;
    this.client = data.client || message.client;

    this.send = this.channel.send.bind(this.channel);
    this.canEmbed = this.channel.type !== 'dm'
      ? this.guild && this.guild.me !== null && this.channel.permissionsFor(this.guild.me)?.has('EMBED_LINKS')
      : true;

    if (message.member) this.member = message.member;
    if (message.guild) this.guild = message.guild;

    const voiceChannel = this.member?.voice?.channel;
    if (voiceChannel) this.voiceChannel = voiceChannel;
  }
}

export default CommandContext;
