import React, { Component } from "react";
import { Link } from "react-router-dom";
import countries from "../countries.json"
import Select from "react-select";
import "../Styles/Landing.css";
import { A } from "react-html-email";

class LandingPage extends Component {
  state = {
    city: "",
    country: "",
    error: ""
  };

  handleChange = (value, attribute) => {
    this.setState({[attribute]: value})};

  render() {
    console.log(this.state)
    const countryOptions = Object.entries(countries).map((country) => {return {value: country[0], label: country[0]}})
    return (
      <div className='container'>
        <div className="landingStart">
          <div className="landingStart2">
            <h1>My Travel Guide</h1>
            <div>
            <form style={{
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center'
              }}>
              <label>Where do you want to go?</label>
              <Select
              className="airlineInput"
              name="country"
              onChange={(selectedOption) => {
                this.handleChange(selectedOption?.value ? selectedOption?.value  : '', 'country')
              }}
              value={this.state.country ? {value: this.state.country, label: this.state.country} : null}
              getOptionValue={options => options.value}
              placeholder="Destination Country"
              options={countryOptions}
              isClearable
              formatOptionLabel={options => (
                <>
                  <span className="code">{options.label}</span>
                </>
              )}
            />
              <input
              style={{
                width: '32.6vw', 
                color: 'hsl(0,0%,20%)',
                border: 'none', 
                fontSize: '20px', 
                height: '36px', 
                padding: '2px 11px',
                borderRadius: '4px',
                margin: '20px 0',
              }}
                onChange={(event) => {
                  if (!this.state.country) {
                    return this.handleChange('', 'city');
                  }
                  this.handleChange(event.target.value, 'city')
                }}
                value={this.state.country ? this.state.city : ''}
                disabled={!this.state.country}
                type="text"
                name="city"
                placeholder="Destination City"
              />
              {this.state.country && this.state.country ? (
                <Link to={`/home/${this.state.country}/${this.state.city}`}>
                  <button>Start Your Vacation</button>
                </Link>
              ) : (
                <p>{this.state.error}</p>
              )}
            </form>
            </div>
          </div>
        </div>
        <div className="landingMiddle">
          <div className="midd">
            <h1>Your one-stop-shop for a perfect trip</h1>
          </div>
          <div className="landingMiddle2">
            <div className="landingText first">
              <img src={require("../Images/gps.png")} alt="gps" />
              <p>
                Fully customizable multi-destination trip planner with popular
                itineraries to help you get started
              </p>
            </div>
            <div className="landingText">
              <img src={require("../Images/hotel.png")} alt="hotel" />
              <p>
                Hotel search with an extensive price comparison. The prices
                shown come from numerous hotels and booking websites
              </p>
            </div>
            <div className="landingText">
              <img src={require("../Images/plane.png")} alt="plane" />
              <p>
                The best flight deals near you to all the best vacation
                destinations
              </p>
            </div>
            <div className="landingText">
              <img
                src="https://cdn.onlinewebfonts.com/svg/img_120584.png"
                alt="vip"
              />
              <p>
                Finding cool local hangouts and events as an undercover tourist
                can be difficult, right? No worries, let us take care of it!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
