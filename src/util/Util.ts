import {
  Guild, GuildMember, ImageURLOptions, User,
} from 'discord.js';

export function resolveName(resolvable: Guild | GuildMember | User | string): string {
  if (resolvable instanceof User) return resolvable.tag;
  if (resolvable instanceof GuildMember) return resolvable.user.tag;
  if (resolvable instanceof Guild) return resolvable.name;
  return resolvable.toString();
}

export function resolveImage(resolvable?: Guild | GuildMember | User | string): string | null {
  const opts: ImageURLOptions & { dynamic: boolean } = { size: 2048, dynamic: true };
  if (resolvable instanceof User) return resolvable.displayAvatarURL(opts);
  if (resolvable instanceof GuildMember) return resolvable.user.displayAvatarURL(opts);
  if (resolvable instanceof Guild) return resolvable.iconURL(opts);
  return null;
}
