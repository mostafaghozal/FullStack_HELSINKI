/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import personService from './PersonService';

const Persons = ({filteredPersons, setPersons}) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletePerson(id)
        .then(() => {
          setPersons(filteredPersons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.log(error)
        });
    }
  };
    return(
<ul>
{filteredPersons.map((person, index) => (
  <li key={index}>{person.name} {person.number}
  <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>

  </li>
))}
</ul>
);
};
export default Persons;