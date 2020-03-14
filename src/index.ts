import { config } from 'dotenv';
import SimplicityClient from './client/SimplicityClient';
import SimplicityEmbed from './interfaces/SimplicityEmbed';
import SimplicityListener from './interfaces/SimplicityListener';
import Constants from './util/Constants';
import Util from './util/Util';

config();

export default {
  Client: SimplicityClient,
  Constants,
  Embed: SimplicityEmbed,
  Listener: SimplicityListener,
  Util,
  util: Util,
};
