import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Styles/AboutUs.css";

class AboutUs extends Component {
  state = {
    country: this.props.match.params.country,
    city: this.props.match.params.city
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
    return (
      <div className="about-wrapper">
        <div class="topnav">
        <Link to={`/home/${this.state.country}/${this.state.city}`} className='active'>My Travel Guide</Link>

        <div id="myLinks">
        
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
          <Link to={`/home/${this.state.country}/${this.state.city}/hotels`}>
            Hotels
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
        <h1 className="about-title">Developer</h1>
        <div className="info-section">
          <div className="info-container">
            <h2> Andrew Harari </h2>
            <img
              className="profile-pic"
              src={require("../Images/andrew-pic.jpg")}
              alt="profile-pic"
            ></img>
            <div className="link-imgs">
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/hararia">
                <i className="fa fa-github" aria-hidden="true"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/aharari/">
                <i class="fa fa-linkedin" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutUs;
