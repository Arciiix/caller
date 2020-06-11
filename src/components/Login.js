import React from "react";
import "../css/bootstrap.min.css";
import "../css/login.css";

import { Button, FormControl } from "react-bootstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inputText: "", invalid: false };
  }
  login() {
    if (this.state.inputText === "") {
      this.setState({ invalid: true, inputText: "" });
      return;
    }
    fetch(
      `http://10.249.20.105:8500/login?password=${escape(this.state.inputText)}`
    )
      .then((res) => {
        if (res.status !== 200) {
          this.setState({ invalid: true, inputText: "" });
          return false;
        }
        return res.text();
      })
      .then((data) => {
        if (!data) return;
        this.props.onLogin.bind(this.props.this, data)();
      });
  }
  render() {
    return (
      <div className="container">
        <div className="form">
          <div className="iconDiv">
            <i className="far fa-user icon"></i>
          </div>
          <FormControl
            className={`input ${this.state.invalid ? "invalid" : ""}`}
            placeholder="Hasło"
            aria-label="Hasło"
            type="password"
            value={this.state.inputText}
            onChange={(e) => {
              this.setState({ inputText: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === "enter") {
                this.login.bind(this)();
              }
            }}
          />
          <Button
            variant="primary"
            size="lg"
            className="submit"
            block
            onClick={this.login.bind(this)}
          >
            Zaloguj
          </Button>
        </div>
      </div>
    );
  }
}

export default Login;
