import React, { useState, useEffect } from 'react'
import personService from './services/persons';

// TODO fix styles

// List of people and their numbers in the address book. 
// returns a list of people and their numbers
const Persons = ({persons, filterValue, setPersons, setMessage, setError, personService}) => {
  const filteredNames = persons.filter(person => person.name.toUpperCase().includes(filterValue.toUpperCase()));
  const names = filteredNames.map(person =>
    <li key={person.name}>

        {person.name} {person.number} 

        <Delete 
          personService={personService}
          setMessage={setMessage}
          person={person}
          persons={persons}
          setPersons={setPersons}
          setError={setError}
        />

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

const Notification = (props) => {
  const notifStyle = props.error ? styles.errorNotificationStyles : styles.notificationStyles;
  console.log("error value passed as prop ", props.error)
  if (props.message === null) {
    return null;
  }
  else {
    return (
      <div style={notifStyle}> {props.message} </div>
    )
  }
}

// Delete button next to entries in address book.
// By clicking on delete, removes entry from persons state and from database
const Delete = (props) => {
  const clickHandler = () => {
    const result = window.confirm( "Haluatko varmasti poistaa henkilön luettelosta?" );
    if (result) {
      personService.remove(props.person.id)
      .then(response => {
        const filteredPersons = props.persons.filter(person => person.id !== props.person.id);
        props.setMessage(`${props.person.name} poistettiin onnistuneesti`)
        props.setError(false)
        setTimeout(() => {
          props.setMessage(null)
        }, 5000);
        props.setPersons(filteredPersons);
      })
      .catch(error => {
        props.setMessage(`Henkilö ${props.person.name} oli jo poistettu`)
        setTimeout(() => {
          props.setMessage(null)
        }, 5000)
        props.personService.getAll().then(response => {
          props.setPersons(response.data)
        });
        props.setError(true)
      })
    }
  }
  return (
    <button onClick={() => clickHandler()}>poista</button>
  )
}

// Search functionality. Single input field that calls handeFilterChange to filter values out
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

// Form to add new people to the list
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
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(hook, []) // only fire on first render (empty array as second parameter)

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterValue, setFilter] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ error, setError] = useState(false)
  console.log(error, "initialised as")

  const addName = (event) => {
    event.preventDefault();
    if (persons.some(item => item.name === newName)) {
        const entry = persons.find(person => person.name === newName);
        const id = entry.id;

        if (entry.number === newNumber) {
          setError(true);
          setMessage(`${newName} on jo luettelossa`);
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }

        else {
          const result = window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella?`);

          if (result) {
            const changedEntry = {...entry, number: newNumber}; // important
            personService.edit(id, changedEntry).then(response => {
              setPersons(persons.map(person => person.id !== id ? person : response.data));
              setMessage(`Henkilön ${response.data.name} tiedot muutettiin onnistuneesti`)
              setError(false);
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(error => {
              setMessage(`Henkilö ${changedEntry.name} oli jo poistettu`)
              personService.getAll().then(response => {
                setPersons(response.data)
              });
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setError(true)
            })
          }
        }
    }
    else {
      const newObj = { 
        name: newName,
        number: newNumber,
      };
      personService.create(newObj)
        .then(response => {
          setPersons(persons.concat(response.data));
          setMessage(`Lisättiin ${response.data.name} onnistuneesti `)
          setError(false);
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
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
      <Notification message={message} error={error}/>
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
        setPersons={setPersons}
        setMessage={setMessage}
        setError={setError}
        personService={personService}
      />
    </div>
  )
}

export default App

const styles = {
  notificationStyles: {
    display: 'inline-block',
    padding: '20px',
    border: '1px solid green',
    borderRadius: '20px',
    backgroundColor: '#6161612b',
    marginBottom: '20px',
  },
  errorNotificationStyles: {
    display: 'inline-block',
    padding: '20px',
    border: '1px solid red',
    borderRadius: '20px',
    backgroundColor: '#6161612b',
    marginBottom: '20px',
  }
}