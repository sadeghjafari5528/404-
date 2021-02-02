// import React, { Component } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';


let rws ;
const urlProvider = async () => {
    // const token = await getSessionToken();
    // return `wss://my.site.com/${token}`;
};

export const connect= async (url)=>{
    const options = {
        // WebSocket: WS, // custom WebSocket constructor
        connectionTimeout: 1000,
        // maxRetries: 10,
    };
    rws = new ReconnectingWebSocket(url,[],options);

}
export const listen= async (evtName,func)=>{
    
    rws.addEventListener(evtName,evt => func(JSON.parse(evt.data)));
}

export const send= async (obj)=>{
    
    rws.send(JSON.stringify(obj));
}



















// class Socket extends Component {
//     state = {  }
//     render() { 
//         return (
//             <React.Fragment>

//             </React.Fragment>
//         );
//     }
// }
 
// export default Socket;