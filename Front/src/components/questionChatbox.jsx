import React, { Component } from 'react';
import ShowMoreText from 'react-show-more-text';
import { Dropdown } from 'react-bootstrap';
import LoadingPage from './loading';
import './CSS/questionChatbox.css';
 
import { getUserAvatar } from './util';
import ReactTooltip from 'react-tooltip';
import Texteditor from './texteditor';
import {request} from './requests';
import {Link} from 'react-router-dom';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ProfilePreview from './ProfilePreview';



class QuestionChatbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProfilePreview:false,
            // showProfilePreviewUserid:null,
            show: false,
            isOwner:this.props.senderId===parseInt(sessionStorage.getItem("id")),
            isAnswered:this.props.isAnswered,
            loading:false,
            sameProblem:this.props.sameProblem,
            sameProblemCount:this.props.sameProblemCount,
            senderId:this.props.senderId,
            senderUsername:this.props.senderUsername,
            senderAvatar:null,
            context:this.props.context,
            sentDate:this.props.sentDate,
            showMoreButton:this.props.showMoreButton,
            editorContent:this.props.context,
            QuestionID:this.props.Qid,
            editorVisible:false,
            editorContentAnswer:"",
            editing:false
        };

        this.componentDidMount = this.componentDidMount.bind(this)
    }
    componentDidMount=async()=>{
        // console.log(this.state.sameProblem,"________________________________")
        // console.log(this.state.isAnswered,"________________________________")
        if(this.state.isAnswered === 'false')
            this.setState({isAnswered:false})
        else if(this.state.isAnswered === 'true')
            this.setState({isAnswered:true})
        // console.log(sessionStorage.getItem('id'))
        // console.log(this.props.senderId)
        // console.log("inside");
        // if(!sessionStorage.getItem(this.state.senderId+":avatar"))
        // {
            await getUserAvatar(this.state.senderId);
        // }
        this.setState({senderAvatar:sessionStorage.getItem(this.state.senderId+":avatar")})

        
        // console.log(sessionStorage.getItem(this.state.senderId+":avatar"))
    }

    componentDidUpdate(prevProps) {
        // console.log("inside componentDidUpdate")
        // console.log("chatroom changed from ",prevProps.Cid ," to ",this.props.Cid)
        if (prevProps.context !== this.props.context) {
            
            this.setState({context:this.props.context})
            // console.log("chatroom changed from ",prevProps.Cid ," to ",this.props.Cid)
            // this.loadData()
            
        }
      }
    // state = {
    //     loading:false,
    //     sameProblem:false,
    //     sameProblemCount:0,
    //     senderId:1,
    //     senderUsername:"username",
    //     senderAvatar:icon,
    //     title:"Question title",
    //     context:<div>
    //         Lorem ipsum dolor sit amet, consectetur <a href="https://www.yahoo.com/" 
    //                                 target="_blank" rel="noopener noreferrer">yahoo.com
    //                                 </a> adipiscing elit, sed do eiusmod tempor incididunt 
    //                                 <a href="https://www.google.bg/" title="Google" 
    //                                     rel="nofollow" target="_blank" rel="noopener noreferrer"> www.google.bg
    //                                 </a> ut labore et dolore magna amet, consectetur adipiscing elit, 
    //                                 sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
    //                                 minim veniam, quis nostrud exercitation ullamco laboris nisi
    //                                 ut aliquip ex Lorem ipsum dolor sit amet, consectetur
    //                                 adipiscing elit, sed do eiusmod tempor incididunt ut labore

    //                                 et dolore magna aliqua. Ut enim ad minim veniam, quis
    //                                 nostrud exercitation ullamco laboris nisi ut aliquip ex
    //                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
    //                                 do eiusmod tempor incididunt ut labore et dolore magna
    //                                 aliqua. Ut enim ad minim veniam, quis nostrud exercitation
    //     </div>,
    //     sentDate:new Date().toLocaleString(),

    // }


    loadData=()=>{
        //request to load data from backend
    }

    handleEdit=async()=>{
        // sessionStorage.setItem('id','6')
        this.setState({loading:true})
        let config ={
            url:"http://127.0.0.1:8000/api/EditQuestion/",
            needToken:true,
            type:"post",
            formKey:[
                "chatroom",
                "user_id",
                "id",
                "text",
            ],
            formValue:[
                this.props.Cid,
                sessionStorage.getItem("id"),
                this.props.Qid,
                this.state.editorContent,
            ]
        }
        console.log(config)
        let data = []
        // console.log("outside 0",data)


        data = await request(config)
        // console.log(await request(config))
        // console.log("outside",data)
        // this.setState({editorContent:null})
        this.setState({loading:false})
        this.props.loadQuestions()
        

    }

    handleSubmitAnswer = async () =>{
        this.setState({loading:true})
        console.log(this.state.QuestionID)
        let config ={
            url:"http://127.0.0.1:8000/api/AddAnswer/",
            needToken:true,
            type:"post",
            formKey:[
                "user_id",
                "question",
                "text"
            ],
            formValue:[
                sessionStorage.getItem('id'),
                this.state.QuestionID,
                this.state.editorContentAnswer
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        // console.log(await request(config))
        // console.log("outside",data)
        // console.log(data)
        console.log(data)
        this.setState({editorContentAnswer:null})
        this.setState({loading:false})
        this.props.loadAnswers()
    }

    handleSameProblemClicked=async(voteState)=>{
        if(this.state.sameProblem===voteState)
            return
        this.setState({sameProblem:this.state.sameProblem+voteState,
            sameProblemCount:this.state.sameProblemCount+voteState})

        // console.log("chatroom id is :",this.props.Cid)
        this.setState({loading:true})
        //request to back to change same question status
        let config ={
            url:"http://127.0.0.1:8000/api/VoteQuestion/",
            needToken:true,
            type:"post",
            formKey:[
                "question_id",
                "user_id",
                'voteState'
            ],
            formValue:[
                this.props.Qid,
                sessionStorage.getItem("id"),
                this.state.sameProblem+voteState
            ]
        }
        console.log(config)
        let data = []
        // console.log("outside 0",data)
        data = await request(config)


        console.log(data)
        // console.log(await request(config))
        // console.log("outside",data)
        // console.log(data)
        
        // if(this.state.sameProblem)
        //     this.setState({sameProblemCount:this.state.sameProblemCount-1})
        // else
        //     this.setState({sameProblemCount:this.state.sameProblemCount+1})
        // this.setState({sameProblem:!this.state.sameProblem})
            
        this.setState({loading:false})
        
    }

    handleDelete = async()=>{
        this.setState({loading:true})
        let config ={
            url:"http://127.0.0.1:8000/api/DeleteQuestion/",
            needToken:true,
            type:"post",
            formKey:[
                "chatroom",
                "user_id",
                "id",
            ],
            formValue:[
                this.props.Cid,
                sessionStorage.getItem("id"),
                this.props.Qid,
            ]
        }
        console.log(config)
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        // console.log(await request(config))
        // console.log("outside",data)
        console.log(data)
        this.setState({loading:false})
        this.props.loadQuestions()
    }



    showEditor = () => {
        
    this.setState({ editorVisible: true });
  };
  hideEditor = (submit) => {
    this.setState({ editorVisible: false, });
      if (submit) {
        if (!this.state.editing){
            this.handleSubmitAnswer();
        }else{
            // console.log("editing")
            this.handleEdit()
        }
        this.setState({ editing: false, });
      }

      
  };
  updateContent = (value) => {
        if(this.state.editing)
            this.setState({editorContent:value})
        else
            this.setState({editorContentAnswer:value})
  };

  startEditing=()=>{
      this.setState({editing:true})
      this.showEditor()
  }


  goToAnswerPage=()=>{
    sessionStorage.setItem('sameProblemCount',this.state.sameProblemCount);
    sessionStorage.setItem('sameProblem',this.state.sameProblem);
    console.log("saved vote state",this.state.sameProblem)
    sessionStorage.setItem('senderId',this.state.senderId);
    sessionStorage.setItem('senderUsername',this.state.senderUsername);
    sessionStorage.setItem('senderAvatar',this.state.senderAvatar);
    sessionStorage.setItem('isAnswered',this.state.isAnswered);
    sessionStorage.setItem('context',this.state.context);
    sessionStorage.setItem('sentDate',this.state.sentDate);
    sessionStorage.setItem('QuestionID',this.state.QuestionID);
    sessionStorage.setItem('ChatroomID',this.props.Cid);
    document.getElementById("goToAnswerPage").click()
  }


showProfilePreview = (userid) => {
    // this.setState({ showProfilePreview: submit });
    this.setState({ showProfilePreview: true ,});
    // console.log(this.state.submit)

};

hideProfilePreview = () => {
    this.setState({ showProfilePreview: false });
    // this.setState({ submit: -2 });
    // this.loadChatrooms()
};

    render() { 
        return (  
            <React.Fragment>
                <ProfilePreview userid={this.state.senderId} hideProfilePreview={this.hideProfilePreview} showProfilePreview={this.state.showProfilePreview} />
                <Texteditor 
                    content={this.state.editing?this.state.editorContent:""} 
                    updateContent={this.updateContent} 
                    hideEditor={this.hideEditor}
                    editorVisible={this.state.editorVisible}/>
                <ReactTooltip place="right" effect="solid" type="dark"/>
                {this.state.loading?<LoadingPage/>: ""}
                <div id="Question"
                    style={{ 
                        width:this.props.width+"vw",
                    }}
                    className="d-flex flex-column">

                        <div id="header" className="d-flex flex-row ml-auto">
                            <div className="d-flex pl-2 align-top">
                                <p className="pt-1 d-flex align-items-center" style={{fontSize: "0.85rem"}}>
                                    {/* submitted by */}
                                </p>
                            </div>
                            <div className="d-flex pl-2 align-top w-80 ml-3" id="profile">
                                <div style={{cursor:"pointer"}} className="d-flex align-items-center mr-2" onClick={this.showProfilePreview}>
                                    <img  id="profile-img" 
                                    src={this.state.senderAvatar}/>
                                </div>
                                <p style={{cursor:"pointer"}} onClick={this.showProfilePreview} className="pt-1 h5 d-flex align-items-center pr-4 ">{this.state.senderUsername}</p>
                            </div>
                            <div id="options" className="ml-auto">
                                <Dropdown>
                                    <Dropdown.Toggle className="mr-2" id="dropdown-basic">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots-vertical" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                        </svg>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropDown">
                                        {this.state.isOwner?<Dropdown.Item as="button" onClick={this.startEditing}>Edit</Dropdown.Item>:""}
                                        {this.state.isOwner?<Dropdown.Item as="button" onClick={this.handleDelete}>Delete</Dropdown.Item>:""}
                                        <Dropdown.Item as="button">option 3</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>



                        <div id="body" className="d-flex flex-row w-100">


                            <div id="left" className="d-flex flex-column mt-2">
                                
                                <button style={{outline:"none"}} className="ml-auto mr-auto pr-2 pl-2 mb-2 mt-2 clean-button"
                                    data-tip="Select this button if you have same problem!"
                                    onClick={()=>this.handleSameProblemClicked(1)}>
                                    {this.state.sameProblem===1?
                                    <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                    </svg>:
                                    <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-caret-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M3.204 11L8 5.519 12.796 11H3.204zm-.753-.659l4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z"/>
                                    </svg>}
                                </button>
                                <button style={{outline:"none"}} class="ml-auto mr-auto pr-2 pl-2 mt-1 clean-button" data-tip="Number of users with same problem!">
                                    {this.state.sameProblemCount}
                                </button>
                                <button style={{outline:"none"}} className="ml-auto mr-auto pr-2 pl-2 mb-2 mt-2 clean-button"
                                    data-tip="Select this button if Question is wrong or irrelevant to chatroom topic!"
                                    onClick={()=>this.handleSameProblemClicked(-1)}>
                                    {this.state.sameProblem===-1?
                                    <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                    </svg>:
                                    <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-caret-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M3.204 5L8 10.481 12.796 5H3.204zm-.753.659l4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                                    </svg>}
                                </button>
                                {this.state.isAnswered?
                                <svg style={{fill:"green"}} data-tip="This Question is answered"
                                  width="1em" height="1em" viewBox="0 0 16 16" 
                                  className="mt-4 mb-3 align-self-center bi bi-check-circle-fill" 
                                  fill="currentColor" xmlns="http://www.w3.org/2000/svg%22%3E">
                                     <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                </svg>
                                :""
                            }
                                
                            </div>



                            <div id="middle" className="mt-2 mb-1 d-flex flex-column">
                                <div className="p-3">
                                {this.props.showMoreButton?
                                    <ShowMoreText
                                    /* Default options */
                                    lines={3}
                                    more={<p className="ml-auto show-more-less mt-3 mb-2" >Show more</p>}
                                    less={<p className="ml-auto show-more-less">Show less</p>}
                                    className='content-css'
                                    anchorClass='show-more-less d-flex flex-row'
                                    onClick={this.executeOnClick}
                                    expanded={false}>
                                        {ReactHtmlParser(this.state.context)}
                                        {/* {this.state.context} */}
                                    </ShowMoreText>:
                                    ReactHtmlParser(this.state.context)
                                }
                                </div>
                                <small className="date ml-auto mb-2 mr-2 mt-auto">Submitted on : {this.state.sentDate}</small>

                            </div>




                            <div id="right" className="">
                                
                            </div>


                        </div>
                        <div id="footer" className="d-flex flex-row">
                            
                           

                            <div className="ml-auto mr-2 mb-auto mt-auto parisa-css">
                                {this.state.showMoreButton?
                                    <button onClick={this.goToAnswerPage} style={{outline:"none",borderRadius:"5px"}} className="Question-showAnswerButton pr-2 pl-2 m-1 btn-sm btn btn-primary">Show answers</button>: 
                                <button onClick={this.showEditor} style={{outline:"none",borderRadius:"5px",border:"none"}} className="pr-2 pl-2 m-1 btn-sm btn btn-primary">Answer this Question</button>
                                }
                                 
                            </div>
                            
                        </div>
                        <Link id="goToAnswerPage" to="/answerPage"></Link>
                </div>
            </React.Fragment>
        );
    }
}
 
export default QuestionChatbox;