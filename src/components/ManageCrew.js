import React, { Component } from 'react';
import NavBar from './NavBar';
import LoadingBar from './LoadingBar';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import RaisedButton from 'material-ui/RaisedButton';
import Tooltip from '@material-ui/core/Tooltip';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { confirmAlert } from 'react-confirm-alert'; 
import { Link } from 'react-router';
import { CSVLink } from "react-csv";
import openSocket from 'socket.io-client';
import moment from "moment";
import { API_BASE_URL } from '../constant';
import '../style/table.css';
import '../style/alert.css';
import 'rc-tooltip/assets/bootstrap_white.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { retrieveData, updateLoadingBar } from '../actions/data-action';
import { updateDouble } from '../actions/post-action';
import { deleteParticipation, updateDeleteLoadingBar } from '../actions/delete-action';

class ManageCrew extends Component {

    constructor(props) {
        super(props);

        if(!this.props.isAuthenticated) {
            window.location.assign('/');
        }

        this.state = {
            studentId: -1,
            eventCrew: null,
            societyCrew: null,
            headers: [
                { label: "No.", key: "number" },
                { label: "Name", key: "name" },
                { label: "IC", key: "ic" },
                { label: "Course", key: "course" },
                { label: "Year and Sem", key: "year" },
                { label: "Phone Number", key: "phone" },
                { label: "Email Address", key: "email" },
                { label: "Position", key: "position" }
            ], data: []
        };

        this.props.onUpdateLoadingBar();

        if(this.props.params.type === "event")
            this.props.onRetrieveData("eventCrew", this.props.params.id);
        else
            this.props.onRetrieveData("societyCrew", this.props.params.id);

        this.handleApprove = this.handleApprove.bind(this);
        this.handleReject = this.handleReject.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        const socket = openSocket(API_BASE_URL);
        socket.on('updateManage', this.updateList);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.params.type === "event") {
            if((nextProps.eventCrew != this.props.eventCrew) && (nextProps.eventCrew != null)) {
                this.setState({
                    eventCrew: nextProps.eventCrew
                });

                this.setState({ data: [] })

                let ec = nextProps.eventCrew;
                let data = []
    
                for(var i = 0; i < ec.length; i++) {
                    if(ec[i]["status"] == 1) {
                        data.push({
                            number: i+1, name: ec[i]["name"], ic: ec[i]["ic"], course: ec[i]["course"],
                            year: "Y"+ec[i]["year"]+"S"+ec[i]["semester"], phone: ec[i]["contact"],
                            email: ec[i]["email"], position: ec[i]["roleName"]
                        })
                    }
                }
                this.setState({ data: data });
            }
        } else {
            if((nextProps.societyCrew != this.props.societyCrew) && (nextProps.societyCrew != null)) {
                this.setState({
                    societyCrew: nextProps.societyCrew
                });

                this.setState({ data: [] })
                
                let sc = nextProps.societyCrew;
                let data = []
    
                for(var i = 0; i < sc.length; i++) {
                    if(sc[i]["status"] == 1) {
                        data.push({
                            number: i+1, name: sc[i]["name"], ic: sc[i]["ic"], course: sc[i]["course"],
                            year: "Y"+sc[i]["year"]+"S"+sc[i]["semester"], phone: sc[i]["contact"],
                            email: sc[i]["email"], position: sc[i]["roleName"]
                        })
                    }
                }
                this.setState({ data: data });
            }
        }
    }

    updateList(data) {
        if(data["type"] == "rejectEvent") {
            if(this.state.eventCrew != null) {
                let list = this.state.eventCrew;
                for(var i = 0; i < list.length; i++) {
                    let item = list[i];
                    if(item["username"] == data["username"] && this.props.params.id == data["eventId"]) {
                        var index = list.indexOf(item);
                        list.splice(index, 1);
                    }
                }
                this.setState({ eventCrew: list });
            }
        }
        else if(data["type"] == "rejectSociety") {
            if(this.state.societyCrew != null) {
                let list = this.state.societyCrew;
                for(var i = 0; i < list.length; i++) {
                    let item = list[i];
                    if(item["username"] == data["username"] && this.props.params.id == data["societyId"]) {
                        var index = list.indexOf(item);
                        list.splice(index, 1);
                    }
                }
                this.setState({ societyCrew: list });
            }
        } else if (data["type"] == "approveSociety") {
            if(this.state.societyCrew != null) {
                let list = this.state.societyCrew;
                for(var i = 0; i < list.length; i++) {
                    let item = list[i];

                    if(item["username"] == data["username"] && this.props.params.id == data["societyId"]) {
                        item["status"] = 1;
                    }
                }
                this.setState({ societyCrew: list });
            }
        } else if (data["type"] == "approveEvent") {
            if(this.state.eventCrew != null) {
                let list = this.state.eventCrew;
                for(var i = 0; i < list.length; i++) {
                    let item = list[i];

                    if(item["username"] == data["username"] && this.props.params.id == data["eventId"]) {
                        item["status"] = 1;
                    }
                }
                this.setState({ eventCrew: list });
            }
        }
    }

    handleApprove(event, name) {
        let id = event.target.value;

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <MuiThemeProvider>
                        <div className='custom-alert'>
                            <h2>Approval Confirmation</h2>
                            <p>Are you sure to approve this crew?</p>
                            <RaisedButton label="Yes" primary={true} onClick={() => {
                                if(this.props.params.type === "event") {
                                    let data = {
                                        studentId: id,
                                        eventId: this.props.params.id,
                                        username: name
                                    }
                                    this.props.onUpdateData("crew", data, this.props.location.state["eventName"]);
                                } else {
                                    let data = {
                                        id: id,
                                        societyId: this.props.params.id,
                                        username: name
                                    }

                                    if(isNaN(name))
                                        this.props.onUpdateData("societyAdvisor", data, this.props.location.state["societyName"]);
                                    else 
                                        this.props.onUpdateData("societyCrew", data, this.props.location.state["societyName"]);
                                    
                                }
                                onClose();
                            }}/>
                            &nbsp;&nbsp;&nbsp;
                            <RaisedButton label="No" primary={true} onClick={() => onClose()}/>
                        </div>
                    </MuiThemeProvider>
                )
            }
        })
    }

    handleReject(event, name) {
        let targetCrewId = event.target.value;

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <MuiThemeProvider>
                        <div className='custom-alert'>
                            <h2>Reject Confirmation</h2>
                            <p>Are you sure to reject this crew?</p>
                            <RaisedButton label="Yes" primary={true} onClick={() => {   
                                if(this.props.params.type === "event") {
                                    let data = {
                                        id: targetCrewId,
                                        eventId: this.props.params.id,
                                        username: name
                                    }
                                    this.props.onUpdateData("rejectCrew", data, this.props.location.state["eventName"]);
                                } else {
                                    let data = {
                                        id: targetCrewId,
                                        societyId: this.props.params.id,
                                        username: name
                                    }

                                    if(isNaN(name))
                                        this.props.onUpdateData("rejectSocietyAdvisor", data, this.props.location.state["societyName"]);
                                    else 
                                        this.props.onUpdateData("rejectSocietyCrew", data, this.props.location.state["societyName"]);
                                }

                                onClose();
                            }}/>
                            &nbsp;&nbsp;&nbsp;
                            <RaisedButton label="No" primary={true} onClick={() => onClose()}/>
                        </div>
                    </MuiThemeProvider>
                )
            }
        })
    }

    handleRemove(event,name) {
        let targetCrewId = event.target.value;
        
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <MuiThemeProvider>
                        <div className='custom-alert'>
                            <h2>Delete Confirmation</h2>
                            <p>Are you sure to remove this crew?</p>
                            <RaisedButton label="Yes" primary={true} onClick={() => {   

                                if(this.props.params.type === "event") 
                                    this.props.onDeleteParticipation("eventCrew", targetCrewId, this.props.params.id);
                                else {
                                    if(isNaN(name))
                                        this.props.onDeleteParticipation("societyAdvisor", targetCrewId, this.props.params.id);
                                    else
                                        this.props.onDeleteParticipation("societyCrew", targetCrewId, this.props.params.id);
                                }
        
                                onClose();
                            }}/>
                            &nbsp;&nbsp;&nbsp;
                            <RaisedButton label="No" primary={true} onClick={() => onClose()}/>
                        </div>
                    </MuiThemeProvider>
                )
            }
        })
    }

    render() {
        const { RaisedButtonStyle } = styles;
        var message = <div></div>;
        var rows = [], breadcrumbs, crew, termTh, termTd;
        
        if(this.props.params.type === "event") {
            crew = this.state.eventCrew;
            breadcrumbs = 
                <div style={{ margin: 20 }}>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to={`/home`}>Home</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={`/event`}>Events</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={{pathname:`/perEvent/` + this.props.params.id, state: {eventName: this.props.location.state["eventName"]}}}>{this.props.location.state["eventName"]}</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Manage Crew</BreadcrumbItem>
                    </Breadcrumb>
                </div>
        } else {
            crew = this.state.societyCrew;

            termTh = <th>Term</th>;

            breadcrumbs = 
                <div style={{ margin: 20 }}>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to={`/home`}>Home</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={`/event`}>Societies</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={{pathname:`/perSociety/` + this.props.params.id, state: {societyName: this.props.location.state["societyName"]}}}>{this.props.location.state["societyName"]}</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Manage Crew</BreadcrumbItem>
                    </Breadcrumb>
                </div>
        }

        if(crew != null) {
            if(crew.length != 0) {
                for(var i = 0; i < crew.length; i++) {
                    let singleCrew = crew[i];
                    var approvedIcon, deleteIcon;

                    if(this.props.params.type === "society")
                        termTd = <td>{moment(singleCrew["joinDate"]).format("YY") + "/" + parseInt(parseInt(moment(singleCrew["joinDate"]).format("YY")) + 1)}</td>
                    
                    if(singleCrew["status"] != 2) {
                        if(singleCrew["status"] == 1) 
                            approvedIcon = 
                                <td>
                                    <Tooltip title="Approved" placement="left">
                                        <li className="fa fa-check"></li>
                                    </Tooltip>
                                </td>
                        else if(singleCrew["status"] == 0) 
                            approvedIcon = 
                                <td>
                                    <Tooltip title="Approve crew" placement="left">
                                        <li value={singleCrew["id"]} onClick={(event) => this.handleApprove(event, singleCrew["username"])} className="fa fa-plus"></li>
                                    </Tooltip>
                                </td>
                        else 
                            approvedIcon = 
                                <td>
                                    <Tooltip title="Cancelled by member" placement="left">
                                        <div>-</div>
                                    </Tooltip>
                                </td>

                        if(singleCrew["status"] !=3) {
                            deleteIcon = 
                                <td>
                                    <Tooltip title="Reject Crew" placement="right">
                                        <li value={singleCrew["id"]} onClick={(event) => this.handleReject(event,singleCrew["username"])} className="fa fa-trash"></li>
                                    </Tooltip>
                                </td>
                        } else {
                            deleteIcon =
                                <td>
                                    <Tooltip title="Remove Crew" placement="right">
                                        <li value={singleCrew["id"]} onClick={(event) => this.handleRemove(event,singleCrew["username"])} className="fa fa-trash"></li>
                                    </Tooltip>
                                </td>
                        }
                                    

                        rows.push(
                            <tr> 
                                <td>{i+1}</td>
                                <td>{singleCrew["name"]}</td>
                                <td>{singleCrew["ic"]}</td>
                                <td>{singleCrew["course"]}</td>
                                <td>Y{singleCrew["year"]}S{singleCrew["semester"]}</td>
                                <td>{singleCrew["contact"]}</td>
                                <td>{singleCrew["email"]}</td>
                                <td>{singleCrew["roleName"]}</td>
                                {termTd}
                                {approvedIcon}
                                {deleteIcon}
                            </tr>
                        )
                    }
                }
            } else {
                message = <div style= {{ textAlign: "center", marginBottom: "20px"}}>No crew for this event</div>;
            }
        }
        
        return (
            <div id="outerDiv"> 
                <NavBar />

                {breadcrumbs}

                {this.props.loading || this.props.deleteLoading ?
                    [<LoadingBar />]
                    :
                    [
                        <div>
                            <MuiThemeProvider>

                                <div className="container" id="crewContainer">
                                    <div className="row">           
                                        <table id="table1" border="1">
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Name</th>
                                                    <th>IC Number</th>   
                                                    <th>Course</th>  
                                                    <th>Year and Sem</th> 
                                                    <th>Phone Number</th>   
                                                    <th>Email Address</th>   
                                                    <th>Position</th>  
                                                    {termTh}
                                                    <th colSpan="2">Actions</th>               
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {rows}
                                            </tbody>
                                        </table>

                                        {message}

                                        <div style= {{ margin: "0 auto" }}>
                                            <CSVLink data={this.state.data} headers={this.state.headers}>Download</CSVLink>
                                            <RaisedButton label="Back" primary={true} style={RaisedButtonStyle} onClick={(event) => window.history.back()}/>
                                        </div> 
                                    </div>
                                </div>
                            </MuiThemeProvider>
                        </div>
                    ]
                }
        </div>
        );
    };
    
};

const styles = {
    RaisedButtonStyle: {
        margin: 15
    }
}

const mapStateToProps = (state, props) => {
    return {
        eventCrew: state.data.eventCrew,
        societyCrew: state.data.societyCrew,
        userName: state.auth.userName,
        loading: state.data.loading,
        deleteLoading: state.delete.loading,
        isAuthenticated: state.auth.isAuthenticated
    };
};

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
      onRetrieveData: retrieveData,
      onUpdateData: updateDouble,
      onDeleteParticipation: deleteParticipation,
      onUpdateLoadingBar: updateLoadingBar,
      onUpdateDeleteLoadingBar: updateDeleteLoadingBar
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(ManageCrew);
