const Post = {
  author(parent, args, { db }, info) {
    const result = db.users.find((user) => {
      return user.id === parent.author;
    });
    return result;
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => {
      return comment.post === parent.id;
    });
  },
};

export { Post as default };
