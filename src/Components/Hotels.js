import React, { Component } from "react";
import axios from "axios";
import hotels from "./hotels.json";
import { Link } from "react-router-dom";
import "../Styles/Hotels.css";
import SyncLoader from "react-spinners/SyncLoader";
import Itinerary from "./Itinerary";

class Hotels extends Component {
  state = {
    country: this.props.match.params.country,
    city: this.props.match.params.city,
    hotels: [],
    showForm: true,
    loading: false,
    showList: false,
    checkIn: "",
    checkOut: "",
    checkBox: []
  };
  handleChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
    //console.log(this.state.checkIn);
  };
  /*addHotel = e => {
    e.preventDefault();
    console.log(e.target.value);
    let checkBoxCopy = [...this.state.checkBox];
    checkBoxCopy.push(e.target.value);
    this.setState({
      checkBox: checkBoxCopy
    });
    console.log(this.state.checkBox);
  };*/
  addHotel = id => {
    this.props.setItinerary("hotels", id);
    /*let checkBoxCopy = [...this.state.checkBox];
    checkBoxCopy.push(id);
    let hotelsCopy = [...this.state.hotels];
    let i = hotelsCopy.indexOf(id);
    hotelsCopy.splice(i, 1);

    this.setState({
      checkBox: checkBoxCopy,
      hotels: hotelsCopy
    });

    console.log(this.state.checkBox);*/
  };
  refreshPage = () => {
    window.location.reload(false);
  };
  getInfo = e => {
    e.preventDefault();
    axios({
      method: "GET",
      url: "https://hotels4.p.rapidapi.com/locations/search",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "hotels4.p.rapidapi.com",
        "x-rapidapi-key": "520b2c9402mshf46439b682e852dp1733d4jsn81c2c3d744d0",
        useQueryString: true
      },
      params: {
        locale: "en_US",
        query: `${this.state.city} ${this.state.country}`
      }
    })
      .then(response => {
        console.log(response.data);
        this.setState({
          loading: true
        });
        setTimeout(() => {
          axios({
            method: "GET",
            url: "https://hotels4.p.rapidapi.com/properties/list",
            headers: {
              "content-type": "application/octet-stream",
              "x-rapidapi-host": "hotels4.p.rapidapi.com",
              "x-rapidapi-key":
                "520b2c9402mshf46439b682e852dp1733d4jsn81c2c3d744d0",
              useQueryString: true
            },
            params: {
              currency: "USD",
              locale: "en_US",
              sortOrder: "BEST_SELLER",
              destinationId:
                response.data.suggestions[0].entities[0].destinationId,
              pageNumber: "1",
              checkIn: this.state.checkIn,
              checkOut: this.state.checkOut,
              pageSize: "50",
              adults1: "1"
            }
          })
            .then(response2 => {
              console.log(response2);
              this.setState({
                hotels: response2.data.data.body.searchResults.results,
                showList: true,
                showForm: false,
                loading: false
              });

              console.log(this.state.hotels);

              this.showHotels();
            })
            .catch(error2 => {
              console.log(error2);
            });
        }, 3000);
      })
      .catch(error => {
        console.log(error);
      });
  };

  toggleForm = () => {
    this.setState({
      showForm: !this.state.showForm
    });
  };

  showHotels = () => {
    return this.state.hotels.map((hotel, i) => {
      let price = "*";
      if (hotel.ratePlan !== undefined) {
        price = hotel.ratePlan.price.exactCurrent;
        console.log(price);
      }
      return (
        <tr key={i}>
          <td className="table-data">
            {" "}
            {/*<input
              onClick={this.addHotel}
              className="messageCheckbox"
              type="checkbox"
              name="checkBox"
              value={hotel.id}
            />*/}
            {/*<button onClick={() => this.addHotel(hotel)}>Add</button>*/}
            <input
              className="checkBox"
              onChange={() => this.addHotel(hotel)}
              type="checkbox"
            />
          </td>
          <Link
            className="linkHotel"
            to={`/${hotel.name}/${this.state.country}/${this.state.city}/${hotel.id}`}
            target="_blank"
          >
            <td className="tableName">{hotel.name}</td>
          </Link>
          <td className="table-data">
            <strong>${price}</strong>
          </td>
          <td className="table-data">
            <strong>{hotel.starRating}</strong>
          </td>
          <td className="tableAddress">{hotel.address.streetAddress}</td>
        </tr>
      );
    });
  };
  sortPrice = () => {
    let arr = [...this.state.hotels];
    let res = arr.sort((a, b) => {
      if (a.ratePlan !== undefined && b.ratePlan !== undefined) {
        if (a.ratePlan.price.exactCurrent > b.ratePlan.price.exactCurrent)
          return 1;
        if (a.ratePlan.price.exactCurrent < b.ratePlan.price.exactCurrent)
          return -1;
        if (a.ratePlan.price.exactCurrent === 0) return 0;
      }
    });
    this.setState({
      hotels: res.sort((a, b) => {
        if (a.ratePlan === undefined || b.ratePlan === undefined) {
          return a;
        }
        return b.ratePlan.price.exactCurrent - a.ratePlan.price.exactCurrent;
      })
    });
  };
  sortRate = () => {
    let arr2 = [...this.state.hotels];

    this.setState({
      hotels: arr2.sort((a, b) => b.starRating - a.starRating)
    });
  };

  ComponentDidMount = () => {
    if (this.state.hotels.length > 0) {
      this.setState({
        showList: true
      });
    }
  };

  render() {
    return (
      <div className="hotelBack">
        <div className="nav">
          <Link to={`/home/${this.state.country}/${this.state.city}`}>Home</Link>

          <Link to={`/home/${this.state.country}/${this.state.city}/flights`}>
            Flights
          </Link>

          <Link to={`/home/${this.state.country}/${this.state.city}/hotels`}>
            Hotels
          </Link>

          <Link
            to={`/home/${this.state.country}/${this.state.city}/activities`}
          >
            Activities
          </Link>
        </div>

        <Itinerary itinerary={this.props.itinerary} />

        <h1 className="findButton">
          Find your perfect <br></br> Hotel right now!
        </h1>

        <div className="allLists">
          {this.state.showForm ? (
            <form className="form" onSubmit={this.getInfo}>
              <label>Check In</label>
              <br />
              <input
                onChange={this.handleChange}
                type="text"
                name="checkIn"
                placeholder="YYYY-MM-DD"
              />
              <br />
              <label>Check out</label>
              <br />
              <input
                onChange={this.handleChange}
                type="text"
                name="checkOut"
                placeholder="YYYY-MM-DD"
              />
              <br />
              <br />
              <input className="submit" type="submit" />
            </form>
          ) : (
            ""
          )}
          <SyncLoader
            className="spinner"
            color={"lightpink"}
            loading={this.state.loading}
          />
          {this.state.showList ? (
            <div className="list">
              <div className="buttons2">
                <button className="buttonHotel" onClick={this.sortPrice}>
                  Sort by price
                </button>
                <button className="buttonHotel" onClick={this.sortRate}>
                  Sort by star rating
                </button>
              </div>
              <table className="hotel-table">
                <thead>
                  <tr>
                    <th>Add</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Star Rating</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>{this.showHotels()}</tbody>
              </table>
              <p className="price">
                * - Price is unavailable now, please call the hotel directly.
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Hotels;
