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

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error('Email in use');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      ...args.data,
      id: uuidv4(),
    };

    db.posts.push(post);

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(
      (comment) => comment.author !== deletedPost.author
    );

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost,
        },
      });
    }

    return deletedPost;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      // for user update published status, submit create or delete
      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      }
      // for user not update status, submit update
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    console.log('post', post);

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
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

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });

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

  updateComment(parent, args, { db }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    return comment;
  },
};

export { Mutation as default };
