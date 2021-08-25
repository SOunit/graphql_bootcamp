import { GraphQLServer } from 'graphql-yoga';

// Type Definition (Schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'hello';
    },
    name() {
      return 'Jack Pearson';
    },
    location() {
      return 'Canada';
    },
    bio() {
      return 'This is us!';
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

// default port: 4000
server.start(() => {
  console.log('the server is up');
});
