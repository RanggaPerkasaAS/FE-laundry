import axios from "axios";
import React from "react";
import gambar from "../login.png";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }

  loginProcess(event) {
    event.preventDefault();

    let endpoint = "http://localhost:8000/login";

    let data = {
      username: this.state.username,
      password: this.state.password,
    };

    axios
      .post(endpoint, data)
      .then((result) => {
        if (result.data.logged) {
          // store token in local storage
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          window.alert("Login success!");
          window.location.href = "/";
        } else {
          window.alert("Sorry maybe your username and password not correct");
        }
      })
      .catch((error) => console.log(error));
  }
  render() {
    return (
      <div id="body">
        <div className="col-lg-4">
          
          <h1 className="text-center tittleTable"><i class="fa-solid fa-shirt"></i> Cuci'in</h1>
          <div id="cardLogin" className="card">
            <div className="card-body">
            <h3 className="tittleTable">
            <i class="fa-solid fa-user-gear"></i> Login
            </h3>
            <hr id="line"></hr>
              <form onSubmit={(ev) => this.loginProcess(ev)}>
                Username
                <input
                  type="text"
                  className="form-control mb-2"
                  required
                  value={this.state.username}
                  onChange={(ev) =>
                    this.setState({ username: ev.target.value })
                  }
                ></input>
                Password
                <input
                  type="password"
                  className="form-control mb-2"
                  required
                  value={this.state.password}
                  onChange={(ev) =>
                    this.setState({ password: ev.target.value })
                  }
                ></input>
                <button id="simpanModal" type="submit" className="btn btn-login">
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
