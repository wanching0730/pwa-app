import React, { Component } from 'react';
import NavBar from './NavBar';
import LoadingBar from './LoadingBar';
import RaisedButton from 'material-ui/RaisedButton';
import Tooltip from 'rc-tooltip';
import SearchBar from 'material-ui-search-bar';
import { confirmAlert } from 'react-confirm-alert';
import { Link } from 'react-router';
import Analysis from './Analysis';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as FontAwesome from '../../node_modules/react-icons/lib/fa';
import { groupBy } from '../common/common_function';
import '../style/society.css';
import '../style/alert.css';
import 'rc-tooltip/assets/bootstrap_white.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { retrieveAll, updateLoadingBar, searchData } from '../actions/data-action';

class Event extends Component {

    constructor(props) {
        super(props);

        if(!this.props.isAuthenticated) {
            window.location.assign('/');
          }

        this.state = {
            sortType: "name",
            searchWord: ""
        };

        this.handleSearch = this.handleSearch.bind(this);
    }

    async componentDidMount() {
        window.scrollTo(0, 0);

        this.props.onUpdateLoadingBar();
        this.props.onRetrieveAll("event");
    }

    componentWillReceiveProps(nextProps){
        if((nextProps.eventsFound != this.props.eventsFound) && (nextProps.eventsFound != null)) {
            let eventsFound = nextProps.eventsFound;
            var resultRows = [];

            for(var i = 0; i < eventsFound.length; i++) {
                let eventFound = eventsFound[i];
                let toEvent = {
                    pathname: "/perEvent/" + eventFound["eventId"],
                    state: {eventName: eventFound["name"]}
                }

                resultRows.push(
                    <tr>
                        <td key={eventFound["eventId"]}><Link key={eventFound["eventId"]} to={toEvent}>{eventFound["name"]} - {eventFound["category"]}</Link></td>
                    </tr>
                )
            }

            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <MuiThemeProvider>
                            <div className='search-alert'>

                                {eventsFound.length > 0 ?
                                    [
                                        <table id="searchModal">
                                            <thead>
                                                <tr>
                                                    <th>Events</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultRows}
                                            </tbody>
                                        </table>
                                    ]:
                                    [
                                        <div>No result found</div>
                                    ]
                                }
                                <RaisedButton label="Close" primary={true} onClick={() => onClose()} style={{ marginTop: 15 }}/>
                            </div>
                        </MuiThemeProvider>
                    )
                }
            })
        }
    }

    handleClick(event) {
    }

    handleSearch() {
        if(this.state.searchWord != "") {
            this.props.onUpdateLoadingBar();
            this.props.onSearchData("event", this.state.searchWord);
            this.setState({searchWord: ""});
        }
    }

    sort(type, values) {
        if(type === "name") {
            return values.sort(function(a, b){
                if(a["name"] < b["name"]) return -1;
                if(a["name"] > b["name"]) return 1;
                return 0;
            });
        } else {
            return values.sort(function(a, b){
                a = new Date(a["date"]);
                b = new Date(b["date"]);
                if(a < b) return -1;
                if(a > b) return 1;
                return 0;
            });
        }   
    }

    render() {
        const { RaisedButtonStyle } = styles;
        let events = this.props.events;

        if(events != null) {
            var rows = [];
            var counter = 1;
            const categories = groupBy(events, event => event["category"]);
            let mapsort = new Map([...categories.entries()].sort());
            for (const [key, values] of mapsort) {
                var subRows = [];
                var sortedValues;
                
                if(this.state.sortType === "name")
                    sortedValues = this.sort("name", values);
                else 
                    sortedValues = this.sort("date", values);
                
                sortedValues.forEach(value => {
                    let toEvent = {
                        pathname: "/perEvent/" + value["id"],
                        state: {eventName: value["name"]}
                    }
                    subRows.push(
                        <li><Link to={toEvent}>{value["name"]}</Link></li>
                    );
                });

                let stringId = "list-item-" + counter;
                rows.push(
                    <li>
                        <input type="checkbox" id={stringId} />
                        <Tooltip placement="right" trigger={['hover']} overlay={<span>Click to view more</span>}>
                            <label for={stringId} className="first">{key}   <FontAwesome.FaHandORight /></label>
                        </Tooltip>
                        <ul>
                            {subRows}
                        </ul>
                    </li>
                );

                <hr/>
                counter++;
              }
        }

        return (
            <div id="outerDiv"> 
                <NavBar />

                <div style={{ margin: 20 }}>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to={`/home`}>Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Events</BreadcrumbItem>
                    </Breadcrumb>
                </div>

                {this.props.loading ?
                    [<LoadingBar />]
                    :
                    [
                        <div>
                            <MuiThemeProvider>
                                <div className="pull-left col-md-8 col-lg-8 col-sm-8" id="col-9" style={{ marginTop: 20}}>
                                    <h1 style={{ margin: 20, color: '#083477' }}>Event List</h1>

                                    <SearchBar
                                        hintText="Search name or category..."
                                        onChange={(newValue) => this.setState({ searchWord: newValue })}
                                        onRequestSearch={this.handleSearch.bind(this)}
                                        style={{
                                            marginLeft: 20,
                                            marginBottom: 20,
                                            maxWidth: 290,
                                            borderRadius: 6
                                        }}
                                    />

                                    <RaisedButton className="buttons" label="Sort by Alphabet" primary={true} style={RaisedButtonStyle} onClick={(event) => this.setState({sortType: "name"})}/>
                                    <RaisedButton className="buttons" label="Sort by Date" primary={true} style={RaisedButtonStyle} onClick={(event) => this.setState({sortType: "date"})}/>

                                    <div className="wrapper">
                                        <ul>
                                            {rows}
                                        </ul>
                                    </div>
                                </div>

                                <div className="pull-right col-md-4 col-lg-4 col-sm-4" id="col-3" style={{ marginTop: 20}}>
                                    <Analysis />
                                </div>
                            </MuiThemeProvider>
                        </div>
                    ]}
            </div>
        );
    };
};

const styles = {
    RaisedButtonStyle: {
        marginLeft: 20
    }
}

const mapStateToProps = (state, props) => {
    return {
      events: state.data.events,
      eventsFound: state.data.eventsFound,
      loading: state.data.loading,
      isAuthenticated: state.auth.isAuthenticated
    };
};

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
      onRetrieveAll: retrieveAll,
      onSearchData: searchData,
      onUpdateLoadingBar: updateLoadingBar
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(Event);
