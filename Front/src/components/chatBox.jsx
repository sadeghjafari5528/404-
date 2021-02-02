import React, { Component } from 'react';
import './CSS/chatBox.css';
class ChatBox extends Component {
    state = { 
     }
    render() { 
        return (
                <div className="comment d-flex flex-column">
                    <div className="d-flex flex-row">
                        <div className="d-flex align-items-center mr-2"><img  id="profile-img-in-chat" 
                            src="https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"/></div>
                        <h1 className="d-flex align-items-center"><p><a href="">{this.props.chat.by}</a></p></h1>
                    </div>
                    <div className="m-3 handle-enter"><p>{this.props.chat.content}</p></div>
                    <div className="row">
                        <div className="col-lg-6 d-flex justify-content-start">
                            <em>{this.props.chat.time}</em>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                            <p>
                            <a onClick={() => this.props.showModal(this.props.chat.id)} href="#">
                                    reply
                                </a>
                            </p>
                        </div>
                    </div>
                </div> 
            
        );
    }
}
 
export default ChatBox;