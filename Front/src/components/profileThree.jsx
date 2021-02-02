import React, { Component } from 'react';
import './CSS/profileThree.css';
import Select from 'react-select';
 
import { isExpired } from "react-jwt";
import {renewToken} from './requests';
import axios from 'axios';
import {encodeList , decodeList} from './util';

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

class profileThree extends Component {
      constructor(props) {
        super(props);
        this.state = {
            renderSelect:false,
            succeed:false,
            dowload:"",
            selectedFile:null,
            selectedOptions: [],
            bio:"",
            pageCount: 0,
            charsPerPage: 1
          };
    
        this.handleSave = this.handleSave.bind(this);
        this.loadFields = this.loadFields.bind(this);
      }

       handleChange = (e) => { 
           let target=e.target;
           let name = target.name;
           let value = target.value
           console.log(value)
           this.setState({
            [name]:value
           });
           if (name === "bio"){
            let currentText = e.target.value;
            //Now we need to recalculate the number of characters that have been typed in so far
            let characterCount = currentText.length;
            let charsPerPageCount = this.state.charsPerPage;
            let unitCount = Math.round(characterCount/charsPerPageCount);
            this.setState({pageCount: unitCount});
           }
      }

      handleEnterPress = (e) => {
        if (e.keyCode == 13) { 
            document.getElementById("PtextArea").innerHTML = "Triggered enter+shift"; 
        } 

      }


      async componentDidMount(){
            await this.loadFields()
            this.setState({renderSelect:true})
      }


      async loadFields(){


        let token = sessionStorage.getItem("access")
        if(isExpired(sessionStorage.getItem("access")))
        {
            console.log("renewing")
            token=await renewToken()

        }
        console.log("fetching data")
        token = "Bearer "+token;
        console.log(token)
        const form = new FormData()
        form.set('id', sessionStorage.getItem("id"))
        const response =
        await axios.post('http://127.0.0.1:8000/api/show_interests/', form, {
        headers: { 'Content-Type': 'multipart/form-data',
                    'Authorization': token
        },
        })
        
        console.log(response)
        let list = decodeList(options,response.data.interests)
        console.log(list)
        this.setState({bio:response.data.description,selectedOptions:list})


        
        // const response1 =
        // await axios.post('http://127.0.0.1:8000/api/show_cv_file/', form, {
        // headers: { 'Content-Type': 'multipart/form-data',
        //             'Authorization': token
        // },
        // })
        


        
        // this.setState({selectedFile:response1.data})
        // this.setState({dowload:response1.data.url})


      }



      async handleSave(){
        let token = sessionStorage.getItem("access")
         if(isExpired(sessionStorage.getItem("access")))
        {
            console.log("renewing")
            token=await renewToken()

        }
        console.log("fetching data")
        token = "Bearer "+token;
        console.log(token)
        const form = new FormData()
        form.set('id', sessionStorage.getItem("id"))
        // if(this.state.bio!=="")
        form.set('description',this.state.bio?this.state.bio:"")
        form.set('interests',encodeList(options,this.state.selectedOptions))
        form.set('cvfile',this.state.selectedFile)
        const response =
        await axios.post('http://127.0.0.1:8000/api/editinterest/', form, {
        headers: { 'Content-Type': 'multipart/form-data',
                    'Authorization': token
        },
        })
        console.log(response)
        this.setState({succeed:true})
    }



      handleChangeFile=(event)=> {
        //   console.log(this.state.selectedOptions)
        let encode = encodeList(options,this.state.selectedOptions)
          console.log(encode)
          let decode = decodeList(options,encode)
          console.log(decode)
          this.setState({selectedOptions:decode})
            this.setState({
            selectedFile: event.target.files[0],
          })
    }


      handleChangeSelect = (selectedOptions) => {
        this.setState({ selectedOptions });
      }

      /*handleChange2 = (e) => {
        let value = Array.from(e.target.selectedIntrest, option => option.value);
        console.log(value)
        this.setState({values: value});
      } */

      handleUploadClick = ()=>{
          document.getElementById("upload-file-pro").click();
          console.log(document.getElementById("upload-file-pro"))
          
      }



    render() { 
        return ( 
            <React.Fragment>
                    <div className="parisa-css w-100 pt-5 mr-5 ml-5 d-flex flex-row">
                        <div className="w-50">
                            <h1 className="w-100 mb-2">Please select Subjects you are intrested in :</h1>
                            <div className="black-text w-75">
                                {this.state.renderSelect?<Select 
                                onChange={this.handleChangeSelect}
                                styles={customStyles}
                                    isMulti
                                    defaultValue={this.state.selectedOptions}
                                    name="colors"
                                    options={options}
                                    className="select basic-multi-select"
                                    classNamePrefix="select"
                                />:""}
                            </div>
                        </div>
                                

                        <div className="w-50">
                            <div class="fileUploadInput w-100">
                            <h1 className="w-100">Please Upload your resume Files here:</h1>
                            <a href={this.state.dowload}></a>
                                <div className="w-75 d-flex flex-row">
                                    <input onChange={this.handleChangeFile}
                                        id="upload-file-pro" className="w-75" type="file" />
                                    <button onClick={this.handleUploadClick} className="w-25 d-flex justify-content-center rounded-right align-items-center">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class=" bi bi-cloud-arrow-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                                            <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="parisa-css bioBox mt-auto">
                        <div>
                            <h3>Bio :</h3>
                        </div>
                        <div className="parisa-css bioField d-flex justify-content-center">
                            <textarea id="PtextArea" name="bio" onkeypress={this.handleEnterPress} value={this.state.bio}  onChange={this.handleChange}  className="profileBio" maxlength="175" rows="4" cols="53">
                                
                            </textarea>
                            <span className="textCounter">
                                {this.state.pageCount} of 175
                            </span>
                        </div>
                        <button class="profile-saveButton btn btn-primary" onClick={this.handleSave}>Save</button>
                        {this.state.succeed? <p className="d-flex justify-content-center pro-success">Saved successfully!</p> : <br/>}
                    </div>

                    
                         
            </React.Fragment>
            
         );
    }
}
 
export default profileThree;