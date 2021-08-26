const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    // true for stay
    // false for drop
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  posts(parent, args, { db }, info) {
    const query = args.query;

    const posts = db.posts;

    if (!query) {
      return posts;
    }

    return posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());

      return isTitleMatch || isBodyMatch;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
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
};

export { Query as default };
