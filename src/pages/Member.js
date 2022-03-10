import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import {baseUrl , authorization} from "../config";

class Member extends React.Component {
  constructor() {
    super();
    this.state = {
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
    if(!localStorage.getItem("token")){
      window.location.href = "/login"
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
      jenis_kelamin: "Wanita",
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
        .post(endpoint, data,authorization)
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
        .put(endpoint, data,authorization)
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
        .delete(endpoint ,authorization)
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
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    //FUNGSI INI DIJALANKAN SETELAH FUNGSI RENDER DIJALANKAN
    this.getData();
    let user = JSON.parse(localStorage.getItem("user"))
    //cara pertama
    this.setState({
      role : user.role
    })
    //cara kedua
    if(user.role === 'admin' || user.role === 'kasir'){
      this.setState({
        visible:true
      })
    }else{
      this.setState({
        visible:false
      })
    }
  }

  showAddButton(){
    if(this.state.role === 'admin' || this.state.role === 'kasir'){
      return(
        <button
              className="btn btn-sm btn-success my-3"
              onClick={() => this.tambahData()}
            >
              Tambah data Member
            </button>
      )
    }
  }
  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="card-header bg-success">
            <h3 className="text-white">List Member Laundry</h3>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {this.state.members.map((member) => (
                <li className="list-group-item">
                  <div className="row">
                    <div className="col-lg-2">
                      <small className="text-info">NAMA</small>
                      <br></br> <h6>{member.nama}</h6>
                    </div>
                    <div className="col-lg-2">
                      <small className="text-info">JENIS KELAMIN</small>
                      <br></br> <h6>{member.jenis_kelamin}</h6>
                    </div>
                    <div className="col-lg-2">
                      <small className="text-info">TELEPON</small>
                      <br></br> <h6>{member.telepon}</h6>
                    </div>
                    <div className="col-lg-4">
                      <small className="text-info">ALAMAT</small>
                      <br></br> <h6>{member.alamat}</h6>
                    </div>
                    <div className="col-lg-2">
                      <div>
                        <button
                          className= {`btn btn-sm btn-warning mx-2 ${this.state.visible ? `` : `d-none`}`}
                          onClick={() => this.ubahData(member.id_member)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                          onClick={() => this.hapusData(member.id_member)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {this.showAddButton()}
          </div>
        </div>

        {/* form modal data member */}
        <div className="modal" id="modal_member">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header bg-success">
                <h4 className="text-white">Form data member</h4>
              </div>
              <div className="modal-body">
                <form onSubmit={(ev) => this.simpanData(ev)}>
                  Nama
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={this.state.nama}
                    onChange={(ev) => this.setState({ nama: ev.target.value })}
                  ></input>
                  Jenis Kelamin
                  <select
                    className="form-control mb-2"
                    value={this.state.jenis_kelamin}
                    onChange={(ev) =>
                      this.setState({ jenis_kelamin: ev.target.value })
                    }
                  >
                    <option value="Wanita">Wanita</option>
                    <option value="Pria">Pria</option>
                  </select>
                  Telepon
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={this.state.telepon}
                    onChange={(ev) =>
                      this.setState({ telepon: ev.target.value })
                    }
                  ></input>
                  Alamat
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={this.state.alamat}
                    onChange={(ev) =>
                      this.setState({ alamat: ev.target.value })
                    }
                  ></input>
                  <button className="btn btn-success" type="submit">
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
