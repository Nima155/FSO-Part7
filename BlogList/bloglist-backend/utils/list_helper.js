// loadash library
const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((prev, cur) => prev + cur.likes, 0);
const favoriteBlog = (blogs) => {
  if (!blogs.length) return null;
  const maximumLikes = Math.max(...blogs.map((ele) => ele.likes));
  return blogs.find((ele) => ele.likes === maximumLikes);
};
const mostBlogs = (blogs) => {
  // loadash function countBy
  const results = _.countBy(blogs, 'author');

  let author = '';
  let maxim = 0;

  Object.entries(results).forEach(([key, value]) => {
    if (value > maxim) {
      author = key;
      maxim = value;
    }
  });

  return {
    author,
    blogs: maxim,
  };
};

const mostLikes = (blogs) => {
  // loadash function groupBy
  const results = _.groupBy(blogs, 'author');

  let author = '';
  let maxim = 0;

  Object.entries(results).forEach(([key, values]) => {
    const sum = values.reduce((prev, cur) => prev + cur.likes, 0);
    if (sum > maxim) {
      author = key;
      maxim = sum;
    }
  });
  return {
    author,
    likes: maxim,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
