import "./App.css"
import { useState, useEffect, useCallback } from "react"
import searchIcon from "./assets/searchIcon.png"
import weatherIcon from "./assets/weatherIcon.png"
import windIcon from "./assets/foggyIcon.png"
import humidityIcon from "./assets/graphIcon.png"
import PropTypes from "prop-types";


const WeatherDetails = ({icon, temp, city, country, lat, lon, humidity, wind}) =>{
  return(
    <>
      <div className="image">
        <img src={icon} alt="Image"/>
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude </span>
          <span>{lat}</span>
        </div>
        
        <div>
          <span className="lon">longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon"/>
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        
        <div className="element">
          <img src={windIcon} alt="wind" className="icon"/>
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
          </div>
        </div>
    </>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
};

function App() {

  let api_key = "0954b08afff25ccc49de0a1a4609f507";
  const [text, setText] = useState("Coimbatore");

  const [icon, setIcon] = useState(weatherIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async() => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();

      if(data.cod === "404"){
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      if(data.cod !== 200){
        setError(`API error: ${data.message}`);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setIcon(`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
      setCityNotFound(false);

    }catch(error){
      console.error("An error occurred:",error.message);
      setError("Failed to fetch weather data. Please try again later.");
    }finally{
      setLoading(false);
    }
}, [text, api_key]);

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) =>{
    if(e.key == "Enter"){
      search();
    }
  };

  useEffect(function () {
    search();
  },[search]);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="cityInput" placeholder="Search City" onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="Search Icon"/>
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind} />}

        {loading && <div className="loading-message">Loading.....</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        <p className="copyright">
          Designed by <span>Logananthu</span>
        </p>
      </div>

    </>
  )
}

export default App
