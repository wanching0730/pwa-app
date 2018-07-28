import React, { Component } from 'react';
import NavBar from './NavBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import ToggleButton from 'react-toggle-button';
import ReactNotifications from 'react-browser-notifications';
import '../style/form.css';
import NotificationModal from './NotificationModal';
import axios from 'axios';

class RegisterEvent extends Component {

  constructor(props){
    super(props);
    this.state={
      first_name:'',
      last_name:'',
      emailNoti: false,
      webNoti: false
      // showModal: false
    }
  }

  displayText() {

      if(this.state.webNoti) {
        if(this.n.supported()) 
          this.n.show();
      }

      const data = Object.keys(this.state).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(this.state[key]);
      }).join('&');

      fetch(`http://localhost:5000/puppies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
      }).then(function(response) {
        return response;
      });

  }

  handleNotiClick(event) {
    window.focus()
    this.n.close(event.target.tag);
  }

  handleClick(event) {
      this.displayText();
      browserHistory.push("/perEvent/1");
      // this.setState({showModal: this.state.value});
    }
  

  // renderModal() {
  //     if(this.state.showModal) {
  //         return <NotificationModal />;
  //     } else {
  //         return <p>hello</p>;
  //     }
    
  // }
  
  render() {

    const { RaisedButtonStyle, ContainerStyle } = styles;

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <NavBar />

            <div style={{ margin: 20 }}>
              <Breadcrumb>
                <BreadcrumbItem><Link to={`/`}>Home</Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={`/society`}>Societies</Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={`/perEvent/1`}>Cardio Night Run</Link></BreadcrumbItem>
                <BreadcrumbItem active>Registration</BreadcrumbItem>
              </Breadcrumb>
            </div>

            <div className="container" style={ContainerStyle}>
              <div className="form-style-10">
                <h1>Register Cardio Night Run<span>Register the event now and get yourself a seat!</span></h1>
                <form>
                    <div class="section"><span>1</span>Full Name &amp; ID &amp; IC</div>
                    <div class="inner-wrap">
                        <label>Full Name</label>  
                        {/* <TextField onChange = {(event,newValue) => {this.setState({first_name:newValue})}} /> */}
                        <input type="text" onChange={(event) => {
                          this.setState({first_name:event.target.value});
                          console.log("state value: " + this.state.first_name);
                          }}/>
                        <br/>
                        <label>Student ID (Eg: 15UEB02834)</label>
                        <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                        <label>Student IC (Eg: 998877-66-5555)</label>
                        <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                    </div>

                     <div class="section"><span>2</span>Course &amp; Year</div>
                    <div class="inner-wrap">
                      <label>Course (Eg: Software Engineering)</label>
                      <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                      <br/>
                      <label>Year and Semester (Eg: Y1S1)</label> 
                      <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                    </div>

                    <div class="section"><span>3</span>Email &amp; Phone</div>
                    <div class="inner-wrap">
                      <label>Email Address</label>
                      <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                      <label>Phone Number</label> 
                      <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                    </div>

                    <div class="section"><span>4</span>Allow Notification</div>
                    <div class="inner-wrap">
                      <label>Allow Email Notification</label>
                      <ToggleButton
                        value={ this.state.emailNoti || false }
                        onToggle={(value) => {
                            this.setState({
                            emailNoti: !value,
                            })
                        }} />
                      <br/>
                      <label>Allow Web Notification</label>
                      <ToggleButton
                          value={ this.state.webNoti || false }
                          onToggle={(value) => {
                              this.setState({
                              webNoti: !value,
                              })
                          }} />
                      <br/>
                      <ReactNotifications
                        onRef={ref => (this.n = ref)} // Required
                        title="Some Title" // Required
                        body="This is the body!"
                        icon="devices-logo.png"
                        tag="abcdef"
                        timeout="1000"
                        onClick={event => this.handleNotiClick(event)}
                      />
                    </div>
                    <div class="button-section">
                    <RaisedButton label="Submit" id="button2" primary={true} style={RaisedButtonStyle} onClick={(event) => this.handleClick(event)}/>
                    {/* <input type="submit" name="Sign Up" /> */}
                    </div>
                </form>
                </div>

            {/* <form>
            <TextField
              hintText="Enter your First Name"
              floatingLabelText="First Name"
              onChange = {(event,newValue) => this.setState({first_name:newValue})}
              />
            <br/>
            <TextField
              hintText="Enter your Last Name"
              floatingLabelText="Last Name"
              onChange = {(event,newValue) => this.setState({last_name:newValue})}
              />
            <br/>
            <p>Allow Email Notification</p>
            <ToggleButton
                value={ this.state.emailNoti || false }
                onToggle={(value) => {
                    this.setState({
                    emailNoti: !value,
                    })
                }} />
            <p>Allow Web Notification</p>
            <ToggleButton
                value={ this.state.webNoti || false }
                onToggle={(value) => {
                    this.setState({
                    webNoti: !value,
                    })
                }} />
            <br/>
            <ReactNotifications
              onRef={ref => (this.n = ref)} // Required
              title="Some Title" // Required
              body="This is the body!"
              icon="devices-logo.png"
              tag="abcdef"
              timeout="1000"
              onClick={event => this.handleNotiClick(event)}
            />
            <RaisedButton label="Submit" primary={true} style={RaisedButtonStyle} onClick={(event) => this.handleClick(event)}/>
          </form> */}
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
  }, 
  ContainerStyle: {
    margin: "30px",
    position: "absolute",
    width: "100%"
  }
};

export default RegisterEvent;