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
      inputText: "",
    };
  }
  componentDidMount() {
    this.setState({ isActive: true, message: "test" }, this.forceUpdate); //dev
  }
  send() {
    //dev
    this.setState({ inputText: "" }, this.forceUpdate);
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
          <Form.Control
            className="messageInput"
            value={this.state.inputText}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === "enter") {
                this.send.bind(this)();
              }
            }}
            onChange={(e) => {
              this.setState({ inputText: e.target.value });
            }}
          />
          <Button
            variant="success"
            className="sendBtn"
            onClick={this.send.bind(this)}
          >
            Wyślij
          </Button>
        </div>
      </div>
    );
  }
}

export default Reply;
