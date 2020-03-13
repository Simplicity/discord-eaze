declare module 'simplicity-discord' {
  import { Client } from 'discord.js';
  import mongoose from 'mongoose';
  import Database from '../src/database/Database';

  interface CommandContext {
    message: Message;
    totalLength: number;
    mentions: MessageMentions;
    member: GuildMember | null;
    guild: Guild | null;
    author: User;
    voiceChannel: VoiceChannel | null | undefined;
    client: SimplicityClient;
    prefix: string;
    command: Command;
    botLanguages: string[];
    language: string | undefined;
    query: string;
    args: string[];
    emoji: Function;
    send: Function;
    canEmbed: boolean | null | undefined;
    database: typeof mongoose;
    guildData: object;
    flags: object;
    channel: TextChannel | DMChannel;
  }

  interface SimplicityClient extends Client {
    database: typeof mongoose;
  }
}
