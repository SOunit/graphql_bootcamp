import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Dummy data
const users = [];

const posts = [];

const comments = [];

// Type Definition (Schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
      posts(query: String): [Post!]!
      comments: [Comment!]!
      me: User!
      post: Post!
    }

    type Mutation {
      createUser(name: String!, email: String!, age: Int): User!
      createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
      createComment(text: String!, author: ID!, post: ID!): Comment!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
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
    comments(parent, args, ctx, info) {
      return comments;
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email);
      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
        posts: [],
        comments: [],
      };
      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);
      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);
      const postExists = posts.some(
        (post) => post.id === args.post && post.published
      );
      if (!userExists || !postExists) {
        throw new Error('unable to find user and post');
      }

      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post,
      };
      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      const result = users.find((user) => {
        return user.id === parent.author;
      });
      return result;
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return parent.id === post.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return parent.id === comment.author;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return parent.author === user.id;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

// default port: 4000
server.start(() => {
  console.log('the server is up');
});
