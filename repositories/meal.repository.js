const { ObjectId } = require('mongodb');

module.exports = ({ db }) => {
  const collection = db.collection('meals');

  const findById = async ({ _id }) => {
    return collection.findOne({ _id: ObjectId(_id) });
  }

  const create = async ({ name, imageUrl }) => {
    collection.insertOne({ name, imageUrl });
  }

  const update = async ({ _id, name, imageUrl }) => {
    collection.updateOne({ _id: ObjectId(id) }, { $set: {
      name, imageUrl
    }});
  }

  const remove = async ({ _id }) => {
    collection.deleteOne({ _id: Object(id) });
  }

  const search = async ({ pattern, page = 0, perPage = 10 }) => {
    const cursor = collection.find({ $text: { $search: pattern } })
      .skip(page * perPage)
      .limit(perPage);

    const meals = [];
    let m;

    while (m = await cursor.next()) {
      meals.push(m);
    }

    return meals;
  }

  return {
    findById,
    create,
    update,
    remove,
    search
  }
}