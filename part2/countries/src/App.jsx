import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchField from './components/SearchField'
import ResultField from './components/ResultField'

function App() {

  const [searchTerm, setSearchTerm] = useState("")
  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  const apiUrl = "https://studies.cs.helsinki.fi/restcountries/api/all"

  useEffect(() => {
    axios.get(apiUrl).then(response => {
      setCountries(response.data)
    })
  }, [])

  useEffect(() => {
    if (countries) {
      setFilteredCountries(countries.filter( country => {
        const re = new RegExp(searchTerm, "i")
        return re.test(country.name.common)
      }))
    }
  }, [searchTerm])

  const onChangeSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <>
      <SearchField
        searchTerm={searchTerm}
        onChangeSearch={onChangeSearch} />
      <ResultField
        filteredCountries={filteredCountries}
        setFilteredCountries={setFilteredCountries}
        weatherData={weatherData}
        setWeatherData={setWeatherData}
      />
    </>
  )
}

export default App
