import { Message, MessageMentions, GuildMember, Guild, User, VoiceChannel, TextChannel, DMChannel } from 'discord.js';
import mongoose from 'mongoose';
import SimplicityClient from '../../client/SimplicityClient';
import Command from './Command';

interface CommandContextOptions {
  message: Message;
  totalLength: number;
  client: SimplicityClient;
  prefix?: string;
  command?: Command;
  query?: string;
  args?: string[];
  guildData?: object;
}

interface CommandContext extends CommandContextOptions {
  mentions?: MessageMentions;
  member?: GuildMember | null;
  guild?: Guild | null;
  author?: User;
  voiceChannel?: VoiceChannel | null | undefined;
  botLanguages?: string[];
  language?: string | undefined;
  emoji?: Function;
  send?: Function;
  canEmbed?: boolean | null | undefined;
  database?: typeof mongoose;
  flags?: object;
  channel?: TextChannel | DMChannel;
}

class CommandContext {
  constructor(public data: CommandContextOptions) {
    const message: Message = data.message;

    this.totalLength = data.totalLength;
    this.prefix = data.prefix;
    this.command = data.command;
    this.query = data.query;
    this.args = data.args;
    this.guildData = data.guildData;

    this.message = message;
    this.mentions = message.mentions;
    this.member = message.member;
    this.guild = message.guild;
    this.author = message.author;
    this.channel = message.channel;
    this.client = data.client || message.client;
    this.voiceChannel = this.member?.voice?.channel;

    this.send = this.channel.send.bind(this.channel);
    this.database = this.client?.database;
    this.canEmbed = this.channel.type !== 'dm' ?
      this.guild && this.guild.me !== null && this.channel.permissionsFor(this.guild.me)?.has('EMBED_LINKS') :
      true;
    this.flags = {};
  }
}

export default CommandContext;
