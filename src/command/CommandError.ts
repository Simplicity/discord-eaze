import { EmbedFieldData } from 'discord.js';

interface CommandError {
  showUsage: boolean;
  fields: EmbedFieldData[];
  delete: boolean;
}

interface ErrorOptions {
  showUsage?: boolean;
  notEmbed?: boolean;
  delete?: boolean;
}

class CommandError extends Error {
  constructor(
    public message: string, public options: ErrorOptions = { delete: false, showUsage: false },
  ) {
    super(message);
    this.options = options;
    this.showUsage = !!options.showUsage;
    this.fields = [];
    this.delete = !!options.delete;
  }

  /**
   * Adds a field to the embed (max 25).
   * @param {StringResolvable} name The name of this field
   * @param {StringResolvable} value The value of this field
   * @param {boolean} [inline=false] If this field will be displayed inline
   * @returns {this}
   */
  addField(name: string, value: string, inline = false): this {
    this.fields.push({ inline, name, value });
    return this;
  }
}

export default CommandError;
