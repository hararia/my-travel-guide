import React, { Component } from "react";
import axios from "axios";
// import images from "./imgHotels.json";
import "../Styles/SingleHotel.css";

class SingleHotel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotels: [],
      hotel: [],
      city: this.props.match.params.city,
      country: this.props.match.params.country,
      name: this.props.match.params.name,
      hotelId: this.props.match.params.hotelId,
      images: []
    };
  }
  componentDidMount() {
    axios({
      method: "GET",
      url: "https://priceline-com-provider.p.rapidapi.com/v1/hotels/details",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "priceline-com-provider.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
        useQueryString: true
      },
      params: {
        hotel_id: this.state.hotelId
      }
    })
      .then(response => {
        console.log(response);
        this.setState({
          images: response.data.images,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  showImages = () => {
    return this.state.images.map((image, i) => {
      // let s = image.baseUrl;
      // let end = s.indexOf("_");
      // let final = s.slice(0, end + 1) + "z.jpg";
      return (
        <img className="imagesRoom" key={i} src={image.imageUrl} alt="hotel room" />
      );
    });
  };
  render() {
    console.log(this.state.name);
    return (
      <div className="hotelBackg">
        <div className="room">
          <div className="header2">
            <h1>
              {this.state.name}, {this.state.city}
            </h1>
          </div>
          <div>{this.showImages()}</div>
        </div>
      </div>
    );
  }
}

export default SingleHotel;
