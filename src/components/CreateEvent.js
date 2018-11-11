import React, { Component } from 'react';
import NavBar from './NavBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import moment from "moment";
import DatePicker from "react-datepicker";
import { confirmAlert } from 'react-confirm-alert';
import "react-datepicker/dist/react-datepicker.css";
import '../style/form.css';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { create, update } from '../actions/post-action';

class CreateEvent extends Component {

  constructor(props){
    super(props);

    this.state = {
      name:'',
      startDate: '',
      endDate: '',
      desc: '',
      venue: '',
      organiserId: '',
      organiserName: '',
      category: 'dance',
      ssCategory: 'communication',
      ssPoint: 0,
      fee: 0,
      chairperson: '',
      contact: '',
      selectedStartDate: moment(),
      selectedEndDate: moment()
    }

    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleEventCategory = this.handleEventCategory.bind(this);
    this.handleSoftskilltCategory = this.handleSoftskilltCategory.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setOrganiserId();

    // wait after 2 seconds just set state
    setTimeout(function() { 
      if(this.props.event != null && this.props.params.type == "event") {
        let event = this.props.event;
        this.setState({
          name: event["name"],
          dateTime: event["dateTime"],
          organiserId: event["organiserId"],
          organiserName: event["organiserName"],
          desc: event["desc"], 
          venue: event["venue"],
          category: event["category"],
          fee: event["fee"],
          ssCategory: event["ssCategory"],
          ssPoint: event["ssPoint"],
          chairperson: event["chairperson"], 
          contact: event["contact"],
          boothId: event["boothId"],
          selectedStartDate: moment(event["startDate"]),
          selectedEndDate: moment(event["endDate"])
        });
        console.log("converted date: " + this.state.selectedStartDate);
      }
    }.bind(this), 2000)
  }

  setOrganiserId() {
    let p = this.props.params;
    if(p.type == "society") {
      this.setState({
        organiserId: p.id
      });
    }
  }

  handleClick(event) {
    // console.log("start date: " + moment(this.state.startDate).format("hh:mm a"));
    // console.log("end date: " + moment(this.state.selectedStartDate).format("YYYY-MM-DD hh:mm:ss"));
    // console.log("event category: " + this.state.eventCategory);
    // console.log("softskill category: " + this.state.softskillCategory);
    const { name, desc, venue, chairperson, contact } = this.state;
    
    if(name == '' || desc == '' || venue == '' ||  chairperson == '' || contact == '' ) {
      confirmAlert({
        title: 'Warning',
        message: 'Please fill in all empty fields before proceed',
        buttons: [
            {
                label: 'Close'
            }
        ]
      })
      return false;
    } else {
      let eventId = this.props.params.id;
      let data = this.state
      let eventName = data["name"];
      // let eventId = this.props.params.id;
      console.log("event content: " + JSON.stringify(data));
      if(this.props.params.type == "society")
        this.props.onCreate("event", data);
      else {
        if(data.startDate == '')
          data.startDate = "" + moment(this.props.event["dateTime"]).format("YYYY-MM-DD hh:mm:ss")
        this.props.onUpdate("event", eventId, eventName, data);
      }
    }
  }

  handleStart(date) {
    this.setState({
      selectedStartDate: date,
      startDate: "" + moment(date).format("YYYY-MM-DD hh:mm:ss")
    });
  }

  handleEnd(date) {
    this.setState({
      selectedEndDate: date,
      endDate: "" + moment(date).format("YYYY-MM-DD hh:mm:ss")
    });
  }

  handleEventCategory(event) {
    this.setState({category: event.target.value});
  }

  handleSoftskilltCategory(event) {
    this.setState({ssCategory: event.target.value});
  }

  mapItem(item) {
    return <option value={item.value}>{item.name}</option>;
  }

  render() {
    console.log("society id in create event: " + JSON.stringify(this.props.params.id));
    console.log("category: " + this.state.category);

    console.log("startDate: " + this.state.selectedStartDate);
    console.log("endDate: " + this.state.selectedEndDate);
    console.log("now: " + moment());

    const { RaisedButtonStyle } = styles;

    const eventCategories = [{value:'dance', name:'Dance'}, {value:'design', name:'Design'}, {value:'education', name:'Education'},
    {value:'entertainment', name:'Entertainment'}, {value:'music', name:'Music'}, {value:'softskill', name:'Soft Skill'}, 
    {value:'sport', name:'Sport'}, {value:'technology', name:'Technology'}];

    const softSkillCategories = [{value:'communication', name:'Communication & Language Skills'}, {value:'criticalThinking', name:'Critical Thinking & Problem Solving'}, {value:'digitalLiteracy', name:'Digital Literacy'},
    {value:'eq', name:'Emotional Intelligence & Teamwork Skills'}, {value:'entrepreneur', name:'Entrepreneurship Skills'}, {value:'leadership', name:'Leadership Skills'},
    {value:'lifelong', name:'Lifelong Learning & Information Management'}, {value:'moral', name:'Moral & Professional Ethics'}];

    var header;
    var breadCrumb;

    if(this.props.params.type == "society") {
        header = <h1>Create Society Event<span>Create a new event for your society and start to promote it!</span></h1>
        breadCrumb = 
          <Breadcrumb>
            <BreadcrumbItem><Link to={`/home`}>Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/society`}>Societies</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={{pathname:`/perSociety/` + this.props.params.id, state: {societyName: this.props.location.state["societyName"]}}}>{this.props.location.state["societyName"]}</Link></BreadcrumbItem>
            <BreadcrumbItem active>Create Event</BreadcrumbItem>
          </Breadcrumb>
    } else {
      header = <h1>Edit Society Event<span>Edit your event details and make it better!</span></h1>
      breadCrumb = 
          <Breadcrumb>
            <BreadcrumbItem><Link to={`/home`}>Home</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/event`}>Events</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={{pathname:`/perEvent/` + this.props.params.id, state: {eventName: this.props.location.state["eventName"]}}}>{this.props.location.state["eventName"]}</Link></BreadcrumbItem>
            <BreadcrumbItem active>Edit Event</BreadcrumbItem>
          </Breadcrumb>
    }

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <NavBar />

            <div style={{ margin: 20 }}>
                {breadCrumb}
            </div>

            <div className="container">
              <div className="form-style-10">
                {header}
                <form>
                    <div class="section"><span>1</span>Name &amp; Category &amp; Description</div>
                    <div class="inner-wrap">
                        <label>Event Name</label>  
                        <input type="text" value={this.state.name} ref="name" onChange={(event) => {
                          this.setState({name:event.target.value});
                          console.log("state value: " + this.state.name);
                          }}/>
                        <br/>
                        <label>Event Category (Eg: Technology)</label>
                        <select value={this.state.category} onChange={this.handleEventCategory}>
                          {eventCategories.map(this.mapItem)}
                        </select>
                        <br/>
                        <label>Event Description</label>
                        <textarea name="desc" value={this.state.desc} onChange={(event) => {
                          this.setState({desc: event.target.value});
                        }}></textarea>
                    </div>

                    <div class="section"><span>2</span>Date &amp; Time &amp; Venue</div>
                    <div class="inner-wrap">
                      <label>Event Start Date &amp; Time </label>
                      <DatePicker
                        selected={this.state.selectedStartDate}
                        onChange={this.handleStart.bind(this)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="time"
                      />
                      <br/>
                      <label>Event End Date &amp; Time </label>
                      <DatePicker
                        selected={this.state.selectedEndDate}
                        onChange={this.handleEnd.bind(this)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="LLL"
                        timeCaption="time"
                      />
                      <br/>
                      <label>Event Venue</label> 
                      <input type="text" value={this.state.venue} name="venue" onChange={(event) => {this.setState({venue:event.target.value})}}/>
                    </div>

                    <div class="section"><span>3</span>Fee</div>
                        <div class="inner-wrap">
                        <label>Event Fee</label>
                        <input type="text" value={this.state.fee} name="fee" onChange={(event) => {this.setState({fee:event.target.value})}}/>
                    </div>

                    <div class="section"><span>4</span>Organizing Chairperson Name &amp; Contact Number</div>
                    <div class="inner-wrap">
                      <label>Chairperson Name</label>
                      <input type="text" value={this.state.chairperson} name="chairperson" onChange={(event) => {this.setState({chairperson:event.target.value})}}/>
                      <br/>
                      <label>Chairperson Contact Number</label> 
                      <input type="text" value={this.state.contact} name="contact" onChange={(event) => {this.setState({contact:event.target.value})}}/>
                      <br/>
                    </div>

                    <div class="section"><span>5</span>Soft Skill Points &amp; Category</div>
                    <div class="inner-wrap">
                      <label>Soft Skill Points</label>
                      <input type="text" value={this.state.ssPoint} name="ssPoint" onChange={(event) => {this.setState({ssPoint:event.target.value})}}/>
                      <br/>
                      <label>Soft Skill Category</label> 
                      <select value={this.state.ssCategory} onChange={this.handleSoftskilltCategory}>
                        {softSkillCategories.map(this.mapItem)}
                      </select>
                      <br/>
                    </div>

                    <div class="button-section">
                      <RaisedButton label="Submit" id="button2" primary={true} style={RaisedButtonStyle} onClick={(event) => this.handleClick(event)}/>
                      <RaisedButton label="Back" primary={true} style={RaisedButtonStyle} onClick={(event) => window.history.back()}/>
                    </div>
                </form>
              </div>
            </div>
          </div>
          </MuiThemeProvider>
      </div>
    );
    }
}

const styles = {
  RaisedButtonStyle: {
    margin: 15
  }
};

const mapStateToProps = (state, props) => {
  return {
    createdEventId: state.create.createdEventId,
    event: state.data.event
  };
};

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onCreate: create,
    onUpdate: update
  }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(CreateEvent);