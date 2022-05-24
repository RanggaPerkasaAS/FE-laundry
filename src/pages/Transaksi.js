import React from "react";
import axios from "axios";
import { authorization, formatDate, formatNumber } from "../config";
import domToPdf from "dom-to-pdf";

export default class Transaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      transaksi: [],
      masterPacks: [],
      search: "",
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  getData() {
    let endpoint = "http://localhost:8000/transaksi";
    axios
      .get(endpoint, authorization)
      .then((response) => {
        let dataTransaksi = response.data;
        for (let i = 0; i < dataTransaksi.length; i++) {
          let total = 0;
          for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
            let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
            let qty = dataTransaksi[i].detail_transaksi[j].qty;

            total += harga * qty;
          }

          //tambahkan key total
          dataTransaksi[i].total = total;
        }
        this.setState({ transaksi: dataTransaksi });
        this.setState({ masterPacks: response.data });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getData();
  }

  convertStatus(id_transaksi, status) {
    if (status === 1) {
      return (
        <div className="badge" id="badgeBaru">
          <a
            onClick={() => this.changeStatus(id_transaksi, 2)}
            className="text-white"
          >
            Transaksi Baru <i class="fa-solid fa-sliders"></i>
          </a>
        </div>
      );
    } else if (status === 2) {
      return (
        <div className="badge text-white" id="badgeProses">
          <a
            onClick={() => this.changeStatus(id_transaksi, 3)}
            className="text-white"
          >
            Sedang diproses <i class="fa-solid fa-sliders"></i>
          </a>
        </div>
      );
    } else if (status === 3) {
      return (
        <div className="badge text-white" id="badgeSiap">
          <a
            onClick={() => this.changeStatus(id_transaksi, 4)}
            className="text-white"
          >
            Siap diambil <i class="fa-solid fa-sliders"></i>
          </a>
        </div>
      );
    } else if (status === 4) {
      return (
        <div className="badge text-white" id="badgeTelah">
          Telah Diambil <i class="fa-solid fa-check"></i>
        </div>
      );
    }
  }

  changeStatus(id, status) {
    if (window.confirm(`Apakah anda yakin ingin mengganti statusnya?`)) {
      let endpoint = `http://localhost:8000/transaksi/status/${id}`;
      let data = {
        status: status,
      };

      axios
        .post(endpoint, data, authorization)
        .then((response) => {
          window.alert(`Status telah diubah`);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  convertStatusBayar(id_transaksi, dibayar) {
    if (dibayar == 0) {
      return (
        <div id="statusBayar" className="badge text-white">
          <a
            onClick={() => this.changeStatusBayar(id_transaksi, 1)}
            className="text-white"
          >
            belum dibayar <i class="fa-solid fa-sliders"></i>
          </a>
        </div>
      );
    } else if (dibayar == 1) {
      return (
        <div id="statusBayar2" className="badge text-white">
          Sudah dibayar <i class="fa-solid fa-check-double"></i>
        </div>
      );
    }
  }

  changeStatusBayar(id, status) {
    if (window.confirm(`Apakah yakin mngubah status bayar?`)) {
      let endpoint = `http://localhost:8000/transaksi/bayar/${id}`;

      axios
        .get(endpoint, authorization)
        .then((response) => {
          window.alert(`status bayar berhasil diubah`);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }
  deleteTransaksi(id) {
    if (window.confirm(`Apakah anda yakin menghapus data tersebut?`)) {
      let endpoint = `http://localhost:8000/transaksi/${id}`;
      axios
        .delete(endpoint, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }
  convertPdf() {
    //ambil element yang akan didownload ke pdf
    let element = document.getElementById(`target`);
    let options = {
      filename: "Laporan.pdf",
    };
    domToPdf(element, options, () => {
      window.alert("Laporan akan dicetak!");
    });
  }

  printStruk(id) {
    var element = document.getElementById(`struk${id}`);
    var options = {
      filename: `struk-${id}.pdf`,
    };
    domToPdf(element, options, () => {
      window.alert("Struk akan dicetak!");
    });
  }
  searching(ev) {
    let code = ev.keyCode;
    if (code === 13) {
      let data = this.state.masterPacks;
      let found = data.filter((it) =>
        it.member.nama.toLowerCase().includes(this.state.search.toLowerCase())
      );
      this.setState({ transaksi : found });
    }
  }
  render() {
    const target = React.createRef();
    const optionPDF = {
      orientation: `landscape`,
      unit: `cm`,
      format: [21, 29.7],
    };
    return (
      <div className="container">
        <div ref={target} id="target" className="card">
          <div className="card-body">
            <h3 className="tittleTable">
              <i class="fa-solid fa-user-gear"></i> List Transaksi
            </h3>
            <hr id="line"></hr>
            <div className="row">
              <div className="col-3">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Cari data Transaksi"
                  value={this.state.search}
                  onChange={(ev) => this.setState({ search: ev.target.value })}
                  onKeyUp={(ev) => this.searching(ev)}
                ></input>
              </div>
              <div className="col-7"></div>
              <div className="col-2">
              <button
              id="generateLaporan"
              className="btn mb-2"
              onClick={() => this.convertPdf()}
            >
              <i class="fa-solid fa-print"></i> Cetak Laporan
            </button>
            </div>
            </div>
            <ul className="list-group">
              {this.state.transaksi.map((trans) => (
                <li id="listTransaksi" className="list-group-item mt-3">
                  <div className="row">
                    {/* this is member area */}
                    <div className="col-lg-3">
                      <small className="text-info">Pelanggan</small>
                      <br />
                      {trans.member.nama}
                    </div>

                    {/* this is transaksi area */}
                    <div className="col-lg-2">
                      <small className="text-info">Tanggal Transaksi</small>
                      <br />
                      {formatDate(trans.tgl)}
                    </div>

                    {/* this is batas waktu area */}
                    <div className="col-lg-2">
                      <small className="text-info">Laundry Selesai</small>
                      <br />
                      {formatDate(trans.batas_waktu)}
                    </div>

                    {/* this is transaksi area */}
                    <div className="col-lg-2">
                      <small className="text-info">Tanggal Bayar</small>
                      <br />
                      {formatDate(trans.tgl_bayar)}
                    </div>
                    {/* this is total area */}
                    <div className="col-lg-2">
                      <small className="text-info">Total Semua</small>
                      <br />
                      Rp {formatNumber(trans.total)}
                    </div>

                    {/* this is status area */}
                    <div className="col-lg-3">
                      <small className="text-info">Status Laundry</small>
                      <br />
                      <h6>
                        {this.convertStatus(trans.id_transaksi, trans.status)}
                      </h6>
                    </div>

                    {/* this is status bayar area */}
                    <div className="col-lg-4">
                      <small className="text-info">Status Bayar</small>
                      <br />
                      <h6>
                        {this.convertStatusBayar(
                          trans.id_transaksi,
                          trans.dibayar
                        )}
                      </h6>
                    </div>
                    {/* this is struk area */}
                    <div className="col-lg-2">
                      <small className="text-info">Struk Pembayaran</small>
                      <br />
                      <button
                        id="edit"
                        className="btn btn-sm "
                        onClick={() => this.printStruk(trans.id_transaksi)}
                      >
                        <i class="fa-solid fa-receipt"></i> Struk
                      </button>
                    </div>
                    <div style={{ display: `none` }}>
                      <div
                        id={`struk${trans.id_transaksi}`}
                        className="col-lg-12 p-3"
                      >
                        <h2 className="text-center struk-brand"><i class="fa-solid fa-shirt"></i> Cuci'in</h2>
                        <h4 className="text-center desc">Jl. Sungai Kilimanjaro No.3 Telp. 08123456789</h4>
                        <h5>Pelanggan : {trans.member.nama}</h5>
                        <h5>Tanggal Transaksi : {formatDate(trans.tgl)}</h5>
                        <h5>Petugas : {trans.user.nama}</h5>

                        <div
                          className="row mt-3"
                          style={{ borderBottom: `1px dotted black` }}
                        >
                          <h3 className="Tittle">Detail Trasaksi</h3>
                          <div className="col-4">Paket</div>
                          <div className="col-2">QTY:</div>
                          <div className="col-3">Harga Satuan</div>
                          <div className="col-3">Total</div>
                        </div>

                        {trans.detail_transaksi.map((item) => (
                          <div
                            className="row mt-3"
                            style={{ borderBottom: `1px dotted black` }}
                          >
                            <div className="col-4">
                              {item.paket.jenis_paket}
                            </div>
                            <div className="col-2">{item.qty}</div>
                            <div className="col-3">
                              Rp {formatNumber(item.paket.harga)}
                            </div>
                            <div className="col-3">
                              {item.paket.harga * item.qty}
                            </div>
                          </div>
                        ))}
                        <div className="row mt-2">
                          <div className="col-lg-9"></div>
                          <div className="col-lg-3">
                            <h4>Rp {trans.total}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* delete button */}
                    <div className="col-lg-3">
                      <small className="text-info">Hapus Transaksi</small>
                      <br></br>
                      <button
                        className="btn btn-sm"
                        id="hapus"
                        onClick={() => this.deleteTransaksi(trans.id_transaksi)}
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                  <hr />
                  {/* area detail transaksi */}
                  <h5 className="Tittle">Detail Transaksi</h5>
                  {trans.detail_transaksi.map((detail) => (
                    <div className="row">
                      {/* area nama paket */}
                      <div className="col-lg-3">{detail.paket.jenis_paket}</div>
                      {/* area quantity paket */}
                      <div className="col-lg-2">
                        Qty:
                        {detail.qty}
                      </div>
                      {/* area harga paket */}
                      <div className="col-lg-3">
                        @ Rp
                        {formatNumber(detail.paket.harga)}
                      </div>
                      {/* area harga total */}
                      <div className="col-lg-4">
                        Rp
                        {formatNumber(detail.paket.harga * detail.qty)}
                      </div>
                    </div>
                  ))}
                  <div className="row">
                    
                  <div className="col-lg-8 Tittle">TOTAL</div>
                  <div className="col-lg-4 Tittle">Rp {formatNumber(trans.total)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
