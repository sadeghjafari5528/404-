import React, {Component} from 'react';
import './CSS/LoginSignUp.css';
import SignUpForm from './SignUpForm';
import emailImg from '../img/email.png'
import passImg from '../img/password.png'
import axios from 'axios';
import logo from '../img/backgr.jpg';
import { Link } from 'react-router-dom';
 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// axios.interceptors.request.use(
//   config => {
//     config.headers.authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA1MzcxMDAxLCJqdGkiOiI5ODE4ZGYzODIyZWU0YWE0ODAyMWJlYzY1YzFlY2ZjMCIsInVzZXJfaWQiOjE3fQ.fYSWwvvVeQg4f6uw5V_9T2MaQ6LCD1iGLDcamkn2ixQ';
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// )

class SignInForm extends Component{ 
  static displayName = 'RememberMe';

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailCheckMassage:{massage:"Email is not valid!",active:false},
      passwordCheckMassage:{massage:"",active:false},
      loginCheckMassage:{massage:"Wrong Email or Password!",active:false}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    if(sessionStorage.getItem("targetURL") && sessionStorage.getItem("targetURL") !=="/")
    {
      toast.dark("you should login first");
    }
      

  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value,
    });
  }

  validatePassword() {
    var passwordValidator = require('password-validator');
 
    // Create a schema
    var schema = new passwordValidator();
    schema
    .is().min(8)                                    // Minimum length 8
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    return(schema.validate(this.state.password))
  }

  async handleSubmit() {
    this.clearErrors()
    if (!this.emailValidation())
    {
      this.setState({email:""})
      this.setState({emailCheckMassage:{massege:"Email is not valid!",active:true}});
      return;
    }
    
    if (this.state.password.length===0)
    {
      this.setState({password:""})
      return(this.setState({passwordCheckMassage:{massage:"Enter your password",active:true}}));
    }

    if (!this.validatePassword())
    {
      this.setState({password:""})
      return(this.setState({passwordCheckMassage:{massage:"Password is incorrect!",active:true}}));
    }
    
    const form = new FormData()
    form.set('email', this.state.email.toLowerCase());
    form.set('password', this.state.password)
    console.log(form)
    const response =
    await axios.post('http://localhost:8000/api/login/', form, {
      headers: { 'Content-Type': 'multipart/form-data'
      },
    })

    console.log(response)

    if(response.data.message==="wellcome")
    {
      sessionStorage.setItem("email",this.state.email)
      sessionStorage.setItem("username",response.data.user.username)
      sessionStorage.setItem("id",response.data.user.id)
      console.log(form.get("email"))
      console.log(form.get("password"))
      const response2 =
      await axios.post('http://localhost:8000/api/token/', form, {
      headers: { 'Content-Type': 'multipart/form-data'
      },
    })

      sessionStorage.setItem("refresh",response2.data.refresh)
      sessionStorage.setItem("access",response2.data.access)



      let token = sessionStorage.getItem("access")
      token = "Bearer "+token;
      console.log(token)
      form.set("id",sessionStorage.getItem("id"))
      const response3 =
      await axios.post('http://127.0.0.1:8000/api/show_profile_picture/', form, {
      headers: { 'Content-Type': 'multipart/form-data',
                  'Authorization': token
      },
    })

      // console.log(response3.data)
      sessionStorage.setItem("avatar",response3.data.Base64)


    // var data = new FormData();
    // data.set('id', '20');

    // var config = {
    //   method: 'get',
    //   url: 'http://127.0.0.1:8000/api/show_profile_picture/',
    //   headers: { 
    //     'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA1MzYyODQ5LCJqdGkiOiI5OTQ0MWMyMjk3NzY0YjQ3YjllMmQ0MTQ0M2IyYjJjOSIsInVzZXJfaWQiOjIwfQ.AmBRJeI1JnIB7uE8Rq2Rv2IUvUst1peai3i3Qqgu8NA', 
    //   },
    //   data : data
    // };

    // axios(config)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })





      document.getElementById("GoHomepageFromSignin").click()
    }

    return(this.setState({loginCheckMassage:{massage:response.data.message,active:true}}));
  }


  clearErrors(){
    this.setState({emailCheckMassage:{active:false}});
    this.setState({passwordCheckMassage:{active:false}})
    this.setState({loginCheckMassage:{active:false}})
  }

  


  emailValidation = () => {
    var validator = require("email-validator");
     // true
    return (validator.validate(this.state.email));
  }

    render() {
        return (
          <div className="Abed-css">
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
            
            <img className="logo" src={logo} alt="Logo" />
            <div className="emailField">
              <img className="emailImg" src={emailImg} />
              <input placeholder="Enter your email address" name="email" value={this.state.email} onChange={this.handleChange} className="emailField" type="email" />
            </div>
            <div className="validEmailSignIn error">
              {this.state.emailCheckMassage.active ? this.state.emailCheckMassage.massage:""}
            </div>
            <div className="passField">
              <img className="passImg" src={passImg} />
              <input placeholder="Enter your password" value={this.state.password} onChange={this.handleChange} name="password" className="passField" type="password" />
            </div>
            <div className="validpassSignIn error">
              {this.state.passwordCheckMassage.active ? this.state.passwordCheckMassage.massage:""}
            </div>
            <div className="signInTransfer">
            <Link id="GoHomepageFromSignin" to={sessionStorage.getItem("targetURL")}></Link>
            <button name= "signInButton" type="button" onClick={this.handleSubmit}>Sign In</button>
              <br />
            </div>
            <br />
            <div className="validFieldsSignIn error">
              {this.state.loginCheckMassage.active ? this.state.loginCheckMassage.massage:""}
            </div>
            <br />
              <div className="signUpTransfer">
                <p>Don't have an account ?</p> 
                <Link to="/signup">
                  <button name= "signUpButton" type="button">Sign Up</button>
                </Link>
              </div>
          </div>
          ); 
      }

}

export default SignInForm;