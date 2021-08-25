import { GraphQLServer } from 'graphql-yoga';

// Type Definition (Schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
        title: String!
        price: Int!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    id() {
      return 'abc123';
    },
    name() {
      return 'Jack Pearson';
    },
    age() {
      return 38;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    },
    title() {
      return 'item title';
    },
    price() {
      return 333;
    },
    releaseYear() {
      return 19990303;
    },
    rating() {
      return 3.08;
    },
    inStock() {
      return true;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

// default port: 4000
server.start(() => {
  console.log('the server is up');
});
