import React, { Component } from 'react';
import NavBar from './NavBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
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
            <div className="container" style={ContainerStyle}>
            <form>
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
          </form>
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
    margin: 60
  }
};

export default RegisterEvent;