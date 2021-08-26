import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Dummy data
let users = [
  {
    id: '1',
    name: 'Jack',
    email: 'jack@sample.com',
    posts: ['10'],
    comments: ['100'],
  },
  {
    id: '2',
    name: 'rebecca',
    email: 'rebecca@sample.com',
    posts: ['20'],
    comments: ['200'],
  },
];

let posts = [
  { id: '10', title: 'title', author: '1', published: true, comments: [] },
  { id: '20', title: 'title', author: '2', published: true, comments: [] },
];

let comments = [
  { id: '100', text: 'text', author: '1', post: '10' },
  { id: '200', text: 'text', author: '2', post: '20' },
];

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
      createUser(data: CreateUserInput): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput): Post!
      deletePost(id: ID!): Post!
      createComment(data: CreateCommentInput): Comment!
    }

    input CreateCommentInput{
      text: String!
      author: ID!
      post: ID!
    }

    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
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
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        ...args.data,
        id: uuidv4(),
      };
      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.author !== args.id);
        }

        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        ...args.data,
        id: uuidv4(),
      };

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      const deletedPost = posts.splice(postIndex, 1)[0];
      comments = comments.filter(
        (comment) => comment.author !== deletedPost.author
      );

      return deletedPost;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );
      if (!userExists || !postExists) {
        throw new Error('unable to find user and post');
      }

      const comment = {
        ...args.data,
        id: uuidv4(),
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
