import { useState, useEffect } from 'react'
import axios from 'axios'
import personServices from './services/persons'


const Filter = ({ handleFilterChange, newFilter }) => <div>
  filter shown with <input onChange={handleFilterChange} value={newFilter} />
</div>

const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange }) => {
  return < div >
    <div>
      name: <input onChange={handleNameChange} value={newName} />
    </div>
    <div>
      number: <input onChange={handleNumberChange} value={newNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </div >
}


const Persons = ({ filteredPersons, updatePage, setInfoMessage }) => {

  const handleDeleteClick = (id) => {
    console.log('Delete click', id)
    const personToDelte = filteredPersons.find(person => person.id === id)
    if (confirm(`Delete ${personToDelte.name}`)) {
      personServices
        .deletePerson(id)
        .then(response => {
          console.log(response)
          updatePage()

          setInfoMessage(
            `Deleted ${personToDelte.name}`
          )
          setTimeout(() => {
            setInfoMessage(null)
          }, 3500)
        })
    }
  }
  return <div>
    {
      filteredPersons.map(person =>
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDeleteClick(person.id)}>delete</button>
        </div>
      )
    }
  </div>
}


const InfoNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="info">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filteredPersons, setNewFilteredPersons] = useState([...persons])
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personServices
      .getAll()
      .then(newPersons => {
        setPersons(newPersons)
        setNewFilteredPersons(newPersons)
        updateFilteredPersons(newPersons, '')
      })
  }, [])


  const addName = (event) => {
    event.preventDefault()

    console.log('Adding a new name')

    // Check if name already exists in the list
    let name_exists = false
    persons.forEach(person => {
      if (newName === person.name) {
        name_exists = true
      }
    })

    if (name_exists) {
      const person = persons.find(p => p.name === newName)
      let replaceNumber = true

      if (person.number !== '') {
        replaceNumber = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      }
      if (replaceNumber) {

        const newPerson = { ...person, number: newNumber }
        personServices
          .update(newPerson)
          .then((response) => {
            if (response.status !== 404) {
              const newList = persons.map(p => p.name !== newName ? p : newPerson)
              setNewName('')
              setNewNumber('')
              setPersons(newList)
              updateFilteredPersons(newList, newFilter)

              setInfoMessage(
                `Changed number for ${newPerson.name}`
              )
              setTimeout(() => {
                setInfoMessage(null)
              }, 3500)
            }
          })
          .catch(error => {
            // Update the persons from the server
            personServices
              .getAll()
              .then(newPersons => {
                setPersons(newPersons)
                setNewFilteredPersons(newPersons)
                updateFilteredPersons(newPersons, '')
                setNewName('')
                setNewNumber('')
              })

            const message = error.response.data.error
            console.log("Error catched: ", message)
            setErrorMessage(message)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3500)
          })
      }

    }
    else {
      console.log('Name doesnt exist yet')
      const newObject = {
        name: newName,
        number: newNumber
      }
      console.log('Adding new object: ', newObject)
      personServices
        .create(newObject)
        .then(newResponse => {
          const newList = persons.concat(newResponse)
          setPersons(newList)
          setNewName('')
          setNewNumber('')
          updateFilteredPersons(newList, newFilter)

          setInfoMessage(
            `Added ${newObject.name}`
          )
          setTimeout(() => {
            setInfoMessage(null)
          }, 3500)
        }
        )
        .catch(error => {
          console.log('ERRORMessage: ', error.response.data)
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 3500)
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)


  const handleFilterChange = (event) => {
    const eventFilter = event.target.value
    setNewFilter(eventFilter)
    updateFilteredPersons(persons, eventFilter)
  }

  const updateFilteredPersons = (newPersons, filter) => {
    let filterValue = filter.toLowerCase()
    if (filterValue === '') {
      setNewFilteredPersons(newPersons)
    }
    else {
      const filteredList = []
      console.log('Persons in update filter list: ', newPersons)
      console.log('Filter used: ', filterValue)
      newPersons.forEach(person => {
        if (person.name.toLowerCase().includes(filterValue)) {
          console.log('Found a match: ', person.name)
          filteredList.push(person)
        }
      })
      console.log(filteredList)
      setNewFilteredPersons(filteredList)
    }
  }

  const updatePage = () => {
    personServices
      .getAll()
      .then(newPersons => {
        setPersons(newPersons)
        setNewFilteredPersons(newPersons)
        updateFilteredPersons(newPersons, '')
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <InfoNotification message={infoMessage} />
      <ErrorNotification message={errorMessage} />
      <form onSubmit={addName}>

        <Filter handleFilterChange={handleFilterChange} newFilter={newFilter} />

        <h3>Add a new</h3>
        <PersonForm
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}
        />

      </form>

      <h3>Numbers</h3>

      <Persons filteredPersons={filteredPersons} updatePage={updatePage} setInfoMessage={setInfoMessage} />

    </div>
  )

}

export default App