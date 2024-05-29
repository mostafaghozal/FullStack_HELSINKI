const http = require('http')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const mongoose = require('mongoose')
const db = require('./db');
const PhonebookEntry = require('./phonebookEntry');



/// not sure of mongo code yet



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


  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  app.get('/persons', async (request, response) => {
    try {
      const persons = await PhonebookEntry.find({});
      response.json(persons);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/info', async (req, res) => {
    try {
      const phonebookEntries = await PhonebookEntry.countDocuments({});
      const requestTime = new Date();
  
      const responseText = `
        <p>Phonebook has info for ${phonebookEntries} people</p>
        <p>${requestTime}</p>
      `;
    
      res.send(responseText);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
    
  app.get('/persons/:id', async (request, response) => {
    const id = request.params.id;
    
    try {
      const person = await PhonebookEntry.findById(id);
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/persons', async (request, response) => {
    const body = request.body;
  
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'Name or number missing' });
    }
  
    try {
      const nameExists = await PhonebookEntry.exists({ name: body.name });
      if (nameExists) {
        return response.status(400).json({ error: 'Name already exists in the phonebook' });
      }
  
      const newPerson = new PhonebookEntry({
        name: body.name,
        number: body.number,
      });
  
      const savedPerson = await newPerson.save();
      response.json(savedPerson);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.delete('/persons/:id', async (request, response) => {
    const id = request.params.id;
    
    try {
      await PhonebookEntry.findByIdAndDelete(id);
      response.status(204).end();
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });