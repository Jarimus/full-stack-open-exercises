const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

// constants
const PORT_BACKEND = process.env.PORT | 3001
const PORT_FRONTEND = 5173

// static site
app.use(express.static('dist'))

// cors
var corsOptions = {
  origin: `http://localhost:${PORT_FRONTEND}`,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// express json
app.use(express.json())

// morgan logging
morgan.token("data", (req, res) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

// Phonebook notes in memory
let notes = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// GET all notes
app.get("/api/persons", (req, res) => {
  res.json(notes)
})

// GET info
app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${notes.length} people</p>
    ${new Date()}`)
})

// GET one note
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note).end()
    return
  }
  res.status(404).json({error: "resource does not exist"}).end()
})

// DELETE: /api/persons/id (delete one)
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const targetNote = notes.find(note => note.id === id)
  if (targetNote) {
    notes = notes.filter( note => note.id !== id)
    res.json(targetNote).end()
    return
  }
  res.status(404).json({error: "resource does not exist"}).end()
})

// POST /api/persons (add entry)
app.post("/api/persons", (req, res) => {
  const reqNote = req.body
  if (reqNote.name === undefined || reqNote.number === undefined) {
    res.status(400).json({ error: "required fields not provided" }).end()
    return
  }
  if (notes.find(note => note.name === reqNote.name)) {
    res.status(400).json({ error: "name already exists in the phonebook" }).end()
    return
  }
  const dbNote = {
    name: reqNote.name,
    number: reqNote.number,
    id: String(Math.floor(Math.random()*100000))
  } 
  notes.push(dbNote)
  res.json(dbNote)
})

app.listen(PORT_BACKEND, () => {
  console.log(`Server running on port ${PORT_BACKEND}`)
})