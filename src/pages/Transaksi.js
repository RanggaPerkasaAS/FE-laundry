import React from "react";
import axios from "axios";
import { authorization } from "../config";
import ReactToPdf from "react-to-pdf";
import domToPdf from "dom-to-pdf"

export default class Transaksi extends React.Component{
    constructor(){
        super()
        this.state ={
            transaksi: []
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
          }
    }

    getData(){
        let endpoint = "http://localhost:8000/transaksi"
        axios.get(endpoint,authorization)
        .then(response => {
            let dataTransaksi = response.data
            for (let i = 0; i < dataTransaksi.length; i++) {
                let total  = 0;
                for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                    let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                    let qty = dataTransaksi[i].detail_transaksi[j].qty
                    
                    total += (harga * qty)
                }

                //tambahkan key total
                dataTransaksi[i].total = total
            }
            this.setState({transaksi: dataTransaksi})
        })
        .catch( error => console.log(error));
    }

    componentDidMount(){
        this.getData()
    }

    convertStatus(id_transaksi, status ){
        if(status === 1){
            return(
                <div className="badge bg-info text-white">
                    Transaksi Baru
                    <br></br>
                    <a onClick={() => this.changeStatus(id_transaksi,2)} className="text-danger">
                        klik untuk ganti
                    </a>
                </div>
            )
        }else if(status === 2){
            return(
                <div className="badge bg-warning text-white">
                Sedang diproses

                <br></br>
                    <a onClick={() => this.changeStatus(id_transaksi,3)} className="text-danger">
                        klik untuk ganti
                    </a>
                </div>
            )
        }else if(status === 3){
            return(
                <div className="badge bg-secondary text-white">
                Siap diambil
                <br></br>
                    <a onClick={() => this.changeStatus(id_transaksi,4)} className="text-danger">
                        klik untuk ganti
                    </a>
                </div>
            )
        }else if(status === 4){
            return(
                <div className="badge bg-success text-white">
                Telah Diambil
                </div>
            )
        }
    }

    changeStatus(id, status){
        if (window.confirm(`Apakah anda yakin ingin mengganti statusnya?`)) {
            let endpoint = `http://localhost:8000/transaksi/status/${id}`
            let data = {
                status : status
            }

            axios.post(endpoint,data,authorization)
            .then(response => {
                window.alert(`Status telah diubah`)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }

    convertStatusBayar(id_transaksi, dibayar){
        if (dibayar == 0){
            return(
                <div className="badge bg-danger text-white">
                    belum dibayar
                    <br></br>

                    <a onClick={() => this.changeStatusBayar(id_transaksi, 1)} className="text-white">
                        klik untuk mengganti status bayar
                    </a>
                </div>
            )
        }else if(dibayar == 1){
            return(
                <div className="badge bg-success text-white">
                    Sudah dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status){
        if(window.confirm(`Apakah yakin mngubah status bayar?`)){
            let endpoint = `http://localhost:8000/transaksi/bayar/${id}`

            axios.get(endpoint,authorization)
            .then(response => {
                window.alert(`status bayar berhasil diubah`)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    deleteTransaksi(id){
        if(window.confirm(`Apakah anda yakin menghapus data tersebut?`)){
            let endpoint = `http://localhost:8000/transaksi/${id}`
            axios.delete(endpoint,authorization)
            .then(response =>{
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    convertPdf(){
        //ambil element yang akan didownload ke pdf
        let element = document.getElementById(`target`)
        let options ={
            filename : "Laporan.pdf"
        }
        domToPdf(element,options ,() => {
            window.alert("Laporan akan dicetak!")
        })
    }
    render(){
        const target = React.createRef()
        const optionPDF = {
            orientation : `landscape`,
            unit: `cm`,
            format: [21, 29.7]
        }
        return(
            <div className="container">
                <div ref={target} id="target" className="card">
                    <div className="card-header bg-primary">
                        <h4 className="text-white">List Transaksi</h4>
                    </div>
                    
                    <div className="card-body">
                    <button className="btn btn-danger mb-2" onClick={() => this.convertPdf()}>
                    Cetak Laporan
                    </button>
                        <ul  className="list-group">
                            {this.state.transaksi.map(trans => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/* this is member area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Member
                                            </small><br />
                                            {trans.member.nama}
                                        </div>

                                        {/* this is transaksi area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Tanggal
                                            </small><br/>
                                            {trans.tgl}
                                        </div>

                                        {/* this is batas waktu area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Batas Waktu
                                            </small><br/>
                                            {trans.batas_waktu}
                                        </div>

                                        {/* this is transaksi area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                TGL BAYAR
                                            </small><br/>
                                            {trans.tgl_bayar}
                                        </div>

                                        {/* this is status area */}
                                        <div className="col-lg-2">
                                            <small className="text-info">
                                                Status
                                            </small><br/>
                                            <h6>{this.convertStatus(trans.id_transaksi,trans.status)}</h6>
                                        </div>

                                        {/* this is status bayar area */}
                                        <div className="col-lg-2">
                                            <small className="text-info">
                                                Status Bayar
                                            </small><br/>
                                            <h6>{this.convertStatusBayar(trans.id_transaksi,trans.dibayar)}</h6>
                                        </div>

                                        {/* total */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Total
                                            </small>
                                            <br></br>
                                            Rp {trans.total}
                                        </div>

                                        {/* delete button */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Action
                                            </small>
                                            <br></br>
                                            <button className="btn btn-sm btn-danger" onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <br />
                                    {/* area detail transaksi */}
                                    <h5>Detail Transaksi</h5>
                                    {trans.detail_transaksi.map(detail => (
                                        <div className="row">
                                            {/* area nama paket */}
                                            <div className="col-lg-3">
                                                {detail.paket.jenis_paket}
                                            </div>
                                            {/* area quantity paket */}
                                            <div className="col-lg-2">
                                                Qty:
                                                {detail.qty}
                                            </div>
                                            {/* area harga paket */}
                                            <div className="col-lg-3">
                                                @ Rp
                                                {detail.paket.harga}
                                            </div>
                                            {/* area harga total */}
                                            <div className="col-lg-4">
                                                Rp 
                                                {detail.paket.harga * detail.qty}
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
