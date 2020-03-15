import { Collection } from 'discord.js';
import SimplicityClient from '../client/SimplicityClient';
import Loader from '../structures/Loader';
import Command from '../structures/command/Command';
import FileUtil from '../util/FileUtil';

class CommandStore<K, Command> extends Collection<K, Command> {
  public fetch(str: string): Command | undefined {
    return this.find((c: Command) => c.name.toLowerCase() === str.toLowerCase() || c.aliases.includes(str.toLowerCase()));
  }
}

interface CommandLoader {
  client: SimplicityClient;
  commands: CommandStore<string, Command>;
}

class CommandLoader extends Loader {
  constructor(public client: SimplicityClient) {
    super(client, true);
    this.commands = new CommandStore();
  }

  public async load(): Promise<boolean> {
    const error = (x: Error, ...args: string[]): void => console.error(x.stack, args);
    await FileUtil.requireDirectory('src/commands', error, this.loadSuccess.bind(this));
    return true;
  }

  private loadSuccess(Cmd: Command, fileName: string, folderName: string): void {
    const command = new Cmd(this.client);
    command.name = fileName;
    if (folderName !== 'commands' && command.category === 'none') command.category = folderName;
    this.commands.set(fileName, command);
  }
}

export default CommandLoader;
