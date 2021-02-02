import React, { Component,useState} from 'react';
import Select from 'react-select';
import './CSS/search.css'

const times = [
    { value: 0, label: 'All time' },
    { value: 1, label: 'last 2 years' },
    { value: 2, label: 'last year' },
    { value: 3, label: 'last 6 months' },
    { value: 4, label: 'last 3 months' },
    { value: 5, label: 'last month' },
    { value: 6, label: 'last week' },
]
const members = [
    { value: 0, label: '10' },
    { value: 1, label: '100' },
    { value: 2, label: '1000' },
    { value: 3, label: '5000' },
    { value: 4, label: 'more than 10000' },
    { value: 5, label: 'no limit'},
]
const sorts = [
    { value: 0, label: 'Newest'},
    { value: 1, label: 'Oldest'},
    { value: 2, label: 'Number of Upvotes' },

]


class SearchFilter extends Component {
    state = {
        onlyAnswered:(this.props.onlyAnswered===1),
        time:times[this.props.time],
        member:members[this.props.member],
        sort:sorts[this.props.sort],
    }

    modalClick = (e) => {
        // e.preventDefault();
        e.stopPropagation();
        return false;
    }
    // componentDidMount(){
    //     this.setState({onlyAnswered:this.props.onlyAnswered===1,
    //         time:times[this.props.time],
    //         member:members[this.props.member],
    //         sort:sorts[this.props.sort],})
    // }
    ccomponentDidUpdate(prevProps) {
        console.log("change detected")
        if (prevProps !== this.props) {
            console.log("applied changes")
            this.setState({onlyAnswered:this.props.onlyAnswered===1,
                time:times[this.props.time],
                member:members[this.props.member],
                sort:sorts[this.props.sort],})
            // console.log("chatroom changed from ",prevProps.Cid ," to ",this.props.Cid)
            // this.loadData()
            
        }
      }

    
    render() { 
        return (
            <div id="search-filter">
                {this.props.showFilter?
                <div onClick={() => this.props.hideFilter(false,null)} className="modal">
                    <section onClick={this.modalClick} className="modal-main d-flex flex-column">
                        <button 
                            type="button" class="btn-lg rounded-circle ml-auto mr-2 clean-button"
                            onClick={() => this.props.hideFilter(false,null)} 
                            style={{outline:"none",height: "30px",width: "30px"}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                        <div className="pr-3 pl-3">
                            <div className="border-bottom">
                                <p className="ml-2 mb-2 h3">Filters</p>
                            </div>
                            <div className="mt-2">
                                <input className=""
                                    name="onlyAnsweredCheckBox"
                                    type="checkbox" 
                                    onClick={()=>this.setState({onlyAnswered:!this.state.onlyAnswered})} 
                                    checked={this.state.onlyAnswered}/>
                                <label for="onlyAnsweredCheckBox" className="ml-2">Show answered Questions only.</label>
                            </div>
                            <div className="d-flex flex-row mt-4">
                                <p className="mt-2">sort by :</p>
                                <div className="black-text w-50 ml-auto">
                                    <Select
                                        onChange={(value)=>this.setState({sort:value})}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={this.state.sort}
                                        isLoading={false}
                                        // isClearable={true}
                                        isRtl={false}
                                        isSearchable={false}
                                        options={sorts}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row mt-4">
                                <p className="mt-2">Questions submitted in :</p>
                                <div className="black-text w-50 ml-auto">
                                    <Select
                                        onChange={(value)=>this.setState({time:value})}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={this.state.time}
                                        isLoading={false}
                                        // isClearable={true}
                                        isRtl={false}
                                        isSearchable={false}
                                        options={times}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-row mt-4">
                                <p className="mt-2">Minimum Users in Chatroom  :</p>
                                <div className="black-text w-50 ml-auto">
                                    <Select
                                        onChange={(value)=>this.setState({member:value})}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={this.state.member}
                                        isLoading={false}
                                        // isClearable={true}
                                        isRtl={false}
                                        isSearchable={false}
                                        options={members}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto mb-2">
                            <div className="d-flex flex-row">
                            <div className="d-flex justify-content-start ml-auto mr-4">
                                <button type="button" className="btn btn-secondary"
                                    onClick={() => this.props.hideFilter(false,null)}>
                                    Cancel
                                </button>
                            </div>
                                <div className=" d-flex justify-content-end mr-3">
                                    <button onClick={() => this.props.hideFilter(true,
                                        {
                                            onlyAnswered:this.state.onlyAnswered?1:0,
                                            time:this.state.time.value,
                                            member:this.state.member.value,
                                            sort:this.state.sort.value,
                                        }
                                    )} 
                                        type="button" className="btn btn-primary">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                :""}
                
            </div>
        );
    }
}
 
export default SearchFilter;