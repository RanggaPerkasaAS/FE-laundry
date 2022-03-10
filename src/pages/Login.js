import axios from "axios";
import React from "react";

class Login extends React.Component{
    constructor(){
        super()
        this.state = {
            username: "",
            password: "",
        }
    }

    loginProcess(event){
        event.preventDefault()

        let endpoint = "http://localhost:8000/login"

        let data ={
            username: this.state.username,
            password: this.state.password
        }

        axios.post(endpoint, data)
        .then(result =>{
            if (result.data.logged) {
                // store token in local storage
                localStorage.setItem("token", result.data.token)
                localStorage.setItem("user", JSON.stringify(result.data.user))
                window.alert("Login success!")
                window.location.href = "/"
            }else{
                window.alert("Sorry maybe your username and password not correct")
            }
        })
        .catch(error => console.log(error));
    }
    render(){
        return(
            <div className="container">
                <div className="col-lg-6" style={{margin: "0 auto" }}>
                    <div className="card">
                        <div className="card-header bg-dark">
                            <h4 className="text-white">Login Box</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={ev => this.loginProcess(ev)}>
                            Username
                            <input type="text" className="form-control mb-2" required 
                            value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                            Password
                            <input type="password" className="form-control mb-2" required 
                            value={this.state.password} onChange={ev => this.setState({password: ev.target.value})}></input>
                        
                            <button type="submit" className="btn btn-login btn-dark">
                                Log in
                            </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login