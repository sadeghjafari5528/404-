import React, { Component } from 'react';
import ReactLoading from 'react-loading';

class LoadingPage extends Component {
    state = {}
    render() { 
        return (
            <React.Fragment>
                <div className="modal display-block">
                    <div className="d-flex justify-content-center d-flex align-items-center h-100 w-100">
                            <ReactLoading type={this.props.type?this.props.type:"spinningBubbles"} 
                                color={this.props.color?this.props.color:"white"} height={200} width={200} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default LoadingPage;