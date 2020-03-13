import { Client, ClientOptions } from 'discord.js';
import mongoose from 'mongoose';
import Database from '../database/Database';

interface SimplicityClient extends Client {
  database: typeof mongoose;
}

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
