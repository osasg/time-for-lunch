const typeDefs = `
  type Query {
    todayMeals: [Meal]
  }

  type Meal {
    name: String
    imageUrl: String
  }
`;

const resolvers = {
  Query: {
    todayMeals: (root, params) => {
      try {
        return [ {} ];
      } catch (e) {
        console.error(e.stack);
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}