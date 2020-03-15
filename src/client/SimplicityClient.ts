import { Client, ClientOptions } from 'discord.js';
import mongoose from 'mongoose';
import Constants from '../util/Constants';

interface SimplicityClient extends Client {
  database: typeof mongoose;
}

class SimplicityClient extends Client {
  constructor(options: ClientOptions = Constants.CLIENT_OPTIONS) {
    super(options);
  }

  public login(token = process.env.DISCORD_TOKEN): Promise<string> {
    return super.login(token);
  }
}

export default SimplicityClient;
