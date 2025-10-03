const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

const initialBlogs = [
  {
    title: "title 1",
    author: "author 2",
    url: "url 1",
    likes: 123,
  },
  {
    title: "title 2",
    author: "author 2",
    url: "url 2",
    likes: 456,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('GET: notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


test('GET: all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('GET: unique identifier is id (not _id)', async () => {
  const response = await api.get('/api/blogs')
  const id = response.body[0].id
  assert.notEqual(id, undefined)
})

test('GET: one existing resource', async () => {
  let response = await api.get('/api/blogs')
  const initialBlogs = response.body
  const id = initialBlogs[0].id
  response = await api.get(`/api/blogs/${id}`).expect(200)
  const retrievedBlog = response.body
  assert.deepStrictEqual(retrievedBlog, initialBlogs[0])
})

test('GET: one non-existent resource', async () => {
  await api
    .get(`/api/blogs/79abc1faba78f707986fe51f`)
    .expect(404)
})

test('POST method works', async () => {

  const blog = {
      title: "title 3",
      author: "author 3",
      url: "url 3",
      likes: 789,
    }

  await api.post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogs = response.body

  assert.deepStrictEqual(blogs.length, initialBlogs.length + 1)
  assert.deepStrictEqual({...blog, id: "irrelevant"}, {...blogs[2], id: "irrelevant"})
})

test('POST: likes defaults to 0', async () => {

  const blog = {
    title: "title 4",
    author: "author 4",
    url: "url 4",
  }

  await api.post('/api/blogs')
  .send(blog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const retrievedBlog = response.body.find((blog) => blog.title === "title 4")

  assert.strictEqual(retrievedBlog.likes, 0)
})

test('POST: title missing --> 400', async () => {

  const blog = {
    author: "author 4",
    url: "url 4",
    likes: 0
  }

  await api.post('/api/blogs')
  .send(blog)
  .expect(400)
})

test('POST: url missing --> 400', async () => {

  const blog = {
    title: "title 4",
    author: "author 4",
    likes: 0
  }

  await api.post('/api/blogs')
  .send(blog)
  .expect(400)
})

test('DELETE: existing blog', async () => {
  const response = await api.get('/api/blogs')
  const id = response.body[0].id

  await api.delete(`/api/blogs/${id}`)
    .expect(204)
})

test('DELETE: non-existent blog, correct id format', async () => {
  await api.delete('/api/blogs/79abc1faba78f707986fe51f')
    .expect(204)
})

test('DELETE: non-existent blog, malformatted id', async () => {
  await api.delete('/api/blogs/123')
    .expect(400)
})

test('PUT: existing resource', async () => {
  let response = await api.get('/api/blogs')
  const id = response.body[0].id
  const updatedBlog = {
    title: "new title",
    author: "new author",
    url: "new url",
    likes: 9000
  }
  await api
    .put(`/api/blogs/${id}`)
    .send(updatedBlog)
    .expect(200)
  
  response = await api.get('/api/blogs')
  const newBlogs = response.body
  
  assert.deepStrictEqual({...updatedBlog, id: id}, newBlogs.find(blog => blog.id === id))
})

test('PUT: non-existent resource', async () => {
  const updatedBlog = {
    title: "new title",
    author: "new author",
    url: "new url",
    likes: 9000
  }
  await api
    .put('/api/blogs/79abc1faba78f707986fe51f')
    .send(updatedBlog)
    .expect(404)
})

test('PUT: malformatted id', async () => {
  const updatedBlog = {
    title: "new title",
    author: "new author",
    url: "new url",
    likes: 9000
  }
  await api
    .put('/api/blogs/123')
    .send(updatedBlog)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})