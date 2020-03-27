import Parameter from './Parameter';

class BooleanFlagParameter extends Parameter {
  static parse(): boolean {
    return true;
  }
}

export default BooleanFlagParameter;
