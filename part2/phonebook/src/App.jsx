import { useEffect, useState } from 'react'
import dbPersons from './services/persons'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import NumberList from './components/NumberList'

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
  const handleDeletePerson = (targetPerson) => {
    if (window.confirm(`Delete ${targetPerson.name}?`)) {
      dbPersons
      .deletePerson(targetPerson.id)
      .then( deletedPerson => setPersons(persons.filter(person => person.id != deletedPerson.id)))
      .catch(() => {
        setErrorMessage(`Information of ${targetPerson.name} has already been removed from the server.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000);
        setPersons(persons.filter(person => person.id != targetPerson.id))
      })
    }
  }
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
    if (newNumber.match(/^[\d-\s]+$/g) === null) {
      alert(`${newNumber} is not a valid number.`)
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
              }, 3000)
            })
            .catch(() => {
              setErrorMessage(`Information of ${targetPerson.name} has already been removed from the server.`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 3000);
              setPersons(persons.filter(person => person.id != targetPerson.id))
            })
          setNewName("")
          setNewNumber("")
        }
        return
    }
    const newPerson = { name: newName, number: newNumber }
    dbPersons.create(newPerson)
      .then(newEntry => setPersons(persons.concat(newEntry)))
    setNotification(`Added ${newPerson.name}`)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
    setNewName("")
    setNewNumber("")
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