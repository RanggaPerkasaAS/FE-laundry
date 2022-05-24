import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

function Logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export default function Navbar(props) {
  if (!localStorage.getItem("user")) {
    window.location.href = "/login";
  }
  let halo = JSON.parse(localStorage.getItem(`user`));
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container-fluid">
          <a href="/" className="navbar-brand">
            <i class="fa-solid fa-shirt"></i> Cuci'in
          </a>

          {/* button toogler */}
          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#myNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* define menu */}
          <div className="collapse navbar-collapse" id="myNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/member" className="nav-link">
                  Member
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/transaksi" className="nav-link">
                  Transaksi
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/paket" className="nav-link">
                  Paket
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users" className="nav-link">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/form-transaksi" className="nav-link">
                  Transaksi baru
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  to="/login"
                  className="nav-link"
                  id="logout"
                  onClick={() => Logout()}
                >
                  <i class="fa-solid fa-right-from-bracket iconlogout"></i>{" "}
                  Logout
                </Link>
              </li>
            </ul>
          </div>
          <div className="inline" >
            <a id="welcomeUser">
              Hai, {halo.role} {halo.nama}
              <AccountCircleIcon />
            </a>
          </div>
        </div>
      </nav>
      {props.children}
    </div>
  );
}
