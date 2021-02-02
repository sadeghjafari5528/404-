import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './CSS/search.css';
import {request} from './requests';
import { ToastContainer, toast } from 'react-toastify';



class Search extends Component {
    state = {
        minError:false,
        focused:false,
        panelOpened:false,
        searchInput:"",
        // result:false,
        suggestions:[],
        informed:false,
    }


    handelSearch=()=>{
        if(this.state.focused)
        {
            if(this.state.searchInput.length > 2)
            {
                document.getElementById("goToSearchResultPage").click();
                this.setState({searchInput:""});
                this.setState({focused:false,panelOpened:false,suggestions:[],minError:false})
            }   
            else
            {
                this.setState({panelOpened:true,minError:true})
            }
        }
        else
        {
            this.setState({focused:!this.state.focused})
            // console.log(this.state.searchInput)
        }
        
    }

    handelInputChange=(event)=>{
        let input = event.target.value;
        this.setState({searchInput:input})
        if (input.length >2)
        {
            // toast.dismiss()
            this.setState({panelOpened:true})
            this.loadSuggestions(input);
        }
        else
            this.setState({panelOpened:false,suggestions:[]})
    }

    loadSuggestions= async (input)=>{
        let config ={
            url:"http://127.0.0.1:8000/api/SeggestionChatroomSreach/",
            needToken:true,
            type:"post",
            formKey:[
                "searchText",
            ],
            formValue:[
                input,
            ]
        }
        let data = []
        // console.log("outside 0",data)
        data = await request(config)
        // console.log(await request(config))
        // console.log("outside",data)
        if (data)
        {
            this.setState({suggestions:data,})
            console.log("state set")
        }
    }

    
    render() { 
        return (  
            <React.Fragment>
                <Link id="goToSearchResultPage" to={{pathname:"/search/"+this.state.searchInput,state:{tab:1}}}/>
                <div id='search' className="d-flex flex-row">
                    <div id='bar' className={"ml-auto mr-4 d-flex flex-row-reverse".concat(this.state.focused?" active ":"")}>
                        
                        <button onClick={this.handelSearch} className=" rounded-circle d-flex flex-row transparent-button">
                            <svg width="30px" height="30px" viewBox="0 0 16 16" className="text-white bi bi-search align-self-center" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                                <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                            </svg>
                        </button>
                        <input value={this.state.searchInput} onChange={this.handelInputChange}
                            className="mr-sm-2 form-control" placeholder="Search" 
                        />
                    </div>

                    <div id='panel' className={"mt-5 mr-2 ".concat(this.state.panelOpened?" active":"")}>
                        <div className={"m-3".concat(this.state.panelOpened?" ":" display-none")}>
                            {this.state.searchInput.length<3?(this.state.minError?<p>Enter at least 3 letters!</p>:""):(this.state.suggestions.length>0?<p>Suggested Chatrooms :</p>:<p>can't suggest any Chatroom</p>)}
                        </div>
                        <div className={"search-result".concat(this.state.suggestions.length>0 && this.state.searchInput !== ""?" active":"")}>
                            
                            
                            {this.state.suggestions.map(sug =>
                            <Link 
                                to={"/qanda"+sug.chatroom_id} 
                                id="suggestion" 
                                key={sug.chatroom_id} 
                                className="m-2 d-flex pl-3"
                                onClick={()=>this.setState({searchInput:"",panelOpened:false,focused:false,suggestions:[]})}>
                                <p className="mt-auto mb-auto">{sug.chatroom_name}</p>
                            </Link>    
                            )}
                        </div>
                    </div>
                    
                </div>

            </React.Fragment>

        );
    }
}
 
export default Search;