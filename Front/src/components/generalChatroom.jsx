import React, { Component } from 'react';
import ChatroomInfo from './chatroomInfo.jsx';
import LoadingPage from './loading';
import MessageBox from './messageBox';
import {connect,listen,send} from './socket';
import { Input } from 'react-chat-elements'
import { isExpired } from "react-jwt";
import {renewToken,request} from './requests'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResizeObserver from 'rc-resize-observer';
import { Dropdown } from 'react-bootstrap';


 


class GeneralChatroom extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isOwner:false,
            isJoin:true,
            replying:null,
            replyingTo:null,
            inputValue:"",
            loading:false,
            inputRef:React.createRef(),
            chats:[],
            inputHeight:37,
            ChatroomID:parseInt(this.props.match.params.chatroomid),

        };
        this.componentDidMount=this.componentDidMount.bind(this)
        // this.loadQuestions=this.loadQuestions.bind(this)
    }
    newMessage=(message)=>{
        // console.log(message)
        if(message.order_type==="delete_message")
        {
            let temp  = this.state.chats.filter(function(item) {
                return item.message_id !== message.message_id
            })

            this.setState({chats:temp})
            // for (let i = 0;i<temp.length;i++)
            // {
            //     if (temp[i].message_id === message.message_id)
            //     {
            //         temp.remo
            //     }
            // }
        }
        else if (message.order_type==="create_message")
        {
            this.setState({chats:[...this.state.chats,message]})
        }
        console.log(message)
        // this.setState({chats:[...this.state.chats,message]})
        // console.log("received info:",message.data)
        // console.log("old chats:",this.state.chats)
        // console.log("new chats:",this.state.chats)
        // let data = JSON.parse(message.data);
        //   console.log(data);
        //   if (data.message)
        // this.setState({time:data.message})
      }

    async componentWillMount(){
        if(this.state.ChatroomID!==-1)
        {
            await connect("ws://127.0.0.1:8000/ws/api/generalchatroom/"+this.state.ChatroomID+"/");
            await listen("message",this.newMessage); 
        }  
      }


    componentDidMount(){
        sessionStorage.removeItem("search")
        // var msg = document.getElementById("message"); 
        let button = document.getElementById("generalChatroomSendButton"); 
        let textBox = document.getElementById("sendOnEnter"); 
  
        // This event is fired when button is clicked 
        if(this.state.ChatroomID!==-1)
            textBox.addEventListener("keyup", function (event) { 
                if (event.keyCode === 13 && event.shiftKey) { 
                    button.click();  
                } 
            }); 
        

        this.loadChats()
    }

    componentDidUpdate(prevProps) {
        // console.log("something changed")
        if (prevProps.match.params.chatroomid !== this.props.match.params.chatroomid) {
          this.setState({ChatroomID:parseInt(this.props.match.params.chatroomid)})
        this.loadChats()
        }
      }

    changeJoinState=(state)=>
    {
        this.setState({isJoin:state})
        if(state)
        {
            this.setState({inputHeight:37})
        }
        else
            this.setState({inputHeight:0,})
    }

    loadChats=async()=>{
        if(this.props.match.params.chatroomid ==="-1")
            return false
        this.setState({loading:true})
        console.log("fetching Questions")
        let config ={
            url:"http://127.0.0.1:8000/api/show_Message/",
            needToken:true,
            type:"post",
            formKey:[
                "chatroomId",
            ],
            formValue:[
                this.props.match.params.chatroomid,
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        // console.log(await request(config))
        console.log("outside",data)
        if (data)
        {
            this.setState({chats:data})
            console.log("state set")
        }
        this.loadData()
        this.setState({loading:false})
        // console.log(data)
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
                this.state.ChatroomID
            ]
        };
        let data = [];
        data = await request(config);
        if (data) {
            this.setState({
                isOwner: parseInt(sessionStorage.getItem("id")) === data.owner,
            });
        }
        // console.log(data)
        // this.setState({loading:false})
    }

    // inputOnChange=(e)=>{
    //     let target = e.target;
    //     // let value = target.value;
        
    //     this.setState({inputHeight:target.offsetHeight})
    //     // this.forceUpdate()
    //     console.log(target.offsetHeight)
    // }

    sendMessage=async()=>{
        // console.log(this.state.inputRef.input.value)
        if (this.state.inputRef.input.value===""){
            toast.dark("Message is empty!");
            return 0
        }
        toast.dismiss()
        let token = sessionStorage.getItem
        if(isExpired(sessionStorage.getItem('id'))){
        token=await renewToken()
        }
        if (this.state.replying)
            send({
                'order_type' : 'create_message',
                'chatroom_id':this.state.ChatroomID,
                'token': token,
                'message': this.state.inputRef.input.value,
                'replyTo':this.state.replying
            })
        else
            send({
                'order_type' : 'create_message',
                'chatroom_id':this.state.ChatroomID,
                'token': token,
                'message': this.state.inputRef.input.value,
            })
        this.state.inputRef.clear();
        this.setState({inputRef:"",replying:null,replyingTo:null})
    }

    handleDelete=async(message_id)=>{
        let token = sessionStorage.getItem
        if(isExpired(sessionStorage.getItem('id'))){
        token=await renewToken()
        }
        send({
            'order_type' : 'delete_message',
            'chatroom_id':this.state.ChatroomID,
            'token': token,
            'message_id': message_id,
        })
    }

    reply=(id,username)=>{
        // console.log("replying")
        this.setState({replying:id,replyingTo:username})
    }



    render() { 
        return (
            <React.Fragment>
                {this.state.ChatroomID!==-1?
                <React.Fragment>
                    <div id="warning">
                        <ToastContainer
                            className="Toast"
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            />
                        </div>
                    {this.state.loading?<LoadingPage/>: ""}
                    <div className="w-100 h-100 p-2">
                        <div id="question-page" className="d-flex flex-column h-100 w-100">
                            <div id="chatroom-info" className=" d-flex flex-row">
                                <ChatroomInfo
                                    loadChatrooms={this.props.loadChatrooms}
                                    changeJoinState={this.changeJoinState}
                                    isDiscussion={true}
                                    Cid={this.state.ChatroomID}  />
                            </div>
                            <div className="mt-1 mb-1 ml-5 h-100">
                                <div className="messages-box" style={{height: "calc(83vh - 58px - ".concat(this.state.inputHeight).concat("px)")}}>
                                    <div className="mr-5 mb-2">
                                        {this.state.chats.map(chat =>
                                        <div key={chat.message_id} className="mb-3 d-flex flex-row w-100">
                                            <div className={chat.user===parseInt(sessionStorage.getItem("id"))?"ml-auto d-flex flex-row-reverse":"d-flex flex-row"}>
                                                <MessageBox
                                                    reply={this.reply}
                                                    message_id={chat.message_id}
                                                    userid={chat.user}
                                                    title={chat.username}
                                                    text={<span style={{whiteSpace: "pre-line"}}>
                                                            {ReactHtmlParser(chat.text)}
                                                        </span>}
                                                    dateString={chat.time}
                                                    isReply={chat.replyTo}
                                                    titleRep={chat.replyTo?this.state.chats.find(reply => reply.message_id === chat.replyTo).username:null}
                                                    messageRep={chat.replyTo?this.state.chats.find(reply => reply.message_id === chat.replyTo).text:null}/>
                                                <div id="options" className={chat.user===parseInt(sessionStorage.getItem("id"))?"option-right":"option-left"}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle className="" id="dropdown-basic">
                                                            <svg width="15px" height="15px" viewBox="0 0 16 16" class="bi bi-three-dots-vertical" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                                            </svg>
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu className="dropDown">
                                                            <Dropdown.Item as="button" onClick={()=>this.reply(chat.message_id,chat.username)}>Reply</Dropdown.Item>
                                                            {this.state.isOwner?<Dropdown.Item as="button" onClick={()=>this.handleDelete(chat.message_id)}>Delete</Dropdown.Item>:""}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {this.state.isJoin?
                            <ResizeObserver
                                onResize={({ width, height }) => this.setState({inputHeight:height})}
                            >
                            <div id="sendOnEnter">
                                <Input
                                    ref={el => (this.state.inputRef = el)}
                                    // onChange={this.inputOnChange}
                                    // minHeight={50}
                                    placeholder="Type here..."
                                    multiline={true}
                                    autoHeight={true}
                                    rightButtons={
                                        <button
                                            className="p-2 rounded"
                                            // {this.state.inputValue.length===0?disabled:""}
                                            onClick={this.sendMessage}
                                            id="generalChatroomSendButton"
                                            style={{backgroundColor:'#0062cc',color:'white'}}>
                                                Send
                                        </button>
                                    }
                                    leftButtons={this.state.replying?
                                        <div className="black-text">
                                            <button className="p-2 rounded replyToButton">
                                                Replying to {this.state.replyingTo}
                                            </button>
                                            <button className="p-1" style={{backgroundColor:"transparent"}} onClick={()=>this.reply(null,null)}>
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                            </button>
                                        </div>:""
                                        }/>
                            </div>
                            </ResizeObserver>:""}
                        </div>
                    </div>
                </React.Fragment>:""}
            </React.Fragment>
        );
    }
}
 
export default GeneralChatroom;