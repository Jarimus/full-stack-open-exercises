const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


// GET ALL (async/await)
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1} )
  response.json(blogs)
})

// GET ONE
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { name: 1, username: 1} )
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


// POST (async/await)
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = await User.findById(request.user.id)

  if (!user) {
    return response.status(400).json({ error: 'userID missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(blog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

// DELETE (async/await)
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // Check whether the blog exists
  const blogID = request.params.id
  const blog = await Blog.findById(blogID)
  if (!blog) {
    return response.status(204).end()
  }

  //validate jwt (middleware extracted data to request.user )
  const userIDtoken = request.user.id
  if (!userIDtoken) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // compare userID in the blog and the token.
  const userIDblog = blog.user._id.toString()
  if (userIDtoken != userIDblog) {
    response.status(401).send({ error: "only owner can delete blogs"})
  }

  await Blog.findByIdAndDelete(blogID)
  response.status(204).end()
})

// PUT (async/await)
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const id = request.params.id
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog).end()

})

module.exports = blogsRouter