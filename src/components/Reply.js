import React from "react";
import "../css/bootstrap.min.css";
import "../css/reply.css";
import { Alert, Form, Button } from "react-bootstrap";
import io from "socket.io-client";

const room = "default";

class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: true,
      message: "Pisanie wiadomości...",
      inputText: "",
    };
  }

  checkForAuthentication() {
    return new Promise((resolve, reject) => {
      fetch(`http://10.249.20.105:8500/verify?token=${this.props.token}`).then(
        (response) => {
          if (response.status !== 200) {
            console.error("Invaild token!");
            this.props.onInvaildToken.bind(this.props.this)();
          } else {
            resolve();
          }
        }
      );
    });
  }

  async componentDidMount() {
    await this.checkForAuthentication();
    this.socket = io("", {
      query: `type=sender&room=${room}`,
    });

    this.socket.on("message", (content) => {
      this.setState({ message: content });
    });
    //When receiver ends the call (leaves the page or clicks on end button at the main page)
    this.socket.on("statusUpdate", (newStatus) => {
      if (newStatus === "end") {
        this.setState({ isActive: false });
      }
    });

    //When user leaves the page, send the notification about ended call
    window.addEventListener("beforeunload", () => {
      this.socket.emit("statusUpdate", {
        toSender: false,
        status: "end",
        room: room,
      });
    });
  }
  send() {
    this.socket.emit("message", {
      toSender: false,
      message: this.state.inputText,
      room: room,
    });
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
