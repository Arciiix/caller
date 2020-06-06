import React from "react";
import "../css/bootstrap.min.css";
import "../css/login.css";

import { Button, FormControl } from "react-bootstrap";

class Login extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="form">
          <div className="iconDiv">
            <i className="far fa-user icon"></i>
          </div>
          <FormControl
            className="input"
            placeholder="Hasło"
            aria-label="Hasło"
            type="password"
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === "enter") {
                this.props.onLogin.bind(this.props.this)();
              }
            }}
          />
          <Button
            variant="primary"
            size="lg"
            className="submit"
            block
            onClick={this.props.onLogin.bind(this.props.this)} //I call the callback to change the parent's state. This.props.this is parent, so I need to assign it to change state.
          >
            Zaloguj
          </Button>
        </div>
      </div>
    );
  }
}

export default Login;
