import { GraphQLServer } from 'graphql-yoga';

// Type Definition (Schema)
const typeDefs = `
    type Query {
      me: User!
      post: Post!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: '123abc',
        name: 'Jack Pearson',
        email: 'jackjack@sample.com',
        age: 38,
      };
    },
    post() {
      return {
        id: 'postid',
        title: 'post title',
        body: 'post body',
        published: true,
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

// default port: 4000
server.start(() => {
  console.log('the server is up');
});
