import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useRouteMatch,
  useParams,
  useLocation
} from "react-router-dom";
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import Homepage from './components/homepage';
import Setting from './components/setting';
import MessageBox from './components/messageBox';
 
import AnswerPage from './components/answersPage'
import QuestionsPage from './components/questionsPage'
import Test from './components/test';
import './index.css';



class App extends Component {
  state={
    
  }

  componentDidMount=()=>{
    if(window.location.pathname.toLowerCase() !=="/login" && window.location.pathname.toLowerCase() !=="/signup")
    {
      // console.log(window.location.pathname.toLowerCase()," !== ","/nan")
       
      // console.log("target:",sessionStorage.getItem("targetURL"),":",window.location.pathname)
      if(!sessionStorage.getItem("id"))
      {
        sessionStorage.setItem("targetURL",window.location.pathname)
        document.getElementById("GoToLoginPage").click()
      }
      else
        sessionStorage.removeItem("targetURL")
    }
    else
    {
      sessionStorage.setItem("targetURL","/")
    }
      
  }

  // getUrl()
  // {
  //   const location = useLocation();
  //   console.log(location.pathname);
  // }


  render(){
    return (
      <Router>
        <Link id="GoToLoginPage" to="/login"/>
        {/* <Link id="GoToHomePage" to="/"/> */}
        <Switch>
          <Route path="/login">
            <SignInForm />
          </Route>
          <Route path="/signup">
            <SignUpForm />
          </Route>
          <Route path="/setting">
            <Setting />
          </Route>
          <Route path="/answerPage">
            <AnswerPage />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
        {/* {this.state.currentComponent} */}
      </Router>
    ); 
  }
}
export default App;