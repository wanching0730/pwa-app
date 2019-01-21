import React, { Component } from 'react';
import NavBar from './NavBar';
import LoadingBar from './LoadingBar';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import RaisedButton from 'material-ui/RaisedButton';
import Tooltip from 'rc-tooltip';
import {browserHistory} from 'react-router';
import openSocket from 'socket.io-client';
import moment from "moment";
import '../style/table.css';
import '../style/alert.css';
import 'rc-tooltip/assets/bootstrap_white.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteParticipation, updateDeleteLoadingBar } from '../actions/delete-action';
import { retrieveData, updateLoadingBar } from '../actions/data-action';

class MyEvent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eventId: -1,
            userEvents: null
        };

        this.props.onUpdateLoadingBar();

        if(this.props.userName.substring(0,2) === "00") 
            this.props.onRetrieveData("staffEvent", this.props.userId);
        else 
            this.props.onRetrieveData("studentEvent", this.props.userId);

        this.handleCancelEvent = this.handleCancelEvent.bind(this);
        this.handleCancelCrew = this.handleCancelCrew.bind(this);
        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        const socket = openSocket('http://localhost:5000');
        socket.on('updateParticipation', this.updateList);
    }

    componentWillReceiveProps(nextProps){
        if((nextProps.userEvents != this.props.userEvents) && (nextProps.userEvents != null)) {
            this.setState({
                userEvents: nextProps.userEvents
            });
        }
    }

    updateList(data) {
        let list = this.state.userEvents;
        for(var i = 0; i < list.length; i++) {
            let item = list[i];
            if(item["studentId"] == data["studentId"] && item["eventId"] == data["eventId"]) {
                var index = list.indexOf(item);
                list.splice(index, 1);
            }
        }
        this.setState({ userEvents: list });
    }
    
    handleSocieties(event) {
        browserHistory.push("/myProfile");
    }

    handleEvents(event) {
        browserHistory.push("/myEvents");
    }

    handleCancelCrew(event) {
        let eventId = event.target.value;
        this.setState({eventId: eventId});

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <MuiThemeProvider>
                        <div className='custom-alert'>
                            <h2>Cancel Crew Registration Confirmation</h2>
                            <p>Are you sure to cancel joining as crew for this event?</p>
                            <RaisedButton label="Yes" primary={true} onClick={() => {
                                        this.props.onUpdateDeleteLoadingBar();
                                        this.props.onDeleteParticipation("eventCrew", this.props.userId, this.state.eventId);
                    
                                        onClose();
                                    }
                                }/>
                                &nbsp;&nbsp;&nbsp;
                            <RaisedButton label="No" primary={true} onClick={() => onClose()}/>
                        </div>
                    </MuiThemeProvider>
                )
            }
        })
    }

    handleCancelEvent(event) {
        let eventId = event.target.value;
        this.setState({eventId: eventId});

        setTimeout(() => {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <MuiThemeProvider>
                            <div className='custom-alert'>
                                <h2>Cancel Crew Participation Confirmation</h2>
                                <p>Are you sure to cancel participating this event?</p>
                                <RaisedButton label="Yes" primary={true} onClick={() => {
                                            this.props.onUpdateDeleteLoadingBar();

                                            if(this.props.userName.substring(0,2) === "00") 
                                                this.props.onDeleteParticipation("staffEvent", this.props.userId, this.state.eventId);
                                            else 
                                                this.props.onDeleteParticipation("studentEvent", this.props.userId, this.state.eventId);
                
                                            onClose();
                                        }
                                    }/>
                                    &nbsp;&nbsp;&nbsp;
                                <RaisedButton label="No" primary={true} onClick={() => onClose()}/>
                            </div>
                        </MuiThemeProvider>
                    )
                }
            })
        }, 2000);
    }
    
    render() {
        const { imageStyle, RaisedButtonStyle } = styles;

        if(this.state.userEvents != null) {
            var message = <div></div>;
            var rows = [];

            if(this.state.userEvents.length != 0) {
                let events = this.state.userEvents;

                var status, isVege, crewAction, participantAction, ratingStatus;
                
                for(var i = 0; i < events.length; i++) {
                    let event = events[i];

                    let toEvent = {
                        pathname: "/perEvent/" + event["eventId"],
                        state: {eventName: event["name"]}
                    }

                    let toSociety = {
                        pathname: "/perSociety/" + event["organiserId"],
                        state: {societyName: event["organiserName"]}
                    }

                    let toFeedback = {
                        pathname: "/feedback/" + event["eventId"],
                        state: {eventName: event["name"]}
                    }

                    if(event["status"] === 0)  
                        status = <td>Pending</td>;
                    else 
                        status = <td>Approved</td>;

                    if(event["vegetarian"] === 0)
                        isVege = <td>No</td>;
                    else 
                        isVege = <td>Yes</td>;

                    if(event["status"] === 0 && event["position"] != "participant") 
                        crewAction = 
                            <td>
                                <Tooltip placement="right" trigger={['hover']} overlay={<span>Cancel event crew</span>}>
                                    <li value={event["eventId"]} onClick={(event) => this.handleCancelCrew(event)} className="fa fa-times-circle"></li>
                                </Tooltip>
                            </td>;
                    else 
                        crewAction = <td></td>

                    if(event["status"] === 1) 
                        participantAction = 
                            <td>
                                <Tooltip placement="left" trigger={['hover']} overlay={<span>Cancel event registration</span>}>
                                    <li value={event["eventId"]} onClick={(event) => this.handleCancelEvent(event)} className="fa fa-trash"></li>
                                </Tooltip>
                            </td>;
                    else 
                        participantAction = <td></td>
                    
                    if(this.props.userName.substring(0,2) === "00") 
                        ratingStatus = <td>-</td>;
                    else {
                        if(event["ratingStatus"] == 1) 
                            ratingStatus = <td>Done</td>;
                        else 
                            ratingStatus = <td><Link to={toFeedback}>Undone</Link></td>;
                    }

                    rows.push(
                        <tr>
                            <td>{i+1}</td>
                            <td><img style={imageStyle} src={event["logoUrl"]} /></td>
                            {/* <td><img style={imageStyle} src={ require('../assets/images/sport.jpg') } /></td> */}
                            <td><Link to={toEvent}>{event["name"]}</Link></td>
                            <td><Link to={toSociety}>{event["organiserName"]}</Link></td>
                            <td>{moment(event["joinDate"]).format("DD/MM/YYYY")}</td>
                            <td>{event["position"]}</td>
                            {status}
                            {isVege}
                            {ratingStatus}
                            {participantAction}
                            {crewAction}
                        </tr>
                    )
                }
            } else {
                message = <div style= {{ textAlign: "center", marginBottom: "20px"}}>No events participated</div>;
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
                            <BreadcrumbItem active>My Events</BreadcrumbItem>
                        </Breadcrumb>
                    </div>

                    <div style= {{ textAlign: "center" }}>
                        <RaisedButton label="My Societies" primary={true} style={RaisedButtonStyle} onClick={(event) => this.handleSocieties(event)}/>
                        <RaisedButton label="My Events" primary={true} style={RaisedButtonStyle} onClick={(event) => this.handleEvents(event)}/>
                    </div>

                    {this.props.loading || this.props.deleteLoading ?
                    [<LoadingBar />]
                    :
                    [
                        <div>
                            <div className="container" id="myEventContainer">
                                <div className="row">
                                    <table id="table1">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Logo</th>
                                                <th>Events</th> 
                                                <th>Organisers</th> 
                                                <th>Joined Date</th>
                                                <th>Position</th>
                                                <th>Crew Status</th>
                                                <th>Vegetarian</th>
                                                <th>Rating Status</th>    
                                                <th colSpan="2">Actions</th>           
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </table>
                                    {message} 

                                    <div style= {{ margin: "0 auto" }}>
                                        <RaisedButton label="Back" primary={true} style={RaisedButtonStyle} onClick={(event) => window.history.back()}/>
                                    </div>
                                </div>
                            </div>  
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
    imageStyle: {
        height: "50px",
        width: "50px"
    }
}

const mapStateToProps = (state, props) => {
    return {
        userEvents: state.data.userEvents,
        userId: state.auth.id,
        userName: state.auth.userName,
        loading: state.data.loading,
        deleteLoading: state.delete.loading
    };
};

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onRetrieveData: retrieveData,
        onDeleteParticipation: deleteParticipation,
        onUpdateLoadingBar: updateLoadingBar,
        onUpdateDeleteLoadingBar: updateDeleteLoadingBar
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(MyEvent);
