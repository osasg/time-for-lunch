const { ObjectId } = require('mongodb');

module.exports = ({ db }) => {
  const collection = db.collection('meals');

  const findById = async ({ _id }) => {
    return collection.findOne({ _id: ObjectId(_id) });
  }

  const create = async ({ name, imageUrl }) => {
    const response = await collection.insertOne({ name, imageUrl });
    return response.ops[0];
  }

  const update = async ({ _id, name, imageUrl }) => {
    const response = await collection.updateOne({ _id: ObjectId(_id) }, { $set: {
      name, imageUrl
    }});

    return response.ops[0];
  }

  const remove = async ({ _id }) => {
    const response = await collection.deleteOne({ _id: ObjectId(_id) });
    return response.result.ok;
  }

  const search = async ({ pattern, page = 0, perPage = 10 }) => {
    pattern = pattern
      ? pattern.split(/[\s]/).map(w => `(${w})`).join('|')
      : '';
    pattern = new RegExp(pattern, 'i');

    const cursor = collection.find({ name: { $regex: pattern } })
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