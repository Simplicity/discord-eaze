import EazeClient from '../client/EazeClient';

abstract class Loader {
  constructor(public client: EazeClient, public required = true) {}

  abstract load(): any;
}

export default Loader;
