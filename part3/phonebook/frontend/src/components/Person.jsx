const Person = ({person, handleDeletePerson}) => {
    return (
        <>
            {person.name} {person.number} <button onClick={handleDeletePerson}>delete</button> <br />
        </>
    )
}

export default Person