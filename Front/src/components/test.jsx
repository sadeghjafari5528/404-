import React, { Component } from 'react';
import {connect,listen,send} from './socket';

class Test extends Component {
  state = { time:"", }

  setMessage=(message)=>{
    console.log("received info:",message)
    let data = JSON.parse(message.data);
      console.log(data);
      if (data.message)
    this.setState({time:data.message})
  }
  async componentWillMount(){
    await connect("ws://127.0.0.1:8000/ws/api/generalchatroom/kidding/");
    await listen("message",this.setMessage);
    
  }
  async sayHello(){
    await send({"message" : "Hi man!"});
  }

  render() { 
    return ( 
      <React.Fragment>
        <div className="App black-text">
            <header className="App-header">
              <React.Fragment>
                {/* <Event event='message' handler={this.onMessage} /> */}
                <p>Server Time is {this.state.time}</p>
                <button onClick={this.sayHello}>Say Hi to server</button>
              </React.Fragment>
            </header>
          </div>
      </React.Fragment>
     );
  }
}
 
export default Test;