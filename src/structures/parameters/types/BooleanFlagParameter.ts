import Parameter from './Parameter';

class BooleanFlagParameter extends Parameter {
  public static parse(): boolean {
    return true;
  }
}

export default BooleanFlagParameter;
