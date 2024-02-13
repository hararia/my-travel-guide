import React, { Component } from "react";
import axios from "axios";
// import hotels from "./hotels.json";
import { Link } from "react-router-dom";
import "../Styles/Hotels.css";
import SyncLoader from "react-spinners/SyncLoader";
import Itinerary from "./Itinerary";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Hotels extends Component {
  state = {
    country: this.props.match.params.country,
    city: this.props.match.params.city,
    hotels: [],
    showForm: true,
    loading: false,
    showList: false,
    checkIn: new Date(),
    checkOut: new Date(),
    checkBox: []
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

  handleCheckIn = date => {
    this.setState({
      checkIn: date
    });
  };

  handleCheckOut = date => {
    this.setState({
      checkOut: date
    });
  };
  addHotel = hotel => {
    console.log(hotel)
    this.props.setItinerary("hotels", hotel);
  };
  refreshPage = () => {
    window.location.reload(false);
  };
  getInfo = e => {
    e.preventDefault();

    axios({
      method: "GET",
      url: "https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations",
      headers: {
        "content-type": "application/octet-stream",
        'X-RapidAPI-Host': "priceline-com-provider.p.rapidapi.com",
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        useQueryString: true
      },
      params: {
        name: this.state.city,
        search_type: 'CITY'
      }
    })
      .then(response => {
        console.log('response1', response)
        const cityId = response.data[0].cityID;
        this.setState({
          loading: true
        });
        setTimeout(() => {
          axios({
            method: "GET",
            url: "https://priceline-com-provider.p.rapidapi.com/v1/hotels/search",
            headers: {
              "content-type": "application/octet-stream",
              'X-RapidAPI-Host': "priceline-com-provider.p.rapidapi.com",
              'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
              useQueryString: true
            },
            params: {
              location_id: cityId,
              date_checkin: this.formatDate(this.state.checkIn),
              date_checkout: this.formatDate(this.state.checkOut),
              sort_order: 'HDR',
              rooms_number: '1',
            }
          })
            .then(response2 => {
              console.log('response2', response2);
              this.setState({
                hotels: response2.data.hotels,
                showList: true,
                showForm: true,
                loading: false
              });

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
      if (hotel.ratesSummary !== undefined) {
        price = hotel.ratesSummary.minPrice;
      }
      return (
        <tr key={i}>
          <td className="table-data">
            {" "}
            <input
              className="checkBox"
              onChange={() => this.addHotel(hotel)}
              type="checkbox"
              checked={this.props.itinerary.hotels.find(a => a.hotelId === hotel.hotelId)}
            />
          </td>
          <Link
            className="linkHotel"
            to={`/${hotel.name}/${this.state.country}/${this.state.city}/${hotel.hotelId}`}
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
          <td className="tableAddress">{hotel.location.address.addressLine1}</td>
        </tr>
      );
    });
  };
  sortPrice = () => {
    let arr = [...this.state.hotels];
    let res = arr.sort((a, b) => {
      if (
        (a.ratesSummary === undefined && b.ratesSummary === undefined) ||
        (a.ratesSummary === undefined && b.ratesSummary !== undefined)
      )
        return 1;
      if (
        (a.ratesSummary === undefined && b.ratePlan === undefined) ||
        (a.ratesSummary !== undefined && b.ratePlan === undefined)
      )
        return -1;
      if (a.ratesSummary !== undefined && b.ratesSummary !== undefined) {
        if (a.ratesSummary.minPrice > b.ratesSummary.minPrice)
          return 1;
        if (a.ratePlan.ratesSummary.minPrice < b.ratePlan.ratesSummary.minPrice)
          return -1;
        if (a.ratePlan.ratesSummary.minPrice === 0) return 0;
      }
    });
    this.setState({
      hotels: res.sort((a, b) => {
        if (a.ratesSummary === undefined || b.ratesSummary === undefined) {
          return a;
        }
        return b.ratesSummary.minPrice - a.ratesSummary.minPrice;
      })
    });
  };
  sortRate = () => {
    let arr2 = [...this.state.hotels];

    this.setState({
      hotels: arr2.sort((a, b) => b.starRating - a.starRating)
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
        <div className="topnav">
        <Link className='active' to={`/home/${this.state.country}/${this.state.city}`}>
            My Travel Guide
          </Link>
        <div id="myLinks">
        <Link to={`/home/${this.state.country}/${this.state.city}/flights`}>
            Flights
          </Link>

          <Link
            to={`/home/${this.state.country}/${this.state.city}/activities`}
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

          <Link to={`/home/${this.state.country}/${this.state.city}/flights`}>
            Flights
          </Link>
          <Link
            to={`/home/${this.state.country}/${this.state.city}/activities`}
          >
            Activities
          </Link>
          <Link to={`/home/${this.state.country}/${this.state.city}`}>
            Home
          </Link>
        </div>

        <Itinerary
          setItinerary={this.props.setItinerary}
          itinerary={this.props.itinerary}
          clearItinerary={this.props.clearItinerary}
        />

        <h1 className="findButton">
          Find your perfect <br></br> hotel right now!
        </h1>

        <div className="allLists">
          {this.state.showForm ? (
            <form className="form" onSubmit={this.getInfo}>
              <label>Check In</label>
              <br />
              <DatePicker
                name="checkIn"
                selected={this.state.checkIn}
                onSelect={this.handleCheckIn}
              />
              <br />
              <label>Check out</label>
              <br />
              <DatePicker
                name="checkOut"
                selected={this.state.checkOut}
                onSelect={this.handleCheckOut}
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
