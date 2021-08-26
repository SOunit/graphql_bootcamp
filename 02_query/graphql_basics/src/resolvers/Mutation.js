import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) {
      throw new Error('Email taken.');
    }

    const user = {
      ...args.data,
      id: uuidv4(),
    };
    db.users.push(user);

    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter(
          (comment) => comment.author !== args.id
        );
      }

      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },

  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      ...args.data,
      id: uuidv4(),
    };

    db.posts.push(post);

    return post;
  },

  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    const deletedPost = db.posts.splice(postIndex, 1)[0];
    db.comments = db.comments.filter(
      (comment) => comment.author !== deletedPost.author
    );

    return deletedPost;
  },

  createComment(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );
    if (!userExists || !postExists) {
      throw new Error('unable to find user and post');
    }

    const comment = {
      ...args.data,
      id: uuidv4(),
    };
    db.comments.push(comment);

    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    const deletedComment = db.comments.splice(commentIndex, 1)[0];
    return deletedComment;
  },
};

export { Mutation as default };
