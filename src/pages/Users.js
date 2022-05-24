import { Modal } from "bootstrap";
import React from "react";
import axios from "axios";
import { authorization } from "../config";

class Users extends React.Component {
  constructor() {
    super();
    this.state = {
      masterPacks: [],
      search: "",
      id_user: "",
      nama: "",
      username: "",
      password: "",
      role: "",
      visible: true,
      fillPassword: true,
      userss: [
        {
          id_user: "1",
          nama: "Doni",
          username: "dodon",
          password: "12345",
          role: "admin",
        },
        {
          id_user: "2",
          nama: "Rafli",
          username: "Rafl",
          password: "abcd",
          role: "admin",
        },
        {
          id_user: "3",
          nama: "rehan",
          username: "reh",
          password: "12345",
          role: "admin",
        },
      ],
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }
  tambahData() {
    this.modalUsers = new Modal(document.getElementById("modal_users"));
    this.modalUsers.show();

    this.setState({
      action: "tambah",
      id_user: Math.random(1, 10000),
      nama: "",
      username: "",
      password: "",
      role: "",
      fillPassword: true,
    });
  }
  simpanData(event) {
    event.preventDefault();

    if (this.state.action === "tambah") {
      let endpoint = "http://localhost:8000/users";
      let data = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        password: this.state.password,
        role: this.state.role,
      };

      // let temp = this.state.userss
      // temp.push(data);
      // this.setState({userss:temp})

      axios
        .post(endpoint, data, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .error((error) => console.log(error));
      this.modalUsers.hide(0);
    } else if (this.state.action === "ubah") {
      // let temp = this.state.userss
      // let index = temp.findIndex(
      //     (user) => user.id_user === this.state.id_user
      // )
      // temp[index].nama = this.state.nama
      // temp[index].username = this.state.username
      // temp[index].password = this.state.password
      // temp[index].role = this.state.role

      // this.setState({userss: temp})
      let endpoint = "http://localhost:8000/users/" + this.state.id_user;
      let data = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        role: this.state.role,
      };

      if (this.state.fillPassword === true) {
        data.password = this.state.password
      }
      axios
        .put(endpoint, data, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
      this.modalPaket.hide();
    }
  }
  ubahData(id_user) {
    this.modalUsers = new Modal(document.getElementById("modal_users"));
    this.modalUsers.show();

    let index = this.state.userss.findIndex((user) => user.id_user === id_user);
    this.setState({
      action: "ubah",
      id_user: id_user,
      nama: this.state.userss[index].nama,
      username: this.state.userss[index].username,
      password: "",
      role: this.state.userss[index].role,
      fillPassword: false
    });
  }
  hapusData(id_user) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      // let temp = this.state.userss;
      // let index = temp.findIndex((user => user.id_user === id_user))

      // temp.splice(index, 1);

      // this.setState({userss: temp})
      let endpoint = "http://localhost:8000/users/" + id_user;

      axios
        .delete(endpoint, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  getData() {
    let endpoint = "http://localhost:8000/users";
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ userss: response.data });
        this.setState({ masterPacks: response.data });
      })
      .catch((error) => console.log(error));
  }

  searching(ev) {
    let code = ev.keyCode;
    if (code === 13) {
      let data = this.state.masterPacks;
      let found = data.filter((it) =>
        it.nama.toLowerCase().includes(this.state.search.toLowerCase())
      );
      this.setState({ userss : found });
    }
  }

  componentDidMount() {
    this.getData();
    let user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "admin") {
      this.setState({
        visible: true,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }
  showPassword(){
    if (this.state.fillPassword === true) {
      return(
        <div>
          <input placeholder="Password" type="password" className="form-control mb-1" required 
          value={this.state.password}
          onChange={ev => this.setState({password: ev.target.value})}></input>
        </div>
      )
    }else{
      return(
        <button id="tambah" className="btn mb-1" onClick={()=> this.setState({fillPassword: true})}>Change Password</button>
      )
    }
  }
  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            <h3 className="tittleTable">
            <i class="fa-solid fa-user-gear"></i> List Users
            </h3>
            <hr id="line"></hr>
            <div className="row">
              <div className="col-3">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Cari data User"
                  value={this.state.search}
                  onChange={(ev) => this.setState({ search: ev.target.value })}
                  onKeyUp={(ev) => this.searching(ev)}
                ></input>
              </div>
              <div className="col-8"></div>
              <div className="col-1">
                <button
                  id="tambah"
                  className={`btn btn-sm text-white ${
                    this.state.visible ? `` : `d-none`
                  }`}
                  onClick={() => this.tambahData()}
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jenis Kelamin</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userss.map((user) => (
                  <tr>
                    <td>{user.nama}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        id="edit"
                        className={`btn btn-sm btn-warning mx-2 ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.ubahData(user.id_user)}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        id="hapus"
                        className={`btn btn-sm  mx-2 ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.hapusData(user.id_user)}
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* form modal data paket */}
        <div className="modal" id="modal_users">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-body">
              <h3 id="headerTittle"><i class="fa-solid fa-user-gear"></i> Form Pengisian Data User</h3>
              <hr id="line"></hr>
                <form onSubmit={(ev) => this.simpanData(ev)}>
                  <input
                    placeholder= "Nama"
                    type="text"
                    className="form-control mb-2"
                    value={this.state.nama}
                    onChange={(ev) => this.setState({ nama: ev.target.value })}
                  ></input>
                  <input
                  placeholder="Username"
                    type="text"
                    className="form-control mb-2"
                    value={this.state.username}
                    onChange={(ev) =>
                      this.setState({ username: ev.target.value })
                    }
                  ></input>
                  {this.showPassword()}
                  <select
                    className="form-select mb-2"
                    value={this.state.role}
                    onChange={(ev) =>
                      this.setState({ role: ev.target.value })
                    }
                  >
                    <option>---Pilih Jenis Role---</option>
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button className="btn" type="submit" id="simpanModal">
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
