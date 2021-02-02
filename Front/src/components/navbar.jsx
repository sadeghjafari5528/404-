import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './CSS/navbar.css';
import Search from './search';
import {getActiveChannel,getActiveNav} from './util';

class Navbar extends Component {
    state = {
        activeChatroom:getActiveChannel(),
        activeNav:getActiveNav()
    }
    componentDidUpdate(preProps){

        this.setState({
            activeChatroom:this.props.activeChatroom,
            activeNav:this.props.activeNav,
        })
    }
    
    componentDidUpdate(preprops){
        if(preprops.activeNav !== this.props.activeNav)
        {
            this.setState({activeNav:this.props.activeNav})
        }
        if(preprops.activeChatroom !== this.props.activeChatroom)
        {
            this.setState({activeChatroom:this.props.activeChatroom})
        }
    }

    render() { 
        return (
            <nav className="navbar navbar-dark bg-light justify-content-between">
                <Link className="navbar-brand" to="/">404!</Link>
                <ul className="navbar-nav mr-auto">
                    <li className={"nav-item ml-4 pl-3 pr-3".concat(this.state.activeNav==="qanda"?" active":"")}>
                        <Link onClick={()=>this.props.changeNav("qanda")} className="nav-link" to={"/qanda"+this.state.activeChatroom}>Q&A</Link>
                    </li>
                    <li className={"nav-item ml-4 pl-3 pr-3".concat(this.state.activeNav==="discussion"?" active":"")}>
                        <Link onClick={()=>this.props.changeNav("discussion")} className="nav-link" to={"/discussion"+this.state.activeChatroom}>Discussion</Link>
                    </li>
                    {/* <li className="nav-item ml-4 pl-3 pr-3 dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#">Something else here</a>
                      </div>
                    </li> */}
                </ul>
                <Search></Search>
            </nav>
        );
    }
}
 
export default Navbar;