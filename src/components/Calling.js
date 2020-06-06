import React from "react";
import "../css/bootstrap.min.css";
import "../css/calling.css";
import { Alert, Spinner } from "react-bootstrap";
import io from "socket.io-client";

const room = "default";

class Calling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Łączenie...",
    };
  }

  componentDidMount() {
    this.socket = io("", {
      query: `type=sender&room=${room}`,
    });
    this.socket.emit("call", { room: room, message: this.props.message });

    this.socket.on("statusUpdate", (newStatus) => {
      switch (newStatus) {
        case "sent":
          this.setState({ status: "Wysłano!" });
          break;
        case "offline":
          this.setState({ status: "Nie ma odbiorcy!" });
          break;
        case "received":
          this.setState({ status: "Wiadomość doszła!" });
          break;
        case "read":
          this.setState({ status: "Przeczytano!" });
          break;
        case "end":
          this.setState({ status: "Zakończono!" });
          break;
        case "writingMessage":
          this.props.onMessage.bind(this.props.this)();
          break;
        default:
          break;
      }
    });
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
