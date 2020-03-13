import SimplicityClient from '../client/SimplicityClient';

class SimplicityListener {
  constructor(public client: SimplicityClient) {}

  on(): void {
    throw new Error(`${this.constructor.name} doesn't have an on() method.`);
  }
}

export default SimplicityListener;
