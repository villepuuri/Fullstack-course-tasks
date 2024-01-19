import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAllNames = () => {
    const request = axios.get(`${baseUrl}api/all`)
    return request.then(response => response.data.map(object => object.name.common))
  }

const getCountryInformation = (countryName) => {
  const request = axios.get(`${baseUrl}api/name/${countryName}`)
  return request.then(response => response.data)
}

export default { 
    getAllNames,
    getCountryInformation
}