import React, { Component } from 'react';
import axios from 'axios';
import './CSS/chatroom.css';
import SubmitField from './submitField';
import ChatBox from './chatBox';

class Chatroom extends Component {
    state = {
        show: false,
        submit: -2,
        isClicked:false,
        QOrR:-2,
        refToChatroom:React.createRef()
    }

    // constructor(props) {
    //     super(props);
    //     this.state = { chats:this.loadChat() };
    //     console.log(this.state);
    //   }
    async loadChat(){
        let url = "http://localhost:3004/chats";
        const response =
          await axios.get(url)
        // console.log(response);
        console.log("data found (test): ",response.data);
        console.log(response)
        this.setState({ chats: response.data });
        console.log(this.state.chats)
    }

    componentDidMount(){
        console.log("mounted");
        this.loadChat();
    }
    

    handleSubContent = (id) =>{
        let counter= 0;
        let subContent;
        let content = <React.Fragment></React.Fragment>;
        for(let index=0;index<this.state.chats.length;index++)
        {
            if(this.state.chats[index].type===id)
            {
                counter++;
                let chat = this.state.chats[index];
                subContent =  
                <React.Fragment>
                    <li>
                        <ChatBox chat={chat} showModal={this.showModal} refToChatroom={this.state.refToChatroom} />
                        {this.handleSubContent(this.state.chats[index].id, "")}
                    </li>
                </React.Fragment>;
                content = <React.Fragment>{content}{subContent}</React.Fragment>;
            }
        }
        if (counter===0)
            return <React.Fragment></React.Fragment>;
        return <ul>{content}</ul>;
    }

    handleContent = () =>{
        // let index = 0;
        let finalResult = <ul className="simple-nested"><div className="comment"> No Chat in here!</div></ul>;
        if (this.state.chats.length===0)
            return finalResult;
        // finalResult = <React.Fragment></React.Fragment>;
        return <ul className="simple-nested">{this.handleSubContent(-1)}</ul>;
    }


    showModal = (submit) => {
        this.setState({ submit: submit });
        this.setState({ show: true });
        // console.log(this.state.submit)

    };

    hideModal = () => {
        this.setState({ show: false });
        this.setState({ submit: -2 });
        this.loadChat();
    };

    

    render() { 
        if (this.state.chats)
            return (  
                <React.Fragment>
                    <SubmitField ref={this.state.refToChatroom} hideModal={this.hideModal} show={this.state.show} submit={this.state.submit} />
                    <div>
                        <div className="m-3 chatbox">
                            <div className={"add-scroll ".concat(this.state.isClicked ? "add-scroll-active":"")}>
                                <div className="mr-5 mt-2">
                                    {this.handleContent()}
                                </div>
                            </div>
                            <button onClick={() => this.showModal(-1)} className="flex-row justify-content-center align-self-end btn btn-primary submit-button" type="button">
                                Submit a Question
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            );
        else
            return(<React.Fragment></React.Fragment>);
    }
}
 
export default Chatroom;