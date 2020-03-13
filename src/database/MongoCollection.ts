import { model as MongoModel } from 'mongoose';

class MongoCollection {
  constructor(public model: typeof MongoModel) {
    this.model = model;
  }

  parse(entity) {
    return entity;
  }

  get(id: string) {
    return this.model.findById(id).then((e) => this.parse(e) || this.create(id));
  }

  create(id: string) {
    return this.model.create({ _id: id }).then(this.parse);
  }

  edit(id: string, entity) {
    return this.model.updateOne({ _id: id }, entity);
  }

  remove(id: string) {
    return this.model.findById(id).then((i) => this.model.deleteOne(i)).then(this.parse);
  }
}

export default MongoCollection;
