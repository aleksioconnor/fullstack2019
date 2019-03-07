import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  const addName = (event) => {
    event.preventDefault();
    const newObj = { name: newName};
    setPersons(persons.concat(newObj));
  }

  const handleNameChange = (event) => {
      setNewName(event.target.value) // event is input field
  }

  const Names = () => {
      const names = persons.map(list =>
          <li key={list.name}>
              {list.name}
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

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <form onSubmit={addName}>
        <div>
          nimi: 
          <input 
            value={newName}
            onChange={handleNameChange} 
          />
        </div>
        <div>
          <button type="submit">lisää</button>
        </div>
      </form>
      <h2>Numerot</h2>
      <Names />
    </div>
  )

}

export default App