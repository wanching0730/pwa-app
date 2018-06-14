import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import Register from '../src/components/Register';
import Login from '../src/components/Login';
import Home from '../src/components/Home';
import Society from '../src/components/Society';
import PerSociety from '../src/components/PerSociety';
import Student from '../src/components/Student';
import Feedback from '../src/components/Feedback';
import RegisterEvent from '../src/components/RegisterEvent';
import './App.css';

class App extends Component {
  render() {
    return (

        <Router history={browserHistory}>
          <Route path="/" component={Home}/>
          <Route path="/society" component={Society}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/perSociety/:societyId" component={PerSociety}/>
          <Route path="/student" component={Student}/>
          <Route path="/feedback" component={Feedback}/>
          <Route path="/register_event" component={RegisterEvent}/>
        </Router>
        
    );
  }
}

export default App;