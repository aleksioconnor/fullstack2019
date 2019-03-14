import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Persons = ({persons, filterValue}) => {
  const filteredNames = persons.filter(person => person.name.toUpperCase().includes(filterValue.toUpperCase()));
  const names = filteredNames.map(person =>
    <li key={person.name}>
        {person.name} {person.number}
    </li>
  )

  return (
      <div>
        <ul>
          {names}
        </ul>
      </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      <input 
        value={props.filterValue}
        onChange={props.handleFilterChange}
      />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addName}>
        <div>
          nimi: 
          <input 
            value={props.newName}
            onChange={props.handleNameChange} 
          />
        </div>

        <div>
          numero:
            <input 
              value={props.newNumber}
              onChange={props.handleNumberChange}
            />
        </div>

        <div>
          <button type="submit">lisää</button>
        </div>
      </form>
    </div>
  )
}
const App = () => {

  const [ persons, setPersons] = useState([]) 

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(hook, []) // only fire on first render (empty array as second parameter)

  

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterValue, setFilter] = useState('')

  const addName = (event) => {
    event.preventDefault();
    if(persons.some(item => item.name === newName)) {
        alert(`${newName} on jo luettelossa`);
    }
    else {
      const newObj = { 
        name: newName,
        number: newNumber,
      };
      setPersons(persons.concat(newObj));
    }
  }

  const handleNameChange = (event) => {
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Filter 
        handleFilterChange={handleFilterChange}
        filterValue={filterValue}
      />
      <h3>Lisää uusi</h3>
      <PersonForm 
        addName={addName}
        handleNameChange={handleNameChange}
        newName={newName}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} 
      />
      <h3>Numerot</h3>
      <Persons 
        persons={persons}
        filterValue={filterValue}
      />
    </div>
  )
}

export default App