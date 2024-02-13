import React, { Component } from "react";
import LandingPage from "./Components/LandingPage";
import { Switch, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Flights from "./Components/Flights";
import Hotels from "./Components/Hotels";
import Activities from "./Components/Activities";
import SingleHotel from "./Components/SingleHotel";
import SingleActivity from "./Components/SingleActivity";
import AboutUs from "./Components/AboutUs"

class App extends Component {
  state = {
    itinerary: {
      flights: [],
      hotels: [],
      activities: []
    }
  };

  setItinerary = (component, thing) => {
    let itineraryCopy = { ...this.state.itinerary };

    if (component === "activities") {
      if (!itineraryCopy.activities.some(item => item.id === thing.id))
        itineraryCopy.activities.push(thing);
      else {
        let item = itineraryCopy.activities.find(item => item.id === thing.id);
        itineraryCopy.activities.splice(
          itineraryCopy.activities.indexOf(item),
          1
        );
      }
    }
    if (component === "flights") {
      if (!itineraryCopy.flights.some(item => item.id === thing.id))
        itineraryCopy.flights.push(thing);
      else {
        let item = itineraryCopy.flights.find(
          item => item.id === thing.id
        );
        itineraryCopy.flights.splice(itineraryCopy.flights.indexOf(item), 1);
      }
    }

    if (component === "hotels") {
      if (!itineraryCopy.hotels.some(item => item.hotelId === thing.hotelId))
        itineraryCopy.hotels.push(thing);
      else {
        let item = itineraryCopy.hotels.find(item => item.hotelId === thing.hotelId);
        itineraryCopy.hotels.splice(itineraryCopy.hotels.indexOf(item), 1);
      }
    }
    this.setState({
      itinerary: itineraryCopy
    });
  };
  clearItinerary = () => {
    this.setState({
      itinerary: {
        flights: [],
        hotels: [],
        activities: []
      }
    })
  }


  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={props => <LandingPage {...props} />} />
          <Route
            exact
            path="/home/:country/:city"
            render={props => (
              <HomePage
                {...props}
                itinerary={this.state.itinerary}
                setItinerary={this.setItinerary}
                clearItinerary={this.clearItinerary}
              />
            )}
          />
          <Route
            exact
            path="/home/:country/:city/flights"
            render={props => (
              <Flights
                {...props}
                itinerary={this.state.itinerary}
                setItinerary={this.setItinerary}
                clearItinerary={this.clearItinerary}
              />
            )}
          />
          <Route
            exact
            path="/home/:country/:city/hotels"
            render={props => (
              <Hotels
                {...props}
                itinerary={this.state.itinerary}
                setItinerary={this.setItinerary}
                clearItinerary={this.clearItinerary}
              />
            )}
          />
          <Route
            exact
            path="/home/:country/:city/activities"
            render={props => (
              <Activities
                {...props}
                itinerary={this.state.itinerary}
                setItinerary={this.setItinerary}
                clearItinerary={this.clearItinerary}
              />
            )}
          />

          <Route
            exact
            path="/home/:country/:city/aboutus"
            render={props => <AboutUs {...props} 
            itinerary={this.state.itinerary}
            setItinerary={this.setItinerary} />}
          />
          <Route
            exact
            path="/:name/:country/:city/:hotelId"
            render={props => (
              <SingleHotel
                {...props}
                itinerary={this.state.itinerary}
                setItinerary={this.setItinerary}
              />
            )}
          />
          <Route
            exact
            path="/:name/:country/:city/activities/:businessId"
            render={props => (
              <SingleActivity
                {...props}
                itinerary={this.state.itinerary}
                setItinerary={this.setItinerary}
                clearItinerary={this.clearItinerary}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
