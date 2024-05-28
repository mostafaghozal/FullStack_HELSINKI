const http = require('http')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

module.exports = mongoose.model('PhonebookEntry', phonebookEntrySchema);



mongoose.connect('mongodb+srv://ghozal:ghozal@cluster0.7oykssj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



const app = express()
app.use(express.static('dist'))
const bodyParser = require('body-parser'); // Import body-parser module
var morgan = require('morgan')
morgan.token('req-body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return '-';
  }
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  app.get('/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (req, res) => {
    const requestTime = new Date();
    const phonebookEntries = persons.length;
  
    const responseText = `
    <p>Phonebook has info for  ${phonebookEntries} people</p>

      <p>${requestTime}</p>
    `;
  
    res.send(responseText);
  });
  
  app.get('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(note => note.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      })


 
      const generateId = () => {
        const maxId = persons.length > 0
          ? Math.max(...persons.map(n => n.id))
          : 0
        return maxId + 1
      }
      
      app.post('/persons', (request, response) => {
        const body = request.body

        if (!body.name || !body.number) {
          return response.status(400).json({ 
            error: ' Name or number missing' 
          });
        }
        const nameExists = persons.some(person => person.name === body.name);
        if (nameExists) {
          return response.status(400).json({ 
            error: 'Name already exists in the phonebook' 
          });
        }
      
        const person = {
          name: body.name,
          number: body.number,
          id: generateId(),
        }
      
        persons = persons.concat(person)
      
        response.json(person)
      });

  app.delete('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

