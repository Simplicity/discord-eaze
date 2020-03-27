import { ClientOptions } from 'discord.js';

export const CLIENT_OPTIONS: ClientOptions = {
  disableMentions: 'everyone',
  partials: ['MESSAGE', 'CHANNEL'],
};
