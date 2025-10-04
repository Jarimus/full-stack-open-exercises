const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { getTokenFrom } = require('../utils/jwt')
const jwt = require('jsonwebtoken')


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
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

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
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

// PUT (async/await)
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const id = request.params.id
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).end()
  }

  [blog.title, blog.author, blog.url, blog.likes] = [title, author, url, likes]

  const updatedBlog = await blog.save()
  response.json(updatedBlog).end()

})

module.exports = blogsRouter