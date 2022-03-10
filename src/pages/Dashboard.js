import React from "react";
import axios from "axios";
import { formatNumber, authorization } from "../config";

export default class Dashboard extends React.Component{
    constructor(){
        super()

        this.state = {
            jumlahMember: 0,
            jumlahPaket: 0,
            jumlahTransaksi: 0,
            income: 0
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }

    getSummary(){
        let endpoint = `http://localhost:8000/member`
        axios.get(endpoint,authorization)
        .then(response => {
            this.setState({jumlahMember: response.data.length})
        })
        .catch(error => console.log(error))

        //paket
        endpoint = `http://localhost:8000/paket`
        axios.get(endpoint,authorization)
        .then(response => {
            this.setState({jumlahPaket: response.data.length})
        })
        .catch(error => console.log(error))

        //transaksi
        endpoint = `http://localhost:8000/transaksi`
        axios.get(endpoint, authorization)
        .then(response => {
            let dataTransaksi = response.data
            let income = 0
            for (let i = 0; i < dataTransaksi.length; i++) {
                let total  = 0;
                for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                    let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                    let qty = dataTransaksi[i].detail_transaksi[j].qty
                    
                    total += (harga * qty)
                }

                income += total
            }
            this.setState({
                jumlahTransaksi: response.data.length,
                income: income
            })
        })
        .catch(error => console.log(error))
    }

    componentDidMount(){
        this.getSummary()
    }
    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center bg-primary m-1">
                            <div className="card-body">
                                <h4 className="card-title text-white">Jumlah Member</h4>
                                <h2 className="text-white">{this.state.jumlahMember}</h2>
                                <h6 className="text-white">Member yang tergabung dalam laundry</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center bg-warning m-1">
                            <div className="card-body">
                                <h4 className="card-title text-white">Jumlah Paket</h4>
                                <h2 className="text-white">{this.state.jumlahPaket}</h2>
                                <h6 className="text-white">Jenis yang tersedia</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center bg-info m-1">
                            <div className="card-body">
                                <h4 className="card-title text-white">Jumlah Transaksi</h4>
                                <h2 className="text-white">{this.state.jumlahTransaksi}</h2>
                                <h6 className="text-white">Jumlah pencapaian transaksi</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="card bg-success m-1">
                            <div className="card-body">
                                <h4 className="card-title text-white text-center">
                                    Income
                                </h4>
                                <h2 className="text-white text-center">Rp {formatNumber(this.state.income)}</h2>
                                <h6 className="text-white text-center">Jumlah income Bulan ini</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}