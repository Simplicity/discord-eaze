import { Client, ClientOptions } from 'discord.js';
import { ResolveResponse } from '../command/arguments/Argument';
import CommandContext from '../command/CommandContext';

export interface EazeClientOptions {
  defaultArgumentOptions?: {
    missingError?: ResolveResponse;
    invalidError?: ResolveResponse;
  };
  customContext?: typeof CommandContext;
}

export class EazeClient extends Client {
  defaultArgumentOptions?: {
    missingError?: ResolveResponse;
    invalidError?: ResolveResponse;
  };

  customContext?: typeof CommandContext;

  constructor(eazeOptions?: EazeClientOptions, options?: ClientOptions) {
    super(options);
    this.defaultArgumentOptions = eazeOptions?.defaultArgumentOptions;
    this.customContext = eazeOptions?.customContext;
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   */
  login(token: string): Promise<string> {
    return super.login(token);
  }
}
