import EazeClient from '../client/EazeClient';

abstract class EazeListener {
  constructor(public client: EazeClient) {}

  abstract on(): void;
}

export default EazeListener;
