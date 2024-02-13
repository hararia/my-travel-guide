import React, { Component } from "react";
import "../Styles/Itinerary.css";

class Itinerary extends Component {
  state = {
    showList: false,
    showItem: true,
    receiverEmail: "",
    feedback: "",
    formSubmitted: false
  };
  toggleList = e => {
    e.preventDefault();
    if (e.target.innerText === "▼") e.target.innerText = "▲";
    else {
      e.target.innerText = "▼";
    }
    this.setState({
      showList: !this.state.showList
    });
  };
  delete = (item, name) => {
    this.props.setItinerary("hotels", item);
  };
  printHotels = () => {
    return this.props.itinerary.hotels.map((hotel, i) => {
      let price = "?";
      if (hotel.ratesSummary) price = hotel.ratesSummary.minPrice;

      return (
        <div className="line">
          <strong>{i + 1}) </strong> ${price} - {hotel.name}
          <img
            className="deleteButton"
            onClick={() => {
              this.delete("hotels", hotel);
            }}
            src={require("../Images/deleteButton.png")}
            alt="gps"
          />
        </div>
      );
    });
  };
  printFlights = () => {
    return this.props.itinerary.flights.map((flight, i) => {

      return (
        <div className="line">
          <strong>{i + 1}) </strong>${flight.totalPriceWithDecimal.price} - {flight.airlines[0].name}
          <img
            className="deleteButton"
            onClick={() => {
              this.delete("flights", flight);
            }}
            src={require("../Images/deleteButton.png")}
            alt="gps"
          />
        </div>
      );
    });
  };
  printActivity = () => {
    return this.props.itinerary.activities.map((activity, i) => {
      return (
        <div className="line">
          <strong>{i + 1}) </strong>
          {activity.name}
          <img
            className="deleteButton"
            onClick={() => {
              this.delete("activities", activity);
            }}
            src={require("../Images/deleteButton.png")}
            alt="gps"
          />
        </div>
      );
    });
  };

  delete = (name, item) => {
    this.props.setItinerary(name, item);
  };

  static sender = "sender@example.com";

  handleChange = event => {
    this.setState({
      receiverEmail: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const template = process.env.REACT_APP_EMAILJS_TEMPLATEID;
    this.sendFeedback(
      template,
      this.sender,
      this.state.receiverEmail,
      process.env.REACT_APP_EMAILJS_USERID
    );
    this.props.clearItinerary()
    this.setState({
      formSubmitted: true
    });

    alert("Email Sent")
  };

  // Note: this is using default_service, which will map to whatever
  // default email provider you've set in your EmailJS account.
  sendFeedback(templateId, senderEmail, receiverEmail, user) {
    window.emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICEID,
        templateId,
        {
          senderEmail,
          receiverEmail,

          activityText: this.props.itinerary.activities
            .map((activity, i) => {
              return `${i + 1}) ${activity.name}`;
            })
            .join("<br />"),
          hotelText: this.props.itinerary.hotels
            .map((hotel, i) => {
              return `${i + 1}) $${hotel.ratesSummary.minPrice} - ${
                hotel.name
              }`;
            })
            .join("<br />"),
          flightText: this.props.itinerary.flights
            .map((flight, i) => {
              return `${i + 1}) $${flight.MinPrice} - ${flight.carrier}`;
            })
            .join("<br />")
        },

        user
      )
      .then(res => {
        this.setState({
          formEmailSent: true
        });
      })
      // Handle errors here however you like
      .catch(err => console.error("Failed to send feedback. Error: ", err));
  }

  render() {
    return (
      <div className="full-container-itin">
        <div className="drop">
          <h2>Itinerary</h2>
          <button onClick={this.toggleList}>▼</button>
        </div>
        {this.state.showList ? (
          <div>
            <table className="mainTable">
              <thead>
                <tr>
                  <th>Hotels</th>
                  <th>Activities</th>
                  <th>Flights</th>
                </tr>
              </thead>
              <tbody className="smallTable">
                <td>{this.printHotels()}</td>
                <td> {this.printActivity()}</td>
                <td>{this.printFlights()}</td>
              </tbody>
            </table>

            <form className="emailForm" onSubmit={this.handleSubmit}>
              <h4>Send it to your email address</h4>
              <div className="inputEmail">
                <input
                  type="email"
                  className="text-input"
                  id="feedback-entry"
                  name="feedback-entry"
                  onChange={this.handleChange}
                  placeholder="example@address.com"
                  style={{ textAlign: "center" }}
                  required
                  value={this.receiverEmail}
                />
                <div className="btn-group">
                  <input type="submit" value="Submit" className="btn--submit" />
                </div>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}
export default Itinerary;
