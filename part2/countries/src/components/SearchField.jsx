const SearchField = ({ onChangeSearch, searchTerm }) => {
  return (
    <div>
      Find countries
      <input 
        type='text'
        value={searchTerm}
        onChange={onChangeSearch}
      />
    </div>
  )
}

export default SearchField