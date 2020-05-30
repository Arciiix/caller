import React from "react";
import "../css/bootstrap.min.css";
import "../css/reply.css";
import { Alert, Form, Button } from "react-bootstrap";

class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      message: "",
    };
  }
  componentDidMount() {
    this.setState({ isActive: true, message: "test" }, this.forceUpdate); //dev
  }
  render() {
    return (
      <div className="container">
        <div className="activeStatusMessage">
          <div
            className={
              "activeDot " + (this.state.isActive ? "active" : "inactive")
            }
          ></div>
          <span
            className={
              "activeText " +
              (this.state.isActive ? "textActive" : "textInactive")
            }
          >
            <b>{this.state.isActive ? "Aktywny" : "Zakończono"}</b>
          </span>
        </div>
        <Alert className="messageAlert" variant="success">
          <Alert.Heading className="alertHeader">
            <b>Wiadomość</b>
          </Alert.Heading>
          <span className="messageBody">{this.state.message}</span>
        </Alert>

        <div className="messageForm">
          <Form.Control className="messageInput" />
          <Button
            variant="success"
            className="sendBtn"
            onClick={() => alert(window.innerHeight)}
          >
            Wyślij
          </Button>
        </div>
      </div>
    );
  }
}

export default Reply;
