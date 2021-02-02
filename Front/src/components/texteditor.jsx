import React, { Component } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
import exitImg from '../img/exit.png'

import './CSS/texteditor.css';




// how to use:
// 1.add following variables to parent state:
//   editorContent:null,
//   editorVisible:true,

// 2.add following function to parent class:
//   showEditor = () => {
//     this.setState({ editorVisible: true });
//   };
//   hideEditor = () => {
//       this.setState({ editorVisible: false });
//   };
//   updateContent = (value) => {
//     this.setState({editorContent:value})
//   };

// 3.add following tag to your code:
//   

 

class Texteditor  extends Component {
  constructor(props) {
      super(props);
      this.state = {
      }
  }

  modalClick = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    return false;
  }
    /**
     * @property Jodit jodit instance of native Jodit
     */
  // jodit;
  // setRef = jodit => this.jodit = jodit;
  
  config = {
    "askBeforePasteHTML": false,
    "askBeforePasteFromWord": false,
  // "defaultActionOnPaste": "insert_only_text",
    "maxHeight": 500,
    theme: "dark",
    readonly: false // all options from https://xdsoft.net/jodit/doc/
  }
    render() {
        return (
          <div id="editor">
            {this.props.editorVisible?
              <div onClick={() => this.props.hideEditor()} className="modal">
                 <section onClick={this.modalClick} className="modal-main d-flex flex-column">
                 <div className="editor-exitImg">
                            {/* <Link to="/"> */}
                                <img onClick={() => this.props.hideEditor(false)}  src={exitImg} />
                            {/* </Link> */}
                        </div>
                    <div className="modal-body black-text">
                      <JoditEditor
                        // editorRef={this.setRef}
                        value={this.props.content}
                        config={this.config}
                        onChange={this.props.updateContent}
                      />
                    </div>
                    <div className="row mb-2">
                            <div className="d-flex justify-content-start ml-auto mr-4">
                                <button type="button" className="btn btn-secondary"
                                    onClick={() => this.props.hideEditor(false)}>
                                    Cancel
                        </button>
                            </div>
                            <div className=" d-flex justify-content-end mr-3">
                                <button onClick={() => this.props.hideEditor(true)} 
                                    type="button" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </div>
                </section>
            </div>
            :""}
            
          </div>
        
        );
    }
}
export default Texteditor;
              
        




      