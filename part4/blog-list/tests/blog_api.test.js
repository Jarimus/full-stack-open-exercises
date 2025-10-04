const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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

const initialUsers = [
  {
    username: "username 1",
    user: "user 1",
    password: "password 1",
  }
]

describe('blogs: initial database with two entries', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const userObject = new User(initialUsers[0])
    userObject.password = await bcrypt.hash(userObject.password, 10)
    await userObject.save()
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
  
  test('GET: one existing resource by id', async () => {
    let response = await api.get('/api/blogs')
    const initialBlogs = response.body
    const id = initialBlogs[0].id
    response = await api.get(`/api/blogs/${id}`).expect(200)
    const retrievedBlog = response.body
    assert.deepStrictEqual(
    {
      id: retrievedBlog.id,
      title: retrievedBlog.title,
      author: retrievedBlog.author,
      url: retrievedBlog.url,
      likes: retrievedBlog.likes
    },
    {
      id: initialBlogs[0].id,
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: initialBlogs[0].likes
    })
  })
  
  test('GET: one non-existent resource', async () => {
    await api
      .get(`/api/blogs/79abc1faba78f707986fe51f`)
      .expect(404)
  })
  
  test('POST method works', async () => {
    const responseUsers = await api.get('/api/users')
    const UsersAtStart = responseUsers.body
    const userID = UsersAtStart[0].id

    const user = initialUsers[0]
    const loginResponse = await api
      .post('/api/login')
      .send({ username: user.username, password:  user.password })  
  
    const blog = {
        title: "title 3",
        author: "author 3",
        url: "url 3",
        likes: 789,
      }
  
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const responseBlogs = await api.get('/api/blogs')
    const blogs = responseBlogs.body
  
    assert.deepStrictEqual(blogs.length, initialBlogs.length + 1)
    assert.deepStrictEqual({...blog, id: "irrelevant", user: userID}, {...blogs[2], id: "irrelevant", user: userID})
  })
  
  test('POST: likes defaults to 0', async () => {
    const user = initialUsers[0]
    const loginResponse = await api
      .post('/api/login')
      .send({ username: user.username, password:  user.password })  
  
    const blog = {
      title: "title 4",
      author: "author 4",
      url: "url 4",
    }
  
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const retrievedBlog = response.body.find((blog) => blog.title === "title 4")
  
    assert.strictEqual(retrievedBlog.likes, 0)
  })
  
  test('POST: title missing --> 400', async () => {
    const user = initialUsers[0]
    const loginResponse = await api
      .post('/api/login')
      .send({ username: user.username, password:  user.password })  
  
    const blog = {
      author: "author 4",
      url: "url 4",
      likes: 0
    }
  
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(blog)
      .expect(400)
  })
  
  test('POST: url missing --> 400', async () => {
    const user = initialUsers[0]
    const loginResponse = await api
      .post('/api/login')
      .send({ username: user.username, password:  user.password })    

    const blog = {
      title: "title 4",
      author: "author 4",
      likes: 0
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
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

})

after(async () => {
  await mongoose.connection.close()
})