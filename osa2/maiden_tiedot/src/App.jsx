import { useState, useEffect } from 'react'
import countryService from "./services/countries"
import weatherService from "./services/weather"

const basicDisplayText = "Too many matches, specify another filter"


const CountryInformation = ({ countryInfo }) => {

  if (countryInfo.name === '') {
    return
  }

  return <div>
    <h1>{countryInfo.name}</h1>
    <p>capital {countryInfo.capital}</p>
    <p>area {countryInfo.area}</p>

    <h3>languages:</h3>
    {
      countryInfo.languages.map(language =>
        <li key={language}>
          {language}
        </li>
      )
    }

    <img src={countryInfo.imageURL} />

    <h2>Weather in {countryInfo.capital}</h2>
    <p>temperature {countryInfo.capitalTemperature} Celsius</p>
    <img src={weatherService.getWeatherIconURL(countryInfo.capitalWeatherCode)}/>
    <p>wind {countryInfo.capitalWindSpeed} m/s</p>
  </div>
}

const App = () => {
  const [allCountryNames, setAllCountryNames] = useState([])
  const [foundCountries, setFoundCountries] = useState([])
  const [countryInfo, setCountryInfo] = useState({
    name: '',
  })

  useEffect(() => {
    countryService
      .getAllNames()
      .then(allNames => {
        setAllCountryNames(allNames)
      })
  }, [])

  const handleSearchChange = (event) => {
    const filterValue = event.target.value

    const filteredCountries = []
    allCountryNames.forEach(name => {
      if (name.toLowerCase().includes(filterValue.toLowerCase())) {
        // console.log('Found a country: ', name)
        filteredCountries.push(name)
      }
    })
    console.log('Found countries: ', filteredCountries.length)
    if (filterValue === '') {
      setFoundCountries(['Set a filter to find a country'])
      resetCountryInfo()
    }
    else if (filteredCountries.length < 1) {
      setFoundCountries(['No countries found with the filter'])
      resetCountryInfo()
    }
    else if (filteredCountries.length === 1) {
      console.log('Display country', filteredCountries[0])
      setFoundCountries([])
      updateCountryInfo(filteredCountries[0])
    }
    else if (filteredCountries.length < 10) {
      console.log("Less than 10 countries found")
      setFoundCountries(filteredCountries)
      resetCountryInfo()
    }
    else {
      console.log('Else')
      setFoundCountries([basicDisplayText])
      resetCountryInfo()
    }
  }

  const resetCountryInfo = () => {
    setCountryInfo({
      name: '',
    })
  }

  const updateCountryInfo = name => {
    countryService
      .getCountryInformation(name)
      .then(response => {
        weatherService
          .getWeatherData(response.capitalInfo.latlng)
          .then(weatherResponse => {

            setCountryInfo({
              name: name,
              capital: response.capital[0],
              area: response.area,
              languages: Object.values(response.languages),
              imageURL: response.flags.png,
              capitalTemperature: weatherResponse.current.temp - 273.15,
              capitalWindSpeed: weatherResponse.current.wind_speed,
              capitalWeatherCode: weatherResponse.current.weather[0].icon
            })

          })


      })
  }

  const handleShowCountryClick = (countryName) => {
    console.log('Clicked ', countryName)
    updateCountryInfo(countryName)
  }


  return (
    <div>
      <form>
        find countries<input onChange={handleSearchChange} />

      </form>

      {
        foundCountries.map(country => {
          if (foundCountries.length > 1) {
            return <ul key={country}>
              {country}
              <button onClick={() => handleShowCountryClick(country)}>show</button>
            </ul>
          }
          else {
            return <ul key={country}>
              {country}
            </ul>
          }
        }

        )
      }

      <CountryInformation countryInfo={countryInfo} />


    </div>
  )
}

export default App
