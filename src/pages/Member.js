import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";

class Member extends React.Component {
  constructor() {
    super();
    this.state = {
      masterPacks: [],
      search: "",
      id_member: "",
      nama: "",
      alamat: "",
      jenis_kelamin: "",
      telepon: "",
      action: "",
      role: "",
      visible: true,
      members: [
        {
          id_member: "1",
          nama: "Rangga Perkasa Aprili",
          alamat: "Tulungagung",
          jenis_kelamin: "Pria",
          telepon: "0812345678",
        },
        {
          id_member: "2",
          nama: "Perkasa",
          alamat: "Sembung",
          jenis_kelamin: "Pria",
          telepon: "0812456789",
        },
        {
          id_member: "3",
          nama: "April",
          alamat: "Malang",
          jenis_kelamin: "Wanita",
          telepon: "0897654321",
        },
      ],
    };
    //mengecek keberadaan token
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }
  tambahData() {
    this.modalMember = new Modal(document.getElementById("modal_member"));
    this.modalMember.show(); //menmpilkan modal

    //reset state untuk form member
    this.setState({
      action: "tambah",
      id_member: Math.random(1, 10000),
      nama: "",
      alamat: "",
      jenis_kelamin: "",
      telepon: "",
    });
  }
  simpanData(event) {
    event.preventDefault(); //preventdefault untuk mencegah aksi default(reload page) dari form submit

    if (this.state.action === "tambah") {
      let endpoint = "http://localhost:8000/member";
      //menampung data isian dari user
      let data = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        jenis_kelamin: this.state.jenis_kelamin,
        telepon: this.state.telepon,
      };

      //tambah ke state members (arrays)
      // let temp = this.state.members
      // temp.push(data) //menambah data pada array
      // this.setState({members: temp})

      axios
        .post(endpoint, data, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));

      //menghilangkan modal
      this.modalMember.hide();
    } else if (this.state.action === "ubah") {
      // let temp = this.state.members
      // let index = temp.findIndex(member => member.id_member === this.state.id_member)
      // temp[index].nama = this.state.nama
      // temp[index].alamat = this.state.alamat
      // temp[index].jenis_kelamin = this.state.jenis_kelamin
      // temp[index].telepon = this.state.telepon

      // this.setState({members: temp})
      let endpoint = "http://localhost:8000/member/" + this.state.id_member;

      let data = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        jenis_kelamin: this.state.jenis_kelamin,
        telepon: this.state.telepon,
      };

      axios
        .put(endpoint, data, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
      this.modalMember.hide();
    }
  }
  ubahData(id_member) {
    this.modalMember = new Modal(document.getElementById("modal_member"));
    this.modalMember.show(); //menmpilkan modal

    //mencari index posisi dari data member yang akan diubah
    let index = this.state.members.findIndex(
      (member) => member.id_member === id_member
    );
    //reset state untuk form member
    this.setState({
      action: "ubah",
      id_member: id_member,
      nama: this.state.members[index].nama,
      alamat: this.state.members[index].alamat,
      jenis_kelamin: this.state.members[index].jenis_kelamin,
      telepon: this.state.members[index].telepon,
    });
  }
  hapusData(id_member) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      // posisi index data yang akan dihapus
      // let temp = this.state.members
      // let index = temp.findIndex(member => member.id_member === id_member)

      // // dihapus data array
      // temp.splice(index,1)

      // this.setState({members: temp})
      let endpoint = "http://localhost:8000/member/" + id_member;

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
    let endpoint = "http://localhost:8000/member";
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ members: response.data });
        this.setState({masterPacks: response.data})
      })
      .catch((error) => console.log(error));
  }

  searching(ev) {
    let code = ev.keyCode; 
    if (code === 13) {
      let data = this.state.masterPacks;
      let found = data.filter(it => 
        it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
      this.setState({ members : found });
    }
  }

  componentDidMount() {
    //FUNGSI INI DIJALANKAN SETELAH FUNGSI RENDER DIJALANKAN
    this.getData();
    let user = JSON.parse(localStorage.getItem("user"));
    //cara pertama
    this.setState({
      role: user.role,
    });
    //cara kedua
    if (user.role === "admin" || user.role === "kasir") {
      this.setState({
        visible: true,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  showAddButton() {
    if (this.state.role === "admin" || this.state.role === "kasir") {
      return (
        <button
          id="tambah" className="btn btn-sm"
          onClick={() => this.tambahData()}
        >
          <i class="fa-solid fa-plus"></i>
        </button>
      );
    }
  }
  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
          <h3 className="tittleTable"><i class="fa-solid fa-users"></i> List Member</h3>
          <hr id="line"></hr>
          <div className="row">
          <div className="col-3">
              <input className="form-control" type="text" placeholder="Cari data Member" 
              value={this.state.search} onChange={ev => this.setState({search: ev.target.value})} 
              onKeyUp={(ev) => this.searching(ev)}></input>
          </div>
          <div className="col-8">

          </div>
          <div className="col-1">
          {this.showAddButton()}
          </div>
          </div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jenis Kelamin</th>
                  <th>Telepon</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {this.state.members.map((member) => (
                  <tr>
                    <td>{member.nama}</td>
                    <td>{member.jenis_kelamin}</td>
                    <td>{member.telepon}</td>
                    <td>{member.alamat}</td>
                    <td>
                      <button
                        id="edit" className={`btn btn-sm btn-warning mx-2 ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.ubahData(member.id_member)}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        id="hapus"  className={`btn btn-sm  mx-2 ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.hapusData(member.id_member)}
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

        {/* form modal data member */}
        <div className="modal" id="modal_member">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-body">
              <h3 id="headerTittle"><i class="fa-solid fa-users"></i> Form Pengisian Data Member</h3>
              <hr id="line"></hr>
                <form onSubmit={(ev) => this.simpanData(ev)}>
                  <input
                  placeholder="Nama"
                    type="text"
                    className="form-control mb-2"
                    value={this.state.nama}
                    onChange={(ev) => this.setState({ nama: ev.target.value })}
                  ></input>
                  <select
                    className="form-select mb-2"
                    value={this.state.jenis_kelamin}
                    onChange={(ev) =>
                      this.setState({ jenis_kelamin: ev.target.value })
                    }
                  >
                    <option>---Pilih Jenis Kelamin---</option>
                    <option value="Wanita">Wanita</option>
                    <option value="Pria">Pria</option>
                  </select>
                  <input
                  placeholder="Nomor Telepon"
                    type="text"
                    className="form-control mb-2"
                    value={this.state.telepon}
                    onChange={(ev) =>
                      this.setState({ telepon: ev.target.value })
                    }
                  ></input>
                  <input
                  placeholder="Alamat"
                    type="text"
                    className="form-control mb-2"
                    value={this.state.alamat}
                    onChange={(ev) =>
                      this.setState({ alamat: ev.target.value })
                    }
                  ></input>
                  <button id="simpanModal" className="btn btn-success" type="submit">
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

export default Member;
