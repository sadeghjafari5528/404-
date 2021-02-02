import React, { Component } from 'react';
import {getUserAvatar} from './util';

class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnline: true,
            showAvatar: this.props.showAvatar,
            userId: this.props.userId,
        }; 

    }
    render() { 
        return ( 
            <div className="userProfileAvatar">
                {this.state.isOnline && this.state.showAvatar?
                                  
                    <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    variant="dot"
                    >
                        <Avatar alt="Avatar" id="profile-img" src={getUserAvatar(this.state.userId)} />
                    </StyledBadge> :    
                    <img id="profile-img" src={getUserAvatar(this.state.userId)} />
                }
            </div>
         );
    }
}
 
export default Avatar;