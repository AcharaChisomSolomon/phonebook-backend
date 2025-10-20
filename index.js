const express = require('express')
const app = express()

app.use(express.json())

let persons = [
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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toUTCString()}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const hasPerson = persons.some(person => person.id === id)

  if (!hasPerson) {
    response.status(404).json({ message: `person with id ${id} not found!`})
  }

  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const requestedPerson = request.body
  let errorMessage = null

  if (!requestedPerson.name) {
    errorMessage = "name is missing"
  }
  if (!requestedPerson.number) {
    errorMessage = "number is missing"
  }
  if (requestedPerson.name && persons.some(p => p.name.toLowerCase() === requestedPerson.name.toLowerCase())) {
    errorMessage = "name must be unique"
  }
  
  if (errorMessage) {
    response.status(404).json({ error: errorMessage })
    return
  }

  const newPerson = {
    id: String(Math.floor(Math.random() * 1000000000)),
    name: requestedPerson.name,
    number: requestedPerson.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
})