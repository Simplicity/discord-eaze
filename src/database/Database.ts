import mongoose, { model as MongoModel, Schema as MongoSchema } from 'mongoose';
import MongoCollection from './MongoCollection';
import Schemas from './Schemas';
const Schema = mongoose.Schema;

class Database {
  static async connect(url = process.env.MONGODB_URL): Promise<object> {
    if (!url) throw new TypeError('No parser URL was passed.');

    const database = {};
    for (const x in Schemas) {
      const schema: MongoSchema = new Schema(Schemas[x]);
      const model: typeof MongoModel = mongoose.model(x, schema);
      database[x] = new MongoCollection(model);
    }

    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    return database;
  }
}

export default Database;
