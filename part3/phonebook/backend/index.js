require('dotenv').config()
const cors = require('cors')
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')

const app = express()

// cors
app.use(cors())

// frontend
app.use(express.static('dist'))

// express json
app.use(express.json())

// morgan logging
morgan.token('data', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

// GET: /api/persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// GET: /info
app.get('/info', (req, res) => {
  Person.find({}).then( persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`)
  })
})

// GET: /api/persons/id
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person
    .findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send({ error: 'resource does not exist' })
      }
    })
    .catch(error => next(error))
})

// DELETE: /api/persons/id
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(person => res.status(204).json(person).end())
    .catch(error => next(error))
})

// POST: /api/persons
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then( savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

// PUT: /api/persons/{id}
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person
    .findById(req.params.id)
    .then(person => {
      if (!person) {
        res.status(404).send({ error: 'resource does not exist' }).end()
        return
      }
      [person.name, person.number] = [name, number]
      return person.save()
        .then( savedPerson => {
          res.json(savedPerson)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

// Handling unknown endpoints
const unknownEnpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEnpoint)

// Error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

// Start listening for traffic
const PORT = process.env.PORT | 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})