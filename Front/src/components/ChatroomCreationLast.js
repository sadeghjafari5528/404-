import React, { Component } from 'react';
import './CSS/ChatroomCreation.css';
import {Link} from 'react-router-dom';
import { isExpired } from "react-jwt";
import SelectAvatar from './selectAvatar';
 
import axios from 'axios';
import {renewToken} from './requests';

class ChatroomCreationLast extends Component {
    

     constructor(props) {
        super(props)
        const src = require('../img/uploadAvatar.png');
        this.state = {
          src,
          preview:null,
          avatarChanged:false,
          chatroomName: null,
          error: false,
        }
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onSave = this.onSave.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleBack = this.handleBack.bind(this);
      }

      handleBack() {
        return "/chatroomCreation" + sessionStorage.getItem("selectedTopic");
      }

      onClose() {
        this.setState({preview: null})
      }
      
      onCrop(preview) {
        this.setState({preview})
        console.log(preview)
      }
    
      onSave(){
        let src = this.state.preview
        console.log("save button pressed")
        console.log("current preview:",src)
        this.setState({avatarChanged:true,src})
        console.log("changed src:",this.state.src)
      }

      handleChange(e) {
        let target = e.target;
        let value = target.value;
        let name = target.name;
        this.setState({
          [name]: value,
        });
        if (name === "chatroomName" && value !== "") {
            this.setState({
                error: false,
            });
        }
      }

      async handleClick() {
        if (!this.state.chatroomName && !this.state.error) {
            return this.setState({
                error: true,
            });
        }
        console.log(sessionStorage.getItem("id"))
        sessionStorage.setItem("topic" , this.state.chatroomName);
        sessionStorage.setItem("chatroomName" , this.state.chatroomName);
        let token = sessionStorage.getItem("access")
        if(isExpired(sessionStorage.getItem("access"))){
        console.log("renewing")
        token=await renewToken()
        }
        console.log("fetching data")
        token = "Bearer "+token;
        console.log(token)
        const form = new FormData()
        if(this.state.avatarChanged)
          form.set('Base64',this.state.src)
        if (sessionStorage.getItem("selectedTopic") === "OS") {
          form.set('selectedTopic', sessionStorage.getItem("selectedTopic"))
          form.set('chatroomName', sessionStorage.getItem("chatroomName"))
          form.set('owner', sessionStorage.getItem("id"))
          form.set('selected', sessionStorage.getItem("selected"))
          form.set('selectedSub', sessionStorage.getItem("selectedSub"))
          form.set('Description', sessionStorage.getItem("Description"))
        }

        if (sessionStorage.getItem("selectedTopic") === "PL") {
          let selected = sessionStorage.getItem("selected")
          form.set('selectedTopic', sessionStorage.getItem("selectedTopic"))
          form.set('chatroomName', sessionStorage.getItem("chatroomName"))
          form.set('owner', sessionStorage.getItem("id"))
          form.set('selected', sessionStorage.getItem("selected") )
          form.set('Link', sessionStorage.getItem("Link"))
          form.set('Description', sessionStorage.getItem("selected"))
        }

        if (sessionStorage.getItem("selectedTopic") === "App") {
          form.set('selectedTopic', sessionStorage.getItem("selectedTopic"))
          form.set('chatroomName', sessionStorage.getItem("chatroomName"))
          form.set('owner', sessionStorage.getItem("id"))
          form.set('Link', sessionStorage.getItem("Link"))
          form.set('Description', sessionStorage.getItem("Description"))
        }

        const response =
        await axios.post('http://127.0.0.1:8000/api/createchatroom/', form, {
        headers: { 'Content-Type': 'multipart/form-data',
                    'Authorization': token
          },
        })
        sessionStorage.removeItem("selectedSub")
        sessionStorage.removeItem("selected")
        sessionStorage.removeItem("selectedTopic")
        sessionStorage.removeItem("Description")
        sessionStorage.removeItem("Link")

        this.props.hideModal()


      }

    render() { 
        return ( 
            <div className="main-box">
                <div className="elements">
                    <div className="d-flex justify-content-center mt-3">
                        <SelectAvatar src={this.state.src}
                            onCrop={this.onCrop}
                            onClose={this.onClose}
                            onSave={this.onSave} side="30" />
                    </div>
                    <div className="nameField">
                        <input name="chatroomName" value={this.state.chatroomName} placeholder="Enter chatroom name" onChange={this.handleChange} />
                    </div>
                    {this.state.error ? <div className="LastError">Please select a name for chatroom</div> : ''}
                    <Link to={this.handleBack}>
                        <button className="backButtonLast" type="button">Back</button>
                    </Link>
                    <Link to={this.state.chatroomName ? "/": "/chatroomCreationLast"} onClick={this.handleClick}>
                        <button className="createButtonLast" type="button">Create</button>
                    </Link>
                </div>
            </div>
         );
    }
}
 
export default ChatroomCreationLast;