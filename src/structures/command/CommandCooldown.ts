import Util from '../../util/Util';

class CommandCooldown extends Map {
  constructor(public cooldown: number, public ratelimit: number = cooldown / 3) {
    super();
  }

  public isCooldown(userID: string): number | string {
    const user = this.get(userID);
    if (!user) return 'continue';

    const current = Date.now();
    const time = current - user.timestamp;
    if (this.cooldown > time && user.ratelimit < 3) {
      user.ratelimit += 1;
      this.set(userID, user);
      return this.cooldown - time;
    } if (this.cooldown < time) {
      this.delete(userID);
      return 'continue';
    } if (user.ratelimit >= 3) {
      if (!user.ratelimitTimestamp) {
        user.ratelimitTimestamp = current;
        this.set(userID, user);
      } else if (this.ratelimit && (current - user.ratelimitTimestamp) > this.ratelimit) {
        user.ratelimitTimestamp = current;
        user.ratelimit = 0;
        this.set(userID, user);
      }
      return 'ratelimit';
    }

    return 'continue';
  }

  public toMessage(timestamp: number): string {
    const date = new Date(timestamp);
    let time = '';

    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (minutes) time += `${minutes} ${Util.fixPlural(minutes, 'minute')}`;
    if (minutes && seconds) time += ' and ';
    if (seconds) time += `${seconds} ${Util.fixPlural(seconds, 'second')}`;

    return time || 'Wait a little bit.';
  }

  public add(userID: string): this {
    return this.set(userID, { ratelimit: 0, ratelimitTimestamp: null, timestamp: Date.now() });
  }
}

export default CommandCooldown;
