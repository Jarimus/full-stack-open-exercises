import axios from "axios"

const ResultField = ({ weatherData, setWeatherData, filteredCountries, setFilteredCountries }) => {
  // First make sure the filtered array is ready
  if (!filteredCountries) {
    return null
  }
  // If there are too many or no results, display a message instead of results
  if (filteredCountries.length === 0) {
    return <div>No matches</div>
  }
  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  // For one match, display full information
  if (filteredCountries.length === 1) {
    const c = filteredCountries[0]
    const languages = Object.entries(c.languages)
    const flagStyle = {
      maxWidth: 300,
      border: '1px solid black',
    }
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER}&q=${c.capital[0]}&aqi=no`
    axios.get(apiUrl).then(res => setWeatherData(res.data))
    return (
      <>
        <h1>{c.name.common}</h1>
        <p>
          Capital: {c.capital[0]}<br />
          Area: {c.area} km<sup>2</sup>
        </p>
        <h2>Languages</h2>
        <ul>
          {languages.map(([code, name]) => <li key={code}>{name}</li>)}
        </ul>
        <img src={c.flags.svg} alt={c.flags.alt} style={flagStyle} />
        <WeatherInfo weatherData={weatherData} />        
      </>
    )
  }
  // For multiple matches up to 10, display only the name of the country
  // and a button to show full info of the chosen country
  return (
      <div>
        {filteredCountries.map(country =>
          <div key={country.name.common}>
            {country.name.common} <button onClick={() => setFilteredCountries([country])}>Show</button>
          </div>)}
      </div>
    )
}

const WeatherInfo = ({ weatherData }) => {
  if (weatherData) {
    return (
      <div>
        <h2>Weather in {weatherData.location.name}</h2>
        <div>Temperature {weatherData.current.temp_c} Celsius</div>
        <img src={weatherData.current.condition.icon} />
        <div>Wind {(weatherData.current.wind_kph / 3.6).toFixed(1)} m/s</div>
      </div>
    )
  }
  return null
}

export default ResultField