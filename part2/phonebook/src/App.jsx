import { useEffect, useState } from 'react'
import axios from 'axios'

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

const NumberList = ({persons, filterText}) => {
    return (
        <>
            {persons.map(person => {
                const re = new RegExp(filterText, "i")
                if (re.test(person.name)) {
                    return <Person key={person.name} person={person} />
                }
            })}
        </>
    )
}

const Person = ({person}) => {
    return (
        <>
            {person.name} {person.number}<br />
        </>
    )
}

const App = () => {

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((res) => {
        setPersons(res.data)
      })
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  const handleNewNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNewNumberInput = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilterText(event.target.value)
  }
  const addToPhoneBook = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name.toLowerCase() == newName.toLowerCase())) {
        alert(`${newName} is already added to the phonebook.`)
        return
    }
    if (persons.find(person => person.number == newNumber)) {
        alert(`${newNumber} is already in use.`)
        return
    }
    if (newName == "" || newNumber == "")  {
        alert(`Please fill all fields.`)
        return
    }
    if (newNumber.match(/^[\d-\s]+$/g) === null) {
        alert(`${newNumber} is not a valid number.`)
        return
    }
    const newNameList = persons.concat( {name: newName, number: newNumber})
    setPersons(newNameList)
    setNewName("")
    setNewNumber("")
  }

  return (
    <div>
        <h2>Phonebook</h2>

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

        <NumberList persons={persons} filterText={filterText} />
    </div>
  )
}

export default App