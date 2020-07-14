import React from "react";

import "./css/bootstrap.min.css";

//Components
import Login from "./components/Login.js";
import Call from "./components/Call.js";
import Calling from "./components/Calling.js";
import Reply from "./components/Reply.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      token: "",
      writingMessage: false,
      calling: false,
      message: "",
    };
  }
  render() {
    if (!this.state.isLogged) {
      //When user isn't logged, show him the login page
      return <Login onLogin={this.saveToken} this={this} />;
    } else {
      //If user is logged and isn't writing or receiving message right now
      if (!this.state.writingMessage) {
        if (this.state.calling) {
          return (
            <Calling
              this={this}
              onMessage={this.message}
              message={this.state.message}
              token={this.state.token}
              onInvaildToken={this.logOut}
            />
          );
        } else {
          return (
            <Call
              this={this}
              call={this.call}
              token={this.state.token}
              onInvaildToken={this.logOut}
              logOut={this.logOut}
            />
          );
        }
      } else {
        return (
          <Reply
            this={this}
            token={this.state.token}
            onInvaildToken={this.logOut}
            logOut={this.logOut}
          />
        );
      }
    }
  }

  saveToken(token) {
    this.setState({ token: token, isLogged: true }, this.forceUpdate);
  }
  call(message) {
    this.setState({ calling: true, message: message }, this.forceUpdate);
  }
  message() {
    this.setState({ writingMessage: true }, this.forceUpdate);
  }

  logOut() {
    this.setState(
      {
        isLogged: false,
        token: "",
        calling: false,
        writingMessage: false,
      },
      this.forceUpdate
    );
  }
}

export default App;
