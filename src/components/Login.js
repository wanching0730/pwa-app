import NavBar from './NavBar';
import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {browserHistory} from 'react-router';

class Login extends Component {

  constructor(props){
    super(props);
    this.state={
    username:'',
    password:''
    }
   }

   handleClick(event) {
     browserHistory.push("/student");
   }

  render() {
    
    const { RaisedButtonStyle } = styles;

    return (
      <div>
        <MuiThemeProvider>
          <div>
            <NavBar />
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange = {(event,newValue) => this.setState({username:newValue})}
              />
            <br/>
              <TextField
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                onChange = {(event,newValue) => this.setState({password:newValue})}
                />
              <br/>
              <RaisedButton label="Submit" primary={true} style={RaisedButtonStyle} onClick={(event) => this.handleClick(event)}/>
          </div>
          </MuiThemeProvider>
      </div>
    );
  }

}

const styles = {
    RaisedButtonStyle: {
        margin: 15,
    }
};

export default Login;