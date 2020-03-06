import { Client, ClientOptions } from 'discord.js';

class SimplicityClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }
}

export default SimplicityClient;
