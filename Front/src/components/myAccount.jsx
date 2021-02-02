import React, { Component } from 'react';
import SelectAvatar from './selectAvatar';
import ProfileOne from './profileOne';
import ProfileTwo from './profileTwo';
import ProfileThree from './profileThree';
import './CSS/myAccount.css';
 
import { isExpired } from "react-jwt";
import {renewToken} from './requests';
import axios from 'axios';


class MyAccount extends Component {
    constructor(props) {
        super(props)
        const src = sessionStorage.getItem("avatar")
        this.state = {
            tabs:[
                {
                    id:1,
                    label:"Personal Info",
                    content:<ProfileOne/>
                },
                {
                    id:2,
                    label:"Activity",
                    content:<ProfileTwo/>
                },
                {
                    id:3,
                    label:"Interests",
                    content:<ProfileThree/>
                }
            ],
            selectedTab:1,
          src,
          preview:null,
          avatarChanged:false,
          currentComponent:<React.Fragment>
            
          </React.Fragment>
        }
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onSave = this.onSave.bind(this)
      }
    
    
      onClose() {
        this.setState({preview: null})
      }
      
      onCrop(preview) {
        this.setState({preview})
        console.log(preview)
      }
    
      async onSave(){
        let src = this.state.preview
        console.log("save button pressed")
        console.log("current preview:",src)
        this.setState({avatarChanged:true,src})
        if(isExpired(sessionStorage.getItem("access")))
        {
            console.log("renewing")
            token=await renewToken()
        }
        let token = sessionStorage.getItem("access")
        token = "Bearer "+token;
        const form = new FormData()
        form.set("id",sessionStorage.getItem("id"))
        form.set("Base64",this.state.preview)
        const response3 =
        await axios.post('http://127.0.0.1:8000/api/editprofilepicture/', form, {
        headers: { 'Content-Type': 'multipart/form-data',
                    'Authorization': token
        },
        })

        sessionStorage.setItem("avatar",this.state.preview)

        console.log( this.state.src)
      }

      tabSelected=(id)=>{
          this.setState({selectedTab:id})
      }

    render() { 
        return ( 
            <React.Fragment>
                <nav className="">
                    <ul className="nav nav-tabs">
                        <div className="w-25 avatar-size p-2">
                            <SelectAvatar src={this.state.src}
                                onCrop={this.onCrop}
                                onClose={this.onClose}
                                onSave={this.onSave} side="20" />
                        </div>
                        <div className="w-75 d-flex flex-column justify-content-center">
                            <p className="h1">{sessionStorage.getItem("username")}</p>
                            <p>{sessionStorage.getItem("email")}</p>
                        </div>
                        {this.state.tabs.map(tab =>
                            <li key={tab.id} className="pl-1 pr-1 nav-item d-flex align-items-end">
                                <a onClick={()=>this.tabSelected(tab.id)}
                                    className={"mb-0 w-100 nav-link d-flex justify-content-center".concat(this.state.selectedTab===tab.id?" active":"").concat(tab.id===2?" disabled":"")} href="#">
                                    {tab.label}
                                </a>
                            </li>
                        )}
                    </ul>
                </nav>
                <div className="myAccount-content">
                    {this.state.tabs[this.state.selectedTab-1].content}
                </div>
            </React.Fragment>
        );
    }
}
 
export default MyAccount;