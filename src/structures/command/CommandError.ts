import { EmbedFieldData } from 'discord.js';

interface CommandError {
  onUsage: boolean;
  fields: EmbedFieldData[];
  notEmbed: boolean;
}

interface ErrorOptions {
  onUsage?: boolean;
  notEmbed?: boolean;
}

class CommandError extends Error {
  constructor(public message = '???', public options: ErrorOptions = { notEmbed: false, onUsage: false }) {
    super(message);
    this.options = options;
    this.onUsage = !!options.onUsage;
    this.fields = [];
    this.notEmbed = !!options.notEmbed;
  }

  public addField(name = '???', value = '???', inline = false): this {
    this.fields.push({ inline, name, value });
    return this;
  }
}

export default CommandError;
