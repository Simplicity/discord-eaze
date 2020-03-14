import SimplicityClient from '../client/SimplicityClient';

class Loader {
  constructor(public client: SimplicityClient, public required = true) {
    this.client = client;
    this.required = !!required;
  }

  load(): void {
    throw new Error(`${this.constructor.name} doesn't have a load() method.`);
  }
}

export default Loader;
