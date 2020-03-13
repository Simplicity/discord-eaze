import { Client, ClientOptions } from 'discord.js';
import Database from '../database/Database';

class SimplicityClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
    this.database = Database.connect();
  }

  login(token = process.env.DISCORD_TOKEN): Promise<string> {
    return super.login(token);
  }
}

export default SimplicityClient;
