import React from "react";

import "./css/bootstrap.min.css";

//Components
import Login from "./components/Login.js";
import Call from "./components/Call.js";
import Calling from "./components/Calling.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      writingMessage: false,
      calling: false,
    };
  }
  render() {
    if (!this.state.isLogged) {
      //When user isn't logged, show him the login page
      return <Login onLogin={this.logIn} this={this} />;
    } else {
      //If user is logged and isn't writing or receiving message right now
      if (!this.state.writingMessage) {
        if (this.state.calling) {
          return <Calling this={this} />;
        } else {
          return <Call this={this} call={this.call} />;
        }
      } else {
      }
    }
  }

  logIn() {
    this.setState({ isLogged: true }); //DEV
    this.forceUpdate();
  }
  call() {
    this.setState({ calling: true }, this.forceUpdate); //DEV
  }
}

export default App;
