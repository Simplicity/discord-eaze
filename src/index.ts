import { config } from 'dotenv';
import SimplicityClient from './client/SimplicityClient';
import SimplicityEmbed from './interfaces/SimplicityEmbed';
import SimplicityListener from './interfaces/SimplicityListener';

config();

export default {
  Client: SimplicityClient,
  Embed: SimplicityEmbed,
  Listener: SimplicityListener,
};
