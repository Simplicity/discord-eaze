import { ClientOptions } from 'discord.js';

// eslint-disable-next-line import/prefer-default-export
export const CLIENT_OPTIONS: ClientOptions = {
  disableMentions: 'everyone',
  partials: ['MESSAGE', 'CHANNEL'],
};
