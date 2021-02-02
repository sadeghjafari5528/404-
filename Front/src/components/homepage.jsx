//Coded by Sajad
//initial check done
//tasks remaining :
//1.connecting to backend and reading chatroom list

import React, { Component } from 'react';
import LeftMenu from './leftMenu';
import Navbar from './navbar';
import Chatroom from './chatroom';
import './CSS/homepage.css';
import j_logo from "../img/java-logo.png";
import p_logo from "../img/python-logo.png";
import QuestionsPage from './questionsPage';
import SearchResultPage from './searchResultPage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
    useRouteMatch,
    useParams,
    useHistory 
  } from "react-router-dom";
import GeneralChatroom from './generalChatroom';
import {getActiveChannel,getActiveNav} from './util';
import {request} from './requests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class Homepage extends Component {
//chatrooms id must be non negetive
    constructor(props){
        super(props);
        this.state={
            chatrooms:[],
            activeChatroom:getActiveChannel(),
            activeNav:getActiveNav()
            // targetURL : sessionStorage.getItem("targetURL"),
            // activeNav : sessionStorage.getItem("targetURL")?(toString(sessionStorage.getItem("targetURL")).includes('discussion')?2:1):(1),
            // activeChatroom : sessionStorage.getItem("targetURL")?(sessionStorage.getItem("targetURL").includes('qanda')?parseInt(sessionStorage.getItem("targetURL").split('qanda')[1]):parseInt(sessionStorage.getItem("targetURL").split('discussion')[1])):(-1),
        }
    }

    componentDidMount(){
        sessionStorage.removeItem("targetURL")
        this.loadChatrooms();
    }
    
    changeChatroom=(id)=>{
        this.setState({activeChatroom:id})
    }
    changeNav=(nav)=>{
        this.setState({activeNav:nav})
    }

    loadChatrooms=async(join,chatroomName)=>{

        let config ={
            url:"http://127.0.0.1:8000/api/loadchatroom/",
            needToken:true,
            type:"post",
            formKey:[
                'user_id'
            ],
            formValue:[
                sessionStorage.getItem("id")
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        console.log(data)
        if(data)
            this.setState({chatrooms:data})
        
        if(join===1)
        {
            toast.info("Welcom to "+chatroomName +" chatroom");
        }
        else if(join===2)
        {
            toast.info("You Left "+chatroomName +" Chatroom!");
        }

    }



    render() { 
        return (
            <div className="bg">
                {/* <Link id="selectChatroom" to={"/cr"+this.state.activeChatroom}/> */}
                <div className="LeftColumn">
                    <LeftMenu chatrooms={this.state.chatrooms} loadChatrooms={this.loadChatrooms} activeChatroom={this.state.activeChatroom} activeNav={this.state.activeNav} changeChatroom={this.changeChatroom} />
                </div>
                <div className="RightColumn">
                    <Navbar activeChatroom={this.state.activeChatroom} activeNav={this.state.activeNav} changeNav={this.changeNav} />
                    <div style={{height:"91vh"}}>
                        {/* <button onClick={()=>this.state.refToLeftMenu.current.selectTab(5)}></button> */}
                        {/* <p>{this.state.activeChatroom}</p> */}

                        <Switch>
                            <Route path="/qanda:chatroomid" component={(props)=><QuestionsPage {...props} loadChatrooms={this.loadChatrooms} changeChatroom={this.changeChatroom}/>}/>
                            <Route path="/discussion:chatroomid" component={(props)=><GeneralChatroom {...props} loadChatrooms={this.loadChatrooms}/>}/>
                            <Route path="/search/:searchPhrase" component={SearchResultPage}/>
                        </Switch>
                        
                        
                        
                    </div>
                </div>  
            </div>
        );
    }
}
 
export default Homepage;