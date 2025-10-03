const bcrypt = require('bcryptjs')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const assert = require('node:assert')

const api = supertest(app)

describe('users: one initial user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const hashedPassword = await bcrypt.hash('password123', 10)
    const newUser = new User({
      username: "junior programmer",
      name: "Jack Slowfingers",
      password: hashedPassword
    })
    await newUser.save()
  })

  test('POST: new valid user', async () => {
    const initialUsers = (await api.get('/api/users')).body

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

    const finalUsers = (await api.get('/api/users')).body
    assert.strictEqual(finalUsers.length, initialUsers.length + 1)

    const usernames = finalUsers.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('users: empty database', () => {
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