import {
  Message, MessageMentions, GuildMember, Guild,
  User, VoiceChannel,
} from 'discord.js';
import { EazeClient } from '../client/EazeClient';
import Command from './Command';

class CommandContext {
  message: Message;

  client: EazeClient;

  command?: Command;

  mentions: MessageMentions;

  member?: GuildMember;

  guild?: Guild;

  author: User;

  voiceChannel?: VoiceChannel;

  send: Message['channel']['send'];

  canEmbed: boolean;

  channel: Message['channel'];

  constructor(message: Message, command?: Command) {
    this.command = command;

    this.message = message;
    this.mentions = message.mentions;

    this.author = message.author;
    this.channel = message.channel;
    this.client = message.client;

    this.send = this.channel.send.bind(this.channel);
    this.canEmbed = this.channel.type !== 'dm' ? Boolean(this.channel.permissionsFor(this.guild?.me as GuildMember)?.has('EMBED_LINKS')) : true;

    const voiceChannel = this.member?.voice?.channel;
    if (voiceChannel) this.voiceChannel = voiceChannel;
    if (message.member) this.member = message.member;
    if (message.guild) this.guild = message.guild;
  }
}

export default CommandContext;
