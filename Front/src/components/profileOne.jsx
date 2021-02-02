import React, { Component } from 'react';
import './CSS/profileOne.css';
import { isExpired } from "react-jwt";
import {renewToken} from './requests';
 
import axios from 'axios';


class ProfileOne extends Component {


    constructor(props) {
        super(props);
        this.state = {
            usernameError:false,
            emailError:false,
            succeed:false,
            firstName: "",
            lastName:"",
            username:"",
            emailProfile:""

        };
    
        this.loadData = this.loadData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

    handleChange = (e) => { 
        let target=e.target;
        let name = target.name;
        let value = target.value
        this.setState({
            [name]:value
        });
        }


    componentDidMount()
    {
        
        console.log("mounted")
        this.loadData()

    }


    async loadData()
    {
        let token = sessionStorage.getItem("access")
        if(isExpired(sessionStorage.getItem("access")))
        {
            console.log("renewing")
            token=await renewToken()

        }
        console.log("fetching data")
        token = "Bearer "+token;
        console.log(token)
        const form = new FormData()
        form.set('id', sessionStorage.getItem("id"))
        const response =
        await axios.post('http://127.0.0.1:8000/api/showpersonalinfo/', form, {
        headers: { 'Content-Type': 'multipart/form-data',
                    'Authorization': token
        },
        })
        console.log(response)
        let fn = (response.data.first_name ? response.data.first_name : "")
        let ln = (response.data.last_name ? response.data.last_name : "")
        this.setState({firstName:fn,lastName:ln,username:response.data.username,emailProfile:response.data.email})

    }



        async handleSubmit(){
            if(this.state.username.startsWith("user-") && this.state.username!=="user-"+sessionStorage.getItem("id"))
                return this.setState({usernameError:true,emailError:false,succeed:false})
            var validator = require("email-validator");
            if(!validator.validate(this.state.emailProfile))
                return this.setState({usernameError:false,emailError:true,succeed:false})
            let token = sessionStorage.getItem("access")
            if(isExpired(sessionStorage.getItem("access")))
            {
                console.log("renewing")
                token=await renewToken()
            }
            console.log("fetching data")
            token = "Bearer "+token;
            console.log(token)
            const form = new FormData()
            form.set('id', sessionStorage.getItem("id"))
            form.set('first_name', this.state.firstName)
            form.set('last_name', this.state.lastName)
            form.set('username', this.state.username)
            form.set('email', this.state.emailProfile)
            const response =
            await axios.post('http://127.0.0.1:8000/api/getpersonalinfo/', form, {
            headers: { 'Content-Type': 'multipart/form-data',
                        'Authorization': token
            },
            })
            console.log(response)
            if(response.data.message)
            {
                if(response.data.message==="This username already exist")
                {
                    this.setState({emailError:false})
                    this.setState({usernameError:true})
                    this.setState({succeed:false})
                }
                else if(response.data.message==="This email already exist")
                {
                    this.setState({emailError:true})
                    this.setState({usernameError:false})
                    this.setState({succeed:false})
                }
            }
            else{
                this.setState({emailError:false})
                this.setState({usernameError:false})
                this.setState({succeed:true})
                sessionStorage.setItem("email",this.state.emailProfile)
                sessionStorage.setItem("username",this.state.username)
                
            }

        }

    render() { 
        return ( 
            <React.Fragment>
        

                    <div class="h-100 parisa-css content-form1 d-flex justify-content-center align-items-center">
                    
                        <div className="INPUT-FORM1"> 
                            <p>First Name :</p>
                            <input name="firstName" value={this.state.firstName}  onChange={this.handleChange} type="text" className="input p-2" placeholder="Enter First name"/><br></br>
                            <p>Last Name :</p>
                            <input name="lastName" value={this.state.lastName}  onChange={this.handleChange} type="text" className="input p-2" placeholder="Enter Last name"/><br></br>
                            <p>Username :</p>
                            <input name="username" value={this.state.username}  onChange={this.handleChange} type="text" className="input p-2" placeholder="Enter Username"/>
                            {this.state.usernameError? <p className="pro-error">Username is not available</p> : <br/>}
                            <p>Email :</p>
                            <input name="emailProfile" value={this.state.emailProfile}  onChange={this.handleChange} type="text" className="input p-2" placeholder="Enter Email"/>
                            {this.state.emailError? <p className="pro-error">Email is not valid or already registered!</p> : <br/>}
                            <button className="profile-savebutton btn btn-primary" onClick={this.handleSubmit}>Save</button>
                            {this.state.succeed? <p className="pro-success">Saved successfully!</p> : <br/>}
                        </div>
                            
                            
                            
                    </div>
                
                
            </React.Fragment>
            
         );
    }
}
 
export default ProfileOne;