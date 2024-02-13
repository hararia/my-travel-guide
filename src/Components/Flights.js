import React, { Component } from "react";
import axios from "axios";
import "../Styles/Flights.css";
import { Link } from "react-router-dom";
import Itinerary from "./Itinerary";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import airports from "../airports.json";
import SyncLoader from "react-spinners/SyncLoader";

class Flights extends Component {
  state = {
    destCountry: this.props.match.params.country,
    destCity: this.props.match.params.city,
    flights: [],
    carriers: [],
    showTable: false,
    showSrtBtns: false,
    departDate: new Date(),
    fromAirport: "",
    selectedOption: "",
    loading: false
  };

  formatDate = date => {  
    let returnDate = "";
    date = date.toString();

    returnDate += date.slice(11, 15) + "-";

    let month = date.slice(4, 7);

    if (month === "Jan") returnDate += "01-";
    if (month === "Feb") returnDate += "02-";
    if (month === "Mar") returnDate += "03-";
    if (month === "Apr") returnDate += "04-";
    if (month === "May") returnDate += "05-";
    if (month === "Jun") returnDate += "06-";
    if (month === "Jul") returnDate += "07-";
    if (month === "Aug") returnDate += "08-";
    if (month === "Sep") returnDate += "09-";
    if (month === "Oct") returnDate += "10-";
    if (month === "Nov") returnDate += "11-";
    if (month === "Dec") returnDate += "12-";

    returnDate += date.slice(8, 10);

    return returnDate;
  };

  // give user ability to choose which specific airport they depart from
  // for example inputting new york will give 7 different palces
  // from which i must select the apparoiate "##-sky" code
  // first API call gets destinations ID and the second gets flight based on the two IDs
  getFlightInfo = e => {
    e.preventDefault();
    //dont need destCountry becasue API treats it as market
    if(this.state.fromAirport===''){
      return alert('Enter a departure airport')
    }
    this.setState({
      loading:true
    })
    axios({
      method: "GET",
      url: `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations`,
      headers: {
        "content-type": "application/octet-stream",
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
      },
      params: {
        name: this.state.destCity
      }
    })
      .then(response => {
        const cityCode = response.data[0].id;
        axios({
          method: "GET",
          url: 'https://priceline-com-provider.p.rapidapi.com/v1/flights/search',
          headers: {
            "content-type": "application/octet-stream",
            "x-rapidapi-host":
              "priceline-com-provider.p.rapidapi.com",
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          },
          params: {
            location_arrival: cityCode,
            date_departure: this.formatDate(this.state.departDate),
            class_type: 'ECO',
            location_departure: this.state.fromAirport,
            itinerary_type: 'ONE_WAY',
            sort_order: 'PRICE',
          },
        })
          .then(response => {
            this.setState({
              flights: response.data.data.listings,
              showTable: true,
              showSrtBtns: true,
              loading:false
            });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  determineCarrier(id) {
    for (const elem of this.state.carriers) {
      if (elem.CarrierId === id) return elem.Name;
    }
  }

  determineDirect(d) {
    return d ? "Yes" : "No";
  }

  changeTime(str) {
    let time = str.split(":");
    let hours = Number(time[0]);
    let symbol = "A.M.";
    if (hours > 12) {
      hours -= 12;
      symbol = "P.M.";
    }
    if (hours === 0) hours = 12;

    return "" + hours + ":" + time[1] + " " + symbol;
  }

  printFlights() {
    if (this.state.flights.length === 0) {
      return (
        <tr>
          <td> No flights available from selected airport</td>
        </tr>
      );
    }
    return this.state.flights.map((flight, i) => {
      return (
        <tr key={i}>
          <td>{flight.airlines[0].name}</td>
          <td>${flight.totalPriceWithDecimal.price}</td>
          <td>{new Date(flight.slices[0].segments[0].departInfo.time.dateTime).toISOString().substring(0, 10)}</td>
          <td>{this.changeTime(flight.slices[0].segments[0].departInfo.time.dateTime.slice(11, 16))}</td>
          <td>{flight.slices[0].segments[0].stopQuantity > 0 ? "No" : "Yes"}</td>
          <td>
            <input
              onChange={this.addToItinerary}
              type="checkbox"
              id={flight.id}
              checked={this.props.itinerary.flights.find(
                a => a.id === flight.id
              )}
            />
          </td>
        </tr>
      );
    });
  }

  handleDeparture = date => {
    this.setState({
      departDate: date
    });
  };

  handleChange = selectedOption => {
    if(!selectedOption){
      this.setState({
        fromAirport:''
      })
    }
    if (selectedOption) {
      this.setState({
        fromAirport: selectedOption["IATA code"]
      });
    }
  };

  // itinererary function
  addToItinerary = e => {
    let clickedFlight = this.state.flights.find(f => f.id == e.target.id);
    
    // let carrier = this.determineCarrier(
    //   clickedFlight.OutboundLeg.CarrierIds[0]
    // );
    // clickedFlight.carrier = carrier;

    this.props.setItinerary("flights", clickedFlight);
  };

  sortPrice = () => {
    let flightsCopy = [...this.state.flights];
    flightsCopy.sort((a, b) => {
      if (a.MinPrice > b.MinPrice) return -1;
      else if (a.MinPrice < b.MinPrice) return 1;
      else return 0;
    });
    this.setState({
      flights: flightsCopy
    });
  };

  sortAirline = () => {
    let flightsCopy = [...this.state.flights];
    flightsCopy.sort((a, b) => {
      if (
        this.determineCarrier(a.OutboundLeg.CarrierIds[0]) >
        this.determineCarrier(b.OutboundLeg.CarrierIds[0])
      )
        return 1;
      else if (
        this.determineCarrier(a.OutboundLeg.CarrierIds[0]) <
        this.determineCarrier(b.OutboundLeg.CarrierIds[0])
      )
        return -1;
      else return 0;
    });
    this.setState({
      flights: flightsCopy
    });
  };

  sortDate = () => {
    let flightsCopy = [...this.state.flights];
    flightsCopy.sort((a, b) => {
      if (
        a.OutboundLeg.DepartureDate.slice(0, 10) >
        b.OutboundLeg.DepartureDate.slice(0, 10)
      )
        return 1;
      else if (
        a.OutboundLeg.DepartureDate.slice(0, 10) <
        b.OutboundLeg.DepartureDate.slice(0, 10)
      )
        return -1;
      else return 0;
    });
    this.setState({
      flights: flightsCopy
    });
  };

  hamburgerDrop = () => {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }


  render() {
    const { selectedOption } = this.state.selectedOption;
    return (
      <div>
     <div className="topnav">
     <Link className='active' to={`/home/${this.state.destCountry}/${this.state.destCity}`}>
            My Travel Guide
          </Link>
      <div id="myLinks">

          <Link
            to={`/home/${this.state.destCountry}/${this.state.destCity}/hotels`}
          >
            Hotels
          </Link>

          <Link
            to={`/home/${this.state.destCountry}/${this.state.destCity}/activities`}
          >
            Activities
          </Link>
          <Link to="/">Change Destination</Link>
  </div>
  <button className="icon" onClick={this.hamburgerDrop}>
    <i className="fa fa-bars"></i>
  </button>
</div>
        <div className="nav">
        <Link to="/">Change Destination</Link>

          <Link
            to={`/home/${this.state.destCountry}/${this.state.destCity}/hotels`}
          >
            Hotels
          </Link>

          <Link
            to={`/home/${this.state.destCountry}/${this.state.destCity}/activities`}
          >
            Activities
          </Link>
          <Link to={`/home/${this.state.destCountry}/${this.state.destCity}`}>
            Home
          </Link>
        </div>
        <Itinerary
          setItinerary={this.props.setItinerary}
          itinerary={this.props.itinerary}
          clearItinerary={this.props.clearItinerary}
        />

        <div className="body-container">
          <h1 className="title">Flights</h1>

          <h3 style={{ textAlign: "center" }}>
            When will you depart? Where will you depart from?
          </h3>

          <form className="flights-form" onSubmit={this.getFlightInfo}>
            <Select
              className="airlineInput"
              name="fromAirport"
              onChange={this.handleChange}
              value={selectedOption}
              getOptionValue={options => options["City/Airport"]}
              placeholder="Departure City"
              options={airports["airports"]}
              isClearable
              formatOptionLabel={options => (
                <>
                  <span className="code">{options["IATA code"]}</span>
                  <span>
                    {" "}
                    {options["City/Airport"]}
                    <span className="country"> ({options["Country"]})</span>
                  </span>
                </>
              )}
            />
            <div id="formDate">
              <DatePicker
                className="datePick"
                id="dateP"
                name="departDate"
                selected={this.state.departDate}
                onSelect={this.handleDeparture}
              />
              <button id="buttonF" type="submit" name="submit">
                <img
                  className="mag-img"
                  alt="search"
                  src={require("../Images/magnifier_search_searching_zoom-512.png")}
                ></img>
              </button>
            </div>
            <SyncLoader
        className="spinner"
        color={"#d9a7c7"}
        loading={this.state.loading}
      />
          </form>
          {this.state.showSrtBtns ? (
            <div>
              <button className="sort-btn" onClick={this.sortPrice}>
                Sort by Price
              </button>
              <button className="sort-btn" onClick={this.sortAirline}>
                Sort by Airline
              </button>
              <button className="sort-btn" onClick={this.sortDate}>
                Sort by Date
              </button>
            </div>
          ) : null}
          {this.state.showTable ? (
            <div className="table-wrapper">
              <table className="flight-table">
                <thead>
                  <tr>
                    <th>Airline</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Direct</th>
                    <th>Add</th>
                  </tr>
                </thead>
                <tbody>{this.printFlights()}</tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Flights;
