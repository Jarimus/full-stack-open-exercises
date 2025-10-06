const bcrypt = require('bcryptjs')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
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

const initialUsers = [
  {
    username: "username 1",
    user: "user 1",
    password: "password 1",
  }
]

describe('users: one initial user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const userObject = new User(initialUsers[0])
    await userObject.save()
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

  test('POST: new valid user', async () => {
    const UsersAtStart = (await api.get('/api/users')).body

    const newUser = {
      username: "senior programmer",
      name: "Brian Fastfingers",
      password: 'g00dp4ssw0rdm4ybe'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const UsersAtEnd = (await api.get('/api/users')).body
    assert.strictEqual(UsersAtEnd.length, UsersAtStart.length + 1)

    const usernames = UsersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('users: empty database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
  })
  test('POST: username too short', async () => {
    const initialUsers = (await api.get('/api/users')).body
  
    const newUser = {
      username: "ja",
      name: "jarno",
      password: "sufficientlyLong"
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  
    const finalUsers = (await api.get('/api/users')).body
  
    assert.deepStrictEqual(initialUsers, finalUsers)
  })
  
  test('POST: password too short', async () => {
    const initialUsers = (await api.get('/api/users')).body
  
    const newUser = {
      username: "jarno",
      name: "jarno",
      password: "no"
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const finalUsers = (await api.get('/api/users')).body
  
    assert.deepStrictEqual(initialUsers, finalUsers)
  })
})




after(async () => {
  await mongoose.connection.close()
})