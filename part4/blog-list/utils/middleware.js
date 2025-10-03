const logger = require('./logger')
const morgan = require('morgan')

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

 next(error)
}

morgan.token('data', (req) => JSON.stringify(req.body))
const morganLogging = morgan(':method :url :status :res[content-length] - :response-time ms :data')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint, morganLogging }