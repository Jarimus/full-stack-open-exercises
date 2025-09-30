import Person from "./Person"

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

export default NumberList