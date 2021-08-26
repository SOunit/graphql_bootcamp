// Dummy data
const users = [
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

const posts = [
  { id: '10', title: 'title', author: '1', published: true, comments: [] },
  { id: '20', title: 'title', author: '2', published: true, comments: [] },
];

const comments = [
  { id: '100', text: 'text', author: '1', post: '10' },
  { id: '200', text: 'text', author: '2', post: '20' },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
