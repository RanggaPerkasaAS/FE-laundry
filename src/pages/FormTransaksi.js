import React from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { authorization } from "../config";

export default class FormTransaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      id_member: "",
      tgl: "",
      batas_waktu: "",
      tgl_bayar: "",
      dibayar: 0,
      id_user: "",
      detail_transaksi: [],
      members: [],
      pakets: [],
      id_paket: "",
      qty: 0,
      jenis_paket: "",
      harga:0
    };
    if(!localStorage.getItem("token")){
      window.location.href = "/login"
    }
  }

  getMember() {
    let endpoint = "http://localhost:8000/member";
    axios
      .get(endpoint ,authorization)
      .then((response) => {
        this.setState({ members: response.data });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getMember();
    this.getPaket();

    let user = JSON.parse(localStorage.getItem("user"))
    if (user.role !== 'admin' && user.role !== 'kasir') {
      window.alert(`Maaf anda bukan admin atau kasir!`)
      window.location.href = "/"
    }
  }

  getPaket() {
    let endpoint = "http://localhost:8000/paket";
    axios
      .get(endpoint,authorization)
      .then((response) => {
        this.setState({ pakets: response.data });
      })
      .catch((error) => console.log(error));
  }

  tambahPaket(e) {
      e.preventDefault()
    //untuk menyimpan data paket yang dipilih beaserta jumlahnya didalam array detail transaksi
    let idPaket = this.state.id_paket
    let selectedPaket = this.state.pakets.find(
        paket => paket.id_paket == idPaket
    )
    let newPaket = {
      id_paket: this.state.id_paket,
      qty: this.state.qty,
      jenis_paket: selectedPaket.jenis_paket,
      harga: selectedPaket.harga
    };
    // ambil array detail transaksi
    let temp = this.state.detail_transaksi;
    temp.push(newPaket);
    this.setState({ detail_transaksi: temp });
    this.modal.hide()
  }

  addPaket() {
    //menampilkan form untuk memilih paket
    this.modal = new Modal(document.getElementById("modal_paket"));
    this.modal.show();
    //kosongkan formnya
    this.setState({ id_paket: "", qty: 0, jenis_paket: "", harga: 0 });
  }

  hapusData(id_paket) {
    if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

      //mencari posisi index dari data yang akan dihapus
      let temp = this.state.detail_transaksi
      let index = temp.findIndex(detail => detail.id_paket === id_paket)

      //menghapus data pada array
      temp.splice(index,1)

      this.setState({details: temp})
    }
  }

  simpanTransaksi(){
    if (document.getElementById("member").value == "") {
      alert("missing member");
      return;
    }
    if (document.getElementById("tgl").value == "") {
      alert("missing tanggal transaksi");
      return;
    }
    if (document.getElementById("batas_waktu").value == "") {
      alert("missing batas waktu");
      return;
    }
    if (document.getElementById("tgl_bayar").value == "") {
      alert("missing tanggal transaksi");
      return;
    }
    if (document.getElementById("status_bayar").value == "") {
      alert("missing status");
      return;
    }
    if (this.state.detail_transaksi.length == 0) {
      alert("Missing Paket");
      return;
    }
    if (this.state.detail_transaksi.length == 0) {
      alert("Missing Paket");
      return;
    }
    
    let endpoint = "http://localhost:8000/transaksi"
    let user = JSON.parse(localStorage.getItem("user"))
    let newData ={
      id_member : this.state.id_member,
      tgl : this.state.tgl,
      tgl_bayar: this.state.tgl_bayar,
      batas_waktu : this.state.batas_waktu,
      dibayar : this.state.dibayar,
      id_user : user.id_user,
      detail_transaksi: this.state.detail_transaksi,
    }

    axios.post(endpoint,newData,authorization)
    .then(response => {
      window.alert(response.data.message)
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
          <h3 className="tittleTable">
          <i class="fa-solid fa-cart-plus"></i> Transaksi Baru
            </h3>
            <hr id="line"></hr>
            Nama Member
            <select
            id="member"
              className="form-control mb-2"
              value={this.state.id_member}
              onChange={(e) => this.setState({ id_member: e.target.value })}
            >
              <option>---Nama Member---</option>
              {this.state.members.map((member) => (
                
                <option value={member.id_member}>{member.nama}</option>
              ))}
            </select>
            Tanggal Transaksi
            <input
            id="tgl"
              type="date"
              className="form-control mb-2"
              value={this.state.tgl}
              onChange={(e) => this.setState({ tgl: e.target.value })}
            ></input>
            Batas Waktu
            <input
            id="batas_waktu"
              type="date"
              className="form-control mb-2"
              value={this.state.batas_waktu}
              onChange={(e) => this.setState({ batas_waktu: e.target.value })}
            ></input>
            Tanggal bayar
            <input
            id="tgl_bayar"
              type="date"
              className="form-control mb-2"
              value={this.state.tgl_bayar}
              onChange={(e) => this.setState({ tgl_bayar: e.target.value })}
            ></input>
            Status bayar
            <select
            id="status_bayar"
              className="form-control mb-2"
              value={this.state.dibayar}
              
              onChange={(e) => this.setState({ dibayar: e.target.value })}
            >
              <option value={1}>Sudah dibayar</option>
              <option value={0}>Belum dibayar</option>
            </select>
            <button id="tambah" className="btn" onClick={() => this.addPaket()}>
            <i class="fa-solid fa-plus"></i> Paket
            </button>
            {/*tampilkan isi detail*/}
            <h5 id="headerTittle">Detail Transaksi</h5>
            {this.state.detail_transaksi.map((detail) => (
              <div className="row">
                {/* area nama paket */}
                <div className="col-lg-3">{detail.jenis_paket}</div>
                {/* area quantity paket */}
                <div className="col-lg-2">
                  Qty:
                  {detail.qty}
                </div>
                {/* area harga paket */}
                <div className="col-lg-3">
                  @ Rp
                  {detail.harga}
                </div>
                {/* area harga total */}
                <div className="col-lg-3">
                  Rp
                  {detail.harga * detail.qty}
                </div>
                <div className="col-lg-1 mb-2 ">
                  <button id="hapus" className="btn btn-sm btn-danger" onClick={() => this.hapusData(detail.id_paket)}><i class="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
            ))}
            {/* modal untuk pilihan paket */}
            <div className="modal" id="modal_paket">
              <div className="modal-dialog modal-md">
                <div className="modal-content">
                  <div className="modal-body">
                  <h3 id="headerTittle"><i class="fa-solid fa-cart-plus"></i>Paket yang Dipilih</h3>
                  <hr id="line"></hr>
                    <form onSubmit={(e) => this.tambahPaket(e)}>
                      <select
                        className="form-control mb-2"
                        value={this.state.id_paket}
                        onChange={(e) =>
                          this.setState({ id_paket: e.target.value })
                        }
                      >
                        <option value="">Pilih paket</option>
                        {this.state.pakets.map((paket) => (
                          <option value={paket.id_paket}>
                            {paket.jenis_paket}
                          </option>
                        ))}
                      </select>
                      Jumlah (Qty)
                      <input
                        type="number"
                        className="form-control mb-2"
                        value={this.state.qty}
                        onChange={(e) => this.setState({ qty: e.target.value })}
                      ></input>
                      <button id="simpanModal" type="submit" className="btn ">
                        Tambah
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <button id="simpanModal" type="submit" className="btn btn-sm " onClick={() => this.simpanTransaksi()}>
              Simpan
            </button>
          </div>
        </div>
      </div>
    );
  }
}