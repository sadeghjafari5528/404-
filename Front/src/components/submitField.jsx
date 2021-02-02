import React, { Component } from 'react';
import './CSS/submitField.css';
import axios from 'axios';
// import Modal from './modal';
// require("react-bootstrap/ModalHeader");

class SubmitField extends Component {
    state = {
        isClicked: this.props.isClicked,

    }

    modalClick = (e) => {
        // e.preventDefault();
        e.stopPropagation();
        return false;
    }

    async submitChat(props) {
        let content = document.getElementById("SubmitField-input").value;
        if (content==="")
            return;
        console.log("content is:",content)
        let url = "http://localhost:3004/chats";
        let date = new Date().toLocaleString();
        let chat = {"id": 0,"type": this.props.submit ,"by": window.$username,"time": date,"content": content};
        const response = await axios.post(
            url,
            chat,
            { headers: { 'Content-Type': 'application/json' } }
        )
        document.getElementById("SubmitField-input").value="";
        // console.log(response);
        console.log("data found (test): ", response.data);
        console.log(response)
        props.hideModal();
        // this.setState({ chats: response.data });
        // console.log(this.state.chats)
    }

    render() { 
        return ( 
            <React.Fragment>
                <div onClick={() => this.props.hideModal()} className={this.props.show ? "modal display-block" : "modal display-none"}>
                    <section onClick={this.modalClick} className="modal-main">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.submit === -1 ? "Submitting a Question" : "Submiting a Reply"}</h5>
                            <button type="button" className="close" onClick={() => this.props.hideModal()} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex flex-row justify-content-center mt-2">
                            <textarea id="SubmitField-input" cols="92"
                                rows="4"
                                    className="form-control submit-input-active"
                                placeholder="type here!">
                            </textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="row">
                                <div className="col-lg-6 d-flex justify-content-start">
                                    <button type="button" className="btn btn-secondary"
                                        onClick={() => this.props.hideModal()}>
                                        Cancel
                            </button>
                                </div>
                                <div className="col-lg-6 d-flex justify-content-end">
                                    <button onClick={() => this.submitChat(this.props)} 
                                        type="button" className="btn btn-primary">
                                        {this.props.submit === -1 ? "Submit Question" : "Submit Reply"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </React.Fragment>

        );
    }
}
 
export default SubmitField;