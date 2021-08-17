const Blog = require('../models/blog');

const listOFBlogs = [
  {
    title: 'hancock',
    author: 'j jameson',
    likes: 20,
    url: 'http://23.de',
  },
  {
    title: 'Joker',
    author: 'jamie kingston',
    likes: 10,
    url: 'http://234.de',
  },
  {
    title: 'little red shoe',
    author: 'sarah connor',
    likes: 2301,
    url: 'http://25.de',
  },
  {
    title: 'red roses and blood',
    author: 'Tim peters',
    likes: 2021,
    url: 'http://26.de',
  },
];
// get all the blogs in the database
const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  listOFBlogs,
  blogsInDB,
};
