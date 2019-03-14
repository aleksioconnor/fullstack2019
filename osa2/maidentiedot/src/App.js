import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Find = (props) => {
  return (
    <div>
      find countries
      <input 
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  )
}

const DetailButton = (props) => {
  const changeSearchParameter = () => {
    props.setSearchValue(props.name);
  }
  return (
    <button onClick={() => changeSearchParameter()}>show</button>
  )
}

const Weather = (props) => {
  console.log(props.weatherData)
  if(props.weatherData.length === 0) { // no data has been loaded yet
    return (
      <h3>loading data</h3>
    )
  }
  else {
    return (
      <div>
        <h1>Weather in {props.capital}</h1>
        <b>temperature:</b> {props.weatherData.current.temp_c} celcius
        <br />
        <img src={props.weatherData.current.condition.icon} alt='weather icon' />
        <br />
        <b>wind:</b> {props.weatherData.current.wind_kph} kph direction {props.weatherData.current.wind_dir}
      </div>
    )
  }
}

const CountryDetails = ({country, setWeatherData, weatherData}) => {
  const languages = country.languages.map(language => <li key={language.iso639_1}>{language.name}</li>);
  const getWeather = () => {
    const queryString = 'https://api.apixu.com/v1/current.json?key=765719e6de0f4e72995103149191403&q=' + country.capital;
    axios
    .get(queryString)
    .then(response => {
      setWeatherData(response.data);
    })
  }
  useEffect(getWeather, [])
  return (
    <div>
      <h1>{country.name}</h1>
      capital {country.capital}
      <br/>
      population {country.population}
      <h3>languages</h3>
      <ul>
        {languages}
      </ul>
      <img src={country.flag} alt='flag' style={{ maxWidth: 400 }}/>
      <Weather capital={country.capital} weatherData={weatherData} />
    </div>
  )
}

const Results = (props) => {
  const filteredCountries = props.countries.filter(country => country.name.toUpperCase().includes(props.searchValue.toUpperCase()));
  if(filteredCountries.length < 10 && filteredCountries.length > 1) {

    const content = filteredCountries.map(country => 
      <li key={country.numericCode}> 
        {country.name}
        <DetailButton name={country.name} setSearchValue={props.setSearchValue}/>
      </li>
    );

    return (
      <div>
        <ul>
          {content}
        </ul>
      </div>
    )
  // If there is only one country in the search list, display it. 
  }
  if (filteredCountries.length === 1) {
    return (
      <CountryDetails 
        country={filteredCountries[0]}
        setWeatherData={props.setWeatherData}
        weatherData={props.weatherData}
      />
    )
  }
  else {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}

const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  const searchValueChange = (event) => {
    event.preventDefault();
    setSearchValue(event.target.value);
  }

  const hook = () => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      })
  }

  useEffect(hook, []);

  return (
    <div>
      <Find 
        value={searchValue}
        onChange={searchValueChange}
      />
      <Results 
        countries={countries}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setWeatherData={setWeatherData}
        weatherData={weatherData}
      />
    </div>
  )
}

export default App;
