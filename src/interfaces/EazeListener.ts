import { EazeClient } from '..';

export abstract class EazeListener {
  constructor(public client: EazeClient) {}

  abstract on(): void;
}
