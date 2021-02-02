import React, { Component } from 'react';
import profileImg from '../img/default-profile-picture.jpg'
import exitImg from '../img/exit.png'
import { getUserAvatar } from './util';
import {request} from './requests.jsx';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import './CSS/profileOwner.css';
import editIcon from '../img/edit2.png';
import saveIcon from '../img/save.png';
import cancelIcon from '../img/cancel.png';
import SelectAvatar from './selectAvatar';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';

const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '',
        isOnline: true,
  
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);
  
  
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

class ProfileOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Cid:this.props.Cid,
            chatroomName: '',
            chatroomTitle: '',
            chatroomDes: '',
            chatroomLink: '',
            OwnerIsEditingName: false,
            OwnerIsEditingLink: false,
            OwnerIsEditingdes: false,
            chatroomAvatar: '',
            preview:null,
            temp:'',
            chatroomLinkMsg: "Put a link for context",
            linkError: false,
            chatroomNameMsg: "Choose a name for your chatroom",
            nameError: false,
            isOnline:false,
            isJoined: this.props.isJoined,
            users: []
        }; 

    }

    componentDidMount = async () => {
        this.loadData();
        this.loadUserData();
    }

    componentDidUpdate(prevProps) {
        console.log("something changed")
        if (prevProps.isJoined !== this.props.isJoined) {
          this.setState({isJoined: this.props.isJoined})
        console.log("Updated")
        }
      }

    loadData = async () => {
        // this.setState({loading:true})

        let config = {
            url:"http://127.0.0.1:8000/api/ShowChatroomProfile/",
            needToken:true,
            type:"post",
            formKey:[
                "chatroomId",
            ],
            formValue:[
                this.state.Cid
            ]
        };
        let data = [];
        data = await request(config);
        if (data) {
            this.setState({
                chatroomName: data.chatroomName,
                chatroomTitle: data.selectedTopic,
                chatroomDes: data.Description,
                chatroomLink: data.topicLink,
                chatroomAvatar: data.chatroom_profile_image,
                isOwner: parseInt(sessionStorage.getItem("id")) === data.owner,
            });
        }
        console.log(data)
        // this.setState({loading:false})
    }

    handleEditClick = (id, e) =>{
        if (id === 1)
            this.setState({
                temp: this.state.chatroomName,
                OwnerIsEditingName : true,
            })
        if (id === 2)
            this.setState({
                temp: this.state.chatroomLink,
                OwnerIsEditingLink: true,
            })
        if (id === 3)
            this.setState({
                temp: this.state.chatroomDes,
                OwnerIsEditingDes: true,
            })
        if(id === 4 && this.state.OwnerIsEditingName)
        {
            this.setState({
                nameError:false,
                chatroomName: this.state.temp,
                OwnerIsEditingName : false,
            })
        }
        if(id === 5 && this.state.OwnerIsEditingLink)
        {
            this.setState({
                linkError:false,
                chatroomLink: this.state.temp,
                OwnerIsEditingLink : false,
            })
        }
        if(id === 6 && this.state.OwnerIsEditingDes)
        {
            this.setState({
                chatroomDes: this.state.temp,
                OwnerIsEditingDes : false,
            })
        }

    }

    onClose = () => {
        this.setState({preview: null})
      }
      
      onCrop = (preview) => {
        this.setState({preview})
        console.log(preview)
      }
    
    onSave =  () => {
        this.setState({
            chatroomAvatar: this.state.preview
        })
        this.handleSaveEdits(this.state.preview)
    }

      handleSaveEdits = async (input) => {
          this.setState({

          })
            console.log("edited : " , input)
            let sendElement;
            if (input === this.state.chatroomLink){
                if(!this.state.chatroomLink){
                    this.setState({
                        linkError: true,
                    })
                    return ;
                }else {
                    this.setState({
                        linkError: false,
                    })
                }
                sendElement = "topicLink";
                this.setState({
                    chatroomLink: input,
                    OwnerIsEditingLink: false
                })
            }
            if(input === this.state.chatroomName){
                if(!this.state.chatroomName){
                    this.setState({
                        nameError: true,
                    })
                    return ;
                }else {
                    this.setState({
                        nameError: false,
                    })
                }
                sendElement = "chatroomName";
                this.setState({
                    chatroomName: input,
                    OwnerIsEditingName: false
                })
            }     
            if(input === this.state.chatroomDes){
                sendElement = "Description";
                this.setState({
                    chatroomDes: input,
                    OwnerIsEditingDes: false
                })
            }   
            if(input === this.state.preview)
                sendElement = "chatroom_profile_image";
            let config = {
                url:"http://127.0.0.1:8000/api/EditChatroomProfile/",
                needToken:false,
                type:"post",
                formKey:[
                    "chatroomId",
                    sendElement
                ],
                formValue:[
                    this.state.Cid,
                    input
                ]
            };
            let data = [];
            data = await request(config);
            if (data) {
                console.log("data catched")
            }
            console.log(data)
            // this.setState({loading:false})
      }


      handleInputChange =  (e) => {
        let target = e.target;
        let value = target.value;
        let name = target.name;
        this.setState({
          [name]: value,
         
        });
      }

      loadUserData = async () =>{
        console.log("enter enter enter")
        let config ={
            url:"http://127.0.0.1:8000/api/show_Users/",
            needToken:false,
            type:"post",
            formKey:[
                "chatroomId",
            ],
            formValue:[
                this.state.Cid,
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        if (data) {
            console.log(data) 
            this.setState({
                users: data
            })
            for(let i = 0 ;i<this.state.users.length;i++){
                getUserAvatar(this.state.users[i].id)
            }
        }else{
          console.log("Error to load data")  
        }
      }

      handleLeave = async () =>{
        console.log("enter enter enter")
        let config ={
            url:"http://127.0.0.1:8000/api/Left/",
            needToken:false,
            type:"post",
            formKey:[
                "chatroomId",
                "id"
            ],
            formValue:[
                this.state.Cid,
                sessionStorage.getItem('id'),
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        if (data.message === "chatroom_User deleted") {
            console.log("user left");
            // this.props.isJoined: false
            this.setState({
                isJoined: false,
            });
            this.props.updateJoinState(false)
            if(this.props.loadChatrooms)
                this.props.loadChatrooms(2,this.state.chatroomName)
            this.props.hideChatroomProfile();
        }else{
            console.log(data)
        }
      }
    
    render() { 
        return ( 
            // <img src={profileImg} />
            <div className="chProfileOwner chProfileOwner-main-box" style={{overflowY:"hidden"}}>
               
                <div className="chProfileOwner-exitImg">
                        <img onClick={this.props.hideChatroomProfile} src={exitImg} />
                </div>

                <div class="d-flex h-100">
                    <div  className="chProfileOwner-profile d-flex flex-column">
                            <div className="chProfileOwner-headerProfile row d-flex justify-content-center">
                                <div className="chProfileOwner-profileImg col">
                                    {this.state.isOwner? 
                                    <SelectAvatar src={this.state.chatroomAvatar}
                                    onCrop={this.onCrop}
                                    onClose={this.onClose}
                                    onSave={this.onSave} side="30" /> : <img src={this.state.chatroomAvatar} />
                                    }
                                </div>
                                <div className="chProfileOwner-chName-chTitle-chLink col">

                                    <div className="chProfileOwner-chNameBox">
                                        <div className="d-flex flex-row">
                                            <label className="chNameLable" for="chProfileOwner-chLink">Context link : </label> 
                                            <div className="chProfileOwner-chNameEditImg">{this.state.isOwner && !this.state.OwnerIsEditingName ? 
                                                <img onClick={() => this.handleEditClick(1) } alt="editIcon" data-tip="Edit" src={editIcon} /> : 
                                                this.state.OwnerIsEditingName?
                                                <div className="d-flex justify-content-center"> 
                                                    <img className="mr-2" onClick={() => this.handleEditClick(4)} alt="cancelImg" data-tip="cancel" alt="saveIcon" src={cancelIcon} />
                                                    <img onClick={() => this.handleSaveEdits(this.state.chatroomName)} data-tip="Save" alt="saveIcon" src={saveIcon} />
                                                </div> : '' }
                                            </div>
                                        </div>
                                        <div className="chProfileOwner-chName mr-3">
                                            {this.state.isOwner && this.state.OwnerIsEditingName ? <input  onChange={this.handleInputChange} onClick={() => this.handleEditClick(7)} name="chatroomName" type="text" value={this.state.chatroomName}></input> : <label>{this.state.chatroomName}</label>}
                                            {this.state.nameError? <span className="error">{this.state.chatroomNameMsg}</span> : ''}
                                        </div>
                                    </div>


                                    <div className="chProfileOwner-chTitle">
                                        {/* <p>email : {this.state.userEmail}</p> */}
                                        <p>{this.state.chatroomTitle}</p>
                                    </div>


                                    <div className="chProfileOwner-chLinkBox">
                                        <div className="d-flex flex-row">
                                            <label for="chProfileOwner-chLink">Context link : </label> 
                                            <div className="chProfileOwner-chLinkEditImg">{this.state.isOwner && !this.state.OwnerIsEditingLink ? 
                                                <img alt="editIcon" data-tip="Edit" src={editIcon} onClick={() => this.handleEditClick(2) } /> :
                                                this.state.OwnerIsEditingLink ?
                                                <div className="d-flex justify-content-center">
                                                    <img className="mr-2" onClick={() => this.handleEditClick(5)} alt="cancelImg" data-tip="Cancel"  alt="cancelIcon" src={cancelIcon} />
                                                    <img onClick={() => this.handleSaveEdits(this.state.chatroomLink)} data-tip="Save" alt="saveIcon" src={saveIcon} />
                                                </div> : ''
                                                }
                                            </div>
                                        </div>
                                        <div className="chProfileOwner-chLink">
                                            {this.state.isOwner && this.state.OwnerIsEditingLink ? <input onChange={this.handleInputChange} name="chatroomLink" type="text" value={this.state.chatroomLink}></input> : <a href={this.state.chatroomLink} target="blank">Click here!</a>}
                                            {this.state.linkError? <span className="error">{this.state.chatroomLinkMsg}</span> : ''}
                                        </div>
                                    </div>


                                </div> 
                            </div>


                            <div className="chProfileOwner-desBox">
                                <div className="d-flex flex-row">
                                    <label for="chProfileOwner-des">Description :</label>
                                    <div className="chProfileOwner-desEditImg">{this.state.isOwner && !this.state.OwnerIsEditingDes ? 
                                        <img alt="editIcon" data-tip="Edit" src={editIcon} onClick={() => this.handleEditClick(3)} /> :
                                        this.state.OwnerIsEditingDes ?
                                        <div className="d-flex justify-content-center">
                                            <img className="mr-2" onClick={() => this.handleEditClick(6)} alt="cancelImg" data-tip="Cancel" src={cancelIcon} />
                                            <img onClick={() => this.handleSaveEdits(this.state.chatroomDes)} data-tip="Save" alt="saveIcon" src={saveIcon} />
                                        </div> : ''
                                        }
                                    </div>
                                </div>
                                <div className="chProfileOwner-des">
                                    {this.state.isOwner && this.state.OwnerIsEditingDes ? <textarea onChange={this.handleInputChange} name="chatroomDes" type="text" value={this.state.chatroomDes}></textarea> : <p>{this.state.chatroomDes}</p>}
                                </div>
                            </div>

                            {this.state.isJoined?
                                <div className="chProfileOwner-leaveButton mt-auto">
                                    <button onClick={this.handleLeave}>Leave Chatroom</button>
                                </div> : ''
                            }
                        </div>
                    {/* <div className="w-100 h-100">
                        <div className="h-100 parisa-css content-form1 d-flex justify-content-center align-items-center">
                            <div className="INPUT-FORM1">
                                <p>Name :</p>
                                <input name="lastName" value={this.state.lastName}  onChange={this.handleChange} type="text" className="input p-2" placeholder="Enter Last name"/><br></br>
                                <p>Description :</p>
                                <input name="Description" value={this.state.Description}  onChange={this.handleChange} type="text" className="input p-2" placeholder="Enter Description"/>
                                {this.state.DescriptionError? <p className="pro-error">Description Must Be Full!</p> : <br/>}
                                <button className="btn btn-primary" onClick={this.handleSubmit}>Save Changes</button>
                                {this.state.succeed? <p className="pro-success">Saved successfully!</p> : <br/>}
                                <button className="btn btn-primary" onClick={this.handleSubmit}>Delete Chatroom</button>
                                {this.state.succeed? <p className="pro-success">Delete successfully!</p> : <br/>}  
                            </div>
                        </div>
                    </div> */}


                        <link href="http://getbootstrap.com/examples/jumbotron-narrow/jumbotron-narrow.css" rel="stylesheet"/>
                        <link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css"/>
                        <div className="jumbotron list-content ml-auto ">
                            <div href="#" className="chProfileOwner-list-group-item title w-100 ">
                                   Members
                            </div>
                            <ul className="list-group">
                                {this.state.users.map(u => 
                                        <li className ="d-flex justify-content-start" key={u.id} >
                                            {this.state.isOnline?
                                                <StyledBadge
                                                overlap="circle"
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                                }}
                                                variant="dot"
                                                >
                                                    <Avatar alt="Avatar" src={sessionStorage.getItem(u.id+":avatar")} />
                                                </StyledBadge> :    
                                                    <img className="img-thumbnail" src={sessionStorage.getItem(u.id+":avatar")} />
                                            }
                                            
                                            <label className="name w-75 ml-3 mt-auto mb-auto">
                                                {u.name}
                                            </label>
                                        </li>
                                    )}
                            </ul>
                        </div>
                    </div>    
                    <ReactTooltip place="right" effect="solid" type="dark"/>          
            </div>          
        );
    }
}
 
export default ProfileOwner;