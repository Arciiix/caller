import React from "react";
import "../css/bootstrap.min.css";
import "../css/calling.css";
import { Alert, Spinner } from "react-bootstrap";

class Calling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Łączenie...",
    };
  }

  componentDidMount() {
    this.props.onMessage.bind(this.props.this)(); //DEV
  }
  render() {
    return (
      <div className="container">
        <Alert className="alert" variant="success">
          <Alert.Heading>
            <b className="alertTitle">Status</b>
          </Alert.Heading>
          <span className="alertBody">{this.state.status}</span>
        </Alert>
        <Spinner
          className="spinner"
          animation="border"
          role="status"
          variant="light"
        ></Spinner>
      </div>
    );
  }
}

export default Calling;
