import { Argument, ReturnResolveFuncArgument } from '../Argument';
import CommandContext from '../../CommandContext';

class BooleanFlagParameter extends Argument {
  parse(): boolean {
    return true;
  }

  resolve(message: CommandContext, content: string): ReturnResolveFuncArgument {
    const args = new RegExp('x', 'gi');
    if (args.test(content)) {
      return {
        result: true,
        content: content.replace(args, ''),
      };
    }
    return null;
  }
}

export default BooleanFlagParameter;
