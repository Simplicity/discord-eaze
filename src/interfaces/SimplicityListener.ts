import SimplicityClient from '../client/SimplicityClient';

abstract class SimplicityListener {
  constructor(public client: SimplicityClient) {}

  abstract on(): void;
}

export default SimplicityListener;
