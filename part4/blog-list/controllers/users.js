const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')


// GET: all
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0 } )
  response.json(users).end()
})

// POST
usersRouter.post('/', async (request, response) => {
  const body = request.body

  // Password needs to be 3 or longer
  if (body.password.length < 3) {
    response.status(400).send({ error: 'password too short (min 3)'}).end()
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(body.password, 10)

  const user = new User({
    username: body.username,
    name: body.name,
    password: hashedPassword
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter