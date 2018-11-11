import React, { Component } from 'react';
import NavBar from './NavBar';
import LoadingBar from './LoadingBar';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Breadcrumb, BreadcrumbItem, Card, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';
import Modal from 'react-modal';
import RaisedButton from 'material-ui/RaisedButton';
import { confirmAlert } from 'react-confirm-alert';
import moment from "moment";
import '../style/newsfeed.css';
import '../style/alert.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { retrieveAll, retrieveData, updateLoadingBar } from '../actions/data-action';
import { create } from '../actions/post-action';

class NewsFeed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            inputValue: "",

            status: "all",
            owner: "s",
            ownerId: null,
            ownerName: null,
            ownerCategory: null,

            societyOptions: null,
            eventOptions: null,
        };
    
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleOwner = this.handleOwner.bind(this);

        this.props.onUpdateLoadingBar();
        this.props.onRetrieveData("studentEvent", this.props.userId);
        this.props.onRetrieveAll("newsfeeds");

        setTimeout(() => {
            this.setState({
                newsfeeds: this.props.newsfeeds
            });
            console.log("newsfeeds in constructor: " + this.state.newsfeeds);
        }, 6000);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        if(this.props.societies != null) {
            let societies = this.props.societies;
            let options = [];
            for(var i = 0; i < societies.length; i++) {
                let society = societies[i];
                if(society["position"] == "chairperson" || society["position"] == "secretary") {
                    options.push({
                        value: society["societyId"],
                        name: society["name"]
                    });
                }
            }
            this.setState({
                societyOptions: options
            }, () => this.setDefault());
        } 
        
        setTimeout(() => {
            if(this.props.userEvents != null) {
                let events = this.props.userEvents;
                let options = [];
                for(var i = 0; i < events.length; i++) {
                    let event = events[i];
                    if(event["position"] == "chairperson" || event["position"] == "secretary") {
                        options.push({
                            value: event["eventId"],
                            name: event["name"]
                        });
                    }
                }
                this.setState({
                    eventOptions: options
                }, () => this.setDefault());
            }
        }, 1500);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
        console.log("closemodal ownerId:" + this.state.ownerId);

        if(this.state.inputValue == "") {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <MuiThemeProvider>
                            <div className='custom-alert'>
                                <h1>Warning</h1>
                                <p>Please fill in all empty fields before proceed</p>
                                <RaisedButton label="Close" primary={true} onClick={() => onClose()}/>
                            </div>
                        </MuiThemeProvider>
                    )
                }
            })
            return false;
          } else {
            if(this.state.owner == "s") {
                let societies = this.props.societies;
                for(var i = 0; i < societies.length; i++) {
                    let society = societies[i];
                    if(society["societyId"] == this.state.ownerId) {
                        // call submit() method after the state is set completely
                        this.setState({
                            ownerName: society["name"],
                            ownerCategory: society["category"]
                        }, () => {
                            this.submit();
                        })
                        return;
                    }
                }
            } else {
                let events = this.props.events;
                for(var i = 0; i < events.length; i++) {
                    let event = events[i];
                    if(event["eventId"] == this.state.ownerId) {
                        this.setState({
                            ownerName: event["name"],
                            ownerCategory: event["category"]
                        }, () => {
                            this.submit();
                        })
                        return;
                    }
                }
            }
          }
    }

    submit() {
        let current = moment();
        let data = {
            ownerId: this.state.ownerId,
            name: this.state.ownerName,
            category: this.state.ownerCategory,
            desc: this.state.inputValue,
            dateCreate: moment(current).format("YYYY-MM-DD hh:mm:ss"),
            type: this.state.owner
        };

        console.log("owner data: " + JSON.stringify(data));

        this.props.onCreate("newsfeeds", data);
        
        setTimeout(() => {
            this.props.onRetrieveAll("newsfeeds");
        }, 4000);

        this.setState({
            status: "all",
            owner: "s",
            ownerId: null,
            ownerName: null,
            ownerCategory: null
        });
    }

    updateInputValue(event) {
        this.setState({
          inputValue: event.target.value
        });
    }

    handleOptionChange(event) {
        this.setState({
            owner: event.target.value
        }, () => this.setDefault());
    }

    setDefault() {
        if(this.state.owner == "s") {
            let first = this.state.societyOptions;
            if(first != null) {
                this.setState({
                    ownerId: first[0]["value"]
                });
            }
        } else {
            let first = this.state.eventOptions;
            if(first != null) {
                this.setState({
                    ownerId: first[0]["value"]
                });
            }
        }
    }

    handleOwner(event) {
        this.setState({
            ownerId: event.target.value
        });
    }

    mapItem(item) {
        return <option value={item.value}>{item.name}</option>;
    }

    render() {
        console.log("user event: " + this.props.userEvents);
        const { RaisedButtonStyle, content } = styles;
        let newsfeeds = this.props.newsfeeds;
        let filteredNewsfeeds = [];
        var dropdown;

        console.log("newsfeed in render: " + newsfeeds);
            
        if(this.state.owner == "s") {
            if(this.state.societyOptions != null) {
                dropdown = <select value={this.state.ownerId} onChange={this.handleOwner}>
                                {this.state.societyOptions.map(this.mapItem)}
                            </select>;
            } else {
                dropdown = "No societies available";
            }
        } else {
            if(this.state.eventOptions != null) {
                dropdown = <select value={this.state.ownerId} onChange={this.handleOwner}>
                                    {this.state.eventOptions.map(this.mapItem)}
                                </select>
            } else {
                dropdown = "No events available";
            }
        }
        
        if(newsfeeds != null) {
            var toView;
            var type  = "";
            var rows = [];

            if(this.state.status == "s") {
                for(var i = 0; i < newsfeeds.length; i++) 
                    if(newsfeeds[i]["type"] == "s")
                        filteredNewsfeeds.push(newsfeeds[i]);
            } else if(this.state.status == "e") {
                for(var i = 0; i < newsfeeds.length; i++) 
                    if(newsfeeds[i]["type"] == "e")
                        filteredNewsfeeds.push(newsfeeds[i]);
            } else {
                filteredNewsfeeds = newsfeeds;
            }
            
            for(var i = 0; i < filteredNewsfeeds.length; i++) {
                let newsfeed = filteredNewsfeeds[i];
                if(newsfeed["type"] == "s") {
                    // url = "/perSociety/" + newsfeed["ownerId"];
                    toView = {
                        pathname: "/perSociety/" + newsfeed["ownerId"],
                        state: {societyName: newsfeed["name"]}
                    }
                    type = " Society";
                }
                else {
                    // url = "/perEvent/" + newsfeed["ownerId"];
                    toView = {
                        pathname: "/perEvent/" + newsfeed["ownerId"],
                        state: {eventName: newsfeed["name"]}
                    }
                    type = " Event";
                }

                rows.push(
                    <Card>
                        <img className="image" src={ require('../assets/images/its.jpg') } />
                        <CardBody>
                        <CardTitle>{newsfeed["name"]}{type}</CardTitle>
                        <CardSubtitle>| Category: {newsfeed["category"]} |</CardSubtitle>
                        <br/>
                        <CardText>{newsfeed["desc"]}</CardText>
                        <Link to={toView}>View</Link>
                        <CardText>
                            <small className="text-muted">{moment(newsfeed["dateCreate"]).format("MMM DD YYYY hh:mm A")}</small>
                        </CardText>
                        </CardBody>
                    </Card>
                );
            }
        }

        return (
            
            <div>
                <MuiThemeProvider>
                <div id="outerDiv"> 
                    <NavBar />

                    <div style={{ margin: 20 }}>
                        <Breadcrumb>
                            <BreadcrumbItem><Link to={`/home`}>Home</Link></BreadcrumbItem>
                            <BreadcrumbItem active>NewsFeed</BreadcrumbItem>
                        </Breadcrumb>
                    </div>

                     <div style= {{ textAlign: "center" }}>
                        <RaisedButton label="All" primary={true} style={RaisedButtonStyle} onClick={(event) => this.setState({status: "a"})}/>
                        <RaisedButton label="Societies" primary={true} style={RaisedButtonStyle} onClick={(event) => this.setState({status: "s"})}/>
                        <RaisedButton label="Events" primary={true} style={RaisedButtonStyle} onClick={(event) => this.setState({status: "e"})}/>
                    </div>
                    
                    <div style= {{ textAlign: "left" }}>
                        <RaisedButton label="Create New" primary={false} style={RaisedButtonStyle} onClick={(event) => this.openModal()}/>
                    </div>

                    <Modal
                        isOpen={this.state.modalIsOpen}
                        ariaHideApp={false}
                        //onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={content}
                        contentLabel="Example Modal"
                        >

                        <h2 ref={subtitle => this.subtitle = subtitle}>What's new?</h2>
                        <br/>
                        <br/>
                        <form style={{textAlign:"center"}}>
                            <label>Choose: </label>
                            <input type="radio" value="s" 
                                checked={this.state.owner === 's'} 
                                onChange={this.handleOptionChange} /> Society 
                            &nbsp;
                            <input type="radio" value="e" 
                                checked={this.state.owner === 'e'} 
                                onChange={this.handleOptionChange} /> Event
                            <br/>
                            <label>Post From: </label>
                            {dropdown}
                            <br/>
                            <label>Status: </label>
                            <input onChange={this.updateInputValue} />
                            <br/>
                            <RaisedButton label="Save" primary={true} style={RaisedButtonStyle} onClick={(event) => this.closeModal()}/>
                        </form>
                    
                    </Modal>
        
                    {this.props.loading ?
                        [<LoadingBar />]
                        :
                        [
                            <div className="card">
                                {rows}
                            </div>
                        ]
                    }
                    
                </div>
                </MuiThemeProvider>
            </div>
        );
    };
    
};

const styles = {
    RaisedButtonStyle: {
        margin: 15
    },
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }
}

const mapStateToProps = (state, props) => {
    console.log("state in newsfeed: " + state.data.newsfeeds);
    return {
        userId: state.auth.id,
        newsfeeds: state.data.newsfeeds,
        societies: state.auth.societies,
        userEvents: state.data.userEvents,
        loading: state.data.loading
    };
};

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onRetrieveAll: retrieveAll,
        onRetrieveData: retrieveData,
        onCreate: create,
        onUpdateLoadingBar: updateLoadingBar
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(NewsFeed);
