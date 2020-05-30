import React from "react";
import "../css/bootstrap.min.css";
import "../css/call.css";

import { Button, Form } from "react-bootstrap";

class Call extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStatus: { isActive: false, type: "" },
    };
  }
  componentDidMount() {
    this.setState(
      { activeStatus: { isActive: true, type: "komputer" } },
      this.forceUpdate
    ); //dev
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
                : "nieaktywny"}
            </b>
          </span>
        </div>
        <Form.Control
          className="textField"
          as="textarea"
          rows="5"
          placeholder="Wpisz wiadomość (opcjonalnie)"
        />
        <Button
          variant="primary"
          size="lg"
          block
          onClick={this.props.call.bind(this.props.this)} //Call
        >
          Zawołaj
        </Button>
      </div>
    );
  }
}

export default Call;
