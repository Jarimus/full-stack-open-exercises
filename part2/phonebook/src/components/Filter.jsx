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

export default Filter