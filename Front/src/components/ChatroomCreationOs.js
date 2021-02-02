import React, { Component } from 'react';
import './CSS/ChatroomCreation.css';
import {Link} from 'react-router-dom';
 
import {renewToken} from './requests';
import Select from 'react-select';     

const customStyles = {
    menuList:(provided, state) => ({
        ...provided,
        // height:"200px",
        zIndex:"5"
    })
} 

class ChatroomCreationOs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOs: sessionStorage.getItem("selected")? sessionStorage.getItem("selected") : null,
            selectedSubOs: sessionStorage.getItem("selectedSub")? sessionStorage.getItem("selectedSub") : null,
            osDescription: sessionStorage.getItem("Description")? sessionStorage.getItem("Description") : '',
            error1: false,
            error2: false,
            charsPerPage: 1,
            pageCount: 0,


            OS: [
                    {
                        id:1,
                        label: "Windows",
                        value: "Windows",
                        subOs: [
                            {label: "Windows-XP", value: "Windows-XP", link: "https://github.com/ShizukuIchi/winXP"},
                            {label: "Windows-7", value: "Windows-7", link:"https://github.com/B00merang-Project/Windows-7"},
                            {label: "Windows-8", value: "Windows-8", link:"https://github.com/owncloudarchive/windows8"},
                            {label: "Windows-10", value: "Windows-10", link:"https://github.com/Disassembler0/Win10-Initial-Setup-Script"},
                        ]
                    },
                    {
                        id:2,
                        label: "Mac",
                        value: "Mac",
                        subOs: [
                            {label: "MacOS-Catalina",value: "MacOS-Catalina", link: "https://www.apple.com/macos/big-sur/"},
                            {label: "MacOS-Mojave" ,value: "MacOS-Mojave" , link: "https://www.apple.com/newsroom/2018/06/apple-introduces-macos-mojave/"},
                            {label: "MacOS-High-Sierra",value: "MacOS-High-Sierra", link: "https://support.apple.com/en-us/HT208969"},
                            {label: "MacOS-Sierra",value: "MacOS-Sierra", link: "https://support.apple.com/en-us/HT208202"},
                        ]
                    },
                    {
                        id:3,
                        label: "Linux",
                        value: "Linux",
                        subOs: [
                            {label: "Ubuntu",value: "Ubuntu", link:"https://github.com/ubports/ubuntu-touch"},
                            {label: "Debian",value: "Debian", link:"https://github.com/mate-desktop/debian-packages"},
                            {label: "ElementaryOS",value: "ElementaryOS", link:"https://github.com/elementary/os"},
                            {label: "Mint",value: "Mint", link:"https://github.com/yonaskolb/Mint"},
                            {label: "MX-linux",value: "MX-linux", link:"https://github.com/MX-Linux/mx-snapshot"},
                            {label: "Arch-Linux",value: "Arch-Linux", link:"https://github.com/helmuthdu/aui"},
                            {label: "Manjaro",value: "Manjaro", link:"https://github.com/manjaro/packages-core"},
                            {label: "Kali",value: "Kali", link:"https://github.com/LionSec/katoolin"},
                            {label: "Red",value: "Red", link:"https://github.com/ras0219/ReDOS"},
                            {label: "Hat",value: "Hat", link:"https://github.com/qiuqiangkong/Hat"},
                            {label: "CentOS",value: "CentOS", link:"https://github.com/CentOS/Community-Kickstarts"},
                            {label: "Fedora",value: "Fedora", link:"https://github.com/coreos/fedora-coreos-tracker"},
                        ]
                    },
                    {
                        id:4,
                        label: "BSD",
                        value: "BSD",
                        subOs: [
                            {label: "FreeBSD",value: "FreeBSD", link: "https://github.com/freebsd/freebsd"},
                            {label: "OpenBSD",value: "OpenBSD", link: "https://github.com/job/openbsd-src"},
                            {label: "NetBSD",value: "NetBSD", link: "https://github.com/NetBSD/src"},
                            {label: "DragonFlyBSD",value: "DragonFlyBSD", link: "https://github.com/DragonFlyBSD/DragonFlyBSD"},
                            {label: "PC",value: "PC", link: "https://github.com/trueos/pcbsd"},
                            {label: "BSD",value: "BSD", link: "https://github.com/weiss/original-bsd"},
                        ]
                    },
                ]        
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (!this.state.selectedOs) {
            this.setState({
                error1: true,
            });
        }
         
        if (!this.state.selectedSubOs && this.state.selectedOs) {
            this.setState({
                error2: true,
            });
        }

        if (this.state.selectedOs && this.state.selectedSubOs) {
            sessionStorage.setItem("selected" , this.state.selectedOs);
            sessionStorage.setItem("selectedSub" , this.state.selectedSubOs);
            sessionStorage.setItem("Description" , this.state.osDescription);
        }
    }

     handleChange(e) {
        let target = e.target;
        let value = target.value;
        let name = target.name;
        this.setState({
          [name]: value,
        });
        if (name === "osDescription"){
            let currentText = e.target.value;
            //Now we need to recalculate the number of characters that have been typed in so far
            let characterCount = currentText.length;
            let charsPerPageCount = this.state.charsPerPage;
            let unitCount = Math.round(characterCount/charsPerPageCount);
            this.setState({pageCount: unitCount});
           }

        if (name === "selectedSubOs" && value !== "Select a distro") {
            this.setState({
                error: false,
            });
        }

        if (name === "selectedOs") {
            this.setState({
                selectedSubOs: '',
            });
        }

        if (value === "Select an OS") {
            this.setState({
                selectedOs: null,
                selectedSubOs: null,
            });

        }else if (value === "Select a distro") {
            this.setState({
                selectedSubOs: null,
            });
        }

     }

    handleChangeSelect1 = (selectedOs) => {
        // if (sessionStorage.getItem("selected")) {
        //     this.setState({
        //         selectedOs: sessionStorage.getItem("selected"),
        //         selectedSubOs:sessionStorage.getItem("selectedSub"),
        //         osDescription:sessionStorage.getItem("Description")
        //     })
        // }
        this.setState({ selectedOs: selectedOs.value ,selectedSubOs:""});
        this.setState({
            error1: false,//select
        });
    }

    handleChangeSelect2 = (selectedSubOs) => {
        this.setState({ selectedSubOs: selectedSubOs.value });
        this.setState({
            error2: false,//select
        });
    }      
    render() { 
        return ( 
            <div className="abed-css main-box">
                <form className="elements">
                    <div className="osKinds">
                        <div className="mainOs black-text">
                            {/* <select name="selectedOs" value={this.state.selectedOs} onChange={this.handleChange} required>
                                {this.state.OS.map(os => 
                                   <option key={os.id} value={os.name}>{os.name}</option> 
                                )}
                            </select> */}
                            <Select
                            // value={this.state.selectedOs} 
                            onChange={this.handleChangeSelect1}
                            styles={customStyles}
                            placeholder="Select an Os ..."
                            name="selectedOs"
                            options={this.state.OS}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            >
                            </Select>
                        </div> 
                        {/* {this.state.selectedOs ? 
                            <div className="subOs">
                                <select name="selectedSubOs" value={this.state.selectedSubOs} onChange={this.handleChange} required>
                                    {this.state.OS.find(os => os.name === this.state.selectedOs).subOs.map(subOs => 
                                        <option value={subOs.name}>{subOs.name}</option>  
                                    )}
                                </select>
                            </div> : ''
                        }  */}
                        {this.state.selectedOs ?
                        <div className="subOs  black-text">
                        <Select
                            // value={this.state.selectedOs} 
                            onChange={value => this.handleChangeSelect2(value)}
                            styles={customStyles}
                            placeholder="Select a Distro ..."
                            name="selectedSubOs"
                            options={this.state.OS.find(os => os.label === this.state.selectedOs).subOs}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            >
                        </Select>
                        </div> : ''}
                    </div>
                    {this.state.selectedSubOs ? <div className="osLink">
                        {"You can check "}    
                            <a href={this.state.OS.find(os => os.label === this.state.selectedOs).subOs.find(subOs => subOs.label === this.state.selectedSubOs ).link}  target="_blank">
                                {"This link"}
                            </a>
                        {" for more information about selected OS"}

                        </div> : ''}

                    {this.state.error1 ? <div className="osError">Please select an OS</div> : ''}
                    {this.state.error2 ? <div className="subOsError">Please select a Distro</div> : ''}  
                    
                    <div class="description descriptionOs">
                        <h3>Description :</h3>
                        <textarea name="osDescription" value={this.state.osDescription} onChange={this.handleChange} className="textarea" maxLength="175" rows="4" cols="53">
                            {this.state.osDescription}
                        </textarea>
                        <span className="textCounterOS">
                            {this.state.pageCount} of 175
                        </span>
                    </div>
                        <Link to="/chatroomCreationFirst">
                            <button className="backButtonOs" type="button">Back</button>
                        </Link>
                        <Link to={this.state.selectedOs && this.state.selectedSubOs ? "/chatroomCreationLast": "/chatroomCreationOs"} onClick={this.handleClick}>
                            <button className="nextButtonOs" type="button">Next</button>
                        </Link>
                </form>
            </div>
         );
    }
}
 
export default ChatroomCreationOs;