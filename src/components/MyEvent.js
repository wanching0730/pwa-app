import React, { Component } from 'react';
import NavBar from './NavBar';
import LoadingBar from './LoadingBar';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import RaisedButton from 'material-ui/RaisedButton';
import Tooltip from '@material-ui/core/Tooltip';
import {browserHistory} from 'react-router';
import openSocket from 'socket.io-client';
import { API_BASE_URL } from '../constant';
import moment from "moment";
import '../style/table.css';
import '../style/alert.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteParticipation, updateDeleteLoadingBar } from '../actions/delete-action';
import { retrieveData, updateLoadingBar } from '../actions/data-action';
import { updateDouble } from '../actions/post-action';

class MyEvent extends Component {

    constructor(props) {
        super(props);

        if(!this.props.isAuthenticated) {
            window.location.assign('/');
        }

        this.state = {
            userEvents: null
        };

        this.handleCancelEvent = this.handleCancelEvent.bind(this);
        this.handleCancelCrew = this.handleCancelCrew.bind(this);
        this.handleRemoveEvent = this.handleRemoveEvent.bind(this);
        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        this.props.onUpdateLoadingBar();

        if(isNaN(this.props.userName)) 
            this.props.onRetrieveData("staffEvent", this.props.userId);
        else 
            this.props.onRetrieveData("studentEvent", this.props.userId);

        const socket = openSocket(API_BASE_URL);
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
        if(data["type"] == "removeEvent") {
            if(this.state.userEvents != null) {
                let list = this.state.userEvents;
                for(var i = 0; i < list.length; i++) {
                    let item = list[i];
                    if(this.props.userName == data["username"] && item["eventId"] == data["eventId"]) {
                        var index = list.indexOf(item);
                        list.splice(index, 1);
                    }
                }
                this.setState({ userEvents: list });
            }
        }
    }
    
    handleSocieties(event) {
        browserHistory.push("/myProfile");
    }

    handleEvents(event) {
        browserHistory.push("/myEvents");
    }

    handleCancelCrew(event) {
        let eventId = event.target.value;

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <MuiThemeProvider>
                        <div className='custom-alert'>
                            <h2>Cancel Crew Registration Confirmation</h2>
                            <p>Are you sure to cancel joining as crew for this event?</p>
                            <RaisedButton label="Yes" primary={true} onClick={() => {
                                       
                                        let data = {
                                            id: this.props.userId,
                                            eventId: eventId,
                                            username: this.props.userName
                                        }

                                        this.props.onUpdateData("cancelStudentEvent", data, ""); 
                    
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

        setTimeout(() => {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <MuiThemeProvider>
                            <div className='custom-alert'>
                                <h2>Cancel Crew Participation Confirmation</h2>
                                <p>Are you sure to cancel participating this event?</p>
                                <RaisedButton label="Yes" primary={true} onClick={() => {

                                            let data = {
                                                id: this.props.userId,
                                                eventId: eventId,
                                                username: this.props.userName
                                            }

                                            if(isNaN(this.props.userName)) 
                                                this.props.onUpdateData("cancelStaffEvent", data, ""); 
                                            else 
                                                this.props.onUpdateData("cancelStudentEvent", data, ""); 
                
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

    handleRemoveEvent(event) {
        let eventId = event.target.value;

        setTimeout(() => {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <MuiThemeProvider>
                            <div className='custom-alert'>
                                <h2>Rmeove Crew Participation Confirmation</h2>
                                <p>Are you sure to remove participation in this event?</p>
                                <RaisedButton label="Yes" primary={true} onClick={() => {
                                            this.props.onUpdateDeleteLoadingBar();

                                            if(isNaN(this.props.userName))
                                                this.props.onDeleteParticipation("staffEvent", this.props.userId, eventId);
                                            else 
                                                this.props.onDeleteParticipation("studentEvent", this.props.userId, eventId);
                
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

                var status, isVege, action, ratingStatus;
                
                for(var i = 0; i < events.length; i++) {
                    let event = events[i];

                    if(event["status"] != 3) {
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
                        else if(event["status"] === 1)
                            status = <td>Approved</td>;
                        else if(event["status"] === 2)
                            status = <td style={{color: "red"}}>Rejected</td>;

                        if(event["vegetarian"] === 0)
                            isVege = <td>No</td>;
                        else 
                            isVege = <td>Yes</td>;
                        

                        if(event["status"] != 1 && moment(event["startDate"]).format("YYYY/MM/DD") >= moment(new Date()).format("YYYY/MM/DD")) {
                            if(event["status"] != 2) {
                                if(event["eRoleId"] === 1) 
                                    action = 
                                        <td>
                                            <Tooltip title="Cancel Event Registration" placement="left">
                                                <li value={event["eventId"]} onClick={(event) => this.handleCancelEvent(event)} className="fa fa-trash"></li>
                                            </Tooltip>
                                        </td>;
                                else 
                                    action = 
                                        <td>
                                            <Tooltip title="Cancel Event Crew" placement="right">
                                                <li value={event["eventId"]} onClick={(event) => this.handleCancelCrew(event)} className="fa fa-trash"></li>
                                            </Tooltip>
                                        </td>;
                            } else {
                                if(event["eRoleId"] === 1) 
                                    action = 
                                        <td>
                                            <Tooltip title="Remove Event Registration" placement="left">
                                                <li value={event["eventId"]} onClick={(event) => this.handleRemoveEvent(event)} className="fa fa-trash"></li>
                                            </Tooltip>
                                        </td>;
                                else 
                                    action = 
                                        <td>
                                            <Tooltip title="Remove Crew Registration" placement="right">
                                                <li value={event["eventId"]} onClick={(event) => this.handleRemoveEvent(event)} className="fa fa-trash"></li>
                                            </Tooltip>
                                        </td>;
                            }
                        } else {
                            action = <td>-</td>;
                        }
                        //  console.log(moment(event["startDate"]).format("DD/MM/YYYY"));
                        //  console.log(moment(new Date()).format("DD/MM/YYYY"));
                        //  console.log(moment(event["startDate"]).format("YYYY/MM/DD") <= moment(new Date()).format("YYYY/MM/DD"));
                        if(event["status"] == 1 && moment(event["startDate"]).format("YYYY/MM/DD") <= moment(new Date()).format("YYYY/MM/DD") && moment(event["endDate"]).format("YYYY/MM/DD") <= moment(new Date()).format("YYYY/MM/DD")) {
                            if(event["ratingStatus"] == 1) 
                                ratingStatus = <td>Done</td>;
                            else 
                                ratingStatus = <td><Link to={toFeedback}>Undone</Link></td>;
                        } else {
                            ratingStatus = <td>-</td>;
                        }

                        rows.push(
                            <tr>
                                <td>{i+1}</td>
                                <td><img style={imageStyle} src={event["logoUrl"]} /></td>
                                {/* <td><img style={imageStyle} src={ require('../assets/images/sport.jpg') } /></td> */}
                                <td><Link to={toEvent}>{event["name"]}</Link></td>
                                <td><Link to={toSociety}>{event["organiserName"]}</Link></td>
                                <td>{moment(event["joinDate"]).format("DD/MM/YYYY")}</td>
                                <td>{event["roleName"]}</td>
                                {status}
                                {isVege}
                                {ratingStatus}
                                {action}
                            </tr>
                        )
                    }
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

                    {this.props.loading || this.props.deleteLoading || this.state.userEvents == null ?
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
                                                <th>Upcoming Events</th> 
                                                <th>Organisers</th> 
                                                <th>Joined Date</th>
                                                <th>Position</th>
                                                <th>Status</th>
                                                <th>Vegetarian</th>
                                                <th>Rating Status</th>    
                                                <th>Action</th>           
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
        deleteLoading: state.delete.loading,
        isAuthenticated: state.auth.isAuthenticated
    };
};

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onRetrieveData: retrieveData,
        onDeleteParticipation: deleteParticipation,
        onUpdateLoadingBar: updateLoadingBar,
        onUpdateData: updateDouble,
        onUpdateDeleteLoadingBar: updateDeleteLoadingBar
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(MyEvent);
