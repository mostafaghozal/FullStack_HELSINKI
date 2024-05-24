import { useState,useEffect  } from 'react'
import axios from 'axios'
import './App.css'; // Import the CSS file

import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import PersonService from './PersonService';

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)



  const hook = () => {
    console.log('effect')
    PersonService.getAll()
      .then(PersonsData  => {
        console.log('promise fulfilled')
        setPersons(PersonsData)
      })
  }
  useEffect(hook, [])
  const handleUpdate = (id, updatedPerson) => {
    PersonService.update(id, updatedPerson)
      .then(response => {
        setPersons(persons.map(person => person.id !== id ? person : response.data));
      })
      .catch(error => {
        // Handle error if any
      });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      PersonService.delete(id)
        .then(() => {
          setPersons(filteredPersons.filter(person => person.id !== id));
        })
        .catch(error => {
          // Handle error if any
        });
    }
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    //validation for phone number , extra point 
    if (/^[0-9-]*$/.test(event.target.value) || event.target.value === '') {
      setNewNumber(event.target.value);
    }
  };
// convert both written search value and person value to lower case so its insenstive
  const handleSearchValue = (event) => {
    setSearchValue(event.target.value.toLowerCase()); 
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
  
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        axios.put(`http://localhost:3001/persons/${existingPerson.id}`, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
            setNewName('');
            setNewNumber('');
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      };
  
      axios.post('http://localhost:3001/persons', newPerson)
        .then(response => {
          setSuccessMessage(
            ` ${newPerson.name} was added to database`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
          setPersons(persons.concat(response.data));

          setNewName('');
          setNewNumber('');
        });
    }
  };
  
  const filteredPersons = persons.filter((person) =>
  person.name.toLowerCase().includes(searchValue)
);

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && <h3 className="success">{successMessage}</h3>}

filter
<Filter searchValue={searchValue} handleSearchValue={handleSearchValue}>
</Filter>

      <h2>add a new</h2>

     <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
<Persons filteredPersons={filteredPersons} setPersons={setPersons} />



    </div>
    
  )

  
}

export default App