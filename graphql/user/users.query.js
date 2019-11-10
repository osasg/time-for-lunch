const to = require('await-to-js');

module.exports = {
  users: async (root, params, { db }) => {
    const users = [];
    let u;

    const cursor = db.collection('accounts').find(params);

    while (u = await cursor.next()) {
      users.push(u);
    }

    return users;
  }
}