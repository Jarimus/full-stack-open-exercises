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

export default PersonForm