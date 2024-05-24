import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey ="c06a1380797e5ef2ff520750b9e2cc39"; // Accessing API key from environment variable

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.capital}&appid=${apiKey}&units=metric`)
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          setWeather(null); // Reset weather on error

        });
    }
  }, [selectedCountry]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      axios
        .get(`https://restcountries.com/v3.1/name/${searchTerm}`)
        .then(response => {
          setCountries(response.data);
          setSelectedCountry(null);
          setWeather(null);
        })
        .catch(error => {
          console.error('Error fetching country data:', error);
        });
    } else {
      setCountries([]);
      setSelectedCountry(null);
      setWeather(null);
    }
  }, [searchTerm]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setWeather(null); // Reset weather when a new country is selected
  };
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <div>
      <h1>Country Information</h1>
      <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search for a country" />
      <br />

      {countries.length > 0 && countries.length <= 10 && (
        <ul>
          {countries.map(country => (
            <li key={country.name.common}>
              {country.name.common} 
              <button onClick={() => handleCountrySelect(country)}>View Details</button>
            </li>
          ))}
        </ul>
      )}

      {countries.length > 10 && (
        <p>Please specify your search criteria</p>
      )}

      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Population: {selectedCountry.population}</p>
          <p>Languages: {Object.values(selectedCountry.languages).join(', ')}</p>
          <img src={selectedCountry.flags.png} alt={selectedCountry.flags.alt} style={{ width: '100px', height: 'auto' }} />
          {weather && (
            <div>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather Icon" />

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
