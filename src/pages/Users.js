import { Modal } from "bootstrap";
import React from "react";
import axios from "axios";
import { authorization } from "../config";

class Users extends React.Component{
    constructor(){
        super()
        this.state = {
            id_user:"",
            nama:"",
            username:"",
            password:"",
            role:"",
            visible:true,
            userss: [
                {
                    id_user: "1", nama:"Doni", username:"dodon", password:"12345", role:"admin"
                },
                {
                    id_user: "2", nama:"Rafli", username:"Rafl", password:"abcd", role:"admin"
                },                
                {
                    id_user: "3", nama:"rehan", username:"reh", password:"12345", role:"admin"
                },
            ]
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
          }
    }
    tambahData(){
        this.modalUsers = new Modal (document.getElementById("modal_users"));
        this.modalUsers.show();

        this.setState({
            action: "tambah",
            id_user: Math.random(1,10000),
            nama: "",
            username:"",
            password:"",
            role:"",
        })
    }
    simpanData(event){
        event.preventDefault();

        if (this.state.action === "tambah"){
            let endpoint = "http://localhost:8000/users"
            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            // let temp = this.state.userss
            // temp.push(data);
            // this.setState({userss:temp})
            
            axios.post(endpoint,data,authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .error(error => console.log(error))
            this.modalUsers.hide()
        }else if (this.state.action === "ubah") {
            // let temp = this.state.userss
            // let index = temp.findIndex(
            //     (user) => user.id_user === this.state.id_user
            // )
            // temp[index].nama = this.state.nama
            // temp[index].username = this.state.username
            // temp[index].password = this.state.password
            // temp[index].role = this.state.role

            // this.setState({userss: temp})
            let endpoint = "http://localhost:8000/users/" + this.state.id_user
            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }
            axios.put(endpoint,data,authorization)
            .then((response) => {
              window.alert(response.data.message)
              this.getData()
            })
            .catch((error) => console.log(error))
            this.modalPaket.hide();
        }
    }
    ubahData(id_user){
        this.modalUsers = new Modal(document.getElementById("modal_users"));
        this.modalUsers.show();

        let index = this.state.userss.findIndex(
            (user) => user.id_user === id_user
        )
        this.setState({
            action: "ubah",
            id_user: id_user,
            nama: this.state.userss[index].nama,
            username: this.state.userss[index].username,
            password: this.state.userss[index].password,
            role: this.state.userss[index].role
        })
    }
    hapusData(id_user){
        if(window.confirm("Apakah anda yakin menghapus data ini?")){

            // let temp = this.state.userss;
            // let index = temp.findIndex((user => user.id_user === id_user))

            // temp.splice(index, 1);

            // this.setState({userss: temp})
            let endpoint = "http://localhost:8000/users/" + id_user

            axios.delete(endpoint,authorization)
            .then((response) =>{
              window.alert(response.data.message)
              this.getData()
            })
            .catch((error) => console.log(error));
        }
    }

    getData(){
        let endpoint = "http://localhost:8000/users"
        axios.get(endpoint,authorization)
        .then(response => {
            this.setState({userss: response.data})
        })
        .catch(error => console.log(error));
    }

    componentDidMount(){
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        if(user.role === 'admin'){
            this.setState({
            visible:true
        })
        }else{
            this.setState({
            visible:false
        })
        }
    }
    render(){
        return(
            <div className="container">
                <div className="card">
                    <div className="card-header bg-warning">
                        <h3 className="text-white text-center">List Users</h3>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.userss.map(user =>(
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <small className="text-info">Nama</small>
                                            <br></br> <h6>{user.nama}</h6>
                                        </div>
                                        <div className="col-lg-4">
                                            <small className="text-info">Username</small>
                                            <br></br> <h6>{user.username}</h6>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className="text-info">Role</small>
                                            <br></br> <h6>{user.role}</h6>
                                        </div>
                                        <div className="col-lg-2 justify-content-center align-self-center">
                                            <div>
                                                <button className={`btn btn-sm btn-warning mx-2 ${this.state.visible ? `` : `d-none`}`} 
                                                onClick={() => this.ubahData(user.id_user)}>
                                                    Edit
                                                </button>
                                                <button className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(user.id_user)}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className={`btn btn-sm btn-info my-3 text-white ${this.state.visible ? `` : `d-none`}`} onClick={()=> this.tambahData()}>
                                Tambah data User
                        </button>
                    </div>
                </div>

                {/* form modal data paket */}
                <div className="modal" id="modal_users">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h4 className="text-white">Form data User</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(ev) => this.simpanData(ev)}>
                                    Nama
                                    <input type="text" className="form-control mb-2" value={this.state.nama}
                                    onChange={(ev) => this.setState({nama: ev.target.value})}></input>
                                    username
                                    <input type="text" className="form-control mb-2" value={this.state.username}
                                    onChange={(ev) => this.setState({username: ev.target.value})}></input>
                                    password
                                    <input type="password" className="form-control mb-2" value={this.state.password}
                                    onChange={(ev) => this.setState({password: ev.target.value})}></input>
                                    role
                                    <input type="text" className="form-control mb-2"value={this.state.role}
                                    onChange={(ev) => this.setState({role: ev.target.value})}></input>
                                    <button className="btn btn-success" type="submit">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Users