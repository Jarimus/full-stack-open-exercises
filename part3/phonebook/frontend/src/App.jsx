import { useEffect, useState } from 'react'
import dbPersons from './services/persons'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'

const Filter = ({filterText, handleFilterInput}) => {
    return(
        <div>
            Filter shown with
            <input
                type="text"
                value={filterText}
                onChange={handleFilterInput}
            />
         </div>
    )
}

const PersonForm = ({addToPhoneBook, newNumber, newName, handleNewNameInput, handleNewNumberInput}) => {
    return (
        <form onSubmit={addToPhoneBook}>
        <div>
            name: <input type="text" value={newName} onChange={handleNewNameInput} />
        </div>
        <div>
            number: <input type="tel" value={newNumber} onChange={handleNewNumberInput} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
        </form>
    )
}

const NumberList = ({persons, filterText, handleDeletePerson}) => {
  if (persons) {
    return (
        <>
            {persons.map(person => {
                const re = new RegExp(filterText, "i")
                if (re.test(person.name)) {
                    return <Person key={person.name} person={person} handleDeletePerson={() => handleDeletePerson(person)} />
                }
            })}
        </>
    )
  }
  return null
}

const Person = ({person, handleDeletePerson}) => {
    return (
        <>
            {person.name} {person.number} <button onClick={handleDeletePerson}>delete</button> <br />
        </>
    )
}

const App = () => {

  useEffect(() => {
    dbPersons
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNewNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNewNumberInput = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilterText(event.target.value)
  }
  // Handler for deleting a person resource
  const handleDeletePerson = (targetPerson) => {
    if (window.confirm(`Delete ${targetPerson.name}?`)) {
      dbPersons
      .deletePerson(targetPerson.id)
      .then( deletedPerson => {
        setNotification(`${deletedPerson.name} deleted.`)
      })
      .catch((error) => {
        console.error("Resource no longer exists in database.")
        setErrorMessage("Person already removed from database.")
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
      })
      setPersons(persons.filter(person => person.id != targetPerson.id))
    }
  }
  // Handler for adding a person to db
  const addToPhoneBook = (event) => {
    event.preventDefault()
    if (newName == "" || newNumber == "")  {
      alert(`Please fill all fields.`)
      return
    }
    if (persons.find(person => person.number == newNumber)) {
      alert(`${newNumber} is already in use.`)
      return
    }
    const targetPerson = persons.find(person => person.name.toLowerCase() == newName.toLowerCase())
    if (targetPerson) {
        if (window.confirm(`${newName} is already in the phonebook. Update the phone number?`)) {
          dbPersons
            .put(targetPerson.id, {name: targetPerson.name, number: newNumber})
            .then(updatedEntry => {
              setPersons(persons.map(person => person.id == targetPerson.id ? updatedEntry : person))
              setNotification(`Number for ${updatedEntry.name} updated.`)
              setTimeout(() => {
                setNotification(null)
              }, 10000)
              setNewName("")
              setNewNumber("")
            })
            .catch((error) => {
              console.error(error.response.data.error)
              setErrorMessage(error.response.data.error)
              setTimeout(() => {
                setErrorMessage(null)
              }, 10000);
            })
        }
        return
    }
    const newPerson = { name: newName, number: newNumber }
    dbPersons.create(newPerson)
      .then(newEntry => {
        setPersons(persons.concat(newEntry))
        setNotification(`Added ${newPerson.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 10000)
      setNewName("")
      setNewNumber("")
      })
      .catch((error) => {
        console.error(error.response.data.error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000);
      })
  }

  return (
    <div>
        <h2>Phonebook</h2>
        <Notification notification={notification} />
        <ErrorNotification message={errorMessage} />

        <Filter filterText={filterText} handleFilterInput={handleFilterInput} />

        <h3>add a new entry</h3>

        <PersonForm
            addToPhoneBook={addToPhoneBook}
            newName={newName}
            newNumber={newNumber}
            handleNewNameInput={handleNewNameInput}
            handleNewNumberInput={handleNewNumberInput}
        />

        <h3>Numbers</h3>

        <NumberList persons={persons} filterText={filterText} handleDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App