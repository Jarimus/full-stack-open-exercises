const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET ALL (async/await)
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// GET ONE
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


// POST (async/await)
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  const savedBlog = await blog.save()
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