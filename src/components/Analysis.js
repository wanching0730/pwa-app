import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import { Doughnut, HorizontalBar } from '../../node_modules/react-chartjs-2';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { retrieveAll, updateLoadingBar } from '../actions/data-action';

class Analysis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            labels: [],
            data: []
        };

        this.props.onRetrieveAll("recommendedSocieties");
    }

    componentWillReceiveProps(nextProps){
        console.log("this props: " + this.props.recommendedSocieties);
        console.log("next props: " + nextProps.recommendedSocieties);

        if((nextProps.recommendedSocieties != this.props.recommendedSocieties) && (nextProps.recommendedSocieties != null)) {
            let recommendedSocieties = nextProps.recommendedSocieties;

            for(var i = 0; i < recommendedSocieties.length; i++) {
                this.state.labels.push(recommendedSocieties[i]["name"]);
                this.state.data.push(recommendedSocieties[i]["total"]);
            }
        }
    }

    clickEvent(event) {
        browserHistory.push("/perEvent/1");
    }

    clickSociety(event) {
        browserHistory.push("/perSociety/1");
    }

    render() {
        if(this.props.recommendedSocieties != null) {
            console.log(this.state.labels);
            console.log(this.state.data);

            var doughnutData, barData, options;
        
            doughnutData = {
                labels: [
                    'Cardio Night Run',
                    'Blood Donation',
                    'Engineering Fiesta'
                ],
                datasets: [{
                    data: [200, 30, 50],
                    backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                    ]
                }]
            };

            barData = {
                labels: this.state.labels,
                datasets: [
                {
                    label: 'Total Participants',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: this.state.data
                }
                ]
            };
        }
          

        return (
            <div>
                <div>
                    <h2>Recommended Events</h2>
                    <Doughnut data={doughnutData} onElementsClick={this.clickEvent} />
                </div>

                <br/>

                <div>
                    <h2>Active Societies</h2>
                    <HorizontalBar data={barData} onElementsClick={this.clickSociety} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        recommendedSocieties: state.data.recommendedSocieties
    };
};

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
      onRetrieveAll: retrieveAll,
      onUpdateLoadingBar: updateLoadingBar
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(Analysis);