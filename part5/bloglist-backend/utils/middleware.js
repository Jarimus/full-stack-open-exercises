const logger = require('./logger')
const morgan = require('morgan')
const { getTokenFrom } = require('./jwt')
const jwt = require('jsonwebtoken')

// Error handling
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'username needs to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
 next(error)
}

// Morgan logging
morgan.token('data', (req) => JSON.stringify(req.body))
const morganLogging = morgan(':method :url :status :res[content-length] - :response-time ms :data')

// Unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Token extractor
const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request)
  next()
}

// User extractor
const userExtractor = (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = {
      username: decodedToken.username,
      id: decodedToken.id
    }
  } else {
    response.status(401).send({ error: "token invalid" }).end()
    return
  }
  next()
}

module.exports = { errorHandler, unknownEndpoint, morganLogging, tokenExtractor, userExtractor }