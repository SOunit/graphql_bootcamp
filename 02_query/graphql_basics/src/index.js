import { GraphQLServer } from 'graphql-yoga';

// Dummy data
const users = [
  {
    id: '1',
    name: 'Jack Pearson',
    email: 'jack@example.com',
    age: 38,
  },
  {
    id: '2',
    name: 'rebecca Pearson',
    email: 'rebecca@example.com',
    age: 38,
  },
  {
    id: '3',
    name: 'kevin Pearson',
    email: 'kevin@example.com',
    age: 14,
  },
];

const posts = [
  {
    id: '1',
    title: 'title 1',
    body: 'body 1',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'title 2',
    body: 'body 2',
    published: true,
    author: '1',
  },
  {
    id: '3',
    title: 'title 3',
    body: 'body 3',
    published: true,
    author: '2',
  },
];

// Type Definition (Schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
      posts(query: String): [Post!]!
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
      author: User!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      // true for stay
      // false for drop
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      const query = args.query;

      if (!query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
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
  Post: {
    author(parent, args, ctx, info) {
      const result = users.find((user) => {
        return user.id === parent.author;
      });
      return result;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

// default port: 4000
server.start(() => {
  console.log('the server is up');
});
