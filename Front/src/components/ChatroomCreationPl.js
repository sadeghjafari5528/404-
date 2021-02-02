import React, { Component } from 'react';
import './CSS/ChatroomCreation.css';
import {Link} from 'react-router-dom';
 
import Select from 'react-select';

const options = [
    { value: 'java', label: 'java' },
    { value: 'php', label: 'php' },
    { value: 'python', label: 'python' },
    { value: 'c', label: 'c' },
    { value: 'c++', label: 'c++' },
    { value: 'c#', label: 'c#' },
    { value: 'html', label: 'html' },
    { value: 'css', label: 'css' },
    { value: 'java-script', label: 'java script' }
]

const customStyles = {
    menuList:(provided, state) => ({
        ...provided,
        height:"200px",
        zIndex:"5"
    })
} 

class ChatroomCreationPl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPl: sessionStorage.getItem("selected"),
            plDescription: sessionStorage.getItem("description"),
            plLink: sessionStorage.getItem("link"),
            error1: false,
            error2: false,
            pageCount:0,
            charsPerPage:1,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        console.log(this.state.selectedPl)
        if (!this.state.selectedPl && !this.state.error1) {
            this.setState({
                error1: true,
            });
        }
        if (!this.state.plLink && !this.state.error2) {
            this.setState({
                error2: true,
            });
        }
        if (this.state.selectedPl && this.state.plLink) {
            sessionStorage.setItem("selected" , this.state.selectedPl);
            sessionStorage.setItem("Link" , this.state.plLink);
            sessionStorage.setItem("Description" , this.state.plDescription);
        }
    }

    handleChange(e) {
        let target = e.target;
        let value = target.value;
        let name = target.name;
        this.setState({
          [name]: value,
        });
        if (name === "plDescription"){
            let currentText = e.target.value;
            //Now we need to recalculate the number of characters that have been typed in so far
            let characterCount = currentText.length;
            let charsPerPageCount = this.state.charsPerPage;
            let unitCount = Math.round(characterCount/charsPerPageCount);
            this.setState({pageCount: unitCount});
           }

        if (name === "plLink" && value !== '') {
            
            this.setState({
                error2: false,//link
            });
        }
     }

     handleChangeSelect = (selectedPl) => {
        this.setState({ selectedPl });
        this.setState({
            error1: false,//select
        });
      }

    render() { 
        return ( 
            <div className="main-box">
                <div className="elements">
                <div className="black-text plKinds">
                        <Select
                        value={this.state.selectedPl} 
                        onChange={this.handleChangeSelect}
                        styles={customStyles}
                        defaultValue={this.state.selectedPl}
                        name="selectedPl"
                        options={options}
                        classNamePrefix="select"
                        placeholder="Select a Programming language ..."
                        >
                        </Select>
                    </div>
                    {this.state.error1 ? <div className="plError">Please select a programming language.</div> : ''}
                    <div className="plLink">
                        <label for="plLink"><h1>Put a link for more information about programming language:</h1></label>
                        <input name="plLink" value={this.state.plLink} type="url" placeholder="Programming language link" onChange={this.handleChange} required /> 
                    </div>
                    {this.state.error2 ? <div className="plError">Please put a link for selected programming language.</div> : ''}
                    <div className="description descriptionPl">
                        <h1>Description :</h1>
                        <textarea name="plDescription" value="plDescription" className="textarea" value={this.state.plDescription} maxlength="175" rows="4" cols="53" onChange={this.handleChange}>
                            {this.state.plDescription}
                        </textarea>
                        <span className="textCounterPl">
                            {this.state.pageCount} of 175
                        </span>
                    </div>
                    <Link to="/chatroomCreationFirst">
                        <button className="backButtonPl" type="button">Back</button>
                    </Link>
                    <Link to={this.state.selectedPl && this.state.plLink ? "/chatroomCreationLast": "/chatroomCreationPl"} onClick={this.handleClick}>
                        <button className="nextButtonPl" type="button">Next</button>
                    </Link>
                </div>
            </div>
         );
    }
}
 
export default ChatroomCreationPl;