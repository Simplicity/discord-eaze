import SimplicityClient from '../client/SimplicityClient';

abstract class Loader {
  constructor(public client: SimplicityClient, public required = true) {}

  abstract load(): any;
}

export default Loader;
