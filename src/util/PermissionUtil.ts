import SimplicityClient from '../client/SimplicityClient';

class PermissionUtil {
  public static async verifyDev(userID: string, client?: SimplicityClient): Promise<boolean> {
    if (client) {
      const { owner } = await client.fetchApplication();
      if (owner?.id) return owner.id === userID;
    }

    const developers = process.env.DEVELOPERS?.split(',');
    return developers?.includes(userID) || false;
  }
}

export default PermissionUtil;
