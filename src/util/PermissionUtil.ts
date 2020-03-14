import SimplicityClient from '../client/SimplicityClient';
class PermissionUtil {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  static async verifyDev(userID: string, client?: SimplicityClient): Promise<boolean> {
    if (client) {
      const application = await client.fetchApplication();
      const owner = application.owner;
      if (owner?.id) return owner.id === userID;
    }

    const developers = process.env.DEVELOPERS?.split(',');
    return developers?.includes(userID) || false;
  }
}

export default PermissionUtil;
