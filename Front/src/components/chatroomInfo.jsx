import React, { Component } from 'react';
import {Link} from "react-router-dom";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import './CSS/leftMenu.css';
import './CSS/setting.css';
import MyAccount from './myAccount';
import defaultProfileImg from '../img/default-profile-picture.jpg';
import linkImg from '../img/link.png';
import './CSS/chatroomInfo.css';
import CopyToClipboard from "reactjs-copy-to-clipboard";
import ReactTooltip from 'react-tooltip';
import {request} from './requests';
import Texteditor from './texteditor';
import ProfileOwner from './profileOwner';
import JoinChatroom from './joinChatroom';
import Modal from 'react-modal';
import {  toast } from 'react-toastify';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      padding               : '0%',
      width                 : '35%'
    }
};
class ChatroomInfo extends Component {
    state = {
        isDiscussion:this.props.isDiscussion,
        showChatroomProfile: false,
        chatroomName: 'chatroom name',
        selectedTopic: 'Title',
        chatroom_profile_image: null,
        chatroomLink: "link to chatroom",
        copied:false,
        editorContent:null,
        editorVisible:false,
        chatroomId: this.props.Cid,
        showJoinChatroom: false,
        hideJoinChatroom:false,
        userid: sessionStorage.getItem("id"),
        isJoined: '',
    }

    componentDidUpdate(prevProps) {
        // console.log("inside componentDidUpdate")
        // console.log("chatroom changed from ",prevProps.Cid ," to ",this.props.Cid)
        if (prevProps.Cid !== this.props.Cid) {
            this.setState({chatroomId:this.props.Cid})
            console.log("chatroom changed from ",prevProps.Cid ," to ",this.props.Cid)
            this.loadData()
            
        }
        if (prevProps.isJoined !== this.props.isJoined) {
            this.setState({isJoined:this.props.isJoined})  
        }
        if (prevProps.isDiscussion !== this.props.isDiscussion) {
            this.setState({isDiscussion:this.props.isDiscussion})  
        }

      }

    updateJoinState = (joinState) =>{
        if(this.state.isDiscussion)
            this.props.changeJoinState(joinState)
        this.setState({
            isJoined: joinState,
        })
    }


    handleCopy=(e)=>{
        // copyToClipboard('Text to copy');
        // console.log("Clicked")
        toast.info("Copied");
        this.setState({copied:true})
    }

    showEditor = () => {
    this.setState({ editorVisible: true });
    };
    
    hideEditor = (submit) => {
      this.setState({ editorVisible: false });
      if(submit)
        this.handleSubmitQuestion()
    };

    updateContent = (value) => {
    this.setState({editorContent:value})
    };


    handleSubmitQuestion= async ()=>{
        let config ={
            url:"http://127.0.0.1:8000/api/AddQuestion/",
            needToken:true,
            type:"post",
            formKey:[
                "user_id",
                "chatroom",
                "text"
            ],
            formValue:[
                sessionStorage.getItem('id'),
                this.state.chatroomId,
                this.state.editorContent
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        // console.log(await request(config))
        // console.log("outside",data)
        // console.log(data)
        this.setState({editorContent:null})
        if(this.props.loadQuestions)
            this.props.loadQuestions()
    }

    componentDidMount = () => {
        this.loadData();
        this.loadJoinState();
    }

    loadData = async () => {
        let config = {
            url:"http://127.0.0.1:8000/api/ShowChatroomProfile/",
            needToken:true,
            type:"post",
            formKey:[
                "chatroomId",
            ],
            formValue:[
                this.props.Cid
            ]
        };
        let data = [];
        data = await request(config);
        if (data) {
            this.setState({
                selectedTopic: data.selectedTopic,
                chatroomName: data.chatroomName,
                Description: data.Description,
                chatroom_profile_image: data.chatroom_profile_image,
                chatroomLink: "http://localhost:3000/"+(this.state.isDiscussion?"discussion":"qanda")+this.state.chatroomId,
            });
        }
        // console.log(data.chatroom_profile_image)
    }


    showJoinChatroom = () => {
        // this.setState({ showProfilePreview: submit });
        this.setState({ showJoinChatroom: true });
        // console.log(this.state.submit)
    
    };
    
    hideJoinChatroom = () => {
        this.setState({ showJoinChatroom: false });
    };

    showChatroomProfile = () => {
        // this.setState({ showProfilePreview: submit });
        this.setState({ showChatroomProfile: true });
        // console.log(this.state.submit)
    
    };

    
    hideChatroomProfile = () => {
        this.setState({ showChatroomProfile: false });
    };

    
    modalClick = (e) => {
        // e.preventDefault();
        e.stopPropagation();
        return false;
      }

    handleJoinClick = () => {
        if(this.state.isJoined) {
            this.showEditor()
        }else{
            this.showJoinChatroom()
        }
    }

    loadJoinState = async () =>{
        console.log("enter enter enter")
        let config ={
            url:"http://127.0.0.1:8000/api/checkJoin/",
            needToken:false,
            type:"post",
            formKey:[
                "id",
                "chatroomId",
            ],
            formValue:[
                sessionStorage.getItem('id'),
                this.props.Cid
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        if (data.message === "User has joined") {
            // this.props.isJoined = true
            this.setState({
                isJoined: true,
            })
            this.updateJoinState(true)
            // this.props.hideJoinChatroom()
            // toast.dark("Welcom to the chatroom");
        }else if(data.message === "user is not joined yet"){
            this.setState({
                isJoined: false,
            })
            this.updateJoinState(false)
        }
    }
    

    render() { 
        return (  
            <div className="chatroomInfo w-100 chatroomInfo-infoBox">
                <ReactTooltip place="right" effect="solid" type="dark"/>
                <JoinChatroom 
                  loadChatrooms={this.props.loadChatrooms}
                  chatroomName={this.state.chatroomName}
                  isJoined={this.state.isJoined}
                  Cid={this.state.chatroomId}
                  hideJoinChatroom={this.hideJoinChatroom}
                  showJoinChatroom={this.state.showJoinChatroom}
                  showWelcomeChatroom={this.state.showWelcomeChatroom}
                  hideWelcomeChatroom={this.hideWelcomeChatroom}
                  updateJoinState={this.updateJoinState}
                />
                <Texteditor 
                content={this.state.content} 
                updateContent={this.updateContent} 
                hideEditor={this.hideEditor}
                editorVisible={this.state.editorVisible}/>
                {/* <ReactTooltip place="bottom" effect="solid" type="dark"/> */}
                <div className="chatroomInfo-infoElements d-flex flex-row">
                    <div className="chatroomInfo-avatar-name-contexet-link d-flex flex-row">
                        <div style={{cursor:"pointer"}} onClick={this.showChatroomProfile} className="chatroomInfo-infoImg">
                            <img src={this.state.chatroom_profile_image} alt="chatroom profile image"/>
                        </div>
                        <div className="chatroomInfo-userInfo">
                            <div className="d-flex flex-row">
                                <h2 style={{cursor:"pointer"}} onClick={this.showChatroomProfile} className="">{this.state.chatroomName}</h2>
                                <CopyToClipboard text={this.state.chatroomLink} onCopy={() => this.handleCopy()}>
                                    <div className=" d-flex flex-row">
                                        
                                        <img src={linkImg} className="h-100"
                                            data-tip={this.state.copied?"Copied":"Click to copy"} />
                                        {/* <small className="ml-3 h-100">{this.state.copied?"Copied":""}</small> */}
                                    </div>
                                    
                                    
                                </CopyToClipboard>
                                
                            </div>
                            <h3>{this.state.selectedTopic}</h3>
                        </div>
                    </div>
                    <div className="chatroomInfo-button d-flex flex-row-reverse">
                        {this.state.isDiscussion?(this.state.isJoined?"":
                        <button style={{outline:"none"}} 
                            onClick={this.handleJoinClick}   
                            className="float-right btn-pro mr-2 chatroomInfo-submiteAnswerButton">
                            Join
                        </button>):
                        <button style={{outline:"none"}} 
                            onClick={this.handleJoinClick}   
                            className="float-right btn-pro mr-2 chatroomInfo-submiteAnswerButton">
                            Submit Question
                        </button>}
                    </div>
                </div>
                <div id="showChatroomProfile">
                    {this.state.showChatroomProfile?
                    <div onClick={() => this.hideChatroomProfile()} className="modal">
                        <section onClick={this.modalClick} className="modal-main d-flex flex-column">
                            <ProfileOwner loadChatrooms={this.props.loadChatrooms} updateJoinState={this.updateJoinState} isJoined={this.state.isJoined} Cid={this.state.chatroomId} hideChatroomProfile={this.hideChatroomProfile}/>
                        </section>
                    </div>
                    :""}
                </div>
            </div>
        );
                
    }
    
}



 
export default ChatroomInfo;