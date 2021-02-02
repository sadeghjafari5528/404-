//Coded by Sajad
//expremental solution is used for passing (this) to functions
//

import React, { Component } from 'react';
import {Link, Redirect} from "react-router-dom";
import NewChatroom from './newChatroom';
import './CSS/leftMenu.css';


class LeftMenu extends Component {
    state = {  
        show: false,
        chatrooms:this.props.chatrooms,
        activeChatroom:this.props.activeChatroom,
        activeNav:this.props.activeNav,
    }

    componentDidMount(){
        console.log("leftmenu state =>",this.state)
        // console.log(this.props.activeNav, "===", 1)
        // if ( this.props.activeNav === 1)
        // {
        //     this.setState({preAddress:"qanda"})
        // }
            
        // else
        //     this.setState({preAddress:"discussion"})
        // this.loadChatrooms()
        // for (let i = 0;i<this.state.chatrooms.length;i++)
        //     if (this.state.chatrooms[i].id === this.state.activeChatroom)
        //         document.getElementById("goToSelectedChatroom"+this.state.activeChatroom).click()
    }

    componentDidUpdate(preprops){
        if(preprops.activeChatroom !== this.props.activeChatroom)
        {
            this.setState({activeChatroom:this.props.activeChatroom})
        }
        if(preprops.activeNav !== this.props.activeNav)
        {
            this.setState({activeNav:this.props.activeNav})
        }
        if(preprops.chatrooms !== this.props.chatrooms)
        {
            this.setState({chatrooms:this.props.chatrooms})
        }
    }

    

    // handleLogOutClick = () =>{
    //     window.$username = "";
    //     this.props.refToSelectComponent(0);
    // }

    showModal = (submit) => {
        this.setState({ submit: submit });
        this.setState({ show: true });
        // console.log(this.state.submit)

    };

    hideModal = () => {
        this.setState({ show: false });
        this.setState({ submit: -2 });
        this.props.loadChatrooms()
    };

    logOut=()=>{
        sessionStorage.removeItem("id")
        sessionStorage.setItem("targetURL","/")
    }

    render() { 
        window.$username="username"
        return (
            <div className="max-height">
            
                <div className="d-flex flex-column justify-content-center fix-height">
                    <div className="d-flex pl-4 align-top" id="profile">
                        <div className="d-flex align-items-center mr-3"><img  id="profile-img" 
                            src={sessionStorage.getItem("avatar")} /></div>
                        <h1 className="pt-1 h4 d-flex align-items-center pr-4">{sessionStorage.getItem("username")}</h1>
                    </div>



                    <div className="nav d-flex flex-column nav-pills fill">
                        <div>
                            {this.state.chatrooms.map(chatroom => 
                            <Link id={"goToSelectedChatroom"+chatroom.id} key={chatroom.id} 
                                className={"nav-link ".concat(this.state.activeChatroom===chatroom.id? "active":"")} 
                                onClick={()=> this.props.changeChatroom(chatroom.id)} 
                                to={"/"+this.state.activeNav+chatroom.id} >
                                <div className="d-flex flex-row ">
                                    <img className="d-flex align-items-center mr-3" id="chatroom-img" src={chatroom.Base64} />
                                    <div className="d-flex align-items-center pr-5">{chatroom.name}</div>
                                </div>
                            </Link>)}
                        </div>
                    </div>



                    <div className="leftMenu-buttons w-100 d-flex flex-column align-bottom">
                        <Link to="/chatroomcreationfirst">
                            <button onClick={this.showModal} className="leftMenu-buttons-newchatroom w-100 d-flex align-items-center justify-content-center">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                                new chatroom
                            </button>
                        </Link>
                        
                        <div className="w-100 d-flex flex-row">
                            <Link className="leftMenu-buttons-logOut w-50  p-0" to="/login" onClick={this.logOut}>
                            {/* onClick={() => this.handleLogOutClick()} */}
                                <button  className=" w-100 d-flex align-items-center justify-content-center">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-door-open-fill m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2v13h1V2.5a.5.5 0 0 0-.5-.5H11zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                                    </svg>Logout
                                </button>
                                </Link>
                                <Link className="w-50 p-0" to="/setting">
                                <button className="leftMenu-buttons-setting w-100 d-flex align-items-center justify-content-center">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-sliders m-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
                                    </svg>Setting
                                </button>
                            </Link>
                        </div>
                    
                    </div>
                    
                    
                    
                {/* <div className="col-lg-10" >
                    <div id="tab-detail">
                        <h2>Select a chatroom</h2>
                    </div>
                </div> */}
            </div>                
                <NewChatroom hideModal={this.hideModal} show={this.state.show} />
            </div>
        );
    }
}
 
export default LeftMenu;