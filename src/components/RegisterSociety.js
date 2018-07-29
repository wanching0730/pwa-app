import React, { Component } from 'react';
import NavBar from './NavBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {browserHistory} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import ToggleButton from 'react-toggle-button';
import ReactNotifications from 'react-browser-notifications';
import { Link } from 'react-router';
import '../style/form.css';

class RegisterSociety extends Component {

  constructor(props){
    super(props);
    this.state={
      first_name:'',
      last_name:'',
      email:'',
      password:'',
      course: 'software'
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    console.log("course: " + this.state.course);
    browserHistory.push("/perSociety/1");
  }

  handleChange(event) {
    this.setState({course: event.target.value});
  }

  mapItem(item) {
    return <option value={item.value}>{item.name}</option>;
  }
  
  render() {

    const { RaisedButtonStyle, ContainerStyle, FormStyle } = styles;
    const courses = [{value:'software', name:'Software Engineering'}, {value:'chemical', name:'Chemical Engineering'}, {value:'civil', name:'Civil Engineering'},
    {value:'mechanical', name:'Mechanical Engineering'}, {value:'mechatronic', name:'Mechatronic Engineering'}, {value:'electronic', name:'Electronic Engineering'},
    {value:'accounting', name:'Accounting'}, {value:'mbbs', name:'MBBS'}];

    return (
      <div>
        <MuiThemeProvider>
        <div>
            <NavBar />

            <div style={{ margin: 20 }}>
                <Breadcrumb>
                  <BreadcrumbItem><Link to={`/`}>Home</Link></BreadcrumbItem>
                  <BreadcrumbItem><Link to={`/society`}>Societies</Link></BreadcrumbItem>
                  <BreadcrumbItem><Link to={`/perSociety/1`}>IT Society</Link></BreadcrumbItem>
                  <BreadcrumbItem active>Registration</BreadcrumbItem>
                </Breadcrumb>
            </div>

            <div className="container" style={ContainerStyle}>
              <div className="form-style-10">
                <h1>Register IT Society<span>Register society and looking forward for the upcoming events!</span></h1>
                <form>
                    <div class="section"><span>1</span>Name &amp; IC</div>
                    <div class="inner-wrap">
                        <label>Full Name</label>  
                        {/* <TextField onChange = {(event,newValue) => {this.setState({first_name:newValue})}} /> */}
                        <input type="text" onChange={(event) => {
                          this.setState({first_name:event.target.value});
                          console.log("state value: " + this.state.first_name);
                          }}/>
                        <br/>
                        <label>IC Number (Eg: 998877-66-5555)</label>
                        <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                    </div>

                    <div class="section"><span>2</span>Course &amp; Year</div>
                    <div class="inner-wrap">
                      <label>Course (Eg: Software Engineering)</label>
                      <select value={this.state.course} onChange={this.handleChange}>
                        {courses.map(this.mapItem)}
                      </select>
                      <br/>
                      <label>Year and Semester (Eg: Y1S1)</label> 
                      <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                    </div>

                    <div class="section"><span>3</span>Contact Number &amp; Email</div>
                    <div class="inner-wrap">
                      <label>Contact Number</label>
                      <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/>
                      <br/>
                      <label>Email Address (Eg: abc@hotmail.com)</label> 
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
                        <RaisedButton label="Back" primary={true} style={RaisedButtonStyle} onClick={(event) => window.history.back()}/>
                      {/* <input type="text" onChange={(event) => {this.setState({first_name:event.target.value})}}/> */}
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
  },
  ContainerStyle: {
    margin: 45
  }, 
  FormStyle: {
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: "#666",
    padding: "15px",
    backgroundColor: "#ebeef4"
  }
};

export default RegisterSociety;