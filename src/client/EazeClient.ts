import { Client, ClientOptions } from 'discord.js';
import { ResolveResponse } from '../command/arguments/Argument';

export interface EazeClientOptions {
  defaultArgumentOptions?: {
    missingError?: ResolveResponse;
    invalidError?: ResolveResponse;
  };
}

export class EazeClient extends Client {
  defaultArgumentOptions?: {
    missingError?: ResolveResponse;
    invalidError?: ResolveResponse;
  };

  constructor(options?: ClientOptions & EazeClientOptions) {
    super(options);
    this.defaultArgumentOptions = options?.defaultArgumentOptions;
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   */
  login(token: string): Promise<string> {
    return super.login(token);
  }
}
