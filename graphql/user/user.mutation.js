module.exports = {
  block: async (root, { _id, is }, { repos }) => {
    const [ err, result ] = await to(repos.Account.block({ _id, is }));
    return result;
  },
  remove: async (root, { _id }, { respos }) => {
    const [ err, result ] = await to(repos.Account.remove({ _id}));
    return result;
  }
}