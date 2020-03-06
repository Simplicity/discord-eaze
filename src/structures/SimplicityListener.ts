import SimplicityClient from '../client/SimplicityClient';

interface SimplicityListener {
  client: SimplicityClient;
}

class SimplicityListener {
  constructor(client: SimplicityClient) {
    this.client = client;
  }

  on(): void {
    throw new Error(`${this.constructor.name} doesn't have an on() method.`);
  }
}

export default SimplicityListener;
