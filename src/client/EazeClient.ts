import { Client, ClientOptions } from 'discord.js';
import { CLIENT_OPTIONS } from '../util/Constants';

class EazeClient extends Client {
  constructor(options: ClientOptions = CLIENT_OPTIONS) {
    super(options);
  }

  login(token = process.env.DISCORD_TOKEN): Promise<string> {
    return super.login(token);
  }
}

export default EazeClient;
