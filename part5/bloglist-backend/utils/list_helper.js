const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  sum = 0
  blogs.forEach(blog => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  let favoriteBlog = null
  favoriteLikes = -1
  blogs.forEach( blog => {
    if (blog.likes > favoriteLikes) {
      favoriteBlog = blog
      favoriteLikes = blog.likes
    }
  })
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authorCounts = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])
  return {
    author: maxAuthor,
    blogs: authorCounts[maxAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authorGroups = _.groupBy(blogs, 'author')
  const authorMostLikes = _.maxBy(_.keys(authorGroups), (author) => _.sumBy(authorGroups[author], blog => blog.likes ) )

  return {
  author: authorMostLikes,
  likes: _.sumBy(authorGroups[authorMostLikes], blog => blog.likes)
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}