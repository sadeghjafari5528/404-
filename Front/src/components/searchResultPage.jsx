import React, { Component } from 'react';
import Switch from 'react-bootstrap/esm/Switch';
import { Link, Route } from 'react-router-dom';
import './CSS/search.css';
import QuestionChatbox from './questionChatbox';
import {request} from './requests';
 
import SearchFilter from './searchFilters';



class SearchResultPage extends Component {
    state = {
        onlyAnswered:0,
        time:0,
        member:5,
        sort:0,


        showFilter:false,
        selectedTab:1,
        searchInput:this.props.match.params.searchPhrase,
        chatrooms:[],
        questions:[]
    }

    

    componentDidMount=()=>{
        sessionStorage.setItem("search",this.state.searchInput)
        // console.log("mounted------------------------")
        // console.log("search input is:",this.state.searchInput)
        this.loadData(this.state.searchInput);
    }

    componentDidUpdate(prevProps) {
        // console.log("inside componentDidUpdate")
        // console.log("chatroom changed from ",prevProps.Cid ," to ",this.props.Cid)
        if (prevProps !== this.props) {

            this.setState({searchInput:this.props.match.params.searchPhrase,})
            // console.log("chatroom changed from ",prevProps.Cid ," to ",this.props.Cid)
            this.loadData(this.props.match.params.searchPhrase,null)   
        }
      }

    loadData=async(input,filters)=>{
        console.log("loading data")
        let config ={
            url:"http://127.0.0.1:8000/api/GeneralSearch/",
            needToken:true,
            type:"post",
            formKey:[
                "searchText",
                "user_id",
                'timePeriod',
                'isAnswered',
                'chatroomMember',
                'sort'
            ],
            formValue:[
                input,
                sessionStorage.getItem("id"),
                filters?filters.time:this.state.time,
                filters?filters.onlyAnswered: this.state.onlyAnswered,
                filters?filters.member: this.state.member,
                filters?filters.sort: this.state.sort
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        // console.log(await request(config))
        // console.log("outside",data)
        if (data)
        {
            console.log(config)
            console.log("found data is",data)
            this.setState({questions:data.questions,chatrooms:data.chatrooms})
            
        }
    }


    changeTab=(tab)=>{
        this.setState({selectedTab:tab})
    }

    showFilter = () => {
        this.setState({ showFilter: true });
    };
    hideFilter = (apply,filters) => {
        this.setState({ showFilter: false });
        if(apply)
        {
            console.log("let's check filters:",filters)
            this.setState({onlyAnswered:filters.onlyAnswered,
                time:filters.time,
                member:filters.member,
                sort:filters.sort})
            this.loadData(this.state.searchInput,filters);
        }
    };

    render() { 
        return (
            <React.Fragment>
                <SearchFilter onlyAnswered={this.state.onlyAnswered}
                    showFilter={this.state.showFilter} 
                    hideFilter={this.hideFilter} 
                    time={this.state.time}
                    member={this.state.member}
                    sort={this.state.sort} />
                <div className="w-100 h-100">
                    <div id="search-result" className=" w-100 d-flex flex-column h-100">
                        <div className="p-3 h-100">
                            {/* <button onClick={()=>console.log(this.state)}>check</button> */}
                            <div id="header" className="d-flex flex-row w-100 h-10">
                                <button onClick={()=>this.changeTab(1)} 
                                    className={"nav-link w-25 d-flex transparent-button".concat(this.state.selectedTab===1?" active":"")}>
                                    <p style={{width:"fit-content"}} className="ml-auto mr-auto mt-auto mb-auto">
                                        Questions
                                    </p>
                                </button>
                                <button onClick={()=>this.changeTab(2)} 
                                    className={"nav-link w-25 d-flex transparent-button".concat(this.state.selectedTab===2?" active":"")}>
                                    <p style={{width:"fit-content"}} className="ml-auto mr-auto mt-auto mb-auto">
                                        Chatroom
                                    </p>
                                </button>
                                
                                <button onClick={this.showFilter} className='mt-2 mb-2 ml-auto mr-2 p-1 rounded'>
                                    <div className="ml-auto mr-auto mt-auto mb-auto d-flex flex-row">
                                        Filters 
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-filter" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                            <div id="body" className=" rounded-bottom h-90">
                                <div className=' ml-5 h-100'>
                                    {this.state.selectedTab===2?
                                    <div className="d-flex flex-column h-100">
                                        <div className="pt-4 pb-4 h-10 mb-2">
                                            {this.state.chatrooms.length>0?<p>Found Chatrooms for <Link className="ml-1 mr-1 h4">{this.state.searchInput}</Link>:</p>:<p>No Chatroom Found</p>}
                                        </div>
                                    
                                        <div className="pr-5 mb-3 h-90" style={{overflowY:"auto"}}>
                                            
                                            {this.state.chatrooms.map(chatroom => 
                                            <Link key={chatroom.ChatroomID} 
                                                className=" m-4"
                                                to={"/qanda"+chatroom.ChatroomID} >
                                                <div className="d-flex flex-row result-chatroom">
                                                    <img className="d-flex mt-auto mb-auto mr-3 ml-3" id="chatroom-img" src={chatroom.image} />
                                                    <div className="d-flex mt-auto mb-auto pr-5">{chatroom.name}</div>
                                                </div>
                                            </Link>)}
                                        </div>
                                        
                                    </div>
                                    :""}

                                    {this.state.selectedTab===1?
                                    <div className="d-flex flex-column h-100">
                                        <div className="pt-4 pb-4 h10">
                                            {this.state.questions.length>0?<p>Found Questions for <Link className="ml-1 mr-1 h4">{this.state.searchInput}</Link>:</p>:<p>No Question Found</p>}
                                        </div>
                                        
                                        <div className="pr-5 mb-3 h-90" style={{overflowY:"auto"}}>
                                            {/* <p>Found Questions:</p> */}
                                            {this.state.questions.map(question =>(
                                            <div className="pt-3" key={question.id}>
                                                <QuestionChatbox
                                                    // loadQuestions={this.loadQuestions}
                                                    searchPhrase={this.state.searchInput}
                                                    sameProblemCount={question.vote}
                                                    sameProblem={question.voteState}
                                                    senderId={question.userid}
                                                    senderUsername={question.user}
                                                    context={question.text}
                                                    sentDate={question.time}
                                                    showMoreButton={true}
                                                    isAnswered={question.isAnswered}
                                                    Qid={question.id}
                                                    Cid={question.chatroom}/>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                    :""}


                                </div>

                            </div>
                        </div>              

                    </div>

                </div>
                
            </React.Fragment>
        );
    }
}
 
export default SearchResultPage;