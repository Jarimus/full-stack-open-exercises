const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())

// morgan logging
morgan.token("data", (req, res) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

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
    id: Math.floor(Math.random()*100000)
  } 
  notes.push(dbNote)
  res.json(dbNote)
})

// Error (404) for POST: name of number missing, and name already exists

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running: ${"http://localhost:"+PORT+"/"}`)
})