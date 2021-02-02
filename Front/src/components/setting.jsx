import React, { Component } from 'react';
import {Link} from "react-router-dom";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import './CSS/leftMenu.css';
import './CSS/setting.css';
import MyAccount from './myAccount';


class Setting extends Component {
    state = {
      options:[
        {
          id:1,
          label:"My Account",
          content:<MyAccount/>
        },
        {
          id:2,
          label:"Setting option 2",
          content:<div>Empty div</div>
        },
        {
          id:3,
          label:"Setting option 2",
          content:<div>Empty div</div>
        }
      ],
      activeTab:1
    }

    tabClicked=(id)=>{
      this.setState({activeTab:id})
    }

    render() { 
        return (  
          <div className="Setting-bg d-flex justify-content-center">
            <div className="h-100 empty-125"></div>
            <div className="w-75 ">

            
            <div className="setting-Menu ">
              <div className="h-100 d-flex align-items-start flex-column">

                <p className="h1 mt-3 ml-4 mb-4">Setting</p>

                <div className=" nav nav-pills">

                  {this.state.options.map(opt =>
                    <a key={opt.id} 
                      onClick={()=> this.tabClicked(opt.id)} 
                      className={"nav-link".concat(this.state.activeTab===opt.id?" active":"")}
                      href="#" >
                        <div className="d-flex flex-row">
                            <div className="pl-2 d-flex align-items-center pr-5">{opt.label}</div>
                        </div>  
                    </a>
                  )}
                </div>


                <div className="setting-backButton  mt-auto w-100">
                  <Link className="p-0 w-100" to="/">
                    <button className="w-100 pr-3 d-flex align-items-center justify-content-center">
                      <svg width="1em" height="1em" viewBox="0 0 16 16" className="mr-1 bi bi-chevron-double-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                        <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                      </svg>
                      Back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className=" setting-right">
              <div className="mr-4 ml-4 mt-2 mb-2">
              {this.state.options[this.state.activeTab-1].content}

              </div>
            </div>
            
            </div>
            <div className="h-100 empty-125"></div>

          </div>
          
        );
    }
}
 
export default Setting;