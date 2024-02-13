import React, { Component } from "react";
import "../Styles/Weather.css";
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

class Weather extends Component {
  state = {
    temperature: undefined,
    city: this.props.city,
    country: this.props.country,
    humidity: undefined,
    description: undefined
  };
  getWeather = async () => {
    let city = this.state.city;
    let country = this.state.country;
    const api_call = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=imperial`
    );
    const data = await api_call.json();
    if (data === undefined) {
      return window.location();
    }
    this.setState({
      temperature: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description
    });
  };
  componentDidMount() {
    this.getWeather();
  }
  convertCase(string) {
    return string.replace(/(^\w|\s\w)/g, m => m.toUpperCase())
  }
  render() {
    return (
      <div className="weather-wrapper">
        <h1 className="weather-title">
          {" "}
          {this.convertCase(this.state.city)}, {this.convertCase(this.state.country)}{" "}
        </h1>
        <div className="weather-info">
          <p>
            <strong>Temperature:</strong> {this.state.temperature} ℉{" "}
          </p>
          <p>
            <strong>Humidity:</strong> {this.state.humidity}%{" "}
          </p>
          <p>
            <strong>Description:</strong> {this.state.description}{" "}
          </p>
        </div>
      </div>
    );
  }
}

export default Weather;
