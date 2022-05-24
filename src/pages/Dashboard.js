import React from "react";
import axios from "axios";
import { formatNumber, authorization } from "../config";
import "../index.css"
import PeopleIcon from '@material-ui/icons/People';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

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
                        <div className="card text-center m-1" id="card">
                            <div className="card-body">
                                <h4 className="card-title text-white"><PeopleIcon/> Jumlah Member</h4>
                                <h2 className="text-white Tittle">{this.state.jumlahMember} Orang</h2>
                                <h6 className="text-white desc">Member yang tergabung dalam laundry</h6>
                                <hr id="hr"></hr>
                                <a className="detail" href="/Member">Detail <ArrowForwardIcon></ArrowForwardIcon> </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center bg-warning m-1" id="card2">
                            <div className="card-body">
                                <h4 className="card-title text-white"><AllInboxIcon/> Jumlah Paket</h4>
                                <h2 className="text-white Tittle">{this.state.jumlahPaket} Paket</h2>
                                <h6 className="text-white desc">Jenis paket yang tersedia</h6>
                                <hr id="hr"></hr>
                                <a className="detail" href="/Paket">Detail <ArrowForwardIcon></ArrowForwardIcon> </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card text-center bg-info m-1" id="card3">
                            <div className="card-body">
                                <h4 className="card-title text-white"><ShoppingCart/> Jumlah Transaksi</h4>
                                <h2 className="text-white Tittle">{this.state.jumlahTransaksi} Transaksi</h2>
                                <h6 className="text-white desc">Jumlah pencapaian transaksi</h6>
                                <hr id="hr"></hr>
                                <a className="detail" href="/Transaksi">Detail <ArrowForwardIcon></ArrowForwardIcon> </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="card m-1" id="card4">
                            <div className="card-body text-center">
                                <h4 className="card-title text-white text-center">
                                   <TrendingUpIcon/> Income
                                </h4>
                                <h2 className="text-white text-center Tittle">Rp {formatNumber(this.state.income)}</h2>
                                <h6 className="text-white text-center desc">Jumlah income Bulan ini</h6>
                                <hr id="hr"></hr>
                                <a className=" detail" href="/form-transaksi">Tambah Transaksi biar stonk <i class="fa-solid fa-plus"></i> </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}