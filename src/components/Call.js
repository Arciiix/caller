import React from "react";
import "../css/bootstrap.min.css";
import "../css/call.css";

import { Button, Form } from "react-bootstrap";

import io from "socket.io-client";

const room = "default";

class Call extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStatus: { isActive: false, type: "" },
      inputText: "",
    };
  }
  componentDidMount() {
    this.socket = io("", {
      query: `type=readonly&room=${room}`,
    });

    //Ask server for active status and wait for response, then change the state
    this.socket.emit("isActive", room);
    this.socket.on("isActive", (isActive) => {
      if (isActive.isActive) {
        this.setState({ activeStatus: isActive }, this.forceUpdate);
      }
    });
  }

  send() {
    this.props.call.bind(this.props.this, this.state.inputText)();
  }
  render() {
    return (
      <div className="container">
        <div className="activeStatus">
          <div
            className={
              "activeDot " +
              (this.state.activeStatus.isActive ? "active" : "inactive")
            }
          ></div>
          <span
            className={
              "activeText " +
              (this.state.activeStatus.isActive ? "textActive" : "textInactive")
            }
          >
            <b>
              {this.state.activeStatus.isActive
                ? this.state.activeStatus.type
                : "Nieaktywny"}
            </b>
          </span>
        </div>
        <Form.Control
          className="textField"
          as="textarea"
          rows="5"
          placeholder="Wpisz wiadomość (opcjonalnie)"
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
          variant="primary"
          size="lg"
          block
          onClick={this.send.bind(this)} //Call
        >
          Zawołaj
        </Button>
      </div>
    );
  }
}

export default Call;
